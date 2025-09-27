import React from 'react';

const TransactionTabs = ({ activeTab, setActiveTab }) => {
    const tabs = [
        { id: 'payments', label: 'Payment History', icon: '💳' },
        { id: 'auctions', label: 'Auction Details', icon: '🏆' },
        { id: 'outstanding', label: 'Outstanding', icon: '⚠️' }
    ];

    return (
        <div className="transaction-tabs">
            <div className="tabs-header">
                <h3>Transaction Details</h3>
            </div>

            <div className="tabs-nav">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
                        onClick={() => setActiveTab(tab.id)}
                    >
                        <span className="tab-icon">{tab.icon}</span>
                        <span className="tab-label">{tab.label}</span>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default TransactionTabs;
