import React, { useState, useEffect } from 'react';
import { useDailyCollectionContext } from '../../context/dailyCollection/DailyCollectionContext';
import { useUserContext } from '../../context/user_context';
import { API_BASE_URL } from '../../utils/apiConfig';
import { FiFilter, FiMapPin, FiDollarSign, FiCalendar, FiUser, FiSearch, FiRefreshCw, FiCheckCircle, FiClock, FiAlertCircle } from 'react-icons/fi';

const CollectionsPage = () => {
    const { user } = useUserContext();
    const [receivables, setReceivables] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [selectedReceivable, setSelectedReceivable] = useState(null);
    const [ledgerAccounts, setLedgerAccounts] = useState([]);

    // Filters - Default to show today's due and overdue
    const [filters, setFilters] = useState({
        startDate: '',
        endDate: '',
        subscriberName: '',
        amount: '',
        status: 'all', // all, today, pending, overdue
        disbursementDate: ''
    });

    // Payment form
    const [paymentForm, setPaymentForm] = useState({
        amount: '',
        paymentMethod: '',
        paymentDate: new Date().toISOString().split('T')[0],
        notes: ''
    });

    // Fetch receivables
    const fetchReceivables = async () => {
        if (!user?.results?.token) return;

        setIsLoading(true);
        setError(null);

        try {
            const membershipId = user?.results?.userAccounts?.[0]?.parent_membership_id;
            const queryParams = new URLSearchParams({
                parent_membership_id: membershipId,
                ...(filters.startDate ? { start_date: filters.startDate } : {}),
                ...(filters.endDate ? { end_date: filters.endDate } : {}),
                ...(filters.subscriberName ? { subscriber_name: filters.subscriberName } : {}),
                ...(filters.amount ? { amount: filters.amount } : {}),
                ...(filters.disbursementDate ? { disbursement_date: filters.disbursementDate } : {}),
            });

            console.log("🔍 Frontend filters:", filters);
            console.log("🔍 Query params:", queryParams.toString());

            const url = `${API_BASE_URL}/dc/receivables?${queryParams.toString()}`;
            const res = await fetch(url, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${user.results.token}`,
                    "Content-Type": "application/json",
                },
            });

            if (res.ok) {
                const data = await res.json();
                setReceivables(data.results || []);
            } else {
                throw new Error('Failed to fetch receivables');
            }
        } catch (error) {
            console.error('Error fetching receivables:', error);
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    // Fetch ledger accounts for payment methods
    const fetchLedgerAccounts = async () => {
        if (!user?.results?.token) return;

        try {
            const membershipId = user?.results?.userAccounts?.[0]?.parent_membership_id;
            const url = `${API_BASE_URL}/dc/ledger/accounts?parent_membership_id=${membershipId}`;
            const res = await fetch(url, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${user.results.token}`,
                    "Content-Type": "application/json",
                },
            });

            if (res.ok) {
                const data = await res.json();
                setLedgerAccounts(data.results || []);
            }
        } catch (error) {
            console.error('Error fetching ledger accounts:', error);
        }
    };

    useEffect(() => {
        fetchReceivables();
        fetchLedgerAccounts();
    }, [user, filters]);

    // Filter receivables by status - User perspective focused
    const getFilteredReceivables = () => {
        const today = new Date().toISOString().split('T')[0];
        let filtered = receivables;

        // Default behavior: Show only today's due and past unpaid (no future)
        if (filters.status === 'all' || !filters.status) {
            filtered = filtered.filter(r =>
                (r.due_date <= today) && !r.is_paid
            );
        } else if (filters.status === 'today') {
            filtered = filtered.filter(r => r.due_date === today && !r.is_paid);
        } else if (filters.status === 'pending') {
            filtered = filtered.filter(r => r.due_date < today && !r.is_paid);
        } else if (filters.status === 'overdue') {
            filtered = filtered.filter(r => r.due_date < today && !r.is_paid);
        }

        // If date range is specified, show future dues too
        if (filters.startDate || filters.endDate) {
            filtered = receivables.filter(r => {
                if (filters.startDate && filters.endDate) {
                    return r.due_date >= filters.startDate && r.due_date <= filters.endDate;
                } else if (filters.startDate) {
                    return r.due_date >= filters.startDate;
                } else if (filters.endDate) {
                    return r.due_date <= filters.endDate;
                }
                return true;
            });
        }

        return filtered;
    };

    // Get status badge - User perspective
    const getStatusBadge = (receivable) => {
        const today = new Date().toISOString().split('T')[0];
        const dueDate = receivable.due_date;

        if (receivable.is_paid) {
            return { text: 'Paid', color: 'bg-green-100 text-green-800' };
        } else if (dueDate === today) {
            return { text: "Today's Due", color: 'bg-blue-100 text-blue-800' };
        } else if (dueDate < today) {
            return { text: 'Overdue', color: 'bg-red-100 text-red-800' };
        } else {
            return { text: 'Future', color: 'bg-gray-100 text-gray-800' };
        }
    };

    // Safe amount display to prevent NaN
    const formatAmount = (amount) => {
        const numAmount = parseFloat(amount);
        if (isNaN(numAmount)) return '₹0';
        return `₹${numAmount.toLocaleString("en-IN")}`;
    };

    // Handle payment
    const handlePayment = async () => {
        if (!paymentForm.amount || !paymentForm.paymentMethod) {
            alert('Please fill in amount and payment method');
            return;
        }

        try {
            const membershipId = user?.results?.userAccounts?.[0]?.parent_membership_id;
            const payload = {
                receivableId: selectedReceivable.id,
                amount: parseFloat(paymentForm.amount),
                paymentMethod: paymentForm.paymentMethod,
                paymentDate: paymentForm.paymentDate,
                notes: paymentForm.notes,
                membershipId: membershipId
            };

            const res = await fetch(`${API_BASE_URL}/dc/collections/pay`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${user.results.token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            if (res.ok) {
                const result = await res.json();
                console.log('Payment successful:', result);

                // Show success message with payment details
                const paymentType = result.results?.paymentType;
                const remainingAmount = result.results?.remainingAmount;
                const nextDueUpdated = result.results?.nextDueUpdated;

                if (paymentType === 'partial' && remainingAmount > 0) {
                    alert(`Partial payment collected! Remaining amount: ₹${remainingAmount.toLocaleString("en-IN")} has been added to the next due amount.`);
                } else {
                    alert('Payment collected successfully!');
                }

                setShowPaymentModal(false);
                setSelectedReceivable(null);
                setPaymentForm({ amount: '', paymentMethod: '', paymentDate: new Date().toISOString().split('T')[0], notes: '' });
                fetchReceivables(); // Refresh data
            } else {
                const error = await res.json();
                throw new Error(error.message || 'Payment failed');
            }
        } catch (error) {
            console.error('Payment error:', error);
            alert('Payment failed: ' + error.message);
        }
    };

    const filteredReceivables = getFilteredReceivables();

    return (
        <div className="p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Collections</h1>
                        <p className="text-sm text-gray-600 mt-1">Manage loan collections and payments</p>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setFilters({
                                startDate: '',
                                endDate: '',
                                subscriberName: '',
                                amount: '',
                                status: 'all',
                                disbursementDate: ''
                            })}
                            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
                        >
                            <FiFilter className="w-4 h-4" />
                            Clear Filters
                        </button>
                        <button
                            onClick={fetchReceivables}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
                        >
                            <FiRefreshCw className="w-4 h-4" />
                            Refresh
                        </button>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                    <div className="flex items-center gap-2 mb-4">
                        <FiFilter className="w-5 h-5 text-gray-600" />
                        <h3 className="text-lg font-semibold text-gray-800">Filters</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                            <select
                                value={filters.status}
                                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="all">Today's Due + Overdue</option>
                                <option value="today">Today's Due Only</option>
                                <option value="pending">Overdue Only</option>
                                <option value="overdue">All Overdue</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                            <input
                                type="date"
                                value={filters.startDate}
                                onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                            <input
                                type="date"
                                value={filters.endDate}
                                onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Subscriber</label>
                            <input
                                type="text"
                                value={filters.subscriberName}
                                onChange={(e) => setFilters({ ...filters, subscriberName: e.target.value })}
                                placeholder="Search subscriber"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
                            <input
                                type="number"
                                value={filters.amount}
                                onChange={(e) => setFilters({ ...filters, amount: e.target.value })}
                                placeholder="Amount"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Disbursement Date</label>
                            <input
                                type="date"
                                value={filters.disbursementDate}
                                onChange={(e) => setFilters({ ...filters, disbursementDate: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                    </div>
                </div>

                {/* Receivables Table */}
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800">Receivables ({filteredReceivables.length})</h3>
                                <p className="text-sm text-gray-600 mt-1">
                                    {filters.status === 'all' ? "Showing today's due and overdue amounts" :
                                        filters.status === 'today' ? "Showing today's due amounts only" :
                                            filters.status === 'pending' ? "Showing overdue amounts only" :
                                                "Showing filtered results"}
                                </p>
                            </div>
                            {filteredReceivables.length > 0 && (
                                <div className="text-right">
                                    <div className="text-sm text-gray-600">Total Amount</div>
                                    <div className="text-lg font-semibold text-gray-900">
                                        {formatAmount(filteredReceivables.reduce((sum, r) => sum + parseFloat(r.due_amount || r.amount || 0), 0))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Subscriber</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Product</th>
                                    <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Amount</th>
                                    <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Due Date</th>
                                    <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Status</th>
                                    <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Route</th>
                                    <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {filteredReceivables.map((receivable) => {
                                    const status = getStatusBadge(receivable);
                                    return (
                                        <tr key={receivable.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                                                        <FiUser className="w-4 h-4 text-gray-600" />
                                                    </div>
                                                    <div>
                                                        <div className="font-medium text-gray-900">
                                                            {receivable.subscriber?.name || 'N/A'}
                                                        </div>
                                                        <div className="text-sm text-gray-500">
                                                            {receivable.subscriber?.phone || ''}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {receivable.product?.product_name || 'N/A'}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    {receivable.loan?.payment_method || ''}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <span className="text-sm font-semibold text-gray-900">
                                                    {formatAmount(receivable.due_amount || receivable.amount)}
                                                </span>
                                                {receivable.due_amount && receivable.amount && receivable.due_amount !== receivable.amount && (
                                                    <div className="text-xs text-gray-500">
                                                        Total: {formatAmount(receivable.amount)}
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className="text-sm text-gray-600">
                                                    {new Date(receivable.due_date).toLocaleDateString('en-GB')}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${status.color}`}>
                                                    {status.text}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                                                    <FiMapPin className="w-4 h-4" />
                                                </button>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                {!receivable.is_paid && (
                                                    <button
                                                        onClick={() => {
                                                            setSelectedReceivable(receivable);
                                                            setPaymentForm({
                                                                amount: receivable.due_amount || receivable.amount || 0,
                                                                paymentMethod: '',
                                                                paymentDate: new Date().toISOString().split('T')[0],
                                                                notes: ''
                                                            });
                                                            setShowPaymentModal(true);
                                                        }}
                                                        className="bg-green-500 hover:bg-green-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
                                                    >
                                                        Collect
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Payment Modal */}
                {showPaymentModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Collect Payment</h3>
                            {selectedReceivable && (
                                <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                                    <div className="text-sm text-blue-800">
                                        <strong>Due Amount:</strong> ₹{formatAmount(selectedReceivable.due_amount || selectedReceivable.amount)}
                                    </div>
                                    <div className="text-xs text-blue-600 mt-1">
                                        💡 Enter less amount for partial payment (remaining will be carried forward)
                                    </div>
                                </div>
                            )}
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
                                    <input
                                        type="number"
                                        value={paymentForm.amount}
                                        onChange={(e) => setPaymentForm({ ...paymentForm, amount: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                        step="0.01"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
                                    <select
                                        value={paymentForm.paymentMethod}
                                        onChange={(e) => setPaymentForm({ ...paymentForm, paymentMethod: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                    >
                                        <option value="">Select Payment Method</option>
                                        {ledgerAccounts.map((account) => (
                                            <option key={account.id} value={account.account_name}>
                                                {account.account_name} (Balance: ₹{Number(account.current_balance).toLocaleString("en-IN")})
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Payment Date</label>
                                    <input
                                        type="date"
                                        value={paymentForm.paymentDate}
                                        onChange={(e) => setPaymentForm({ ...paymentForm, paymentDate: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                                    <textarea
                                        value={paymentForm.notes}
                                        onChange={(e) => setPaymentForm({ ...paymentForm, notes: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                        rows="3"
                                        placeholder="Optional notes"
                                    />
                                </div>
                            </div>
                            <div className="flex gap-3 mt-6">
                                <button
                                    onClick={() => setShowPaymentModal(false)}
                                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handlePayment}
                                    className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                                >
                                    Collect Payment
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CollectionsPage;
