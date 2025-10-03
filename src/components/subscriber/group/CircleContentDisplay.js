import React from 'react';
import { useHistory, useParams } from 'react-router-dom';

const CircleContentDisplay = ({ selectedCircle, groupDetails, auctionStatus, groupAccountId }) => {

    const {
        groupTransactionInfo,
        transactionInfo,
        outstandingAdvanceTransactionInfo,
        auctionStatus: groupAuctionStatus
    } = groupDetails;

    const history = useHistory();
    const { groupId, grpSubId } = useParams();




    const renderContent = () => {
        switch (selectedCircle) {
            case 'groups':
                return renderGroupAccounts();
            case 'due':
                return renderDueDetails();
            case 'auction':
                return renderAuctionDetails();
            case 'credit':
                return renderCreditDetails();
            default:
                return renderGroupAccounts(); // Default to Group Accounts
        }
    };

    const renderGroupAccounts = () => {
        if (!groupTransactionInfo || groupTransactionInfo.length === 0) {
            return (
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Group Accounts</h3>
                    <div className="text-center text-gray-500 py-8">
                        <div className="text-4xl mb-2">📊</div>
                        <p>No group accounts data available</p>
                    </div>
                </div>
            );
        }

        return (
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="bg-gradient-to-r from-red-600 to-red-700 text-white p-3 sm:p-4">
                    <h3 className="text-base sm:text-lg font-semibold">Group Accounts</h3>
                </div>

                {/* Desktop Table View */}
                <div className="hidden md:block overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">S.No</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Auction Amount</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Commission</th>
                                {groupDetails?.type === 'ACCUMULATIVE' && (
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reserve</th>
                                )}
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {groupTransactionInfo.map((transaction, index) => (
                                <tr key={index} className="hover:bg-gray-50">
                                    <td className="px-4 py-3 whitespace-nowrap">
                                        <span className="bg-red-600 text-white px-2 py-1 rounded-full text-xs font-semibold">
                                            #{transaction.sno}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                                        {new Date(transaction.date).toLocaleDateString()}
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm font-semibold text-gray-900">
                                        ₹{transaction.auctionAmount.toLocaleString()}
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                                        ₹{transaction.commision}
                                    </td>
                                    {groupDetails?.type === 'ACCUMULATIVE' && (
                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                                            ₹{transaction.reserve}
                                        </td>
                                    )}
                                    <td className="px-4 py-3 whitespace-nowrap text-sm font-semibold text-gray-900">
                                        ₹{transaction.customerDue}
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap">
                                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${transaction.auctionStatus === 'completed'
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-yellow-100 text-yellow-800'
                                            }`}>
                                            {transaction.auctionStatus === 'completed' ? '✅ Completed' : '⏳ Pending'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Mobile Card View - Compact */}
                <div className="md:hidden p-4 space-y-4">
                    {groupTransactionInfo.map((transaction, index) => (
                        <div key={index} className="bg-white rounded-lg p-4 border border-gray-200 shadow-md">
                            <div className="flex justify-between items-center mb-4">
                                <div className="flex items-center gap-2">
                                    <span className="bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold">
                                        #{transaction.sno}
                                    </span>
                                </div>
                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${transaction.auctionStatus === 'completed'
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-yellow-100 text-yellow-800'
                                    }`}>
                                    {transaction.auctionStatus === 'completed' ? '✅ Completed' : '⏳ Pending'}
                                </span>
                            </div>

                            <div className="space-y-3">
                                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                    <span className="text-sm text-gray-600 font-medium">Date:</span>
                                    <span className="text-sm font-bold text-gray-900">
                                        {new Date(transaction.date).toLocaleDateString()}
                                    </span>
                                </div>

                                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                    <span className="text-sm text-gray-600 font-medium">Auction Amount:</span>
                                    <span className="text-base font-bold text-red-600">
                                        ₹{transaction.auctionAmount.toLocaleString()}
                                    </span>
                                </div>

                                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                    <span className="text-sm text-gray-600 font-medium">Commission:</span>
                                    <span className="text-sm font-semibold text-gray-900">
                                        ₹{transaction.commision}
                                    </span>
                                </div>

                                {groupDetails?.type === 'ACCUMULATIVE' && (
                                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                        <span className="text-sm text-gray-600 font-medium">Reserve:</span>
                                        <span className="text-sm font-semibold text-gray-900">
                                            ₹{transaction.reserve}
                                        </span>
                                    </div>
                                )}

                                <div className="flex justify-between items-center py-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg px-3">
                                    <span className="text-sm text-gray-700 font-bold">Total Due:</span>
                                    <span className="text-lg font-extrabold text-blue-600">
                                        ₹{transaction.customerDue}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    const renderDueDetails = () => {
        // Check multiple possible data sources for due information
        const dueData = transactionInfo || groupDetails?.transactionInfo || groupDetails?.dueInfo || groupDetails?.receivableInfo || [];


        if (!dueData || dueData.length === 0) {
            return (
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Due Details</h3>
                    <div className="text-center text-gray-500 py-8">
                        <div className="text-4xl mb-2">💰</div>
                        <p>No due details available</p>
                    </div>
                </div>
            );
        }

        return (
            <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-100">
                <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-4 sm:p-6">
                    <h3 className="text-xl sm:text-2xl font-bold text-center">Due Details</h3>
                </div>
                <div className="p-4 sm:p-6 space-y-4">
                    {dueData.map((transaction, index) => (
                        <div key={index} className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-4 sm:p-6 border-l-4 border-orange-500 shadow-md">
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                                <div className="text-center sm:text-left">
                                    <div className="text-xs sm:text-sm text-gray-600 mb-1 font-semibold">Date</div>
                                    <div className="text-sm sm:text-base font-bold text-gray-900">
                                        {new Date(transaction.date || transaction.createdAt || new Date()).toLocaleDateString()}
                                    </div>
                                </div>
                                <div className="text-center sm:text-left">
                                    <div className="text-xs sm:text-sm text-gray-600 mb-1 font-semibold">Amount</div>
                                    <div className="text-base sm:text-lg font-extrabold text-red-600">
                                        ₹{(transaction.amount || transaction.receivableAmount || transaction.payment_amount || transaction.customerDue || 0).toLocaleString()}
                                    </div>
                                </div>
                                <div className="text-center sm:text-left">
                                    <div className="text-xs sm:text-sm text-gray-600 mb-1 font-semibold">Status</div>
                                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${transaction.status === 'Success'
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-red-100 text-red-800'
                                        }`}>
                                        {transaction.status === 'Success' ? '✅ Success' : '⚠️ Due'}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    const renderAuctionDetails = () => {
        const isAuctionOpen = auctionStatus === 'OPEN';

        // If auction is closed, show simple closed message
        if (!isAuctionOpen) {
            return (
                <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8 border border-gray-100">
                    <div className="text-center">
                        <div className="text-4xl sm:text-5xl mb-4">🔴</div>
                        <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 mb-4">Auction is Closed</h3>
                        <p className="text-sm sm:text-base lg:text-lg text-gray-600 max-w-2xl mx-auto">
                            This auction is currently closed. No new bids can be placed at this time.
                        </p>
                    </div>
                </div>
            );
        }

        // If auction is open, show auction status and history
        return (
            <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-100">
                <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 sm:p-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xl sm:text-2xl font-bold">Auction Details</h3>
                        <div className="px-3 py-1 rounded-full text-xs font-bold bg-green-500">
                            🟢 LIVE AUCTION
                        </div>
                    </div>
                </div>

                <div className="p-4 sm:p-6">
                    {/* Auction Status Info */}
                    <div className="mb-6 sm:mb-8 text-center">
                        <div className="text-4xl sm:text-5xl mb-4">🟢</div>
                        <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 mb-4">Auction is Live!</h3>
                        <p className="text-sm sm:text-base lg:text-lg text-gray-600 mb-4 max-w-3xl mx-auto">
                            Click the green auction circle above to participate in the live auction and place your bids
                        </p>
                        <div className="bg-green-100 border border-green-300 rounded-lg p-3 max-w-2xl mx-auto">
                            <p className="text-xs text-green-800 font-semibold">
                                Debug: Status = {auctionStatus || 'undefined'}
                            </p>
                        </div>
                    </div>

                    {/* Auction History */}
                    {groupTransactionInfo && groupTransactionInfo.length > 0 && (
                        <div className="space-y-4">
                            <h4 className="text-lg sm:text-xl font-bold text-gray-800 mb-6 text-center">Auction History</h4>
                            {groupTransactionInfo.map((transaction, index) => (
                                <div key={index} className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-4 sm:p-6 border-l-4 border-green-500 shadow-md">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                                        <div>
                                            <div className="text-xs sm:text-sm text-gray-500">Date</div>
                                            <div className="text-sm sm:text-base font-semibold text-gray-900">
                                                {new Date(transaction.date).toLocaleDateString()}
                                            </div>
                                        </div>
                                        <div>
                                            <div className="text-xs sm:text-sm text-gray-500">Amount</div>
                                            <div className="text-sm sm:text-base font-semibold text-gray-900">
                                                ₹{transaction.auctionAmount?.toLocaleString() || '0'}
                                            </div>
                                        </div>
                                        <div>
                                            <div className="text-xs sm:text-sm text-gray-500">Commission</div>
                                            <div className="text-sm sm:text-base font-semibold text-gray-900">
                                                ₹{transaction.commision || '0'}
                                            </div>
                                        </div>
                                        <div>
                                            <div className="text-xs sm:text-sm text-gray-500">Status</div>
                                            <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${transaction.auctionStatus === 'completed'
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                {transaction.auctionStatus === 'completed' ? '✅ Completed' : '⏳ Pending'}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Auction Status Info */}
                    <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-green-50 rounded-lg border border-green-200">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-green-600">ℹ️</span>
                            <span className="text-sm sm:text-base font-medium text-green-800">Auction Status</span>
                        </div>
                        <p className="text-xs sm:text-sm text-green-700">
                            This auction is currently open. You can participate by clicking "Join Live Auction".
                        </p>
                    </div>
                </div>
            </div>
        );
    };

    const renderCreditDetails = () => {
        // Calculate total credit amount dynamically
        const calculateTotalCredit = () => {
            if (!outstandingAdvanceTransactionInfo || outstandingAdvanceTransactionInfo.length === 0) {
                return 0;
            }

            const totalCredit = outstandingAdvanceTransactionInfo.reduce((sum, transaction) => {
                const amount = parseFloat(transaction.amount) || 0;
                return sum + amount;
            }, 0);

            return totalCredit;
        };

        const totalCreditAmount = calculateTotalCredit();

        if (!outstandingAdvanceTransactionInfo || outstandingAdvanceTransactionInfo.length === 0) {
            return (
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Credit Details</h3>
                    <div className="text-center text-gray-500 py-8">
                        <div className="text-4xl mb-2">📈</div>
                        <p>No credit details available</p>
                    </div>
                </div>
            );
        }

        return (
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-3 sm:p-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
                        <h3 className="text-base sm:text-lg font-semibold">Credit Details</h3>
                        <div className="text-left sm:text-right">
                            <div className="text-xs sm:text-sm text-blue-100">Total Credit</div>
                            <div className="text-lg sm:text-xl font-bold">₹{totalCreditAmount.toLocaleString()}</div>
                        </div>
                    </div>
                </div>
                <div className="p-3 sm:p-4 space-y-3">
                    {outstandingAdvanceTransactionInfo.map((transaction, index) => (
                        <div key={index} className="bg-gray-50 rounded-lg p-3 sm:p-4 border-l-4 border-blue-500">
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
                                <div>
                                    <div className="text-xs sm:text-sm text-gray-500">Date</div>
                                    <div className="text-sm sm:text-base font-semibold text-gray-900">
                                        {new Date(transaction.date).toLocaleDateString()}
                                    </div>
                                </div>
                                <div>
                                    <div className="text-xs sm:text-sm text-gray-500">Amount</div>
                                    <div className="text-sm sm:text-base font-semibold text-gray-900">
                                        ₹{transaction.amount?.toLocaleString() || '0'}
                                    </div>
                                </div>
                                <div>
                                    <div className="text-xs sm:text-sm text-gray-500">Status</div>
                                    <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                        Credit
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <div className="mt-6">
            {renderContent()}
        </div>
    );
};

export default CircleContentDisplay;
