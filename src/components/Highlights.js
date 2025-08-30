import { useState, useEffect } from 'react';
import { useUserContext } from '../context/user_context';
import { useLedgerAccountContext } from "../context/ledgerAccount_context";
import { useCompanySubscriberContext } from '../context/companysubscriber_context';
import { usePayablesContext } from '../context/payables_context';
import { useHistory, Link } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa';
import { useReceivablesContext } from '../context/receivables_context';
import { Users, UserPlus, DollarSign, ArrowRight, Plus, Calendar, Wallet, TrendingUp, TrendingDown } from 'lucide-react';

const Highlights = ({ groups, premium }) => {
  const history = useHistory();
  const { user } = useUserContext();
  const { ledgerAccounts } = useLedgerAccountContext();
  const { companySubscribers } = useCompanySubscriberContext();

  const [membershipId, setMembershipId] = useState('');
  const { receivables } = useReceivablesContext();
  const { payables } = usePayablesContext();

  useEffect(() => {
    if (user.results.userAccounts && user.results.userAccounts.length > 0) {
      const membership = user.results.userAccounts[0];
      setMembershipId(membership.parent_membership_id);
    }
  }, [user]);

  const handleMultiStepSubscriber = (membershipId) => {
    history.push(`/addcompanymultisubscriber/${membershipId}`);
  };

  const handleStartGroup = () => {
    history.push('/startagroup');
  };

  const goToLedger = () => history.push('/ledger');
  const goToReceivables = () => history.push('/receivables');
  const goToPayables = () => history.push('/payables');

  const totalCurrentBalance = Array.isArray(ledgerAccounts)
    ? ledgerAccounts.reduce((sum, acc) => sum + (parseFloat(acc.current_balance) || 0), 0)
    : 0;

  // ✅ Sum of rbdue values from receivables
  const totalRbDue = Array.isArray(receivables)
    ? receivables.reduce((sum, item) => sum + (parseFloat(item.rbdue) || 0), 0)
    : 0;

  // ✅ Sum of rbdue values from payables
  const totalPyDue = Array.isArray(payables)
    ? payables.reduce((sum, item) => sum + (parseFloat(item.pbdue) || 0), 0)
    : 0;

  const formatCurrency = (value) => {
    return `₹${value.toLocaleString('en-IN')}`;
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-lg relative">
      {/* Header */}
      <div className="absolute -top-4 left-6 bg-custom-red text-white px-4 py-1 rounded-full text-sm font-medium shadow-md">
        Highlights
      </div>

      <div className="p-6 pt-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          {/* Groups */}
          <div className="text-center">
            <div className="relative w-32 h-32 mx-auto bg-gray-50 border border-gray-200 rounded-2xl flex flex-col items-center justify-center mb-3 hover:bg-gray-100 transition-colors duration-200">
              <div className="flex items-center gap-2 mb-1">
                <Users size={20} className="text-custom-red" />
                <span className="text-2xl font-bold text-gray-800">{groups.length}</span>
              </div>
              <button
                className="absolute -bottom-2 -right-2 w-8 h-8 bg-custom-red text-white rounded-full flex items-center justify-center hover:bg-red-700 transition-colors duration-200 shadow-lg"
                onClick={handleStartGroup}
              >
                <Plus size={16} />
              </button>
            </div>
            <p className="text-sm font-medium text-gray-700">Groups</p>
          </div>

          {/* Subscribers */}
          <div className="text-center">
            <div className="relative w-32 h-32 mx-auto bg-gray-50 border border-gray-200 rounded-2xl flex flex-col items-center justify-center mb-3 hover:bg-gray-100 transition-colors duration-200">
              <Link to={{ pathname: '/subscribers', state: { companySubscribers } }} className="flex items-center gap-2 mb-1 hover:text-custom-red transition-colors duration-200">
                <UserPlus size={20} className="text-custom-red" />
                <span className="text-2xl font-bold text-gray-800">{companySubscribers.length}</span>
              </Link>
              <button
                className="absolute -bottom-2 -right-2 w-8 h-8 bg-custom-red text-white rounded-full flex items-center justify-center hover:bg-red-700 transition-colors duration-200 shadow-lg"
                onClick={() => handleMultiStepSubscriber(membershipId)}
              >
                <Plus size={16} />
              </button>
            </div>
            <p className="text-sm font-medium text-gray-700">Subscribers</p>
          </div>

          {/* Ledger */}
          <div className="text-center cursor-pointer" onClick={goToLedger}>
            <div className="relative w-32 h-32 mx-auto bg-gray-50 border border-gray-200 rounded-2xl flex flex-col items-center justify-center mb-3 hover:bg-gray-100 transition-colors duration-200">
              <div className="flex items-center gap-2 mb-1">
                <Wallet size={20} className="text-custom-red" />
                <span className="text-lg font-bold text-gray-800">{formatCurrency(totalCurrentBalance)}</span>
              </div>
              <button className="absolute -bottom-2 -right-2 w-8 h-8 bg-custom-red text-white rounded-full flex items-center justify-center hover:bg-red-700 transition-colors duration-200 shadow-lg">
                <ArrowRight size={16} />
              </button>
            </div>
            <p className="text-sm font-medium text-gray-700">Ledger</p>
          </div>

          {/* Receivable */}
          <div className="text-center cursor-pointer" onClick={goToReceivables}>
            <div className="relative w-32 h-32 mx-auto bg-gray-50 border border-gray-200 rounded-2xl flex flex-col items-center justify-center mb-3 hover:bg-gray-100 transition-colors duration-200">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp size={20} className="text-green-600" />
                <span className="text-lg font-bold text-gray-800">{formatCurrency(totalRbDue)}</span>
              </div>
              <button className="absolute -bottom-2 -right-2 w-8 h-8 bg-custom-red text-white rounded-full flex items-center justify-center hover:bg-red-700 transition-colors duration-200 shadow-lg">
                <ArrowRight size={16} />
              </button>
            </div>
            <p className="text-sm font-medium text-gray-700">Receivable</p>
          </div>

          {/* Payable */}
          <div className="text-center cursor-pointer" onClick={goToPayables}>
            <div className="relative w-32 h-32 mx-auto bg-gray-50 border border-gray-200 rounded-2xl flex flex-col items-center justify-center mb-3 hover:bg-gray-100 transition-colors duration-200">
              <div className="flex items-center gap-2 mb-1">
                <TrendingDown size={20} className="text-red-600" />
                <span className="text-lg font-bold text-gray-800">{formatCurrency(totalPyDue)}</span>
              </div>
              <button className="absolute -bottom-2 -right-2 w-8 h-8 bg-custom-red text-white rounded-full flex items-center justify-center hover:bg-red-700 transition-colors duration-200 shadow-lg">
                <ArrowRight size={16} />
              </button>
            </div>
            <p className="text-sm font-medium text-gray-700">Payable</p>
          </div>
        </div>

        <div className="text-center">
          <button
            className="bg-custom-red text-white font-semibold px-6 py-3 rounded-lg hover:bg-red-700 transition-colors duration-200 shadow-md"
            onClick={handleStartGroup}
          >
            Start a Group
          </button>
        </div>
      </div>
    </div>
  );
};

export default Highlights;
