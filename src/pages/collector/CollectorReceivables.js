import React, { useState, useEffect, useRef } from 'react';
import { FiDollarSign, FiUsers, FiTrendingUp, FiEye, FiArrowLeft, FiSearch, FiFilter, FiX, FiUser, FiPhone, FiCalendar, FiCreditCard, FiRefreshCw } from 'react-icons/fi';
import { useCollector } from '../../context/CollectorProvider';
import { useCollectorLedger } from '../../context/CollectorLedgerContext';
import loadingImage from '../../images/preloader.gif';
import CollectorPaymentModal from '../../components/collector/CollectorPaymentModal';

const CollectorReceivables = () => {
    const {
        receivables,
        selectedArea,
        areaReceivables,
        isLoading,
        error,
        fetchReceivables,
        fetchAreaReceivables,
        getAreaSummary
    } = useCollector();

    // Fetch ledger accounts (payment methods) for the collector
    const {
        ledgerAccounts = [],
        fetchLedgerAccounts,
        isLoading: isLoadingAccounts
    } = useCollectorLedger();

    const [showAreaDetails, setShowAreaDetails] = useState(false);

    // Filter states
    const [areaFilter, setAreaFilter] = useState("");
    const [customerFilter, setCustomerFilter] = useState("");

    // Payment modal states
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedReceivable, setSelectedReceivable] = useState(null);

    // Advance 360° modal state
    const [showAdvanceModal, setShowAdvanceModal] = useState(false);
    const [selectedAdvanceReceivable, setSelectedAdvanceReceivable] = useState(null);

    useEffect(() => {
        console.log('🔄 CollectorReceivables useEffect triggered');
        console.log('  - receivables.length:', receivables?.length);
        console.log('  - isLoading:', isLoading);
        console.log('  - error:', error);

        // Fetch receivables if we don't have any data and we're not already loading
        if (receivables?.length === 0 && !isLoading && !error) {
            console.log('🔄 Calling fetchReceivables...');
            fetchReceivables();
        }

        // Fetch ledger accounts (payment methods) for payment processing
        if (ledgerAccounts.length === 0 && !isLoadingAccounts) {
            console.log('🔄 Calling fetchLedgerAccounts...');
            fetchLedgerAccounts();
        }
    }, []); // Empty dependency array - only run once on mount

    // Debug logging for ledger accounts
    useEffect(() => {
        console.log('🔍 CollectorReceivables - Ledger Accounts Update:');
        console.log('  - ledgerAccounts:', ledgerAccounts);
        console.log('  - ledgerAccounts.length:', ledgerAccounts?.length);
        console.log('  - isLoadingAccounts:', isLoadingAccounts);
    }, [ledgerAccounts, isLoadingAccounts]);

    const areaSummary = getAreaSummary();

    // Show debug info on screen temporarily
    const debugInfo = {
        receivablesCount: receivables?.length || 0,
        isLoading,
        error,
        areaCount: Object.keys(areaSummary).length
    };

    // Manual fetch function for testing
    const handleManualFetch = () => {
        console.log('🔄 Manual fetch triggered');
        fetchReceivables();
    };

    const handleAreaClick = (areaName) => {
        fetchAreaReceivables(areaName);
        setShowAreaDetails(true);
    };

    const handleBackToAreas = () => {
        setShowAreaDetails(false);
    };

    // Filter receivables based on area and customer name
    const filteredReceivables = receivables.filter(({ aob, customer_name }) => {
        const areaMatch = !areaFilter || (aob || "").toLowerCase().includes(areaFilter.toLowerCase());
        const customerMatch = !customerFilter || (customer_name || "").toLowerCase().includes(customerFilter.toLowerCase());
        return areaMatch && customerMatch;
    });

    // Clear all filters
    const clearFilters = () => {
        setAreaFilter("");
        setCustomerFilter("");
    };

    // Advance 360° modal handlers
    const handleOpenAdvanceModal = (receivable) => {
        setSelectedAdvanceReceivable(receivable);
        setShowAdvanceModal(true);
    };

    const handleCloseAdvanceModal = () => {
        setShowAdvanceModal(false);
        setSelectedAdvanceReceivable(null);
    };

    // Calculate advance breakdown
    const calculateAdvanceBreakdown = (receivable) => {
        const transactions = receivable?.advance_transactions || [];
        let runningBalance = 0;
        let totalCredit = 0;
        let totalDebit = 0;

        const transactionsWithBalance = transactions.map(tx => {
            const amount = parseFloat(tx.amount) || 0;
            if (tx.type === 'CREDIT') {
                runningBalance += amount;
                totalCredit += amount;
            } else if (tx.type === 'DEBIT') {
                runningBalance -= amount;
                totalDebit += amount;
            }
            return {
                ...tx,
                runningBalance: runningBalance
            };
        });

        return {
            transactions: transactionsWithBalance,
            totalCredit,
            totalDebit,
            currentBalance: runningBalance
        };
    };

    const formatCurrency = (amount) => {
        return `₹${Number(amount ?? 0).toLocaleString("en-IN")}`;
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return "-";
        const date = new Date(dateStr);
        return date.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <img src={loadingImage} alt="Loading..." className="w-20 h-20 mx-auto mb-4" />
                    <p className="text-gray-600 font-medium">Loading receivables...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-12 text-center">
                        <div className="w-24 h-24 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
                            <FiCreditCard className="w-12 h-12 text-red-400" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">Error Loading Receivables</h3>
                        <p className="text-gray-600 mb-6">{error}</p>
                        <button
                            onClick={fetchReceivables}
                            className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center gap-2 mx-auto"
                        >
                            <FiDollarSign className="w-5 h-5" />
                            Try Again
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (!receivables.length) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-12 text-center">
                        <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                            <FiCreditCard className="w-12 h-12 text-gray-400" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">No Receivables Found</h3>
                        <p className="text-gray-600 mb-4">
                            You don't have any assigned areas or receivables yet.
                        </p>
                        <p className="text-sm text-gray-500">
                            Contact your administrator to get areas assigned to your account.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    // Show area details view
    if (showAreaDetails && selectedArea) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="bg-white rounded-xl shadow-lg border border-gray-200 mb-8">
                        <div className="bg-gradient-to-r from-red-600 to-red-700 px-8 py-6 rounded-t-xl">
                            <div className="flex items-center justify-between">
                                <div>
                                    <button
                                        onClick={handleBackToAreas}
                                        className="flex items-center text-white/80 hover:text-white mb-4 transition-colors"
                                    >
                                        <FiArrowLeft className="h-5 w-5 mr-2" />
                                        Back to All Areas
                                    </button>
                                    <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                                        <FiCreditCard className="w-8 h-8" />
                                        {selectedArea} - Receivables
                                    </h1>
                                    <p className="text-red-100 mt-2">{areaReceivables.length} receivables found in this area</p>
                                </div>
                                <div className="bg-white/20 rounded-lg px-4 py-2">
                                    <span className="text-white font-semibold text-lg">{areaReceivables.length}</span>
                                    <p className="text-red-100 text-sm">Total Records</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Area Summary Cards */}
                    {areaSummary[selectedArea] && (
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                                <div className="flex items-center">
                                    <div className="p-3 rounded-full bg-blue-100">
                                        <FiDollarSign className="h-6 w-6 text-blue-600" />
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-600">Total Amount</p>
                                        <p className="text-2xl font-bold text-gray-900">
                                            {formatCurrency(areaSummary[selectedArea].totalAmount)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                                <div className="flex items-center">
                                    <div className="p-3 rounded-full bg-green-100">
                                        <FiTrendingUp className="h-6 w-6 text-green-600" />
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-600">Collected</p>
                                        <p className="text-2xl font-bold text-green-600">
                                            {formatCurrency(areaSummary[selectedArea].collected)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                                <div className="flex items-center">
                                    <div className="p-3 rounded-full bg-orange-100">
                                        <FiDollarSign className="h-6 w-6 text-orange-600" />
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-600">Pending</p>
                                        <p className="text-2xl font-bold text-orange-600">
                                            {formatCurrency(areaSummary[selectedArea].pending)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                                <div className="flex items-center">
                                    <div className="p-3 rounded-full bg-purple-100">
                                        <FiUsers className="h-6 w-6 text-purple-600" />
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-600">Customers</p>
                                        <p className="text-2xl font-bold text-purple-600">
                                            {areaSummary[selectedArea].count}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Receivables Cards */}
                    {areaReceivables.length > 0 ? (
                        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                            {areaReceivables.map((receivable, index) => {
                                const progress = receivable.total_amount > 0
                                    ? (receivable.collected_amount / receivable.total_amount) * 100
                                    : 0;

                                return (
                                    <div key={index} className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                                        {/* Card Header */}
                                        <div className="bg-gradient-to-r from-red-600 to-red-700 p-6 text-white">
                                            <div className="flex items-center gap-4">
                                                <div className="relative">
                                                    {receivable.user_image_from_s3 || receivable.customer_image ? (
                                                        <img
                                                            src={receivable.user_image_from_s3 || receivable.customer_image}
                                                            alt={receivable.name || receivable.customer_name}
                                                            className="w-16 h-16 rounded-full object-cover border-2 border-white/30"
                                                            onError={(e) => {
                                                                e.target.style.display = 'none';
                                                                e.target.nextSibling.style.display = 'flex';
                                                            }}
                                                        />
                                                    ) : null}
                                                    <div
                                                        className={`w-16 h-16 rounded-full border-2 border-white/30 bg-white/20 flex items-center justify-center ${receivable.user_image_from_s3 || receivable.customer_image ? 'hidden' : 'flex'}`}
                                                    >
                                                        <FiUser className="w-8 h-8 text-white" />
                                                    </div>
                                                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white"></div>
                                                </div>
                                                <div className="flex-1">
                                                    <h3 className="text-xl font-bold">{receivable.name || receivable.customer_name || 'N/A'}</h3>
                                                    <p className="text-red-100 flex items-center gap-2">
                                                        <FiPhone className="w-4 h-4" />
                                                        {receivable.phone || receivable.customer_phone || 'N/A'}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Card Body */}
                                        <div className="p-6">
                                            {/* Area Info */}
                                            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                                    <FiFilter className="w-4 h-4" />
                                                    <span className="font-medium">Area:</span>
                                                    <span>{receivable.aob || 'N/A'}</span>
                                                </div>
                                            </div>

                                            {/* Advance Balance */}
                                            <div
                                                className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg cursor-pointer hover:shadow-md hover:border-yellow-300 transition-all duration-200 hover:scale-[1.02]"
                                                onClick={() => handleOpenAdvanceModal(receivable)}
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-2xl">💰</span>
                                                        <div>
                                                            <p className="text-xs text-yellow-700 font-medium uppercase tracking-wide">Advance Balance</p>
                                                            <span className="text-xs text-yellow-600 flex items-center gap-1">
                                                                Click for details <span className="text-blue-500">ℹ️</span>
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-2xl font-bold text-yellow-900">
                                                            {formatCurrency(receivable?.total_advance_balance ?? 0)}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Financial Summary */}
                                            <div className="grid grid-cols-3 gap-3 mb-6">
                                                <div className="text-center p-3 bg-blue-50 rounded-lg">
                                                    <div className="text-xs text-blue-600 font-medium mb-1">Total Due</div>
                                                    <div className="text-lg font-bold text-blue-700">{formatCurrency(receivable.rbtotal || receivable.total_amount)}</div>
                                                </div>
                                                <div className="text-center p-3 bg-green-50 rounded-lg">
                                                    <div className="text-xs text-green-600 font-medium mb-1">Paid</div>
                                                    <div className="text-lg font-bold text-green-700">{formatCurrency(receivable.rbpaid || receivable.collected_amount)}</div>
                                                </div>
                                                <div className="text-center p-3 bg-red-50 rounded-lg">
                                                    <div className="text-xs text-red-600 font-medium mb-1">Balance</div>
                                                    <div className="text-lg font-bold text-red-700">{formatCurrency(receivable.rbdue || receivable.pending_amount)}</div>
                                                </div>
                                            </div>

                                            {/* Pay Button */}
                                            <button
                                                onClick={() => {
                                                    setSelectedReceivable(receivable);
                                                    setModalOpen(true);
                                                }}
                                                className="w-full py-3 px-4 bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
                                            >
                                                <FiDollarSign className="w-5 h-5" />
                                                Process Payment
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-12 text-center">
                            <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                                <FiCreditCard className="w-12 h-12 text-gray-400" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">No Receivables in {selectedArea}</h3>
                            <p className="text-gray-600">This area doesn't have any receivables at the moment.</p>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // Show main receivables view
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 mb-8">
                    <div className="bg-gradient-to-r from-red-600 to-red-700 px-8 py-6 rounded-t-xl">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                                    <FiCreditCard className="w-8 h-8" />
                                    Collector Receivables
                                </h1>
                                <p className="text-red-100 mt-2">Track and manage your assigned area receivables</p>
                            </div>
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={handleManualFetch}
                                    disabled={isLoading}
                                    className="flex items-center gap-2 px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    title="Refresh Receivables"
                                >
                                    <FiRefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
                                    <span className="hidden md:inline">Refresh</span>
                                </button>
                                <div className="bg-white/20 rounded-lg px-4 py-2">
                                    <span className="text-white font-semibold text-lg">{receivables.length}</span>
                                    <p className="text-red-100 text-sm">Total Records</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FiSearch className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Search by customer name"
                                    value={customerFilter}
                                    onChange={(e) => setCustomerFilter(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all duration-200"
                                />
                            </div>

                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FiFilter className="h-5 w-5 text-gray-400" />
                                </div>
                                <select
                                    value={areaFilter}
                                    onChange={(e) => setAreaFilter(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all duration-200 appearance-none bg-white"
                                >
                                    <option value="">All Areas</option>
                                    {[...new Set(receivables.map((item) => item.aob).filter(Boolean))].map((areaName, index) => (
                                        <option key={index} value={areaName}>
                                            {areaName}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <button
                                onClick={clearFilters}
                                className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors duration-200 flex items-center justify-center gap-2 font-medium"
                            >
                                <FiX className="w-4 h-4" />
                                Clear Filters
                            </button>
                        </div>

                        {/* Results Summary */}
                        <div className="flex items-center justify-between text-sm text-gray-600">
                            <span>Showing {filteredReceivables.length} of {receivables.length} receivables</span>
                            {(areaFilter || customerFilter) && (
                                <span className="text-red-600 font-medium">Filters applied</span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Receivables List */}
                {filteredReceivables.length > 0 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                        {filteredReceivables.map((receivable, index) => {
                            const progress = receivable.total_amount > 0
                                ? (receivable.collected_amount / receivable.total_amount) * 100
                                : 0;

                            return (
                                <div key={index} className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                                    {/* Card Header */}
                                    <div className="bg-gradient-to-r from-red-600 to-red-700 p-6 text-white">
                                        <div className="flex items-center gap-4">
                                            <div className="relative">
                                                {receivable.user_image_from_s3 || receivable.customer_image ? (
                                                    <img
                                                        src={receivable.user_image_from_s3 || receivable.customer_image}
                                                        alt={receivable.name || receivable.customer_name}
                                                        className="w-16 h-16 rounded-full object-cover border-2 border-white/30"
                                                        onError={(e) => {
                                                            e.target.style.display = 'none';
                                                            e.target.nextSibling.style.display = 'flex';
                                                        }}
                                                    />
                                                ) : null}
                                                <div
                                                    className={`w-16 h-16 rounded-full border-2 border-white/30 bg-white/20 flex items-center justify-center ${receivable.user_image_from_s3 || receivable.customer_image ? 'hidden' : 'flex'}`}
                                                >
                                                    <FiUser className="w-8 h-8 text-white" />
                                                </div>
                                                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white"></div>
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="text-xl font-bold">{receivable.name || receivable.customer_name || 'N/A'}</h3>
                                                <p className="text-red-100 flex items-center gap-2">
                                                    <FiPhone className="w-4 h-4" />
                                                    {receivable.phone || receivable.customer_phone || 'N/A'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Card Body */}
                                    <div className="p-6">
                                        {/* Group and Auction Info - Enhanced */}
                                        <div className="mb-4 grid grid-cols-2 gap-3">
                                            <div className="p-3 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border border-blue-200">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <FiUsers className="w-4 h-4 text-blue-600" />
                                                    <span className="text-xs text-blue-600 font-medium uppercase tracking-wide">Group</span>
                                                </div>
                                                <p className="text-sm font-bold text-blue-900 truncate" title={receivable.group_name}>
                                                    {receivable.group_name || 'N/A'}
                                                </p>
                                            </div>
                                            <div className="p-3 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg border border-purple-200">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <FiCalendar className="w-4 h-4 text-purple-600" />
                                                    <span className="text-xs text-purple-600 font-medium uppercase tracking-wide">Auction</span>
                                                </div>
                                                <p className="text-sm font-bold text-purple-900">
                                                    {formatDate(receivable.auct_date)}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Area Info */}
                                        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <FiFilter className="w-4 h-4" />
                                                <span className="font-medium">Area:</span>
                                                <span>{receivable.aob || 'N/A'}</span>
                                            </div>
                                        </div>

                                        {/* Advance Balance */}
                                        <div
                                            className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg cursor-pointer hover:shadow-md hover:border-yellow-300 transition-all duration-200 hover:scale-[1.02]"
                                            onClick={() => handleOpenAdvanceModal(receivable)}
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-2xl">💰</span>
                                                    <div>
                                                        <p className="text-xs text-yellow-700 font-medium uppercase tracking-wide">Advance Balance</p>
                                                        <span className="text-xs text-yellow-600 flex items-center gap-1">
                                                            Click for details <span className="text-blue-500">ℹ️</span>
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-2xl font-bold text-yellow-900">
                                                        {formatCurrency(receivable?.total_advance_balance || 0)}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Financial Summary */}
                                        <div className="grid grid-cols-3 gap-3 mb-6">
                                            <div className="text-center p-3 bg-blue-50 rounded-lg">
                                                <div className="text-xs text-blue-600 font-medium mb-1">Total Due</div>
                                                <div className="text-lg font-bold text-blue-700">{formatCurrency(receivable.rbtotal || receivable.total_amount)}</div>
                                            </div>
                                            <div className="text-center p-3 bg-green-50 rounded-lg">
                                                <div className="text-xs text-green-600 font-medium mb-1">Paid</div>
                                                <div className="text-lg font-bold text-green-700">{formatCurrency(receivable.rbpaid || receivable.collected_amount)}</div>
                                            </div>
                                            <div className="text-center p-3 bg-red-50 rounded-lg">
                                                <div className="text-xs text-red-600 font-medium mb-1">Balance</div>
                                                <div className="text-lg font-bold text-red-700">{formatCurrency(receivable.rbdue || receivable.pending_amount)}</div>
                                            </div>
                                        </div>

                                        {/* Pay Button */}
                                        <button
                                            onClick={() => {
                                                setSelectedReceivable(receivable);
                                                setModalOpen(true);
                                            }}
                                            className="w-full py-3 px-4 bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
                                        >
                                            <FiDollarSign className="w-5 h-5" />
                                            Process Payment
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-12 text-center">
                        <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                            <FiCreditCard className="w-12 h-12 text-gray-400" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">No Receivables Found</h3>
                        <p className="text-gray-600 mb-4">
                            {receivables.length === 0
                                ? "You don't have any assigned areas or receivables yet."
                                : "No receivables match your current filters."}
                        </p>
                        {receivables.length > 0 && (
                            <button
                                onClick={clearFilters}
                                className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
                            >
                                Clear Filters
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* Payment Modal - Collector Specific */}
            <CollectorPaymentModal
                isOpen={modalOpen}
                onClose={() => {
                    setModalOpen(false);
                    setSelectedReceivable(null);
                }}
                receivable={selectedReceivable}
                fetchReceivables={fetchReceivables}
            />

            {/* Advance 360° Modal */}
            {showAdvanceModal && selectedAdvanceReceivable && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
                        {/* Header */}
                        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 md:p-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <span className="text-3xl md:text-4xl">💰</span>
                                    <div>
                                        <h3 className="text-lg md:text-xl font-bold">Advance 360° View</h3>
                                        <p className="text-xs md:text-sm text-blue-100 mt-1">
                                            {selectedAdvanceReceivable.name || selectedAdvanceReceivable.customer_name}
                                        </p>
                                        <div className="flex flex-col md:flex-row md:gap-4 mt-1">
                                            <p className="text-xs text-blue-200 flex items-center gap-1">
                                                <FiUsers className="w-3 h-3" />
                                                Group: {selectedAdvanceReceivable.group_name}
                                            </p>
                                            <p className="text-xs text-blue-200 flex items-center gap-1">
                                                <FiCalendar className="w-3 h-3" />
                                                Auction: {formatDate(selectedAdvanceReceivable.auct_date)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={handleCloseAdvanceModal}
                                    className="text-white hover:bg-white/20 p-2 rounded-full transition-colors"
                                >
                                    <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-4 md:p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
                            {(() => {
                                const breakdown = calculateAdvanceBreakdown(selectedAdvanceReceivable);
                                const { transactions, totalCredit, totalDebit, currentBalance } = breakdown;

                                return (
                                    <>
                                        {/* Summary Cards */}
                                        <div className="grid grid-cols-3 gap-2 md:gap-4 mb-4 md:mb-6">
                                            <div className="bg-green-50 rounded-lg p-3 md:p-4 text-center border border-green-200">
                                                <p className="text-xs md:text-sm text-green-600 font-medium mb-1">Collected</p>
                                                <p className="text-base md:text-xl font-bold text-green-700">₹{totalCredit.toLocaleString()}</p>
                                            </div>
                                            <div className="bg-red-50 rounded-lg p-3 md:p-4 text-center border border-red-200">
                                                <p className="text-xs md:text-sm text-red-600 font-medium mb-1">Utilized</p>
                                                <p className="text-base md:text-xl font-bold text-red-700">₹{totalDebit.toLocaleString()}</p>
                                            </div>
                                            <div className="bg-blue-50 rounded-lg p-3 md:p-4 text-center border border-blue-200">
                                                <p className="text-xs md:text-sm text-blue-600 font-medium mb-1">Balance</p>
                                                <p className="text-base md:text-xl font-bold text-blue-700">₹{currentBalance.toLocaleString()}</p>
                                            </div>
                                        </div>

                                        {/* Transaction List */}
                                        <div className="bg-gray-50 rounded-lg p-3 md:p-4">
                                            <h4 className="text-sm md:text-base font-semibold text-gray-800 mb-3 md:mb-4 flex items-center justify-between">
                                                <span>Transaction History</span>
                                                <span className="text-xs md:text-sm bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                                                    {transactions.length} {transactions.length === 1 ? 'entry' : 'entries'}
                                                </span>
                                            </h4>

                                            {transactions.length > 0 ? (
                                                <div className="space-y-2 md:space-y-3 max-h-96 overflow-y-auto">
                                                    {transactions.map((tx, idx) => (
                                                        <div
                                                            key={idx}
                                                            className={`flex items-start gap-2 md:gap-3 p-3 md:p-4 rounded-lg ${tx.type === 'CREDIT'
                                                                ? 'bg-green-50 border-l-4 border-green-500'
                                                                : 'bg-red-50 border-l-4 border-red-500'
                                                                }`}
                                                        >
                                                            <div className="flex-shrink-0 mt-1">
                                                                {tx.type === 'CREDIT' ? (
                                                                    <span className="text-green-600 text-lg md:text-xl">✅</span>
                                                                ) : (
                                                                    <span className="text-red-600 text-lg md:text-xl">⚡</span>
                                                                )}
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-1 md:gap-0 mb-2">
                                                                    <span className="font-semibold text-gray-700 text-sm md:text-base">
                                                                        {new Date(tx.date).toLocaleDateString('en-IN', {
                                                                            day: '2-digit',
                                                                            month: 'short',
                                                                            year: 'numeric'
                                                                        })}
                                                                    </span>
                                                                    <span className={`font-bold text-base md:text-lg ${tx.type === 'CREDIT' ? 'text-green-600' : 'text-red-600'}`}>
                                                                        {tx.type === 'CREDIT' ? '+' : '-'}₹{parseFloat(tx.amount).toLocaleString()}
                                                                    </span>
                                                                </div>
                                                                <p className="text-gray-600 text-xs md:text-sm mb-1 break-words">{tx.description}</p>
                                                                {tx.sub_category && (
                                                                    <span className="inline-block text-xs bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full mb-2">
                                                                        {tx.sub_category}
                                                                    </span>
                                                                )}
                                                                <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                                                                    <span className="text-xs md:text-sm text-gray-500">Running Balance:</span>
                                                                    <span className="text-sm md:text-base font-semibold text-blue-600">₹{tx.runningBalance.toLocaleString()}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="text-center py-8 md:py-12">
                                                    <div className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-3 md:mb-4 bg-gray-200 rounded-full flex items-center justify-center">
                                                        <span className="text-3xl md:text-4xl">📊</span>
                                                    </div>
                                                    <p className="text-gray-500 text-sm md:text-base">No transactions yet</p>
                                                    <p className="text-gray-400 text-xs md:text-sm mt-1">Transactions will appear here once recorded</p>
                                                </div>
                                            )}
                                        </div>
                                    </>
                                );
                            })()}
                        </div>

                        {/* Footer */}
                        <div className="border-t border-gray-200 p-4 bg-gray-50 flex justify-end">
                            <button
                                onClick={handleCloseAdvanceModal}
                                className="px-4 md:px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm md:text-base font-medium"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CollectorReceivables;
