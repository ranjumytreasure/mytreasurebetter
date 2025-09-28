// import { useState, useEffect } from 'react';
// import styled from 'styled-components';
// import { FaTrash } from 'react-icons/fa';
// import { API_BASE_URL } from '../utils/apiConfig';
// import { useUserContext } from '../context/user_context';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// const DEFAULT_IMAGE = '/default-image.jpg'; // fallback image path
// import { useGroupDetailsContext } from "../context/group_context";

// const GroupsSubscriber = ({ data }) => {
//   const { user } = useUserContext();


//   const [groupSubscriber, setGroupSubscriber] = useState([]);
//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [selectedSubscriber, setSelectedSubscriber] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);

//   useEffect(() => {
//     if (data?.results?.groupSubcriberResult) {
//       setGroupSubscriber(data.results.groupSubcriberResult);
//     }
//   }, [data]);

//   console.log(data?.results?.groupSubcriberResult);
//   const handleOpenDeleteModal = (subscriber) => {
//     setSelectedSubscriber(subscriber);
//     setShowDeleteModal(true);
//   };

//   const handleCloseDeleteModal = () => {
//     setShowDeleteModal(false);
//     setSelectedSubscriber(null);
//   };

//   // Delete API call with toast for messages
//   const deleteGroupSubscriber = async (subscriber) => {
//     setIsLoading(true);

//     if (!subscriber) {
//       toast.error('Invalid subscriber data');
//       setIsLoading(false);
//       return;
//     }

//     const { group_id, id: subscriber_id, group_subscriber_id } = subscriber;


//     if (!group_id || !subscriber_id || !group_subscriber_id) {
//       toast.error('Missing required IDs for deletion');
//       setIsLoading(false);
//       return;
//     }

//     const apiUrl = `${API_BASE_URL}/groupsubscribers/${group_id}/${subscriber_id}/${group_subscriber_id}`;

//     try {
//       const response = await fetch(apiUrl, {
//         method: 'DELETE',
//         headers: {
//           'Authorization': `Bearer ${user?.results?.token}`,
//           'Content-Type': 'application/json',
//         },
//       });

//       const result = await response.json();

//       if (response.ok) {
//         toast.success(result.message || 'Subscriber removed successfully');
//         setGroupSubscriber((prev) =>
//           prev.filter((sub) => sub.group_subscriber_id !== group_subscriber_id)
//         );
//         handleCloseDeleteModal();
//       } else {
//         toast.error(result.message || 'Failed to delete subscriber');
//       }
//     } catch (error) {

//       toast.error('An error occurred while deleting subscriber');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   if (!data) return <p>Data is not available.</p>;

//   return (
//     <Section>
//       {/* Toast container */}
//       <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />

//       <Header>Group Subscriber ({groupSubscriber.length})</Header>
//       <Grid>
//         {groupSubscriber.map((subscriber) => (
//           <Card key={subscriber.group_subscriber_id || subscriber.id}>
//             <ImageWrapper>
//               <img
//                 src={subscriber?.user_image_from_s3 || DEFAULT_IMAGE}
//                 className="subscriber-image"

//               />
//               <DeleteButton onClick={() => handleOpenDeleteModal(subscriber)}>
//                 <FaTrash />
//               </DeleteButton>
//             </ImageWrapper>
//             <SubscriberName>{subscriber?.name || 'Unknown'}</SubscriberName>
//             <SubscriberPhone>{subscriber?.phone || 'N/A'}</SubscriberPhone>
//           </Card>
//         ))}
//       </Grid>

//       <DeleteSubscriberModal
//         show={showDeleteModal}
//         subscriber={selectedSubscriber}
//         onClose={handleCloseDeleteModal}
//         onConfirm={() => deleteGroupSubscriber(selectedSubscriber)}
//         isLoading={isLoading}
//       />
//     </Section>
//   );
// };

// export default GroupsSubscriber;

// /* ===================== Modal Component ===================== */
// const DeleteSubscriberModal = ({ show, subscriber, onClose, onConfirm, isLoading }) => {
//   if (!show) return null;

//   return (
//     <ModalOverlay>
//       <ModalContent>
//         <h3>Confirm Deletion ?</h3>
//         <h3>Be Carefull</h3>

//         {/* Container for image and details side-by-side */}
//         <InfoWrapper>
//           <img
//             src={subscriber?.user_image_from_s3 || DEFAULT_IMAGE}
//             alt={subscriber?.name || 'Subscriber'}
//             className="modal-image"
//           />
//           <Details>
//             <DetailItem><strong>Name:</strong> {subscriber?.name || 'Unknown'}</DetailItem>
//             <DetailItem><strong>Phone:</strong> {subscriber?.phone || 'N/A'}
//             </DetailItem>
//           </Details>
//         </InfoWrapper>

//         <div className="modal-actions">
//           <button className="cancel-btn" onClick={onClose} disabled={isLoading}>
//             Cancel
//           </button>
//           <button className="confirm-btn" onClick={onConfirm} disabled={isLoading}>
//             {isLoading ? 'Deleting...' : 'Confirm Deletion'}
//           </button>
//         </div>
//       </ModalContent>
//     </ModalOverlay>
//   );
// };

// /* Add these styled components */

// const InfoWrapper = styled.div`
//   display: flex;
//   align-items: center;
//   gap: 1rem;
//   justify-content: center;
//   margin-bottom: 1rem;
// `;

// const Details = styled.div`
//   text-align: left;
// `;

// const DetailItem = styled.p`
//   margin: 0.25rem 0;
//   font-size: 1rem;
// `;


// /* ===================== Styled Components ===================== */

// const Section = styled.section`
//   padding: 1rem;
// `;

// const Header = styled.h3`
//   margin-bottom: 1rem;
// `;

// const Grid = styled.div`
//   display: grid;
//   gap: 1rem;
//   grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));

//   @media (max-width: 600px) {
//     grid-template-columns: repeat(2, 1fr);
//   }
// `;

// const Card = styled.div`
//   background: #fff;
//   border-radius: 8px;
//   box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
//   overflow: hidden;
//   text-align: center;
// `;

// const ImageWrapper = styled.div`
//   position: relative;
//   width: 100%;
//   height: 140px;
//   display: flex;
//   align-items: center;
//   justify-content: center;

//   .subscriber-image {
//     width: 100px;
//     height: 100px;
//     border-radius: 50%;
//     object-fit: cover;
//     border: 2px solid #ddd;
//     background: #f5f5f5;
//   }
// `;

// const DeleteButton = styled.button`
//   position: absolute;
//   top: 6px;
//   right: 6px;
//   background: rgba(234, 24, 24, 0.85);
//   color: white;
//   border: none;
//   border-radius: 50%;
//   padding: 6px;
//   cursor: pointer;
//   font-size: 0.8rem;

//   &:hover {
//     background: rgba(200, 0, 0, 0.9);
//   }
// `;
// const SubscriberPhone = styled.p`
//   margin: 0;
//   font-size: 0.8rem;
//   color: #555;
//   word-break: break-word;
// `;


// const SubscriberName = styled.p`

//   font-weight: 500;
//   font-size: 0.85rem;
//   word-break: break-word;
// `;

// /* Modal Styles */
// const ModalOverlay = styled.div`
//   position: fixed;
//   top: 0; left: 0; right: 0; bottom: 0;
//   background: rgba(0,0,0,0.5);
//   display: flex; align-items: center; justify-content: center;
//   z-index: 999;
// `;

// const ModalContent = styled.div`
//   background: white;
//   padding: 2rem;
//   border-radius: 10px;
//   text-align: center;
//   max-width: 350px;
//   width: 90%;

//   .modal-image {
//     width: 80px; 
//     height: 80px;
//     border-radius: 50%;
//     object-fit: cover;
//     margin-bottom: 1rem;
//   }

//   .modal-actions {
//     margin-top: 1.5rem;
//     display: flex; justify-content: space-between;
//   }

//   .cancel-btn {
//     background: #ccc;
//     border: none;
//     padding: 0.5rem 1rem;
//     border-radius: 5px;
//     cursor: pointer;
//   }

//   .cancel-btn:disabled {
//     cursor: not-allowed;
//     opacity: 0.6;
//   }

//   .confirm-btn {
//     background: #d9534f;
//     color: white;
//     border: none;
//     padding: 0.5rem 1rem;
//     border-radius: 5px;
//     cursor: pointer;
//   }

//   .confirm-btn:hover:not(:disabled) {
//     background: #c9302c;
//   }

//   .confirm-btn:disabled {
//     cursor: not-allowed;
//     opacity: 0.6;
//   }
// `;

// components/GroupsSubscriber.js
import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { FaTrash } from "react-icons/fa";
import { useUserContext } from "../context/user_context";
import { useGroupDetailsContext } from "../context/group_context";
import { useCompanySubscriberContext } from "../context/companysubscriber_context";
import { User, Phone, Wifi, WifiOff } from "lucide-react";
import Scenario1Modal from "./Scenario1Modal";
import Scenario2Modal from "./Scenario2Modal";
import Scenario3Modal from "./Scenario3Modal";
import Scenario4Modal from "./Scenario4Modal";

const DEFAULT_IMAGE = "/default-image.jpg"; // fallback image path

const GroupsSubscriber = () => {

  const { data, deleteGroupSubscriberbyCompositekey, checkDeletionScenario, deleteGroupSubscriberWithScenario } = useGroupDetailsContext();
  const { companySubscribers, fetchCompanySubscribers } = useCompanySubscriberContext();

  const [groupSubscriber, setGroupSubscriber] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showScenarioModal, setShowScenarioModal] = useState(false);
  const [showScenario1Modal, setShowScenario1Modal] = useState(false);
  const [showScenario2Modal, setShowScenario2Modal] = useState(false);
  const [showScenario3Modal, setShowScenario3Modal] = useState(false);
  const [showScenario4Modal, setShowScenario4Modal] = useState(false);
  const [scenarioData, setScenarioData] = useState(null);
  const [selectedSubscriber, setSelectedSubscriber] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [imageError, setImageError] = useState({});
  const [onlineStatus, setOnlineStatus] = useState({});

  // Function to determine if a subscriber is online (mock logic - you can replace with real API calls)
  const isSubscriberOnline = (subscriberId) => {
    // Mock logic: randomly assign online/offline status
    // In a real app, this would check against your backend API
    const lastSeen = onlineStatus[subscriberId];
    if (lastSeen) {
      const now = new Date();
      const timeDiff = now - lastSeen;
      // Consider online if last seen within 5 minutes
      return timeDiff < 5 * 60 * 1000;
    }
    // Random assignment for demo purposes
    return Math.random() > 0.3; // 70% chance of being online
  };

  // Function to update online status (mock - in real app this would come from WebSocket or API)
  const updateOnlineStatus = () => {
    const newStatus = {};
    groupSubscriber.forEach(subscriber => {
      if (Math.random() > 0.3) { // 70% chance of being online
        newStatus[subscriber.id] = new Date();
      }
    });
    setOnlineStatus(newStatus);
  };

  // Sync context data to local state
  useEffect(() => {
    if (data?.results?.groupSubcriberResult) {
      setGroupSubscriber(data.results.groupSubcriberResult);
      // Initialize online status when data loads
      updateOnlineStatus();
    }
  }, [data]);

  // Update online status every 30 seconds (mock - in real app this would be WebSocket updates)
  useEffect(() => {
    const interval = setInterval(() => {
      updateOnlineStatus();
    }, 30000);

    return () => clearInterval(interval);
  }, [groupSubscriber]);

  const handleOpenDeleteModal = async (subscriber) => {
    console.log('🔍 Opening delete modal for subscriber:', subscriber);
    setSelectedSubscriber(subscriber);

    // Check scenario first
    try {
      const result = await checkDeletionScenario(
        subscriber.group_id || data?.results?.group_id,
        subscriber.subscriber_id,
        subscriber.group_subscriber_id
      );

      if (result.success) {
        setScenarioData(result.data);
        const scenario = result.data.scenario;

        console.log('🔍 Scenario determined:', scenario);

        // Show appropriate modal based on scenario
        if (scenario === 1) {
          setShowScenario1Modal(true);
        } else if (scenario === 2) {
          setShowScenario2Modal(true);
        } else if (scenario === 3) {
          setShowScenario3Modal(true);
        } else if (scenario === 4) {
          setShowScenario4Modal(true);
        }
      } else {
        toast.error(result.message || 'Failed to check deletion scenario');
      }
    } catch (error) {
      console.error('Error checking scenario:', error);
      toast.error('Error checking deletion scenario');
    }
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setSelectedSubscriber(null);
  };

  const handleCloseScenarioModal = () => {
    setShowScenarioModal(false);
    setShowScenario1Modal(false);
    setShowScenario2Modal(false);
    setShowScenario3Modal(false);
    setShowScenario4Modal(false);
    setSelectedSubscriber(null);
    setScenarioData(null);
  };

  const handleScenarioSuccess = () => {
    console.log('🔍 Scenario action completed successfully');
    setShowScenarioModal(false);
    setShowScenario1Modal(false);
    setShowScenario2Modal(false);
    setShowScenario3Modal(false);
    setShowScenario4Modal(false);
    setSelectedSubscriber(null);
    setScenarioData(null);
    // The context will automatically refresh the data
  };

  const handleConfirmDelete = async () => {
    if (!selectedSubscriber) return;
    setIsLoading(true);

    const result = await deleteGroupSubscriberbyCompositekey(
      selectedSubscriber.group_id,
      selectedSubscriber.id,
      selectedSubscriber.group_subscriber_id
    );


    setIsLoading(false);
    handleCloseDeleteModal();
    if (result.success) {
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }
  };

  if (!data) return <p>Data is not available.</p>;

  return (
    <section className="py-8 px-4 bg-gradient-to-br from-gray-50 to-white min-h-screen">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />

      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-3xl font-bold text-gray-800 mb-2">Group Subscribers</h3>
            <p className="text-gray-600">Total Members: <span className="font-semibold text-red-600">{groupSubscriber.length}</span></p>
          </div>
          <div className="hidden md:block">
            <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
              <p className="text-sm text-gray-500">Active Members</p>
              <p className="text-2xl font-bold text-green-600">{groupSubscriber.filter((_, index) => index % 3 !== 0).length}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {groupSubscriber.map((subscriber) => {
            const isOnline = isSubscriberOnline(subscriber.id);
            return (
              <div key={subscriber.group_subscriber_id || subscriber.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 overflow-hidden group">
                {/* Header with image and status */}
                <div className="relative bg-gradient-to-br from-gray-50 to-white p-6 pb-4">
                  <div className="relative w-full flex items-center justify-center mb-4">
                    {subscriber?.user_image_from_s3 && !imageError[subscriber.id] ? (
                      <img
                        src={subscriber.user_image_from_s3}
                        className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                        alt={subscriber?.name || "Subscriber"}
                        onError={() => setImageError(prev => ({ ...prev, [subscriber.id]: true }))}
                      />
                    ) : (
                      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 border-4 border-white shadow-lg flex items-center justify-center">
                        <User size={32} className="text-gray-400" />
                      </div>
                    )}

                    {/* Online/Offline Status Indicator */}
                    <div className={`absolute bottom-1 right-1 w-6 h-6 rounded-full border-3 border-white flex items-center justify-center shadow-md ${isOnline ? 'bg-green-500' : 'bg-gray-400'
                      }`}>
                      {isOnline ? (
                        <Wifi size={10} className="text-white" />
                      ) : (
                        <WifiOff size={10} className="text-white" />
                      )}
                    </div>

                    {/* Delete Button */}
                    <button
                      onClick={() => handleOpenDeleteModal(subscriber)}
                      className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 transition-all duration-200 opacity-0 group-hover:opacity-100 shadow-lg hover:shadow-xl"
                    >
                      <FaTrash size={14} />
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="px-6 pb-6">
                  {/* Name */}
                  <h4 className="font-bold text-lg text-gray-800 mb-3 text-center break-words leading-tight">
                    {subscriber?.name || "Unknown"}
                  </h4>

                  {/* Phone */}
                  <div className="flex items-center justify-center gap-2 text-sm text-gray-600 mb-4 bg-gray-50 rounded-lg py-2 px-3">
                    <Phone size={14} className="text-gray-500" />
                    <span className="break-words font-medium">{subscriber?.phone || "N/A"}</span>
                  </div>

                  {/* Advance Amount */}
                  <div className="bg-gradient-to-r from-red-50 to-red-100 rounded-lg p-4 mb-4 border border-red-200">
                    <div className="text-center">
                      <p className="text-xs font-medium text-gray-600 mb-1 uppercase tracking-wide">Advance Amount</p>
                      <p className="text-lg font-bold text-red-600">
                        {(() => {
                          // Try to get the advance balance from different possible field names
                          let advanceBalance = subscriber?.total_advance_balance;

                          // If total_advance_balance is not available, try to calculate it
                          if ((advanceBalance === undefined || advanceBalance === null) &&
                            (subscriber?.total_advance_credit !== undefined || subscriber?.total_advance_debit !== undefined)) {
                            const credit = subscriber?.total_advance_credit || 0;
                            const debit = subscriber?.total_advance_debit || 0;
                            advanceBalance = credit - debit;
                          }

                          // Return formatted value or N/A
                          return (advanceBalance !== undefined && advanceBalance !== null)
                            ? `₹${advanceBalance.toLocaleString()}`
                            : "N/A";
                        })()}
                      </p>
                    </div>
                  </div>

                  {/* Status */}
                  <div className={`flex items-center justify-center gap-2 text-sm font-medium px-4 py-2 rounded-full ${isOnline ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                    }`}>
                    {isOnline ? (
                      <>
                        <Wifi size={14} />
                        <span>Online</span>
                      </>
                    ) : (
                      <>
                        <WifiOff size={14} />
                        <span>Offline</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <DeleteSubscriberModal
        show={showDeleteModal}
        subscriber={selectedSubscriber}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        isLoading={isLoading}
      />

      <Scenario1Modal
        isOpen={showScenario1Modal}
        onClose={handleCloseScenarioModal}
        subscriber={selectedSubscriber}
        groupId={selectedSubscriber?.group_id || data?.results?.group_id}
      />

      <Scenario2Modal
        isOpen={showScenario2Modal}
        onClose={handleCloseScenarioModal}
        subscriber={selectedSubscriber}
        groupId={selectedSubscriber?.group_id || data?.results?.group_id}
        scenarioData={scenarioData}
      />

      <Scenario3Modal
        isOpen={showScenario3Modal}
        onClose={handleCloseScenarioModal}
        subscriber={selectedSubscriber}
        groupId={selectedSubscriber?.group_id || data?.results?.group_id}
        scenarioData={scenarioData}
      />

      <Scenario4Modal
        isOpen={showScenario4Modal}
        onClose={handleCloseScenarioModal}
        subscriber={selectedSubscriber}
        groupId={selectedSubscriber?.group_id || data?.results?.group_id}
        scenarioData={scenarioData}
      />
    </section>
  );
};

export default GroupsSubscriber;

/* ===================== Modal Component ===================== */
const DeleteSubscriberModal = ({ show, subscriber, onClose, onConfirm, isLoading }) => {
  if (!show) return null;

  // Mock online status for modal (in real app, this would be passed as prop or fetched)
  const isOnline = subscriber ? Math.random() > 0.3 : false;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-500 to-red-600 p-6 text-white text-center">
          <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-3">
            <FaTrash size={24} />
          </div>
          <h3 className="text-xl font-bold mb-1">Confirm Deletion</h3>
          <p className="text-red-100 text-sm">This action cannot be undone</p>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="relative">
              {subscriber?.user_image_from_s3 ? (
                <img
                  src={subscriber.user_image_from_s3}
                  alt={subscriber?.name || "Subscriber"}
                  className="w-16 h-16 rounded-full object-cover border-3 border-gray-200"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-gray-100 border-3 border-gray-200 flex items-center justify-center">
                  <User size={20} className="text-gray-400" />
                </div>
              )}
              {/* Online/Offline Status in Modal */}
              <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white flex items-center justify-center ${isOnline ? 'bg-green-500' : 'bg-gray-400'
                }`}>
                {isOnline ? (
                  <Wifi size={8} className="text-white" />
                ) : (
                  <WifiOff size={8} className="text-white" />
                )}
              </div>
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-lg text-gray-800 mb-1">{subscriber?.name || "Unknown"}</h4>
              <div className="flex items-center gap-1 text-sm text-gray-600 mb-2">
                <Phone size={12} />
                <span>{subscriber?.phone || "N/A"}</span>
              </div>
              <div className={`flex items-center gap-1 text-xs ${isOnline ? 'text-green-600' : 'text-gray-500'
                }`}>
                {isOnline ? (
                  <>
                    <Wifi size={10} />
                    <span>Online</span>
                  </>
                ) : (
                  <>
                    <WifiOff size={10} />
                    <span>Offline</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Advance Amount */}
          <div className="bg-gradient-to-r from-red-50 to-red-100 rounded-lg p-4 mb-6 border border-red-200">
            <div className="text-center">
              <p className="text-xs font-medium text-gray-600 mb-1 uppercase tracking-wide">Advance Amount</p>
              <p className="text-lg font-bold text-red-600">
                {(() => {
                  // Try to get the advance balance from different possible field names
                  let advanceBalance = subscriber?.total_advance_balance;

                  // If total_advance_balance is not available, try to calculate it
                  if ((advanceBalance === undefined || advanceBalance === null) &&
                    (subscriber?.total_advance_credit !== undefined || subscriber?.total_advance_debit !== undefined)) {
                    const credit = subscriber?.total_advance_credit || 0;
                    const debit = subscriber?.total_advance_debit || 0;
                    advanceBalance = credit - debit;
                  }

                  // Return formatted value or N/A
                  return (advanceBalance !== undefined && advanceBalance !== null)
                    ? `₹${advanceBalance.toLocaleString()}`
                    : "N/A";
                })()}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              className="flex-1 px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              onClick={onConfirm}
              disabled={isLoading}
            >
              {isLoading ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};


