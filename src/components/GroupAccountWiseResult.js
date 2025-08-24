import React from 'react';
// import { SubContext } from '../context/subscribecontext';
import styled from 'styled-components';
import GroupAccountWiseDataList from './GroupAccountWiseDataList'

const GroupAccountWiseResult = ({ accountWiseData }) => {

  return (
    <Wrapper>

      {accountWiseData?.length > 0 && ( // Use groupTransactionInfo as items
        <div className='subcriber-container'>
          <GroupAccountWiseDataList items={accountWiseData} />
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
    content: 'Auction Wise Payment Status';
    position: absolute;
    top: 0;
    left: 1rem;
    transform: translateY(-100%);
    background: var(--clr-red-dark);
    color: #ffffff;
    padding: 0.25rem 1rem;
    font-weight: 600;
    font-size: 1rem;
    border-radius: 5px;
  }

  .subcriber-container {
    margin-top: 2rem;
    background-color: #ffffff;
    border-radius: 10px;
    padding: 15px;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
    margin: 10px;
    overflow-x: hidden;
  }

  /* Header Row */
  .subscriber-header {
    background-color: #f0e8e9ff;
    color: #ffffff;
    display: flex;
    justify-content: space-between;
    padding: 8px 12px;
    border-radius: 6px;
    font-weight: bold;
    font-size: 0.9rem;
  }

  /* Data Row */
  .subscriber-data {
    display: flex;
    justify-content: space-between;
    padding: 8px 12px;
    border-bottom: 1px solid #eee;
    font-size: 0.85rem;
  }

  /* Columns */
  .col {
    flex: 1;
    text-align: center;
    padding: 2px 4px;
    word-break: break-word;
  }

  .col-name {
    flex: 1.2;
    text-align: left;
  }

  .col-amount,
  .col-paid,
  .col-due {
    flex: 1;
    text-align: right;
  }

  .download-button {
    background-color: #cd3240;
    color: white;
    border: 2px solid white;
    border-radius: 6px;
    padding: 6px 14px;
    font-weight: bold;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    transition: background-color 0.2s ease;
    float: right;
    margin-bottom: 1rem;
  }

  .download-button:hover {
    background-color: white;
    color: #cd3240;
  }

  @media (max-width: 768px) {
    .subscriber-header,
    .subscriber-data {
      font-size: 0.75rem;
      padding: 6px 8px;
    }

    .col {
      padding: 2px;
    }

    .download-button {
      font-size: 0.75rem;
      padding: 5px 10px;
    }
  }
`;



export default GroupAccountWiseResult;
