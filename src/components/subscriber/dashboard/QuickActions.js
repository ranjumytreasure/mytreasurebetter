import React from 'react';
import { useHistory } from 'react-router-dom';

const QuickActions = () => {
    const history = useHistory();

    const quickActions = [
        {
            id: 'groups',
            label: 'View All Groups',
            icon: '👥',
            action: () => history.push('/customer/groups'),
            color: '#4CAF50'
        },
        {
            id: 'transactions',
            label: 'Transaction History',
            icon: '💳',
            action: () => history.push('/customer/transactions'),
            color: '#2196F3'
        },
        {
            id: 'profile',
            label: 'Update Profile',
            icon: '👤',
            action: () => history.push('/customer/profile'),
            color: '#FF9800'
        },
        {
            id: 'help',
            label: 'Help & Support',
            icon: '❓',
            action: () => history.push('/help'),
            color: '#9C27B0'
        }
    ];

    return (
        <div className="quick-actions">
            <h3>Quick Actions</h3>
            <div className="actions-grid">
                {quickActions.map((action) => (
                    <button
                        key={action.id}
                        className="action-card"
                        onClick={action.action}
                        style={{ borderColor: action.color }}
                    >
                        <div className="action-icon" style={{ color: action.color }}>
                            {action.icon}
                        </div>
                        <div className="action-label">{action.label}</div>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default QuickActions;
