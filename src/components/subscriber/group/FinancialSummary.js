import React from 'react';

const FinancialSummary = ({ groupDetails }) => {
    const {
        totalDue,
        profit,
        totalGroupOutstanding,
        totalAdvanceOutstandingAmount
    } = groupDetails;

    return (
        <div className="financial-summary">
            <h3>Financial Summary</h3>
            <div className="summary-grid">
                <div className="summary-card">
                    <div className="card-icon">💰</div>
                    <div className="card-content">
                        <h4>Total Due</h4>
                        <p className="amount due">₹{totalDue.toLocaleString()}</p>
                    </div>
                </div>

                <div className="summary-card">
                    <div className="card-icon">📈</div>
                    <div className="card-content">
                        <h4>Profit Earned</h4>
                        <p className="amount profit">₹{profit.toLocaleString()}</p>
                    </div>
                </div>

                <div className="summary-card">
                    <div className="card-icon">⚠️</div>
                    <div className="card-content">
                        <h4>Group Outstanding</h4>
                        <p className="amount outstanding">₹{totalGroupOutstanding.toLocaleString()}</p>
                    </div>
                </div>

                <div className="summary-card">
                    <div className="card-icon">💸</div>
                    <div className="card-content">
                        <h4>Advance Outstanding</h4>
                        <p className="amount advance">₹{totalAdvanceOutstandingAmount.toLocaleString()}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FinancialSummary;
