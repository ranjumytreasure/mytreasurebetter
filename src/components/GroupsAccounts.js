import React, { useState, useEffect } from 'react';
import GroupAccountList from './GroupAccountList';
import { ArrowUp } from 'lucide-react';

const GroupsAccounts = ({ groupTransactionInfo, type }) => {
  //console.log(groupTransactionInfo);
  const [showScrollTop, setShowScrollTop] = useState(false);

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

  const removeItem = (id) => {

  };

  const editItem = (id) => {

  };



  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-lg relative">
      {/* Header */}
      <div className="absolute -top-4 left-6 bg-custom-red text-white px-4 py-1 rounded-full text-sm font-medium shadow-md">
        Group Accounts
      </div>

      {groupTransactionInfo?.length > 0 && (
        <div className="p-6 pt-8">
          <GroupAccountList items={groupTransactionInfo} removeItem={removeItem} editItem={editItem} type={type} />
        </div>
      )}

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 w-12 h-12 bg-custom-red text-white rounded-full shadow-lg hover:bg-red-700 transition-all duration-200 flex items-center justify-center z-50"
        >
          <ArrowUp size={20} />
        </button>
      )}
    </div>
  );
};

export default GroupsAccounts;
