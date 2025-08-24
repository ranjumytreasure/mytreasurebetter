
import React, { useEffect, useState } from 'react';
import { useReceivablesContext } from '../context/receivables_context';
import "../style/Receivable.css";
import loadingImage from '../images/preloader.gif';
import { FiArrowUp, FiArrowDown } from 'react-icons/fi';
import { GoArrowBoth } from 'react-icons/go';
import Tooltip from 'react-tooltip-lite'; // optional but nice
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
    <div className="receivable-page">
      {isLoading ? (
        <div className="loader-container">
          <img src={loadingImage} alt="Loading..." className="loader-img" />
        </div>
      ) : (
        <div className="receivable-wrapper">
          <h2 className="receivable-header">
            Receivable List <span>({receivables.length})</span>

          </h2>
          <div className="receivables-header">
            <input
              type="text"
              placeholder="Group Name"
              value={groupFilter}
              onChange={(e) => setGroupFilter(e.target.value)}
            />
            <input
              type="text"
              placeholder="Subscriber Name"
              value={subscriberFilter}
              onChange={(e) => setSubscriberFilter(e.target.value)}
            />
            <select
              value={areaFilter}
              onChange={(e) => setAreaFilter(e.target.value)}
              className="area-dropdown"
            >
              <option value="">All Areas</option>
              {[...new Set(aobs.map((item) => item.aob).filter(Boolean))].map((areaName, index) => (
                <option key={index} value={areaName}>
                  {areaName}
                </option>
              ))}
            </select>

            <button className="clear-btn" onClick={clearFilters}>
              Clear
            </button>
          </div>
          {filteredReceivables.length > 0 ? (
            <div className="receivables-list">
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
                  <div className="receivable-card" key={unique_id}>
                    <div className="receivable-left">
                      <img
                        src={user_image_from_s3 || "default-image.jpg"}
                        alt={name}
                        className="receivable-img"
                        onError={(e) => {
                          e.target.src = "default-image.jpg";
                        }}
                      />
                      <div className="receivable-info">
                        <h4>{name}</h4>
                        <p>{phone}</p>
                        <p>Group: {group_name}</p>
                        <p>Auction Date: {formatDate(auct_date)}</p>
                      </div>
                    </div>
                    <div className="receivable-right">
                      <div className="summary-box">
                        <span>Tot Advance: ₹{total_wallet_balance}</span>
                        <span>Grp Advance: ₹{group_specific_balance}</span>
                      </div>
                      <div className="payment-summary-bar">
                        <div className="summary-item">
                          <div className="label">Total Due</div>
                          <div className="value total">{formatCurrency(rbtotal)}</div>
                        </div>
                        <div className="summary-item">
                          <div className="label">Paid</div>
                          <div className="value paid">{formatCurrency(rbpaid)}</div>
                        </div>
                        <div className="summary-item">
                          <div className="label">Balance</div>
                          <div className="value due">{formatCurrency(rbdue)}</div>
                        </div>
                        {/* <div className="summary-item">
      <div className="label">Advance Payable</div>
      <div className="value">{formatCurrency(pbdue)}</div>
    </div> */}
                      </div>



                      <div className="payment-button-container">
                        <button
                          className="pay-button"
                          onClick={() => {
                            setSelectedReceivable(person);
                            setModalOpen(true);
                          }}
                        >
                          Pay
                        </button>
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>
          ) : (
            <div className="empty-message">No receivables to collect.</div>
          )}
        </div>
      )}
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







