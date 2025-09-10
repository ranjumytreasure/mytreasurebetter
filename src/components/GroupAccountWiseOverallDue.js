import React, { useState, useEffect } from 'react';
import GroupSubscriberWiseResult from './GroupSubscriberWiseResult';
import GroupAccountWiseResult from './GroupAccountWiseResult';

const GroupAccountWiseOverallDue = ({ data }) => {
    const [accountWiseData, setAccountWiseData] = useState([]);
    const [subscriberWiseData, setSubscriberWiseData] = useState([]);

    useEffect(() => {
        if (data && data.results) {
            const { groupAccountWiseResult, groupSubscriberWiseResult } = data.results;
            setAccountWiseData(groupAccountWiseResult);
            setSubscriberWiseData(groupSubscriberWiseResult);
        }
    }, [data]);

    useEffect(() => {
        // Additional effect if needed
    }, [accountWiseData, subscriberWiseData]);

    if (!data || !data.results) {
        return <p>No data available.</p>;
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <GroupAccountWiseResult accountWiseData={accountWiseData} />
            <GroupSubscriberWiseResult subscriberWiseData={subscriberWiseData} />
        </div>
    );
};

export default GroupAccountWiseOverallDue;