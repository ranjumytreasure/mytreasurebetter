import React, { useState } from 'react';

const PlanUpgradeForm = ({ selectedPlan, currentPlan, onBack, onProceedToPayment }) => {
    const [selectedBillingCycle, setSelectedBillingCycle] = useState('monthly');
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('UPI');

    const formatAmount = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 0
        }).format(amount || 0);
    };

    const getBillingCycleOptions = () => {
        const basePrice = selectedPlan?.price || 0;
        return [
            {
                id: 'monthly',
                name: 'Monthly',
                period: 'month',
                multiplier: 1,
                price: basePrice,
                savings: 0,
                description: 'Pay monthly, cancel anytime'
            },
            {
                id: 'quarterly',
                name: 'Quarterly',
                period: '3 months',
                multiplier: 3,
                price: basePrice * 3,
                savings: basePrice * 0.1, // 10% discount
                description: 'Save 10% with quarterly billing'
            },
            {
                id: 'yearly',
                name: 'Yearly',
                period: '12 months',
                multiplier: 12,
                price: basePrice * 12,
                savings: basePrice * 2.4, // 20% discount
                description: 'Save 20% with yearly billing'
            }
        ];
    };

    const getPaymentMethods = () => {
        return [
            { id: 'UPI', name: 'UPI', icon: '📱' },
            { id: 'NetBanking', name: 'Net Banking', icon: '🏦' },
            { id: 'Wallet', name: 'Wallet', icon: '💳' },
            { id: 'Cash', name: 'Cash', icon: '💵' }
        ];
    };

    const calculateEndDate = (billingCycle, startDate = new Date()) => {
        const endDate = new Date(startDate);

        switch (billingCycle) {
            case 'monthly':
                endDate.setMonth(endDate.getMonth() + 1);
                break;
            case 'quarterly':
                endDate.setMonth(endDate.getMonth() + 3);
                break;
            case 'yearly':
                endDate.setFullYear(endDate.getFullYear() + 1);
                break;
            default:
                endDate.setMonth(endDate.getMonth() + 1);
        }

        return endDate.toISOString().split('T')[0];
    };

    const handleProceed = () => {
        const billingCycleOptions = getBillingCycleOptions();
        const selectedOption = billingCycleOptions.find(option => option.id === selectedBillingCycle);

        // Prepare billing details for the backend
        const startDate = new Date().toISOString().split('T')[0];
        const endDate = calculateEndDate(selectedBillingCycle, new Date(startDate));

        const billingDetails = {
            subscription_id: currentPlan?.id, // Use existing subscription UUID to close current and create new
            plan_id: selectedPlan.id,
            plan_name: selectedPlan.name,
            plan_type: selectedOption.name,
            amount: selectedOption.price,
            currency: 'INR',
            billing_cycle: selectedBillingCycle,
            plan_start_date: startDate,
            plan_end_date: null, // Active plan
            status: 'active',
            remaining_days: selectedOption.multiplier * 30,
            auto_renew: false
        };

        // Prepare payment data
        const paymentData = {
            amount: selectedOption.price,
            payment_method: selectedPaymentMethod,
            transaction_id: `TXN_${Date.now()}`,
            status: 'success',
            gateway_response: { method: selectedPaymentMethod },
            invoice_number: `INV_${Date.now()}`,
            payment_reference: `REF_${Date.now()}`
        };

        // Debug logging
        console.log('=== PLAN UPGRADE FORM DEBUG ===');
        console.log('Current Plan:', currentPlan);
        console.log('Current Plan ID:', currentPlan?.id);
        console.log('Selected Plan:', selectedPlan);
        console.log('Selected Billing Cycle:', selectedBillingCycle);
        console.log('Start Date:', startDate);
        console.log('End Date:', endDate);
        console.log('Date Calculation Check:');
        console.log('  - Monthly should be 1 month from start');
        console.log('  - Quarterly should be 3 months from start');
        console.log('  - Yearly should be 1 year from start');
        console.log('Billing Details:', billingDetails);
        console.log('Payment Data:', paymentData);
        console.log('================================');

        // Call the parent's proceed function with both objects
        onProceedToPayment({ billingDetails, paymentData });
    };

    const billingCycleOptions = getBillingCycleOptions();
    const paymentMethods = getPaymentMethods();
    const selectedOption = billingCycleOptions.find(option => option.id === selectedBillingCycle);

    return (
        <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Confirm Plan Upgrade</h2>
                    <p className="text-gray-600">Review your plan upgrade details and choose billing cycle before proceeding to payment.</p>
                </div>

                {/* Current Plan */}
                <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Current Plan</h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex justify-between items-center">
                            <div>
                                <h4 className="font-medium text-gray-900">{currentPlan?.name || 'No Plan'}</h4>
                                <p className="text-sm text-gray-600">Current subscription</p>
                            </div>
                            <div className="text-right">
                                <p className="font-semibold text-gray-900">{formatAmount(currentPlan?.price || 0)}</p>
                                <p className="text-sm text-gray-600">per month</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Selected Plan */}
                <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">New Plan</h3>
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <div className="flex justify-between items-center">
                            <div>
                                <h4 className="font-medium text-gray-900">{selectedPlan?.name}</h4>
                                <p className="text-sm text-gray-600">Upgraded subscription</p>
                            </div>
                            <div className="text-right">
                                <p className="font-semibold text-red-600">{formatAmount(selectedPlan?.price)}</p>
                                <p className="text-sm text-gray-600">per month</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Billing Cycle Selection */}
                <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Choose Billing Cycle</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {billingCycleOptions.map((option) => (
                            <div
                                key={option.id}
                                className={`relative rounded-lg border-2 p-4 cursor-pointer transition-all duration-200 ${selectedBillingCycle === option.id
                                    ? 'border-red-500 bg-red-50 ring-2 ring-red-200'
                                    : 'border-gray-200 hover:border-red-300'
                                    }`}
                                onClick={() => setSelectedBillingCycle(option.id)}
                            >
                                {option.savings > 0 && (
                                    <div className="absolute -top-2 -right-2">
                                        <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                                            Save {formatAmount(option.savings)}
                                        </span>
                                    </div>
                                )}
                                <div className="text-center">
                                    <h4 className="font-semibold text-gray-900 mb-1">{option.name}</h4>
                                    <p className="text-2xl font-bold text-gray-900 mb-1">
                                        {formatAmount(option.price)}
                                    </p>
                                    <p className="text-sm text-gray-600 mb-2">for {option.period}</p>
                                    <p className="text-xs text-gray-500">{option.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Payment Method Selection */}
                <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Choose Payment Method</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {paymentMethods.map((method) => (
                            <div
                                key={method.id}
                                className={`relative rounded-lg border-2 p-4 cursor-pointer transition-all duration-200 ${selectedPaymentMethod === method.id
                                    ? 'border-red-500 bg-red-50 ring-2 ring-red-200'
                                    : 'border-gray-200 hover:border-red-300'
                                    }`}
                                onClick={() => setSelectedPaymentMethod(method.id)}
                            >
                                <div className="text-center">
                                    <div className="text-2xl mb-2">{method.icon}</div>
                                    <p className="font-medium text-gray-900">{method.name}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Payment Summary */}
                <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Payment Summary</h3>
                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <span className="text-gray-600">{selectedPlan?.name} Plan ({selectedOption.name})</span>
                                <span className="font-medium">{formatAmount(selectedOption.price)}</span>
                            </div>
                            {selectedOption.savings > 0 && (
                                <div className="flex justify-between text-green-600">
                                    <span>Discount</span>
                                    <span className="font-medium">-{formatAmount(selectedOption.savings)}</span>
                                </div>
                            )}
                            <div className="flex justify-between">
                                <span className="text-gray-600">Payment Method</span>
                                <span className="font-medium">{selectedPaymentMethod}</span>
                            </div>
                            <hr className="my-2" />
                            <div className="flex justify-between text-lg font-semibold">
                                <span>Total Amount to Pay</span>
                                <span className="text-red-600">{formatAmount(selectedOption.price)}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Features Comparison */}
                <div className="mb-8">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Plan Features</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-gray-50 rounded-lg p-4">
                            <h4 className="font-medium text-gray-900 mb-2">{currentPlan?.name || 'Current Plan'}</h4>
                            <ul className="text-sm text-gray-600 space-y-1">
                                <li>• Basic features</li>
                                <li>• Standard support</li>
                            </ul>
                        </div>
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                            <h4 className="font-medium text-gray-900 mb-2">{selectedPlan?.name}</h4>
                            <ul className="text-sm text-gray-600 space-y-1">
                                {selectedPlan?.features?.map((feature, index) => (
                                    <li key={index}>• {feature}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-end">
                    <button
                        onClick={onBack}
                        className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition duration-200"
                    >
                        Back to Plans
                    </button>
                    <button
                        onClick={handleProceed}
                        className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition duration-200"
                    >
                        Pay {formatAmount(selectedOption.price)} Now
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PlanUpgradeForm;