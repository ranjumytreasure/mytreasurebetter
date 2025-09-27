import React from 'react';

const TransactionContent = ({ groupDetails, activeTab }) => {
    const { transactionInfo, groupTransactionInfo, outstandingAdvanceTransactionInfo } = groupDetails;

    const renderPayments = () => (
        <div className="transaction-list">
            <div className="list-header">
                <span>Date</span>
                <span>Amount</span>
                <span>Status</span>
            </div>

            {transactionInfo && transactionInfo.length > 0 ? (
                transactionInfo.map((transaction, index) => (
                    <div key={index} className="transaction-item">
                        <span className="transaction-date">
                            {new Date(transaction.date).toLocaleDateString()}
                        </span>
                        <span className="transaction-amount">
                            ₹{transaction.amount.toLocaleString()}
                        </span>
                        <span className={`transaction-status ${transaction.status.toLowerCase()}`}>
                            {transaction.status}
                        </span>
                    </div>
                ))
            ) : (
                <div className="no-data">No payment history available</div>
            )}
        </div>
    );

    const renderAuctions = () => (
        <div className="auction-list">
            <div className="list-header">
                <span>Date</span>
                <span>Amount</span>
                <span>Status</span>
                <span>Profit</span>
            </div>

            {groupTransactionInfo && groupTransactionInfo.length > 0 ? (
                groupTransactionInfo.map((auction, index) => (
                    <div key={index} className="auction-item">
                        <div className="auction-header">
                            <span className="auction-date">
                                {new Date(auction.date).toLocaleDateString()}
                            </span>
                            <span className="auction-sno">#{auction.sno}</span>
                        </div>

                        <div className="auction-details">
                            <div className="detail-row">
                                <span>Amount:</span>
                                <span>₹{auction.auctionAmount.toLocaleString()}</span>
                            </div>
                            <div className="detail-row">
                                <span>Commission:</span>
                                <span>₹{auction.commision}</span>
                            </div>
                            <div className="detail-row">
                                <span>Profit:</span>
                                <span>₹{auction.profit}</span>
                            </div>
                            <div className="detail-row">
                                <span>Reserve:</span>
                                <span>₹{auction.reserve}</span>
                            </div>
                            <div className="detail-row">
                                <span>Due:</span>
                                <span>₹{auction.customerDue}</span>
                            </div>
                        </div>

                        <div className={`auction-status ${auction.auctionStatus}`}>
                            {auction.auctionStatus === 'completed' ? '✅ Completed' : '⏳ Pending'}
                        </div>
                    </div>
                ))
            ) : (
                <div className="no-data">No auction details available</div>
            )}
        </div>
    );

    const renderOutstanding = () => (
        <div className="outstanding-list">
            <div className="list-header">
                <span>Date</span>
                <span>Amount</span>
                <span>Status</span>
            </div>

            {outstandingAdvanceTransactionInfo && outstandingAdvanceTransactionInfo.length > 0 ? (
                outstandingAdvanceTransactionInfo.map((outstanding, index) => (
                    <div key={index} className="outstanding-item">
                        <span className="outstanding-date">
                            {new Date(outstanding.date).toLocaleDateString()}
                        </span>
                        <span className="outstanding-amount">
                            ₹{outstanding.amount.toLocaleString()}
                        </span>
                        <span className={`outstanding-status ${outstanding.status.toLowerCase()}`}>
                            {outstanding.status}
                        </span>
                    </div>
                ))
            ) : (
                <div className="no-data">No outstanding amounts</div>
            )}
        </div>
    );

    return (
        <div className="transaction-content">
            {activeTab === 'payments' && renderPayments()}
            {activeTab === 'auctions' && renderAuctions()}
            {activeTab === 'outstanding' && renderOutstanding()}
        </div>
    );
};

export default TransactionContent;
