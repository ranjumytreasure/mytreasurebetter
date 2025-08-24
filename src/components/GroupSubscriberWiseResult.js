import React from 'react';
// import { SubContext } from '../context/subscribecontext';
import styled from 'styled-components';
import GroupSubscriberWiseDataList from './GroupSubscriberWiseDataList'

const GroupSubscriberWiseResult = ({ subscriberWiseData }) => {


  return (
    <Wrapper>

      {subscriberWiseData?.length > 0 && ( // Use groupTransactionInfo as items
        <div className='subcriber-container'>
          <GroupSubscriberWiseDataList items={subscriberWiseData} />
        </div>
      )}
    </Wrapper>
  );
};
const Wrapper = styled.article`
  background: var(--clr-white);
  border-radius: var(--radius);
  position: relative;


  
  &::before {
    content: 'Subscriber Wise Payment Status';
    position: absolute;
    top: 0;
    left: 1rem;
    transform: translateY(-100%);
    background: var(--clr-red-dark);
    color:#ffffff;
    padding: 0.25rem 1rem;
    font-weight: 600;
    font-size: 1rem;
    border-radius: 5px;
  }
  .subcriber-container {
    margin-top: 2rem;
    background-color: #fff;
    border-radius: 10px;
    padding: 15px;
    box-shadow: 0 0 10px rgba(0,0,0,0.1);
    margin: 10px;
  }

  .subcriber-item,
  .subcriber-header {
    display: grid;
    grid-template-columns: 2fr 1fr 1fr 1fr 1fr;
    align-items: center;
    padding: 10px 16px;
    gap: 8px;
  }

  .subcriber-header {
    background-color: #cd3240;
    color: #fff;
    font-weight: bold;
    border-radius: 6px 6px 0 0;
    margin-bottom: 12px;
  }

  .subcriber-item {
    border-bottom: 1px solid #f0f0f0;
    transition: background 0.2s;
  }

  .subcriber-item:hover {
    background: #f9f9f9;
    color: var(--clr-grey-7);
  }

  .subcriber-header div,
  .subcriber-header p {
    color: #fff !important;
    margin: 0;
  }

  .download-button-container {
    display: flex;
    justify-content: flex-end;
    padding: 12px 16px 0;
    margin-bottom: 16px;
  }

  .download-button {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background-color: #cd3240;
    color: white;
    border: none;
    border-radius: 6px;
    padding: 8px 14px;
    cursor: pointer;
    font-weight: bold;
    transition: background-color 0.2s ease;
  }

  .download-button:hover {
    background-color: #b32735;
  }
`;


export default GroupSubscriberWiseResult;
