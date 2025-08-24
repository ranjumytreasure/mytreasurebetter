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
import styled from "styled-components";
import { ToastContainer, toast } from "react-toastify";
import { FaTrash } from "react-icons/fa";
import { useUserContext } from "../context/user_context";
import { useGroupDetailsContext } from "../context/group_context";

const DEFAULT_IMAGE = "/default-image.jpg"; // fallback image path

const GroupsSubscriber = () => {

  const { data, deleteGroupSubscriberbyCompositekey } = useGroupDetailsContext();

  const [groupSubscriber, setGroupSubscriber] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedSubscriber, setSelectedSubscriber] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Sync context data to local state
  useEffect(() => {
    if (data?.results?.groupSubcriberResult) {
      setGroupSubscriber(data.results.groupSubcriberResult);
    }
  }, [data]);

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
    <Section>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />

      <Header>Group Subscriber ({groupSubscriber.length})</Header>
      <Grid>
        {groupSubscriber.map((subscriber) => (
          <Card key={subscriber.group_subscriber_id || subscriber.id}>
            <ImageWrapper>
              <img
                src={subscriber?.user_image_from_s3 || DEFAULT_IMAGE}
                className="subscriber-image"
                alt={subscriber?.name || "Subscriber"}
              />
              <DeleteButton onClick={() => handleOpenDeleteModal(subscriber)}>
                <FaTrash />
              </DeleteButton>
            </ImageWrapper>
            <SubscriberName>{subscriber?.name || "Unknown"}</SubscriberName>
            <SubscriberPhone>{subscriber?.phone || "N/A"}</SubscriberPhone>
          </Card>
        ))}
      </Grid>

      <DeleteSubscriberModal
        show={showDeleteModal}
        subscriber={selectedSubscriber}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        isLoading={isLoading}
      />
    </Section>
  );
};

export default GroupsSubscriber;

/* ===================== Modal Component ===================== */
const DeleteSubscriberModal = ({ show, subscriber, onClose, onConfirm, isLoading }) => {
  if (!show) return null;

  return (
    <ModalOverlay>
      <ModalContent>
        <h3>Confirm Deletion?</h3>
        <h3>Is Confirm?</h3>

        <InfoWrapper>
          <img
            src={subscriber?.user_image_from_s3 || DEFAULT_IMAGE}
            alt={subscriber?.name || "Subscriber"}
            className="modal-image"
          />
          <Details>
            <DetailItem><strong>Name:</strong> {subscriber?.name || "Unknown"}</DetailItem>
            <DetailItem><strong>Phone:</strong> {subscriber?.phone || "N/A"}</DetailItem>
          </Details>
        </InfoWrapper>

        <div className="modal-actions">
          <button className="cancel-btn" onClick={onClose} disabled={isLoading}>
            Cancel
          </button>
          <button className="confirm-btn" onClick={onConfirm} disabled={isLoading}>
            {isLoading ? "Deleting..." : "Confirm Deletion"}
          </button>
        </div>
      </ModalContent>
    </ModalOverlay>
  );
};

/* ===================== Styled Components ===================== */
const InfoWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  justify-content: center;
  margin-bottom: 1rem;
`;

const Details = styled.div`
  text-align: left;
`;

const DetailItem = styled.p`
  margin: 0.25rem 0;
  font-size: 1rem;
`;

const Section = styled.section`
  padding: 1rem;
`;

const Header = styled.h3`
  margin-bottom: 1rem;
`;

const Grid = styled.div`
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  @media (max-width: 600px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const Card = styled.div`
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  text-align: center;
`;

const ImageWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 140px;
  display: flex;
  align-items: center;
  justify-content: center;

  .subscriber-image {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid #ddd;
    background: #f5f5f5;
  }
`;

const DeleteButton = styled.button`
  position: absolute;
  top: 6px;
  right: 6px;
  background: rgba(234, 24, 24, 0.85);
  color: white;
  border: none;
  border-radius: 50%;
  padding: 6px;
  cursor: pointer;
  font-size: 0.8rem;

  &:hover {
    background: rgba(200, 0, 0, 0.9);
  }
`;

const SubscriberPhone = styled.p`
  margin: 0;
  font-size: 0.8rem;
  color: #555;
  word-break: break-word;
`;

const SubscriberName = styled.p`
  font-weight: 500;
  font-size: 0.85rem;
  word-break: break-word;
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex; align-items: center; justify-content: center;
  z-index: 999;
`;

const ModalContent = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 10px;
  text-align: center;
  max-width: 350px;
  width: 90%;

  .modal-image {
    width: 80px; 
    height: 80px;
    border-radius: 50%;
    object-fit: cover;
    margin-bottom: 1rem;
  }

  .modal-actions {
    margin-top: 1.5rem;
    display: flex; justify-content: space-between;
  }

  .cancel-btn {
    background: #ccc;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 5px;
    cursor: pointer;
  }

  .cancel-btn:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }

  .confirm-btn {
    background: #d9534f;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 5px;
    cursor: pointer;
  }

  .confirm-btn:hover:not(:disabled) {
    background: #c9302c;
  }

  .confirm-btn:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
`;
