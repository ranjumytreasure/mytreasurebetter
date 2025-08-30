import React from 'react';
import GroupAccountWiseDataList from './GroupAccountWiseDataList'

const GroupAccountWiseResult = ({ accountWiseData }) => {

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-lg relative">
      {/* Header */}
      <div className="absolute -top-4 left-6 bg-custom-red text-white px-4 py-1 rounded-full text-sm font-medium shadow-md">
        Auction Wise Payment Status
      </div>

      {/* Content - Following GroupsAccounts pattern exactly */}
      {accountWiseData?.length > 0 && (
        <div className="p-6 pt-8">
          <GroupAccountWiseDataList items={accountWiseData} />
        </div>
      )}
    </div>
  );
};





export default GroupAccountWiseResult;
