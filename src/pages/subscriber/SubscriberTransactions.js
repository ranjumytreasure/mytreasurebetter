import React, { useState, useEffect } from 'react';
import { useSubscriberContext } from '../../context/subscriber/SubscriberContext';
import TransactionList from '../../components/subscriber/transactions/TransactionList';

const SubscriberTransactions = () => {
    const {
        transactionDashboard,
        fetchTransactionDashboard,
        loading
    } = useSubscriberContext();

    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    useEffect(() => {
        fetchTransactionDashboard(currentPage, pageSize);
    }, [currentPage, pageSize]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handlePageSizeChange = (size) => {
        setPageSize(size);
        setCurrentPage(1); // Reset to first page when changing page size
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="mb-8">
                    <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-lg p-6 md:p-8 text-white shadow-lg">
                        <h1 className="text-2xl md:text-3xl font-bold mb-2">💳 Transaction History</h1>
                        <p className="text-red-100 text-sm md:text-base">
                            View all your payment and receipt transactions
                        </p>
                    </div>
                </div>

                {/* Controls Section */}
                <div className="bg-white rounded-lg shadow-md p-4 mb-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex items-center gap-2">
                            <label className="text-sm font-medium text-gray-700">Show:</label>
                            <select
                                value={pageSize}
                                onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                                className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500"
                            >
                                <option value={5}>5 per page</option>
                                <option value={10}>10 per page</option>
                                <option value={20}>20 per page</option>
                                <option value={50}>50 per page</option>
                            </select>
                        </div>

                        {transactionDashboard && (
                            <div className="text-sm text-gray-600">
                                <span className="font-medium">{transactionDashboard.totalItems}</span> total transactions
                            </div>
                        )}
                    </div>
                </div>

                {/* Transactions Content */}
                <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
                    <TransactionList
                        transactions={transactionDashboard?.transactions || []}
                        loading={loading}
                    />
                </div>

                {/* Pagination */}
                {transactionDashboard && transactionDashboard.totalPages > 1 && (
                    <div className="bg-white rounded-lg shadow-md p-4">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            {/* Pagination Info */}
                            <div className="text-sm text-gray-600">
                                Showing <span className="font-medium">{((currentPage - 1) * pageSize) + 1}</span> to{' '}
                                <span className="font-medium">{Math.min(currentPage * pageSize, transactionDashboard.totalItems)}</span> of{' '}
                                <span className="font-medium">{transactionDashboard.totalItems}</span> transactions
                            </div>

                            {/* Pagination Controls */}
                            <div className="flex items-center gap-2">
                                <button
                                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${currentPage === 1
                                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                            : 'bg-red-600 text-white hover:bg-red-700'
                                        }`}
                                    disabled={currentPage === 1}
                                    onClick={() => handlePageChange(currentPage - 1)}
                                >
                                    Previous
                                </button>

                                <div className="flex gap-1">
                                    {Array.from({ length: Math.min(5, transactionDashboard.totalPages) }, (_, i) => {
                                        const pageNum = i + 1;
                                        return (
                                            <button
                                                key={pageNum}
                                                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${currentPage === pageNum
                                                        ? 'bg-red-600 text-white'
                                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                    }`}
                                                onClick={() => handlePageChange(pageNum)}
                                            >
                                                {pageNum}
                                            </button>
                                        );
                                    })}
                                </div>

                                <button
                                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${currentPage === transactionDashboard.totalPages
                                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                            : 'bg-red-600 text-white hover:bg-red-700'
                                        }`}
                                    disabled={currentPage === transactionDashboard.totalPages}
                                    onClick={() => handlePageChange(currentPage + 1)}
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SubscriberTransactions;
