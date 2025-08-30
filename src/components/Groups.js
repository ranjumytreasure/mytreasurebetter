import React, { useState, useEffect } from 'react';
import GroupDetailsCard from './GroupDetailsCard';
import GroupsAccounts from './GroupsAccounts';
//To generate PDF need 3 imports
import { PDFDownloadLink } from '@react-pdf/renderer';
import { FiDownload } from 'react-icons/fi';
import GroupAccountsPdf from '../components/PDF/GroupAccountsPdf';
import { useUserContext } from '../context/user_context';
import { ArrowUp } from 'lucide-react';

const Groups = ({ data }) => {
  const { user, userRole } = useUserContext();
  //start of PDF generation code
  const userCompany = user?.results?.userCompany;
  const [groupTransactionInfo, setGroupTransactionInfo] = useState([]);// State to store group details
  const [groups, setGroups] = useState([]);// State to store group details
  const [yourdue, setYourDue] = useState([]);// State to store group details
  const [customerdue, setCustomerDue] = useState([]);// State to store group details
  const [showScrollTop, setShowScrollTop] = useState(false);

  const [commisionType, setCommisionType] = useState([]);
  const [is_commision_taken, setCommisionProcurred] = useState([]);
  const [commision, setCommision] = useState([]);
  const [emi, setEmi] = useState([]);
  const [isGroupProgress, setGroupProgress] = useState([]);
  const [groupType, setGroupType] = useState([]);

  // Scroll to top functionality
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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

  return (
    <section className="py-8 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <div className="flex justify-end gap-4 mb-4">
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
                    <button className="px-4 py-2 bg-gray-400 text-white rounded-lg cursor-not-allowed">
                      Loading document...
                    </button>
                  ) : (
                    <button className="flex items-center gap-2 px-4 py-2 bg-custom-red text-white rounded-lg hover:bg-red-700 transition-colors duration-200">
                      <FiDownload size={16} />
                      Download PDF
                    </button>
                  )
                }
              </PDFDownloadLink>
            </div>
            <GroupsAccounts groupTransactionInfo={groupTransactionInfo} type={type} />
          </div>
          <div>
            <GroupDetailsCard
              groups={groups}
              yourdue={yourdue}
              customerdue={customerdue}
              nextAuctionDate={nextAuctionDate}
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
          </div>
        </div>
      </div>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 w-12 h-12 bg-custom-red text-white rounded-full shadow-lg hover:bg-red-700 transition-all duration-200 flex items-center justify-center z-50"
        >
          <ArrowUp size={20} />
        </button>
      )}
    </section>
  );
};
export default Groups;

