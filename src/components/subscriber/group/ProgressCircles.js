import React from 'react';
import { useHistory, useParams } from 'react-router-dom';

const ProgressCircles = ({ groupDetails, selectedCircle, onCircleClick, auctionStatus: realTimeAuctionStatus, groupAccountId }) => {
    const {
        totalGroups = 0,
        groupsCompleted = 0,
        totalDue = 0,
        profit = 0
    } = groupDetails || {};

    // Use real-time auction status from WebSocket events
    const auctionStatus = realTimeAuctionStatus || groupDetails?.auctionStatus || 'CLOSED';

    const progressPercentage = totalGroups > 0 ? (groupsCompleted / totalGroups) * 100 : 0;

    const circles = [
        {
            id: 'groups',
            label: 'Groups',
            value: `${groupsCompleted}/${totalGroups}`,
            percentage: progressPercentage,
            color: '#4CAF50',
            icon: '👥'
        },
        {
            id: 'due',
            label: 'Due',
            value: `₹${(totalDue || 0).toLocaleString()}`,
            percentage: 100,
            color: '#FF9800',
            icon: '💰'
        },
        {
            id: 'auction',
            label: 'Auction',
            value: auctionStatus === 'OPEN' ? 'Open' : 'Closed',
            percentage: 100,
            color: auctionStatus === 'OPEN' ? '#4CAF50' : '#f44336',
            icon: auctionStatus === 'OPEN' ? '🟢' : '🔴'
        },
        {
            id: 'credit',
            label: 'Credit',
            value: `₹${(profit || 0).toLocaleString()}`,
            percentage: 100,
            color: '#2196F3',
            icon: '📈'
        }
    ];

    const history = useHistory();
    const { groupId, grpSubId } = useParams();

    const handleCircleClick = (circleId) => {
        // If auction circle is clicked and auction is open, go directly to auction page
        if (circleId === 'auction' && auctionStatus === 'OPEN' && groupAccountId) {
            console.log('Navigating directly to auction page');
            history.push(`/customer/groups/${groupId}/${grpSubId}/auction`);
            return;
        }

        // For other circles, use the normal click handler
        onCircleClick(circleId);
    };

    return (
        <div className="progress-circles-container">
            <h3 className="circles-title">Group Overview</h3>
            <div className="progress-circles-straight">
                {circles.map((circle) => (
                    <div key={circle.id} className="progress-circle-wrapper">
                        <div
                            className={`progress-circle clickable ${selectedCircle === circle.id ? 'active' : ''}`}
                            onClick={() => handleCircleClick(circle.id)}
                        >
                            <div
                                className="circle-background"
                                style={{
                                    background: `conic-gradient(${circle.color} ${circle.percentage * 3.6}deg, #e0e0e0 0deg)`
                                }}
                            >
                                <div className="circle-content">
                                    <div className="circle-icon">{circle.icon}</div>
                                    <div className="circle-value">{circle.value}</div>
                                    <div className="circle-label">{circle.label}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProgressCircles;
