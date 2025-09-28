import React from 'react';
import { useHistory, useParams } from 'react-router-dom';

const CircleContentDisplay = ({ selectedCircle, groupDetails, auctionStatus, groupAccountId }) => {
    console.log('CircleContentDisplay - groupDetails:', groupDetails);
    console.log('CircleContentDisplay - auctionStatus:', auctionStatus);
    console.log('CircleContentDisplay - groupAccountId:', groupAccountId);

    const {
        groupTransactionInfo,
        transactionInfo,
        outstandingAdvanceTransactionInfo,
        auctionStatus: groupAuctionStatus
    } = groupDetails;

    const history = useHistory();
    const { groupId, grpSubId } = useParams();

    console.log('Extracted values:', { groupTransactionInfo, transactionInfo, outstandingAdvanceTransactionInfo, groupAuctionStatus });



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
                <div className="bg-gradient-to-r from-red-600 to-red-700 text-white p-4">
                    <h3 className="text-lg font-semibold">Group Accounts</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">S.No</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Auction Amount</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Commission</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reserve</th>
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
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                                        ₹{transaction.reserve}
                                    </td>
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
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-4">
                    <h3 className="text-lg font-semibold">Due Details</h3>
                </div>
                <div className="p-4 space-y-3">
                    {dueData.map((transaction, index) => (
                        <div key={index} className="bg-gray-50 rounded-lg p-4 border-l-4 border-orange-500">
                            <div className="grid grid-cols-3 gap-4 items-center">
                                <div>
                                    <div className="text-sm text-gray-500">Date</div>
                                    <div className="font-semibold text-gray-900">
                                        {new Date(transaction.date || transaction.createdAt || new Date()).toLocaleDateString()}
                                    </div>
                                </div>
                                <div>
                                    <div className="text-sm text-gray-500">Amount</div>
                                    <div className="font-semibold text-gray-900">
                                        ₹{(transaction.amount || transaction.receivableAmount || transaction.payment_amount || transaction.customerDue || 0).toLocaleString()}
                                    </div>
                                </div>
                                <div>
                                    <div className="text-sm text-gray-500">Status</div>
                                    <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${transaction.status === 'Success'
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
        console.log('Auction status:', auctionStatus, 'isAuctionOpen:', isAuctionOpen);

        // If auction is closed, show simple closed message
        if (!isAuctionOpen) {
            return (
                <div className="bg-white rounded-lg shadow-md p-8">
                    <div className="text-center">
                        <div className="text-6xl mb-4">🔴</div>
                        <h3 className="text-2xl font-semibold text-gray-800 mb-2">Auctions is Closed</h3>
                        <p className="text-gray-600">
                            This auction is currently closed. No new bids can be placed.
                        </p>
                    </div>
                </div>
            );
        }

        // If auction is open, show auction status and history
        return (
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold">Auction Details</h3>
                        <div className="px-3 py-1 rounded-full text-sm font-medium bg-green-500">
                            🟢 OPEN
                        </div>
                    </div>
                </div>

                <div className="p-4">
                    {/* Auction Status Info */}
                    <div className="mb-6 text-center">
                        <div className="text-6xl mb-4">🟢</div>
                        <h3 className="text-2xl font-semibold text-gray-800 mb-2">Auction is Open</h3>
                        <p className="text-gray-600 mb-4">
                            Click the green auction circle above to participate in the live auction
                        </p>
                        <p className="text-xs text-gray-500">
                            Debug: Status = {auctionStatus || 'undefined'}
                        </p>
                    </div>

                    {/* Auction History */}
                    {groupTransactionInfo && groupTransactionInfo.length > 0 && (
                        <div className="space-y-3">
                            <h4 className="font-semibold text-gray-800 mb-3">Auction History</h4>
                            {groupTransactionInfo.map((transaction, index) => (
                                <div key={index} className="bg-gray-50 rounded-lg p-4 border-l-4 border-green-500">
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        <div>
                                            <div className="text-sm text-gray-500">Date</div>
                                            <div className="font-semibold text-gray-900">
                                                {new Date(transaction.date).toLocaleDateString()}
                                            </div>
                                        </div>
                                        <div>
                                            <div className="text-sm text-gray-500">Amount</div>
                                            <div className="font-semibold text-gray-900">
                                                ₹{transaction.auctionAmount?.toLocaleString() || '0'}
                                            </div>
                                        </div>
                                        <div>
                                            <div className="text-sm text-gray-500">Commission</div>
                                            <div className="font-semibold text-gray-900">
                                                ₹{transaction.commision || '0'}
                                            </div>
                                        </div>
                                        <div>
                                            <div className="text-sm text-gray-500">Status</div>
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
                    <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-green-600">ℹ️</span>
                            <span className="font-medium text-green-800">Auction Status</span>
                        </div>
                        <p className="text-sm text-green-700">
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
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold">Credit Details</h3>
                        <div className="text-right">
                            <div className="text-sm text-blue-100">Total Credit</div>
                            <div className="text-xl font-bold">₹{totalCreditAmount.toLocaleString()}</div>
                        </div>
                    </div>
                </div>
                <div className="p-4 space-y-3">
                    {outstandingAdvanceTransactionInfo.map((transaction, index) => (
                        <div key={index} className="bg-gray-50 rounded-lg p-4 border-l-4 border-blue-500">
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                <div>
                                    <div className="text-sm text-gray-500">Date</div>
                                    <div className="font-semibold text-gray-900">
                                        {new Date(transaction.date).toLocaleDateString()}
                                    </div>
                                </div>
                                <div>
                                    <div className="text-sm text-gray-500">Amount</div>
                                    <div className="font-semibold text-gray-900">
                                        ₹{transaction.amount?.toLocaleString() || '0'}
                                    </div>
                                </div>
                                <div>
                                    <div className="text-sm text-gray-500">Status</div>
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
