import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
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





    return (<section className='section'>
        <Wrapper className='section-center' >
            <GroupAccountWiseResult accountWiseData={accountWiseData} />
            <GroupSubscriberWiseResult subscriberWiseData={subscriberWiseData} />

        </Wrapper>
    </section>

    );
};
const Wrapper = styled.div`
  padding-top: 2rem;
  display: grid;
  gap: 3rem 2rem;
  @media (min-width: 992px) {
    grid-template-columns: 1fr 1fr;
  }
  /* align-items: start; */
`;

export default GroupAccountWiseOverallDue;

