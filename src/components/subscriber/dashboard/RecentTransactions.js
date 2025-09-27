import React from 'react';
import { useHistory } from 'react-router-dom';

const RecentTransactions = ({ transactions, loading }) => {
    const history = useHistory();

    const handleViewAll = () => {
        history.push('/customer/transactions');
    };

    if (loading) {
        return (
            <div className="transactions-loading">
                <div className="skeleton-transaction"></div>
                <div className="skeleton-transaction"></div>
                <div className="skeleton-transaction"></div>
            </div>
        );
    }

    if (!transactions || transactions.length === 0) {
        return (
            <div className="no-transactions">
                <div className="no-transactions-icon">💳</div>
                <h3>No recent transactions</h3>
                <p>Your transaction history will appear here.</p>
            </div>
        );
    }

    return (
        <div className="recent-transactions">
            <div className="transactions-header">
                <h3>Recent Transactions</h3>
                <button className="view-all-btn" onClick={handleViewAll}>
                    View All →
                </button>
            </div>

            <div className="transactions-list">
                {transactions.map((transaction, index) => (
                    <TransactionItem key={index} transaction={transaction} />
                ))}
            </div>
        </div>
    );
};

const TransactionItem = ({ transaction }) => {
    const {
        name,
        payment_method,
        payment_type,
        payment_amount,
        payment_status,
        created_at,
        arrow
    } = transaction;

    const getStatusColor = (status) => {
        switch (status) {
            case 'SUCCESS': return '#4CAF50';
            case 'PENDING': return '#FF9800';
            case 'FAILED': return '#f44336';
            default: return '#666';
        }
    };

    const getArrowIcon = (arrow) => {
        return arrow === 'UP' ? '⬆️' : '⬇️';
    };

    const getPaymentTypeLabel = (type) => {
        switch (type) {
            case 'MONTHLY_PAYMENT': return 'Monthly Payment';
            case 'AUCTION_PAYMENT': return 'Auction Payment';
            case 'ADVANCE_PAYMENT': return 'Advance Payment';
            default: return type;
        }
    };

    return (
        <div className="transaction-item">
            <div className="transaction-icon">
                {getArrowIcon(arrow)}
            </div>

            <div className="transaction-details">
                <div className="transaction-type">
                    {getPaymentTypeLabel(payment_type)}
                </div>
                <div className="transaction-method">
                    {payment_method} • {new Date(created_at).toLocaleDateString()}
                </div>
            </div>

            <div className="transaction-amount">
                <div className="amount">₹{payment_amount.toLocaleString()}</div>
                <div
                    className="status"
                    style={{ color: getStatusColor(payment_status) }}
                >
                    {payment_status}
                </div>
            </div>
        </div>
    );
};

export default RecentTransactions;
