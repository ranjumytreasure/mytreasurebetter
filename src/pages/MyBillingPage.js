import React, { useState, useEffect } from 'react';
import { useBilling } from '../context/billing_context';
import { useUserContext } from '../context/user_context';
import { API_BASE_URL } from '../utils/apiConfig';
import Loading from '../components/Loading';
import PlansSelection from '../components/PlansSelection';
import PlanUpgradeForm from '../components/PlanUpgradeForm';

const MyBillingPage = () => {
    const { user } = useUserContext();
    const {
        subscription,
        payments,
        availablePlans,
        isLoading,
        error,
        fetchCurrentSubscription,
        fetchPaymentHistory,
        fetchAvailablePlans,
        changePlan,
        recordPayment,
        payCycleBill,
        resetBillingData
    } = useBilling();

    const [activeTab, setActiveTab] = useState('billing');
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [showUpgradeForm, setShowUpgradeForm] = useState(false);
    const [showPaymentHistoryDebug, setShowPaymentHistoryDebug] = useState(false);
    const [paymentRefreshKey, setPaymentRefreshKey] = useState(0);


    useEffect(() => {
        fetchCurrentSubscription();
        fetchPaymentHistory();
        fetchAvailablePlans();
    }, [user]);

    // Debug billing cycles when data is loaded
    useEffect(() => {
        if (payments && subscription) {
            debugBillingCycles();
        }
    }, [payments, subscription]);

    const formatAmount = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 0
        }).format(amount || 0);
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    // Utility function to calculate next billing cycle date
    const calculateNextBillingDate = (lastPaymentDate, billingCycle) => {
        if (!lastPaymentDate) return null;

        const paymentDate = new Date(lastPaymentDate);
        const nextDate = new Date(paymentDate);

        switch (billingCycle) {
            case 'monthly':
                nextDate.setMonth(nextDate.getMonth() + 1);
                break;
            case 'quarterly':
                nextDate.setMonth(nextDate.getMonth() + 3);
                break;
            case 'yearly':
                nextDate.setFullYear(nextDate.getFullYear() + 1);
                break;
            default:
                nextDate.setMonth(nextDate.getMonth() + 1);
        }

        return nextDate.toISOString().split('T')[0];
    };

    // Function to generate overdue cycles (simplified without grace period)
    const generateOverdueCycles = (subscription, payments) => {
        if (!subscription || !payments) return [];

        // For now, return empty array - overdue cycles should be created by backend
        // This function can be enhanced later if needed for frontend-generated cycles
        return [];
    };

    // Function to validate billing cycle dates
    const validateBillingCycle = (cycle, previousCycle) => {
        if (!cycle || !subscription?.billing_cycle) return { isValid: true, message: '' };

        // If this is the first cycle, it's valid
        if (!previousCycle) return { isValid: true, message: '' };

        // Calculate expected due date based on previous payment
        const expectedDueDate = calculateNextBillingDate(previousCycle.payment_date || previousCycle.due_date, subscription.billing_cycle);
        const actualDueDate = cycle.due_date;

        if (expectedDueDate !== actualDueDate) {
            return {
                isValid: false,
                message: `Expected: ${formatDate(expectedDueDate)}, Actual: ${formatDate(actualDueDate)}`
            };
        }

        return { isValid: true, message: '' };
    };

    // Comprehensive payment history analysis
    const analyzePaymentHistory = () => {
        // Handle both array and object structures
        const cyclePayments = Array.isArray(payments) ? payments : (payments?.cycle_payments || []);

        if (!cyclePayments || cyclePayments.length === 0) {
            return {
                totalCycles: 0,
                paidCycles: 0,
                unpaidCycles: 0,
                pendingCycles: 0,
                totalPaid: 0,
                totalDue: 0,
                issues: [],
                cycleDetails: []
            };
        }

        const analysis = {
            totalCycles: cyclePayments.length,
            paidCycles: 0,
            unpaidCycles: 0,
            pendingCycles: 0,
            totalPaid: 0,
            totalDue: 0,
            issues: [],
            cycleDetails: []
        };

        cyclePayments.forEach((cycle, index) => {
            const previousCycle = index > 0 ? cyclePayments[index - 1] : null;
            const validation = validateBillingCycle(cycle, previousCycle);

            // Count by status - first cycle should show as paid/free
            const displayStatus = (cycle.cycle_number === 1 && (cycle.status === 'pending' || cycle.status === 'unpaid')) ? 'paid' : cycle.status;

            if (displayStatus === 'paid' || displayStatus === 'success') {
                analysis.paidCycles++;
                analysis.totalPaid += parseFloat(cycle.amount) || 0;
            } else if (displayStatus === 'unpaid' || displayStatus === 'pending') {
                analysis.unpaidCycles++;
                analysis.totalDue += parseFloat(cycle.amount) || 0;
            } else {
                analysis.pendingCycles++;
            }

            // Check for issues
            if (!validation.isValid) {
                analysis.issues.push({
                    cycle: cycle.cycle_number,
                    issue: validation.message,
                    dueDate: cycle.due_date,
                    status: cycle.status
                });
            }

            // Store cycle details
            analysis.cycleDetails.push({
                cycleNumber: cycle.cycle_number,
                dueDate: cycle.due_date,
                paymentDate: cycle.payment_date,
                amount: cycle.amount,
                status: cycle.status,
                validation: validation,
                expectedNextDate: cycle.payment_date ? calculateNextBillingDate(cycle.payment_date, subscription?.billing_cycle) : null
            });
        });

        return analysis;
    };

    // Debug function to check billing cycle logic
    const debugBillingCycles = () => {
        const cyclePayments = Array.isArray(payments) ? payments : (payments?.cycle_payments || []);

        if (cyclePayments && cyclePayments.length > 0) {
            console.log('=== BILLING CYCLE DEBUG ===');
            console.log('Subscription billing cycle:', subscription?.billing_cycle);
            console.log('All cycle payments:', cyclePayments);

            const analysis = analyzePaymentHistory();
            console.log('Payment History Analysis:', analysis);

            cyclePayments.forEach((cycle, index) => {
                console.log(`Cycle ${cycle.cycle_number}:`);
                console.log(`  Due Date: ${cycle.due_date}`);
                console.log(`  Payment Date: ${cycle.payment_date || 'Not paid'}`);
                console.log(`  Status: ${cycle.status}`);

                // Validate against previous cycle
                const previousCycle = index > 0 ? cyclePayments[index - 1] : null;
                const validation = validateBillingCycle(cycle, previousCycle);

                if (!validation.isValid) {
                    console.warn(`  ⚠️ BILLING CYCLE ISSUE: ${validation.message}`);
                }

                if (cycle.payment_date && subscription?.billing_cycle) {
                    const expectedNextDate = calculateNextBillingDate(cycle.payment_date, subscription.billing_cycle);
                    console.log(`  Expected Next Date: ${expectedNextDate}`);
                }
            });
            console.log('===========================');
        }
    };

    const handlePlanSelect = (plan) => {
        setSelectedPlan(plan);
        setShowUpgradeForm(true);
    };

    const handleBackToPlans = () => {
        setShowUpgradeForm(false);
        setSelectedPlan(null);
    };

    const handleProceedToPayment = async ({ billingDetails, paymentData }) => {
        try {
            // Combine billingDetails and paymentData for the backend
            const combinedData = {
                membership_id: user?.results?.userAccounts?.[0]?.parent_membership_id,
                billing_details: {
                    plan_id: billingDetails.plan_id,
                    plan_name: billingDetails.plan_name,
                    amount: billingDetails.amount,
                    currency: billingDetails.currency || 'INR',
                    billing_cycle: billingDetails.billing_cycle,
                    features: billingDetails.features
                },
                ...paymentData
            };

            const result = await recordPayment(combinedData);
            if (result.success) {
                alert('Plan upgraded successfully!');
                setShowUpgradeForm(false);
                setSelectedPlan(null);
                // Refresh billing data
                await fetchCurrentSubscription();
                await fetchPaymentHistory();
            } else {
                alert(`Payment failed: ${result.error}`);
            }
        } catch (error) {
            alert(`Payment error: ${error.message}`);
        }
    };

    const handleCyclePayment = async (cycleData) => {
        try {
            const result = await payCycleBill(cycleData);

            if (result.success) {
                // Show success message
                alert(`Payment of ${formatAmount(cycleData.amount)} recorded successfully!`);

                // Force refresh the billing data to show updated status
                await fetchCurrentSubscription();
                await fetchPaymentHistory();

                // Force UI re-render
                setPaymentRefreshKey(prev => prev + 1);

                // Additional refresh to ensure UI updates
                setTimeout(async () => {
                    await fetchCurrentSubscription();
                    await fetchPaymentHistory();
                    setPaymentRefreshKey(prev => prev + 1);
                }, 1000);

            } else {
                alert(`Payment failed: ${result.error}`);
            }
        } catch (error) {
            alert(`Payment error: ${error.message}`);
        }
    };

    const payCycle = (cycle) => {
        // Create payment data according to billing_payments model structure
        const paymentData = {
            subscription_id: subscription?.id, // Link to current subscription
            cycle_number: cycle.cycle_number,
            amount: parseFloat(cycle.amount),
            payment_method: 'UPI',
            transaction_id: `TXN_${Date.now()}`,
            gateway_response: {
                method: 'UPI',
                status: 'success',
                timestamp: new Date().toISOString()
            },
            invoice_number: `INV_${Date.now()}`,
            payment_reference: `REF_${Date.now()}`,
            status: 'success',
            payment_date: new Date().toISOString()
        };


        handleCyclePayment(paymentData);
    };

    const downloadReceipt = (cycle) => {
        // Create receipt data
        const receiptData = {
            invoice_number: cycle.invoice_number,
            payment_date: cycle.payment_date,
            amount: cycle.amount,
            payment_method: cycle.payment_method,
            plan_name: cycle.plan_name,
            cycle_number: cycle.cycle_number
        };

        // Generate and download receipt
        const receiptContent = `
            RECEIPT
            =======
            Invoice: ${receiptData.invoice_number}
            Date: ${formatDate(receiptData.payment_date)}
            Plan: ${receiptData.plan_name}
            Cycle: ${receiptData.cycle_number}
            Amount: ${formatAmount(receiptData.amount)}
            Method: ${receiptData.payment_method}
            Status: Paid
        `;

        const blob = new Blob([receiptContent], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `receipt_${receiptData.invoice_number}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    };

    const getCurrentPlan = () => {
        if (subscription) {
            return {
                id: subscription.id,  // Use actual UUID instead of plan_id
                name: subscription.plan_name || subscription.plan_id || 'VeryBasic Plan',
                price: subscription.amount || 100
            };
        }
        return null;
    };

    const getBillingStatus = () => {
        if (!subscription) return { status: 'unknown', message: 'No subscription', color: 'gray' };

        // Determine status based on remaining_days and payment history
        if (subscription.remaining_days > 0) {
            // Check if there are any unpaid cycles
            const cyclePayments = Array.isArray(payments) ? payments : (payments?.cycle_payments || []);
            const unpaidCycles = cyclePayments.filter(cycle =>
                cycle.status === 'unpaid' || cycle.status === 'pending'
            );

            if (unpaidCycles.length > 0) {
                return { status: 'overdue', message: 'Overdue', color: 'red' };
            } else {
                return { status: 'paid', message: 'Paid', color: 'green' };
            }
        } else {
            return { status: 'expired', message: 'Expired', color: 'red' };
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <Loading />
                    <p className="mt-4 text-gray-600">Loading billing information...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="max-w-md mx-auto text-center">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <div className="text-red-500 mb-4">
                            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Billing Data</h3>
                        <p className="text-gray-600 mb-4">{error}</p>
                        <div className="space-y-2">
                            <button
                                onClick={() => {
                                    resetBillingData();
                                    fetchCurrentSubscription();
                                    fetchPaymentHistory();
                                    fetchAvailablePlans();
                                }}
                                className="w-full px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition duration-200"
                            >
                                Retry Loading
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">
                        My Billing{subscription && ` - ${subscription.plan_name} Plan - ${formatAmount(subscription.amount)}${getBillingStatus().status === 'paid' ? ' Paid' : getBillingStatus().status === 'overdue' ? ' Overdue' : ''}`}
                    </h1>
                    <p className="mt-2 text-gray-600">
                        Manage your subscription and view payment history.
                    </p>
                </div>

                {/* Tab Navigation */}
                <div className="mb-8">
                    <div className="border-b border-gray-200">
                        <nav className="-mb-px flex space-x-8">
                            <button
                                onClick={() => setActiveTab('billing')}
                                className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'billing'
                                    ? 'border-red-500 text-red-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                            >
                                Current Billing
                            </button>
                            <button
                                onClick={() => setActiveTab('plans')}
                                className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'plans'
                                    ? 'border-red-500 text-red-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                            >
                                Upgrade Plans
                            </button>
                        </nav>
                    </div>
                </div>

                {/* Main Content */}
                {activeTab === 'billing' ? (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left Side - Billing Details */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Current Plan Card */}
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                <h2 className="text-xl font-semibold text-gray-900 mb-4">Current Plan</h2>

                                {subscription ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <div className="space-y-3">
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Plan Name</span>
                                                    <span className="font-medium">
                                                        {subscription.plan_name || 'Basic Plan'}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Amount</span>
                                                    <span className="font-medium">
                                                        {formatAmount(subscription.amount)}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Billing Cycle</span>
                                                    <span className="font-medium capitalize">
                                                        {subscription.billing_cycle || 'monthly'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <div className="space-y-3">
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Start Date</span>
                                                    <span className="font-medium">
                                                        {formatDate(subscription.plan_start_date)}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">End Date</span>
                                                    <span className="font-medium">
                                                        {formatDate(subscription.plan_end_date)}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Status</span>
                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getBillingStatus().color === 'green' ? 'bg-green-100 text-green-800' :
                                                        getBillingStatus().color === 'blue' ? 'bg-blue-100 text-blue-800' :
                                                            getBillingStatus().color === 'red' ? 'bg-red-100 text-red-800' :
                                                                'bg-gray-100 text-gray-800'
                                                        }`}>
                                                        {getBillingStatus().message}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <div className="text-gray-400 mb-4">
                                            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                        </div>
                                        <h3 className="text-lg font-medium text-gray-900 mb-2">No Active Subscription</h3>
                                        <p className="text-gray-600">You don't have an active subscription yet.</p>
                                        <button
                                            onClick={() => setActiveTab('plans')}
                                            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition duration-200"
                                        >
                                            Choose a Plan
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Payment History */}
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-xl font-semibold text-gray-900">Payment History</h2>
                                    {subscription && (
                                        <div className="text-sm text-gray-600">
                                            <span className="font-medium">Billing Cycle:</span> {subscription.billing_cycle || 'monthly'}
                                        </div>
                                    )}
                                </div>

                                {/* Payment History Summary */}
                                {(() => {
                                    const cyclePayments = Array.isArray(payments) ? payments : (payments?.cycle_payments || []);
                                    return cyclePayments && cyclePayments.length > 0;
                                })() && (() => {
                                    const analysis = analyzePaymentHistory();

                                    return (
                                        <div className="mb-4 space-y-3">
                                            {/* Summary Cards */}
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                                <div className="bg-blue-50 p-3 rounded-lg">
                                                    <div className="text-sm text-blue-600 font-medium">Total Cycles</div>
                                                    <div className="text-lg font-bold text-blue-800">{analysis.totalCycles}</div>
                                                </div>
                                                <div className="bg-green-50 p-3 rounded-lg">
                                                    <div className="text-sm text-green-600 font-medium">Paid</div>
                                                    <div className="text-lg font-bold text-green-800">{analysis.paidCycles}</div>
                                                </div>
                                                <div className="bg-red-50 p-3 rounded-lg">
                                                    <div className="text-sm text-red-600 font-medium">Unpaid</div>
                                                    <div className="text-lg font-bold text-red-800">{analysis.unpaidCycles}</div>
                                                </div>
                                                <div className="bg-yellow-50 p-3 rounded-lg">
                                                    <div className="text-sm text-yellow-600 font-medium">Pending</div>
                                                    <div className="text-lg font-bold text-yellow-800">{analysis.pendingCycles}</div>
                                                </div>
                                            </div>

                                            {/* Financial Summary */}
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="bg-green-50 p-3 rounded-lg">
                                                    <div className="text-sm text-green-600 font-medium">Total Paid</div>
                                                    <div className="text-lg font-bold text-green-800">{formatAmount(analysis.totalPaid)}</div>
                                                </div>
                                                <div className="bg-red-50 p-3 rounded-lg">
                                                    <div className="text-sm text-red-600 font-medium">Total Due</div>
                                                    <div className="text-lg font-bold text-red-800">{formatAmount(analysis.totalDue)}</div>
                                                </div>
                                            </div>



                                            {/* Debug Toggle */}
                                            <div className="flex justify-end">
                                                <button
                                                    onClick={() => setShowPaymentHistoryDebug(!showPaymentHistoryDebug)}
                                                    className="px-3 py-1 text-xs bg-gray-100 text-gray-600 rounded hover:bg-gray-200 transition duration-200"
                                                >
                                                    {showPaymentHistoryDebug ? 'Hide' : 'Show'} Debug Info
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })()}

                                {/* Debug Panel */}
                                {showPaymentHistoryDebug && (() => {
                                    const cyclePayments = Array.isArray(payments) ? payments : (payments?.cycle_payments || []);
                                    return cyclePayments && cyclePayments.length > 0;
                                })() && (() => {
                                    const analysis = analyzePaymentHistory();

                                    return (
                                        <div className="mb-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                                            <h3 className="text-sm font-medium text-gray-800 mb-3">Payment History Debug Information</h3>
                                            <div className="space-y-2 text-xs">
                                                <div><strong>Raw Payment Data:</strong></div>
                                                <pre className="bg-white p-2 rounded border text-xs overflow-auto max-h-40">
                                                    {JSON.stringify(payments, null, 2)}
                                                </pre>

                                                <div><strong>Analysis Results:</strong></div>
                                                <pre className="bg-white p-2 rounded border text-xs overflow-auto max-h-40">
                                                    {JSON.stringify(analysis, null, 2)}
                                                </pre>
                                            </div>
                                        </div>
                                    );
                                })()}


                                {(() => {
                                    const cyclePayments = Array.isArray(payments) ? payments : (payments?.cycle_payments || []);
                                    return cyclePayments && cyclePayments.length > 0;
                                })() ? (
                                    <div className="overflow-x-auto" key={paymentRefreshKey}>
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Plan
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Cycle
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Due Date
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Amount
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Status
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Payment Date
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Actions
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {(() => {
                                                    // Generate overdue cycles if needed
                                                    const cyclePayments = Array.isArray(payments) ? payments : (payments?.cycle_payments || []);
                                                    const overdueCycles = generateOverdueCycles(subscription, payments);
                                                    const allCycles = [...cyclePayments, ...overdueCycles];

                                                    return allCycles.map((cycle, index) => {
                                                        const previousCycle = index > 0 ? allCycles[index - 1] : null;
                                                        const validation = validateBillingCycle(cycle, previousCycle);

                                                        // Determine display status - first cycle should show as paid/free
                                                        const displayStatus = (cycle.cycle_number === 1 && (cycle.status === 'pending' || cycle.status === 'unpaid')) ? 'paid' : cycle.status;


                                                        return (
                                                            <tr key={cycle.id}>
                                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                                    <span className="font-medium text-blue-600">
                                                                        {cycle.plan_name || 'Unknown Plan'}
                                                                    </span>
                                                                </td>
                                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                                    <span>Cycle {cycle.cycle_number}</span>
                                                                </td>
                                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                                    {formatDate(cycle.due_date)}
                                                                </td>
                                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                                    {formatAmount(cycle.amount)}
                                                                </td>
                                                                <td className="px-6 py-4 whitespace-nowrap">
                                                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${displayStatus === 'paid'
                                                                        ? 'bg-green-100 text-green-800'
                                                                        : displayStatus === 'unpaid'
                                                                            ? 'bg-red-100 text-red-800'
                                                                            : displayStatus === 'free'
                                                                                ? 'bg-blue-100 text-blue-800'
                                                                                : 'bg-yellow-100 text-yellow-800'
                                                                        }`}>
                                                                        {displayStatus === 'free' ? 'Free' : displayStatus}
                                                                    </span>
                                                                </td>
                                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                                    {cycle.payment_date ? formatDate(cycle.payment_date) : '-'}
                                                                </td>
                                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                                    {(displayStatus === 'paid' || displayStatus === 'free') ? (
                                                                        <button
                                                                            onClick={() => downloadReceipt(cycle)}
                                                                            className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200 font-medium text-sm"
                                                                        >
                                                                            Download Receipt
                                                                        </button>
                                                                    ) : (displayStatus === 'unpaid' || displayStatus === 'pending') ? (
                                                                        <button
                                                                            onClick={() => payCycle(cycle)}
                                                                            className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 transition duration-200 font-medium text-sm"
                                                                        >
                                                                            Pay ({formatAmount(cycle.amount)})
                                                                        </button>
                                                                    ) : (
                                                                        <span className="text-gray-400">Pending</span>
                                                                    )}
                                                                </td>
                                                            </tr>
                                                        );
                                                    });
                                                })()}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <div className="text-gray-400 mb-4">
                                            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                            </svg>
                                        </div>
                                        <h3 className="text-lg font-medium text-gray-900 mb-2">No Payment History</h3>
                                        <p className="text-gray-600">You haven't made any payments yet.</p>

                                    </div>
                                )}

                            </div>
                        </div>

                        {/* Right Side - Quick Actions */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>

                                <div className="space-y-4">
                                    <button
                                        onClick={() => setActiveTab('plans')}
                                        className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200"
                                    >
                                        Upgrade Plan
                                    </button>

                                    <button
                                        onClick={() => {
                                            const cyclePayments = Array.isArray(payments) ? payments : (payments?.cycle_payments || []);
                                            if (cyclePayments && cyclePayments.length > 0) {
                                                const paidCycles = cyclePayments.filter(cycle => cycle.status === 'paid');
                                                if (paidCycles.length > 0) {
                                                    downloadReceipt(paidCycles[0]);
                                                } else {
                                                    alert('No paid cycles available for download');
                                                }
                                            }
                                        }}
                                        className="w-full px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition duration-200"
                                    >
                                        Download Latest Receipt
                                    </button>

                                    <button
                                        onClick={() => {
                                            const cyclePayments = Array.isArray(payments) ? payments : (payments?.cycle_payments || []);
                                            if (cyclePayments && cyclePayments.length > 0) {
                                                const outstandingCycles = cyclePayments.filter(cycle => {
                                                    // Skip first cycle if it's free/paid, otherwise include unpaid cycles
                                                    const isFirstCycleFree = cycle.cycle_number === 1 && (cycle.status === 'pending' || cycle.status === 'unpaid');
                                                    return (cycle.status === 'unpaid' || cycle.status === 'pending') && !isFirstCycleFree;
                                                });
                                                if (outstandingCycles.length > 0) {
                                                    payCycle(outstandingCycles[0]);
                                                } else {
                                                    alert('No outstanding payments found');
                                                }
                                            }
                                        }}
                                        className="w-full px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition duration-200"
                                    >
                                        Pay Outstanding
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div>
                        {showUpgradeForm ? (
                            <PlanUpgradeForm
                                selectedPlan={selectedPlan}
                                currentPlan={getCurrentPlan()}
                                onBack={handleBackToPlans}
                                onProceedToPayment={handleProceedToPayment}
                            />
                        ) : (
                            <PlansSelection
                                currentPlan={getCurrentPlan()}
                                availablePlans={availablePlans}
                                onSelectPlan={handlePlanSelect}
                            />
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyBillingPage;