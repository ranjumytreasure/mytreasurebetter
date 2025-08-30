import React from 'react';
import GroupSubscriberWiseDataList from './GroupSubscriberWiseDataList'

const GroupSubscriberWiseResult = ({ subscriberWiseData }) => {


  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-lg relative">
      {/* Header */}
      <div className="absolute -top-4 left-6 bg-custom-red text-white px-4 py-1 rounded-full text-sm font-medium shadow-md">
        Subscriber Wise Payment Status
      </div>

      {/* Content - Following GroupsAccounts pattern exactly */}
      {subscriberWiseData?.length > 0 && (
        <div className="p-6 pt-8">
          <GroupSubscriberWiseDataList items={subscriberWiseData} />
        </div>
      )}
    </div>
  );
};



export default GroupSubscriberWiseResult;
