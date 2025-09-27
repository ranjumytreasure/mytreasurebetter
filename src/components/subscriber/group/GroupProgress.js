import React from 'react';

const GroupProgress = ({ groupDetails }) => {
    const {
        totalGroups,
        groupsCompleted,
        startDate,
        endDate,
        commissionAmount,
        commissionType
    } = groupDetails;

    const progressPercentage = (groupsCompleted / totalGroups) * 100;

    return (
        <div className="group-progress">
            <h3>Group Progress</h3>

            <div className="progress-container">
                <div className="progress-bar">
                    <div
                        className="progress-fill"
                        style={{ width: `${progressPercentage}%` }}
                    ></div>
                </div>
                <p className="progress-text">
                    {groupsCompleted} of {totalGroups} completed ({progressPercentage.toFixed(1)}%)
                </p>
            </div>

            <div className="group-info-grid">
                <div className="info-item">
                    <label>Start Date</label>
                    <span>{new Date(startDate).toLocaleDateString()}</span>
                </div>

                <div className="info-item">
                    <label>End Date</label>
                    <span>{new Date(endDate).toLocaleDateString()}</span>
                </div>

                <div className="info-item">
                    <label>Commission</label>
                    <span>₹{commissionAmount} ({commissionType})</span>
                </div>

                <div className="info-item">
                    <label>Remaining</label>
                    <span>{totalGroups - groupsCompleted} groups</span>
                </div>
            </div>
        </div>
    );
};

export default GroupProgress;
