
import React, { useEffect, useState } from 'react';
import { useReceivablesContext } from '../context/receivables_context';
import loadingImage from '../images/preloader.gif';
import { FiArrowUp, FiArrowDown, FiSearch, FiFilter, FiX, FiUser, FiPhone, FiCalendar, FiDollarSign, FiCreditCard, FiTrendingUp } from 'react-icons/fi';
import { GoArrowBoth } from 'react-icons/go';
import Tooltip from 'react-tooltip-lite';
import ReceivablePayementModal from '../components/ReceivablePayementModal';
import { useAobContext } from '../context/aob_context';


const Receivable = () => {
  const { fetchReceivables, receivables, isLoading } = useReceivablesContext();
  const [hoveredPayments, setHoveredPayments] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedReceivable, setSelectedReceivable] = useState(null);
  const { aobs, fetchAobs } = useAobContext();

  useEffect(() => {
    fetchReceivables();
    fetchAobs();
  }, []);
  console.log('aobs');
  console.log(aobs);
  // Filter states
  const [groupFilter, setGroupFilter] = useState("");
  const [subscriberFilter, setSubscriberFilter] = useState("");
  const [areaFilter, setAreaFilter] = useState(""); // if you want to implement area filter too


  const handleMouseEnter = (payments) => {
    setHoveredPayments(payments);
  };

  const handleMouseLeave = () => {
    setHoveredPayments(null);
  };

  const formatCurrency = (amount) => {
    return `₹${Number(amount).toLocaleString("en-IN")}`;
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // Filter receivables based on group name and subscriber name (case insensitive)
  // const filteredReceivables = receivables.filter(({ group_name, name }) => {
  //   return (
  //     group_name.toLowerCase().includes(groupFilter.toLowerCase()) &&
  //     name.toLowerCase().includes(subscriberFilter.toLowerCase())
  //     // If you add area, add && area.toLowerCase().includes(areaFilter.toLowerCase())
  //   );
  // });

  const filteredReceivables = receivables.filter(({ group_name, name, area }) => {
    const groupMatch = !groupFilter || group_name.toLowerCase().includes(groupFilter.toLowerCase());
    const subscriberMatch = !subscriberFilter || name.toLowerCase().includes(subscriberFilter.toLowerCase());
    const areaMatch = !areaFilter || (area || "").toLowerCase().includes(areaFilter.toLowerCase());

    return groupMatch && subscriberMatch && areaMatch;
  });


  // Clear all filters
  const clearFilters = () => {
    setGroupFilter("");
    setSubscriberFilter("");
    setAreaFilter("");
  };



  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      {isLoading ? (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <img src={loadingImage} alt="Loading..." className="w-20 h-20 mx-auto mb-4" />
            <p className="text-gray-600 font-medium">Loading receivables...</p>
          </div>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 mb-8">
            <div className="bg-gradient-to-r from-custom-red to-red-600 px-8 py-6 rounded-t-xl">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                    <FiCreditCard className="w-8 h-8" />
                    Receivables Management
                  </h1>
                  <p className="text-red-100 mt-2">Track and manage outstanding payments</p>
                </div>
                <div className="bg-white/20 rounded-lg px-4 py-2">
                  <span className="text-white font-semibold text-lg">{receivables.length}</span>
                  <p className="text-red-100 text-sm">Total Records</p>
                </div>
              </div>
            </div>

            {/* Filters */}
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiSearch className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search by group name"
                    value={groupFilter}
                    onChange={(e) => setGroupFilter(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-custom-red focus:border-transparent transition-all duration-200"
                  />
                </div>

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiUser className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search by subscriber name"
                    value={subscriberFilter}
                    onChange={(e) => setSubscriberFilter(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-custom-red focus:border-transparent transition-all duration-200"
                  />
                </div>

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiFilter className="h-5 w-5 text-gray-400" />
                  </div>
                  <select
                    value={areaFilter}
                    onChange={(e) => setAreaFilter(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-custom-red focus:border-transparent transition-all duration-200 appearance-none bg-white"
                  >
                    <option value="">All Areas</option>
                    {[...new Set(aobs.map((item) => item.aob).filter(Boolean))].map((areaName, index) => (
                      <option key={index} value={areaName}>
                        {areaName}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={clearFilters}
                  className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors duration-200 flex items-center justify-center gap-2 font-medium"
                >
                  <FiX className="w-4 h-4" />
                  Clear Filters
                </button>
              </div>

              {/* Results Summary */}
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>Showing {filteredReceivables.length} of {receivables.length} receivables</span>
                {(groupFilter || subscriberFilter || areaFilter) && (
                  <span className="text-custom-red font-medium">Filters applied</span>
                )}
              </div>
            </div>
          </div>

          {/* Receivables List */}
          {filteredReceivables.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredReceivables.map((person) => {
                const {
                  name,
                  phone,
                  user_image_from_s3,
                  rbtotal,
                  id,
                  rbpaid,
                  payments,
                  group_id,
                  group_name,
                  auct_date,
                  rbdue,
                  pbdue,
                  unique_id,
                  total_wallet_balance,
                  group_specific_balance
                } = person;

                return (
                  <div key={unique_id} className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                    {/* Card Header */}
                    <div className="bg-gradient-to-r from-custom-red to-red-600 p-6 text-white">
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          {user_image_from_s3 ? (
                            <img
                              src={user_image_from_s3}
                              alt={name}
                              className="w-16 h-16 rounded-full object-cover border-2 border-white/30"
                              onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.nextSibling.style.display = 'flex';
                              }}
                            />
                          ) : null}
                          <div
                            className={`w-16 h-16 rounded-full border-2 border-white/30 bg-white/20 flex items-center justify-center ${user_image_from_s3 ? 'hidden' : 'flex'}`}
                          >
                            <FiUser className="w-8 h-8 text-white" />
                          </div>
                          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white"></div>
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold">{name}</h3>
                          <p className="text-red-100 flex items-center gap-2">
                            <FiPhone className="w-4 h-4" />
                            {phone}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-6">
                      {/* Group Info */}
                      <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                          <FiUser className="w-4 h-4" />
                          <span className="font-medium">Group:</span>
                          <span>{group_name}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <FiCalendar className="w-4 h-4" />
                          <span className="font-medium">Auction Date:</span>
                          <span>{formatDate(auct_date)}</span>
                        </div>
                      </div>

                      {/* Advance Balances */}
                      <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-yellow-800 font-medium">Total Advance:</span>
                          <span className="text-yellow-900 font-bold">₹{total_wallet_balance || 0}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm mt-1">
                          <span className="text-yellow-800 font-medium">Group Advance:</span>
                          <span className="text-yellow-900 font-bold">₹{group_specific_balance || 0}</span>
                        </div>
                      </div>

                      {/* Financial Summary */}
                      <div className="grid grid-cols-3 gap-3 mb-6">
                        <div className="text-center p-3 bg-blue-50 rounded-lg">
                          <div className="text-xs text-blue-600 font-medium mb-1">Total Due</div>
                          <div className="text-lg font-bold text-blue-700">{formatCurrency(rbtotal)}</div>
                        </div>
                        <div className="text-center p-3 bg-green-50 rounded-lg">
                          <div className="text-xs text-green-600 font-medium mb-1">Paid</div>
                          <div className="text-lg font-bold text-green-700">{formatCurrency(rbpaid)}</div>
                        </div>
                        <div className="text-center p-3 bg-red-50 rounded-lg">
                          <div className="text-xs text-red-600 font-medium mb-1">Balance</div>
                          <div className="text-lg font-bold text-red-700">{formatCurrency(rbdue)}</div>
                        </div>
                      </div>

                      {/* Pay Button */}
                      <button
                        onClick={() => {
                          setSelectedReceivable(person);
                          setModalOpen(true);
                        }}
                        className="w-full py-3 px-4 bg-gradient-to-r from-custom-red to-red-600 text-white font-semibold rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
                      >
                        <FiDollarSign className="w-5 h-5" />
                        Process Payment
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-12 text-center">
              <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                <FiCreditCard className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No Receivables Found</h3>
              <p className="text-gray-600 mb-4">
                {receivables.length === 0
                  ? "There are no receivables to display at the moment."
                  : "No receivables match your current filter criteria."
                }
              </p>
              {(groupFilter || subscriberFilter || areaFilter) && (
                <button
                  onClick={clearFilters}
                  className="px-6 py-2 bg-custom-red text-white rounded-lg hover:bg-red-600 transition-colors duration-200"
                >
                  Clear Filters
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* Payment Modal */}
      {modalOpen && (
        <ReceivablePayementModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          receivable={selectedReceivable}
          fetchReceivables={fetchReceivables}
        />
      )}
    </div>
  );
};

export default Receivable;







