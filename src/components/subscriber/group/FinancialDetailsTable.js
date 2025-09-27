import React from 'react';

const FinancialDetailsTable = ({ groupDetails }) => {
    const { groupTransactionInfo } = groupDetails;

    if (!groupTransactionInfo || groupTransactionInfo.length === 0) {
        return (
            <div className="financial-details-container">
                <h3 className="table-title">Group Accounts</h3>
                <div className="no-data-message">
                    <div className="no-data-icon">📊</div>
                    <p>No financial details available</p>
                </div>
            </div>
        );
    }

    return (
        <div className="financial-details-container">
            <h3 className="table-title">Financial Details</h3>
            <div className="table-wrapper">
                <table className="financial-table">
                    <thead>
                        <tr>
                            <th>S.No</th>
                            <th>Date</th>
                            <th>Auction Amount</th>
                            <th>Commission</th>
                            <th>Reserve</th>
                            <th>Due</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {groupTransactionInfo.map((transaction, index) => (
                            <tr key={index} className="table-row">
                                <td className="sno-cell">
                                    <span className="sno-badge">#{transaction.sno}</span>
                                </td>
                                <td className="date-cell">
                                    {new Date(transaction.date).toLocaleDateString()}
                                </td>
                                <td className="amount-cell">
                                    <span className="amount-value">
                                        ₹{transaction.auctionAmount.toLocaleString()}
                                    </span>
                                </td>
                                <td className="commission-cell">
                                    <span className="commission-value">
                                        ₹{transaction.commision}
                                    </span>
                                </td>
                                <td className="reserve-cell">
                                    <span className="reserve-value">
                                        ₹{transaction.reserve}
                                    </span>
                                </td>
                                <td className="due-cell">
                                    <span className="due-value">
                                        ₹{transaction.customerDue}
                                    </span>
                                </td>
                                <td className="status-cell">
                                    <span
                                        className={`status-badge ${transaction.auctionStatus}`}
                                    >
                                        {transaction.auctionStatus === 'completed' ? (
                                            <>
                                                <span className="status-icon">✅</span>
                                                Completed
                                            </>
                                        ) : (
                                            <>
                                                <span className="status-icon">⏳</span>
                                                Pending
                                            </>
                                        )}
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

export default FinancialDetailsTable;
