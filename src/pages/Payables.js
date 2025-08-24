
import React, { useEffect, useState } from 'react';
import { usePayablesContext } from '../context/payables_context';
import "../style/Payable.css";
import loadingImage from '../images/preloader.gif';
import Tooltip from 'react-tooltip-lite';
import PayablePaymentModal from '../components/PayablePaymentModal';
import { useAobContext } from '../context/aob_context';

const Payables = () => {
  const { fetchPayables, payables, isLoading } = usePayablesContext();
  const [hoveredPayments, setHoveredPayments] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPayable, setSelectedPayable] = useState(null);
  const { aobs, fetchAobs } = useAobContext();

  useEffect(() => {
    fetchPayables();
    fetchAobs();
  }, []);

  const [groupFilter, setGroupFilter] = useState("");
  const [subscriberFilter, setSubscriberFilter] = useState("");
  const [areaFilter, setAreaFilter] = useState("");

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

  const filteredPayables = payables.filter(({ group_name, name, area }) => {
    const groupMatch = !groupFilter || group_name.toLowerCase().includes(groupFilter.toLowerCase());
    const subscriberMatch = !subscriberFilter || name.toLowerCase().includes(subscriberFilter.toLowerCase());
    const areaMatch = !areaFilter || (area || "").toLowerCase().includes(areaFilter.toLowerCase());

    return groupMatch && subscriberMatch && areaMatch;
  });

  const clearFilters = () => {
    setGroupFilter("");
    setSubscriberFilter("");
    setAreaFilter("");
  };

  return (
    <div className="payable-page">
      {isLoading ? (
        <div className="loader-container">
          <img src={loadingImage} alt="Loading..." className="loader-img" />
        </div>
      ) : (
        <div className="payable-wrapper">
          <h2 className="payable-header">
            Payable List <span>({payables.length})</span>
          </h2>
          <div className="payables-header">
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
          {filteredPayables.length > 0 ? (
            <div className="payables-list">
              {filteredPayables.map((person) => {
                const {
                  name,
                  phone,
                  user_image_from_s3,
                  pbtotal,
                  id,
                  pytotal,
                  pbpaid,
                  payments,
                  group_id,
                  group_name,
                  auct_date,
                  pbdue,
                  rbdue,
                  unique_id,
                } = person;

                return (
                  <div className="payable-card" key={unique_id}>
                    <div className="payable-left">
                      <img
                        src={user_image_from_s3 || "default-image.jpg"}
                        alt={name}
                        className="payable-img"
                        onError={(e) => {
                          e.target.src = "default-image.jpg";
                        }}
                      />
                      <div className="payable-info">
                        <h4>{name}</h4>
                        <p>{phone}</p>
                        <p>Group: {group_name}</p>
                        <p>Auction Date: {formatDate(auct_date)}</p>
                      </div>
                    </div>
                    <div className="payable-right">
                      <div className="payment-summary-bar">
                        <div className="summary-item">
                          <div className="label">Total Payable</div>
                          <div className="value total">{formatCurrency(pytotal)}</div>
                        </div>
                        <div className="summary-item">
                          <div className="label">Paid</div>
                          <div className="value paid">{formatCurrency(pbpaid)}</div>
                        </div>
                        <div className="summary-item">
                          <div className="label">Balance</div>
                          <div className="value due">{formatCurrency(pbdue)}</div>
                        </div>
                      </div>

                      <div className="payment-button-container">
                        <button
                          className="pay-button"
                          onClick={() => {
                            setSelectedPayable(person);
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
            <div className="empty-message">No payables to disburse.</div>
          )}
        </div>
      )}
      {modalOpen && (
        <PayablePaymentModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          payable={selectedPayable}
          fetchPayables={fetchPayables}
        />
      )}
    </div>
  );
};

export default Payables;


// import React, { useEffect, useState } from 'react';
// import { API_BASE_URL } from '../utils/apiConfig';
// import { useUserContext } from '../context/user_context';
// import PayablesList from '../components/PayablesList';
// //import './Receivable.css';

// const Payables = () => {
//     const { user } = useUserContext();
//     const [isLoading, setIsLoading] = useState(false);
//     const [payables, setPayables] = useState(null);
//     const [filteredCount, setFilteredCount] = useState(0);
//     const [region, setRegion] = useState(null);

//     const fetchPayables = async () => {
//         try {
//             setIsLoading(true);
//             const apiUrl = `${API_BASE_URL}/payables`;
//             const response = await fetch(apiUrl, {
//                 method: 'GET',
//                 headers: {
//                     Authorization: `Bearer ${user?.results?.token}`,
//                     'Content-Type': 'application/json',
//                 },
//             });

//             if (!response.ok) {
//                 throw new Error('Failed to fetch payables');
//             }

//             const fetchedPayables = await response.json();
//             // Log the data from the API
//             setPayables(fetchedPayables.results.payablesResult); // Update the state
//         } catch (error) {
//             console.error('Error fetching payables:', error);
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     const loadAreasOfBusiness = async () => {
//         try {
//             setIsLoading(true);
//             const apiUrl = `${API_BASE_URL}/aob/all`;

//             const response = await fetch(apiUrl, {
//                 method: 'GET',
//                 headers: {
//                     Authorization: `Bearer ${user?.results?.token}`,
//                     'Content-Type': 'application/json',
//                 },
//             });

//             if (!response.ok) {
//                 throw new Error('Failed to fetch areas of business');
//             }

//             const data = await response.json();
//             setRegion(data?.results);
           
//         } catch (error) {
//             console.error('Error fetching areas of business:', error);
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     useEffect(() => {
//         if (user) {
//             fetchPayables(); // Fetch payables when the user is available
//             loadAreasOfBusiness(); // Load areas of business
//         }
//     }, [user]); // Dependency on user to ensure the fetch happens after user is set

//     // Log whenever `payables` changes
//     useEffect(() => {
//         console.log('Updated Payables State:', payables);
//     }, [payables]);

//     const refreshPayables = () => {
//         fetchPayables(); // Refresh the payables list
//     };

//     const handleFilteredCount = (count) => {
//         setFilteredCount(count); // Update the count of filtered items
//     };

//     const mainContainerStyle = {
//         minHeight: '100vh',
//         display: 'flex',
//         justifyContent: 'center',
//         alignItems: 'center',
//     };

//     return (
//         <div style={mainContainerStyle}>
//             {payables && payables.length > 0 ? (
//                 <section className="receivablecontainer">
//                     <h3>Payables List ({filteredCount})</h3>
//                     {isLoading ? (
//                         <p>Loading...</p>
//                     ) : (
//                         <PayablesList
//                             payables={payables}
//                             region={region}
//                             onFilteredCount={handleFilteredCount}
//                             refreshPayables={refreshPayables}
//                         />
//                     )}
//                 </section>
//             ) : (
//                 <section className="receivablecontainer">
//                     <h3>No Payables Data to Show</h3>
//                 </section>
//             )}
//         </div>
//     );
// };

// export default Payables;
