import React from 'react';

const GroupProgressCards = ({ progress, onProgressChange, selectedProgress }) => {
    const progressTypes = [
        {
            key: 'INPROGRESS',
            label: 'In Progress',
            count: progress?.inProgressCount || 0,
            color: '#4CAF50',
            icon: '🔄',
            clickable: true
        },
        {
            key: 'FUTURE',
            label: 'Future',
            count: progress?.futureCount || 0,
            color: '#2196F3',
            icon: '⏳',
            clickable: true
        },
        {
            key: 'CLOSED',
            label: 'Completed',
            count: progress?.completedCount || 0,
            color: '#FF9800',
            icon: '✅',
            clickable: true
        }
    ];

    const handleCardClick = (type) => {
        // All cards now work as filters
        onProgressChange(type.key);
    };

    return (
        <div className="group-progress-cards">
            <h3>Group Overview</h3>
            <div className="progress-cards-grid">
                {progressTypes.map(type => (
                    <div
                        key={type.key}
                        className={`progress-card ${selectedProgress === type.key ? 'active' : ''} ${type.clickable ? 'clickable' : ''}`}
                        onClick={() => handleCardClick(type)}
                        style={{ borderColor: type.color }}
                    >
                        <div className="progress-icon" style={{ color: type.color }}>
                            {type.icon}
                        </div>
                        <div className="progress-count" style={{ color: type.color }}>
                            {type.count}
                        </div>
                        <div className="progress-label">{type.label}</div>
                        {type.clickable && (
                            <div className="click-hint">Click to filter groups</div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default GroupProgressCards;
