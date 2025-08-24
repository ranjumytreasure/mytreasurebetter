import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import GroupDetailsCard from './GroupDetailsCard';
import GroupsAccounts from './GroupsAccounts';
//To generate PDF need 3 imports
import { PDFDownloadLink } from '@react-pdf/renderer';
import { FiDownload } from 'react-icons/fi';
import GroupAccountsPdf from '../components/PDF/GroupAccountsPdf';
import { useUserContext } from '../context/user_context';

const Groups = ({ data }) => {
  const { user, userRole } = useUserContext();
  //start of PDF generation code
  const userCompany = user?.results?.userCompany;
  const [groupTransactionInfo, setGroupTransactionInfo] = useState([]);// State to store group details
  const [groups, setGroups] = useState([]);// State to store group details
  const [yourdue, setYourDue] = useState([]);// State to store group details
  const [customerdue, setCustomerDue] = useState([]);// State to store group details

  const [commisionType, setCommisionType] = useState([]);
  const [is_commision_taken, setCommisionProcurred] = useState([]);
  const [commision, setCommision] = useState([]);
  const [emi, setEmi] = useState([]);
  const [isGroupProgress, setGroupProgress] = useState([]);
  const [groupType, setGroupType] = useState([]);

  useEffect(() => {
    if (data && data.results) {
      console.log('Data and results are available:', data);

      // Set groupTransactionInfo when data is available
      const { groupsTabResult, yourDueResult, custDueResult, groupAccountResult, commisionType, is_commision_taken, commissionAmount, emi, groupProgress, type } = data.results;
      setGroupTransactionInfo(groupAccountResult);
      setGroups(groupsTabResult);
      setYourDue(yourDueResult);
      setCustomerDue(custDueResult);
      setCommisionType(commisionType);
      setCommisionProcurred(is_commision_taken);
      setCommision(commissionAmount);
      setEmi(emi);
      setGroupProgress(groupProgress);
      setGroupType(type);
    }
  }, [data]); // Run this effect when data prop changes
  console.log(groups);
  console.log(yourdue);
  console.log(customerdue);
  console.log(commisionType);
  console.log(is_commision_taken);
  if (!data || !data.results) {
    // Handle the case where data or data.results is null or undefined
    return <p>No data available.</p>;
  }



  const { nextAuctionDate, startTime, endTime, type, groupSubcriberResult } = data.results;
  const ActionButtonsWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-bottom: 1rem;

  .action-btn {
    background-color: #28a745;
    color: #fff;
    padding: 10px 16px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    display: flex;
    align-items: center;
    font-size: 0.9rem;

    &:hover {
      background-color: #218838;
    }
  }
`;

  return (<section className='section'>


    <Wrapper className='section-center' >
      <div>
        <ActionButtonsWrapper>
          <PDFDownloadLink
            document={
              <GroupAccountsPdf
                data={data}
                companyData={userCompany}
              />
            }
            fileName={`GroupAccounts_${new Date().toISOString().slice(0, 10)}.pdf`}
          >
            {({ loading }) =>
              loading ? (
                'Loading document...'
              ) : (
                <button className='action-btn'>
                  <FiDownload style={{ marginRight: '8px' }} />
                  Download PDF
                </button>
              )
            }
          </PDFDownloadLink>


        </ActionButtonsWrapper>
        <GroupsAccounts groupTransactionInfo={groupTransactionInfo} type={type} />
      </div>
      <GroupDetailsCard groups={groups}
        yourdue={yourdue}
        customerdue={customerdue}
        nextAuctionDate={nextAuctionDate} // Pass columns as props
        startTime={startTime}
        endTime={endTime}
        commisionType={commisionType}
        is_commision_taken={is_commision_taken}
        commision={commision}
        emi={emi}
        isGroupProgress={isGroupProgress}
        groupType={groupType}
        groupSubcriberResult={groupSubcriberResult}
      />
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

export default Groups;

