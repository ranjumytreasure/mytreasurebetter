import React from 'react';

const DetailModal = ({ detail, onClose }) => {
    const { title, type, data } = detail;

    const renderGroupsDetails = () => (
        <div className="detail-content">
            <div className="detail-table">
                <div className="table-header">
                    <div className="header-cell">S.No</div>
                    <div className="header-cell">Date</div>
                    <div className="header-cell">Auction Amount</div>
                    <div className="header-cell">Commission</div>
                    <div className="header-cell">Reserve</div>
                    <div className="header-cell">Due</div>
                    <div className="header-cell">Status</div>
                </div>
                <div className="table-body">
                    {data.map((item, index) => (
                        <div key={index} className="table-row">
                            <div className="table-cell sno-cell">
                                <span className="sno-badge">#{item.sno || item.sequence_number || index + 1}</span>
                            </div>
                            <div className="table-cell date-cell">
                                {new Date(item.date || item.auct_date).toLocaleDateString()}
                            </div>
                            <div className="table-cell amount-cell">
                                ₹{(item.auctionAmount || item.asked_amount || 0).toLocaleString()}
                            </div>
                            <div className="table-cell commission-cell">
                                ₹{(item.commision || item.commission || 0).toLocaleString()}
                            </div>
                            <div className="table-cell reserve-cell">
                                ₹{(item.reserve || item.reserve_amount || 0).toLocaleString()}
                            </div>
                            <div className="table-cell due-cell">
                                ₹{(item.customerDue || item.customer_due || 0).toLocaleString()}
                            </div>
                            <div className="table-cell status-cell">
                                <span className={`status-badge ${(item.auctionStatus || 'pending').toLowerCase()}`}>
                                    {(item.auctionStatus || 'pending') === 'completed' ? '✅ Completed' : '⏳ Pending'}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    const renderDueDetails = () => (
        <div className="detail-content">
            <div className="detail-table">
                <div className="table-header">
                    <div className="header-cell">Date</div>
                    <div className="header-cell">Amount</div>
                    <div className="header-cell">Status</div>
                </div>
                <div className="table-body">
                    {data.map((item, index) => (
                        <div key={index} className="table-row">
                            <div className="table-cell date-cell">
                                {new Date(item.date || item.createdAt).toLocaleDateString()}
                            </div>
                            <div className="table-cell amount-cell">
                                ₹{(item.amount || item.receivableAmount || item.payment_amount || 0).toLocaleString()}
                            </div>
                            <div className="table-cell status-cell">
                                <span className={`status-badge ${(item.status || 'Due').toLowerCase()}`}>
                                    {(item.status || 'Due') === 'Success' ? '✅ Success' : '⚠️ Due'}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    const renderAuctionDetails = () => (
        <div className="detail-content">
            <div className="detail-table">
                <div className="table-header">
                    <div className="header-cell">Date</div>
                    <div className="header-cell">Amount</div>
                    <div className="header-cell">Status</div>
                </div>
                <div className="table-body">
                    {data.map((item, index) => (
                        <div key={index} className="table-row">
                            <div className="table-cell date-cell">
                                {new Date(item.date || item.auct_date).toLocaleDateString()}
                            </div>
                            <div className="table-cell amount-cell">
                                ₹{(item.auctionAmount || item.asked_amount || 0).toLocaleString()}
                            </div>
                            <div className="table-cell status-cell">
                                <span className={`status-badge ${(item.auctionStatus || 'pending').toLowerCase()}`}>
                                    {(item.auctionStatus || 'pending') === 'completed' ? '✅ Completed' : '⏳ Pending'}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    const renderCreditDetails = () => (
        <div className="detail-content">
            <div className="detail-table">
                <div className="table-header">
                    <div className="header-cell">Date</div>
                    <div className="header-cell">Amount</div>
                    <div className="header-cell">Status</div>
                </div>
                <div className="table-body">
                    {data.map((item, index) => (
                        <div key={index} className="table-row">
                            <div className="table-cell date-cell">
                                {new Date(item.date || item.createdAt).toLocaleDateString()}
                            </div>
                            <div className="table-cell amount-cell">
                                ₹{(item.amount || item.payableAmount || item.payment_amount || 0).toLocaleString()}
                            </div>
                            <div className="table-cell status-cell">
                                <span className={`status-badge ${(item.status || 'Due').toLowerCase()}`}>
                                    {(item.status || 'Due') === 'Success' ? '✅ Success' : '⚠️ Due'}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    const renderContent = () => {
        switch (type) {
            case 'groups':
                return renderGroupsDetails();
            case 'due':
                return renderDueDetails();
            case 'auction':
                return renderAuctionDetails();
            case 'credit':
                return renderCreditDetails();
            default:
                return <div className="no-data">No data available</div>;
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2 className="modal-title">{title}</h2>
                    <button className="modal-close" onClick={onClose}>
                        ✕
                    </button>
                </div>

                <div className="modal-body">
                    {data && data.length > 0 ? (
                        renderContent()
                    ) : (
                        <div className="no-data-message">
                            <div className="no-data-icon">📊</div>
                            <p>No data available</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DetailModal;
