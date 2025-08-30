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
import { User, Phone, Wifi, WifiOff } from "lucide-react";

const DEFAULT_IMAGE = "/default-image.jpg"; // fallback image path

const GroupsSubscriber = () => {

  const { data, deleteGroupSubscriberbyCompositekey } = useGroupDetailsContext();

  const [groupSubscriber, setGroupSubscriber] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
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

  const handleOpenDeleteModal = (subscriber) => {
    setSelectedSubscriber(subscriber);
    setShowDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setSelectedSubscriber(null);
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
    <section className="py-8 px-4 bg-white">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />

      <h3 className="text-2xl font-bold text-gray-800 mb-6">Group Subscriber ({groupSubscriber.length})</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {groupSubscriber.map((subscriber) => {
          const isOnline = isSubscriberOnline(subscriber.id);
          return (
            <div key={subscriber.group_subscriber_id || subscriber.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-200 text-center relative">
              <div className="relative w-full h-32 flex items-center justify-center mb-3">
                {subscriber?.user_image_from_s3 && !imageError[subscriber.id] ? (
                  <img
                    src={subscriber.user_image_from_s3}
                    className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
                    alt={subscriber?.name || "Subscriber"}
                    onError={() => setImageError(prev => ({ ...prev, [subscriber.id]: true }))}
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-gray-100 border-2 border-gray-200 flex items-center justify-center">
                    <User size={24} className="text-gray-400" />
                  </div>
                )}

                {/* Online/Offline Status Indicator */}
                <div className={`absolute bottom-2 right-2 w-4 h-4 rounded-full border-2 border-white flex items-center justify-center ${isOnline ? 'bg-green-500' : 'bg-gray-400'
                  }`}>
                  {isOnline ? (
                    <Wifi size={8} className="text-white" />
                  ) : (
                    <WifiOff size={8} className="text-white" />
                  )}
                </div>

                <button
                  onClick={() => handleOpenDeleteModal(subscriber)}
                  className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 transition-colors duration-200"
                >
                  <FaTrash size={12} />
                </button>
              </div>
              <h4 className="font-medium text-sm text-gray-800 mb-1 break-words">{subscriber?.name || "Unknown"}</h4>
              <div className="flex items-center justify-center gap-1 text-xs text-gray-600 mb-1">
                <Phone size={12} />
                <span className="break-words">{subscriber?.phone || "N/A"}</span>
              </div>
              <div className={`flex items-center justify-center gap-1 text-xs ${isOnline ? 'text-green-600' : 'text-gray-500'
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
          );
        })}
      </div>

      <DeleteSubscriberModal
        show={showDeleteModal}
        subscriber={selectedSubscriber}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        isLoading={isLoading}
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg text-center max-w-sm w-11/12">
        <h3 className="text-xl font-bold text-gray-800 mb-2">Confirm Deletion?</h3>
        <h3 className="text-lg text-gray-600 mb-4">Are you sure?</h3>

        <div className="flex items-center justify-center gap-4 mb-6">
          <div className="relative">
            {subscriber?.user_image_from_s3 ? (
              <img
                src={subscriber.user_image_from_s3}
                alt={subscriber?.name || "Subscriber"}
                className="w-20 h-20 rounded-full object-cover"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center">
                <User size={24} className="text-gray-400" />
              </div>
            )}
            {/* Online/Offline Status in Modal */}
            <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white flex items-center justify-center ${isOnline ? 'bg-green-500' : 'bg-gray-400'
              }`}>
              {isOnline ? (
                <Wifi size={10} className="text-white" />
              ) : (
                <WifiOff size={10} className="text-white" />
              )}
            </div>
          </div>
          <div className="text-left">
            <p className="text-sm mb-1"><strong>Name:</strong> {subscriber?.name || "Unknown"}</p>
            <p className="text-sm mb-1"><strong>Phone:</strong> {subscriber?.phone || "N/A"}</p>
            <p className={`text-sm flex items-center gap-1 ${isOnline ? 'text-green-600' : 'text-gray-500'
              }`}>
              {isOnline ? (
                <>
                  <Wifi size={12} />
                  <span>Online</span>
                </>
              ) : (
                <>
                  <WifiOff size={12} />
                  <span>Offline</span>
                </>
              )}
            </p>
          </div>
        </div>

        <div className="flex justify-between gap-4">
          <button
            className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            className="flex-1 px-4 py-2 bg-custom-red text-white rounded-lg hover:bg-red-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? "Deleting..." : "Confirm Deletion"}
          </button>
        </div>
      </div>
    </div>
  );
};


