import React from 'react';

const GroupHeader = ({ groupDetails }) => {
    const {
        groupName,
        amount,
        type,
        isGovApproved,
        bidStatus,
        auctionDate,
        auctionStatus,
        startDate,
        endDate,
        commissionAmount,
        commissionType
    } = groupDetails;

    const getGroupTypeColor = (type) => {
        switch (type) {
            case 'FIXED': return '#4CAF50';
            case 'ACCUMULATIVE': return '#2196F3';
            case 'DEDUCTIVE': return '#FF9800';
            default: return '#666';
        }
    };

    return (
        <div className="bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg p-4 mb-4 shadow-lg">
            {/* Header Row */}
            <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                    <h1 className="text-lg font-bold text-white mb-1">{groupName}</h1>
                    <div className="text-xl font-extrabold text-white">₹{amount.toLocaleString()}</div>
                </div>
                <div className="flex flex-col gap-2 items-end">
                    <span
                        className="px-3 py-1 rounded-full text-xs font-semibold text-white uppercase tracking-wide"
                        style={{ backgroundColor: getGroupTypeColor(type) }}
                    >
                        {type}
                    </span>
                    {isGovApproved && (
                        <span className="bg-green-500 px-2 py-1 rounded-full text-xs font-medium text-white">
                            ✓ Gov Approved
                        </span>
                    )}
                </div>
            </div>

            {/* Info Grid - Compact */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                <div className="text-center">
                    <div className="text-xs opacity-80 mb-1">Start Date</div>
                    <div className="text-sm font-semibold">{new Date(startDate).toLocaleDateString()}</div>
                </div>
                <div className="text-center">
                    <div className="text-xs opacity-80 mb-1">End Date</div>
                    <div className="text-sm font-semibold">{new Date(endDate).toLocaleDateString()}</div>
                </div>
                <div className="text-center">
                    <div className="text-xs opacity-80 mb-1">Commission</div>
                    <div className="text-sm font-semibold">₹{commissionAmount}</div>
                </div>
                <div className="text-center">
                    <div className="text-xs opacity-80 mb-1">Type</div>
                    <div className="text-sm font-semibold">{commissionType}</div>
                </div>
            </div>

            {/* Status Row - Compact */}
            <div className="flex flex-wrap gap-2 justify-center">
                <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${bidStatus === 'BIDTAKEN' ? 'bg-green-500/30 border border-green-500/50' : 'bg-yellow-500/30 border border-yellow-500/50'
                    }`}>
                    <span>{bidStatus === 'BIDTAKEN' ? '✓' : '⏳'}</span>
                    <span>{bidStatus === 'BIDTAKEN' ? 'Bid Placed' : 'No Bid'}</span>
                </div>

                <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${auctionStatus === 'OPEN' ? 'bg-green-500/30 border border-green-500/50' : 'bg-red-500/30 border border-red-500/50'
                    }`}>
                    <span>{auctionStatus === 'OPEN' ? '🟢' : '🔴'}</span>
                    <span>{auctionStatus === 'OPEN' ? 'Open' : 'Closed'}</span>
                </div>

                <div className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-blue-500/30 border border-blue-500/50">
                    <span>📅</span>
                    <span>{new Date(auctionDate).toLocaleDateString()}</span>
                </div>
            </div>
        </div>
    );
};

export default GroupHeader;
