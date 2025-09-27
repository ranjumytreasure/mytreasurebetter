import React from 'react';
import { MdBusiness, MdCalendarToday, MdAttachMoney, MdSettings } from 'react-icons/md';
import { FiCalendar, FiDollarSign } from 'react-icons/fi';

const GroupOverview = ({ data }) => {
    if (!data || !data.results) {
        return null;
    }

    const { 
        groupName, 
        amount, 
        commisionType, 
        commissionAmount, 
        type, 
        startDate, 
        endDate,
        nextAuctionDate,
        startTime,
        endTime
    } = data.results;

    // Format date helper function
    const formatDate = (dateString) => {
        if (!dateString) return 'Not set';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    return (
        <div className="bg-white border border-gray-200 rounded-xl shadow-lg relative mb-6">
            {/* Header */}
            <div className="absolute -top-4 left-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-1 rounded-full text-sm font-medium shadow-md">
                Group Overview
            </div>

            <div className="p-6 pt-8">
                {/* Main Group Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                    {/* Group Name */}
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                                <MdBusiness className="w-5 h-5 text-white" />
                            </div>
                            <h3 className="text-lg font-semibold text-blue-800">Group Name</h3>
                        </div>
                        <p className="text-blue-700 font-medium text-lg">{groupName || 'N/A'}</p>
                    </div>

                    {/* Group Amount */}
                    <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                                <FiDollarSign className="w-5 h-5 text-white" />
                            </div>
                            <h3 className="text-lg font-semibold text-green-800">Group Amount</h3>
                        </div>
                        <p className="text-green-700 font-medium text-lg">₹{amount || 0}</p>
                    </div>

                    {/* Group Type */}
                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
                                <MdSettings className="w-5 h-5 text-white" />
                            </div>
                            <h3 className="text-lg font-semibold text-purple-800">Group Type</h3>
                        </div>
                        <p className="text-purple-700 font-medium text-lg">{type || 'N/A'}</p>
                    </div>
                </div>

                {/* Commission Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    {/* Commission Type */}
                    <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4 border border-orange-200">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
                                <MdAttachMoney className="w-5 h-5 text-white" />
                            </div>
                            <h3 className="text-lg font-semibold text-orange-800">Commission Type</h3>
                        </div>
                        <p className="text-orange-700 font-medium text-lg">{commisionType || 'N/A'}</p>
                    </div>

                    {/* Commission Amount */}
                    <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-4 border border-red-200">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
                                <MdAttachMoney className="w-5 h-5 text-white" />
                            </div>
                            <h3 className="text-lg font-semibold text-red-800">Commission Amount</h3>
                        </div>
                        <p className="text-red-700 font-medium text-lg">₹{commissionAmount || 0}</p>
                    </div>
                </div>

                {/* Date Information */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Start Date */}
                    <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-lg p-4 border border-indigo-200">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center">
                                <FiCalendar className="w-5 h-5 text-white" />
                            </div>
                            <h3 className="text-lg font-semibold text-indigo-800">Start Date</h3>
                        </div>
                        <p className="text-indigo-700 font-medium">{formatDate(startDate)}</p>
                    </div>

                    {/* End Date */}
                    <div className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-lg p-4 border border-teal-200">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 bg-teal-500 rounded-full flex items-center justify-center">
                                <FiCalendar className="w-5 h-5 text-white" />
                            </div>
                            <h3 className="text-lg font-semibold text-teal-800">End Date</h3>
                        </div>
                        <p className="text-teal-700 font-medium">{formatDate(endDate)}</p>
                    </div>

                    {/* Next Auction Date */}
                    <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-lg p-4 border border-pink-200">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 bg-pink-500 rounded-full flex items-center justify-center">
                                <MdCalendarToday className="w-5 h-5 text-white" />
                            </div>
                            <h3 className="text-lg font-semibold text-pink-800">Next Auction</h3>
                        </div>
                        <p className="text-pink-700 font-medium">{formatDate(nextAuctionDate)}</p>
                        {startTime && endTime && (
                            <p className="text-pink-600 text-sm mt-1">
                                {startTime} - {endTime}
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GroupOverview;

