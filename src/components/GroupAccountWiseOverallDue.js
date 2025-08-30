import React, { useState, useEffect } from 'react';
import GroupSubscriberWiseResult from './GroupSubscriberWiseResult';
import GroupAccountWiseResult from './GroupAccountWiseResult';


const GroupAccountWiseOverallDue = ({ data }) => {



    const [accountWiseData, setAccountWiseData] = useState([]);// State to store group details
    const [subscriberWiseData, setSubscriberWiseData] = useState([]);// State 

    useEffect(() => {
        if (data && data.results) {


            // Set groupTransactionInfo when data is available
            const { groupAccountWiseResult, groupSubscriberWiseResult } = data.results;
            setAccountWiseData(groupAccountWiseResult);
            setSubscriberWiseData(groupSubscriberWiseResult);

        }
    }, [data]); // Run this effect when data prop changes
    useEffect(() => {

    }, [accountWiseData, subscriberWiseData]);


    if (!data || !data.results) {
        // Handle the case where data or data.results is null or undefined
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

