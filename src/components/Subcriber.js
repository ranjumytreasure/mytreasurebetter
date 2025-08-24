import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { API_BASE_URL } from '../utils/apiConfig';
import { useUserContext } from '../context/user_context';
import Alert from '../components/Alert';
import { useLocation } from 'react-router-dom';
import AssignGroupAmountPopup from "../components/AssignGroupAmountPopup";
import defaultUserImage from '../images/default.png'; // adjust the path as needed

import '../style/Subscriber.css'; // ✅ New CSS file

const Subscriber = ({ name, id, phone, user_image_from_s3 }) => {
    const [showAddButton, setShowAddButton] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [alert, setAlert] = useState({ show: false, msg: '', type: '' });
    const location = useLocation();
    const { user } = useUserContext();
    const { groupId } = useParams();

    useEffect(() => {
        const pattern = /\/addgroupsubscriber\//;
        if (pattern.test(location.pathname)) {
            setShowAddButton(true);
        }
    }, [location]);

    const showAlert = (show = false, type = '', msg = '') => {
        setAlert({ show, type, msg });
    };

    const postSubscriberData = async (contributionAmount, contributionPercentage) => {
        const apiUrl = `${API_BASE_URL}/groups/${groupId}/subscribers/${id}`;
        try {
            setIsLoading(true);
            const subData = {
                groupId,
                subscriberUserId: id,
                sourceSystem: 'WEB',
                referredBy: user.results.userId,
                shareAmount: contributionAmount,
                sharePercentage: contributionPercentage,
            };

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${user?.results?.token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(subData),
            });

            const result = await response.json();
            showAlert(true, response.ok ? 'success' : 'danger', result.message);
        } catch (error) {
            showAlert(true, 'danger', 'Something went wrong.');
            console.error(error);
        } finally {
            setIsLoading(false);
            setShowConfirmation(false);
        }
    };

    return (
        <>
            <div className="subscriber-card">
                <div className="subscriber-image">
                    <img
                        src={user_image_from_s3 || defaultUserImage}
                        alt={name || 'Subscriber profile'}
                    />
                </div>
                <div className="subscriber-info">
                    <h3>{name}</h3>
                    <p>{phone}</p>

                    <Link to={`/subscriber/${id}`} className="subscriber-btn">
                        View Details
                    </Link>

                    {showAddButton && (
                        <button
                            onClick={() => setShowConfirmation(true)}
                            disabled={isLoading}
                            className="subscriber-btn"
                        >
                            {isLoading ? 'Adding...' : 'Add Subscriber'}
                        </button>
                    )}

                    {alert.show && <Alert {...alert} removeAlert={showAlert} list={[]} />}

                </div>
            </div>
            {showConfirmation && (
                <AssignGroupAmountPopup
                    confirmAddSubscriber={postSubscriberData}
                    cancelAddSubscriber={() => setShowConfirmation(false)}
                />
            )}
        </>
    );
};




// const Subscriber = ({ name, id, phone, user_image_from_s3 }) => {

//     const [showAddButton, setShowAddButton] = useState(false);
//     const [showConfirmation, setShowConfirmation] = useState(false);
//     const [isLoading, setIsLoading] = useState(false);
//     const [alert, setAlert] = useState({ show: false, msg: '', type: '' });
//     const location = useLocation();
//     const { user } = useUserContext();
//     const { groupId } = useParams();

//     // Detect if the user is on the group creation path
//     useEffect(() => {
//         const pattern = /\/addgroupsubscriber\//;
//         if (pattern.test(location.pathname)) {
//             setShowAddButton(true);
//         }
//     }, [location]);

//     const showAlert = (show = false, type = '', msg = '') => {
//         setAlert({ show, type, msg });
//     };

//     // Submit subscriber data to the server
//     const postSubscriberData = async (contributionAmount, contributionPercentage) => {
//         const apiUrl = `${API_BASE_URL}/groups/${groupId}/subscribers/${id}`;

//         try {
//             setIsLoading(true);
//             const subData = {
//                 groupId: groupId,
//                 subscriberUserId: id,
//                 sourceSystem: 'WEB',
//                 referredBy: user.results.userId,
//                 shareAmount: contributionAmount,  // Include contribution amount
//                 sharePercentage: contributionPercentage,  // Include contribution percentage
//             };

//             const response = await fetch(apiUrl, {
//                 method: 'POST',
//                 headers: {
//                     'Authorization': `Bearer ${user?.results?.token}`,
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify(subData),
//             });

//             if (response.ok) {
//                 const subJsonObject = await response.json();
//                 showAlert(true, 'success', subJsonObject.message);
//             } else {
//                 const errorResponse = await response.json();
//                 showAlert(true, 'danger', errorResponse.message);
//             }
//         } catch (error) {
//             console.error('An error occurred while submitting group details:', error);
//         } finally {
//             setIsLoading(false);
//             setShowConfirmation(false);
//         }
//     };

//     // Confirm the addition of a subscriber
//     const confirmAddSubscriber = (contributionAmount, contributionPercentage) => {

//         postSubscriberData(contributionAmount, contributionPercentage);
//     };


//     // Cancel the addition of a subscriber
//     const cancelAddSubscriber = () => {
//         setShowConfirmation(false);
//     };






//     return (
//         <Wrapper>
//             <div className="img-container">
//                 {isLoading ? (
//                     <p>Loading image...</p> // Display loading message while image is being fetched
//                 ) : (
//                     <img src={user_image_from_s3 || 'https://i.imgur.com/ndu6pfe.png'} alt={name || "Default profile image"} />

//                 )}
//             </div>
//             <div className="cocktail-footer">
//                 <h3>{name}</h3>
//                 <h4>{phone}</h4>
//                 <Link to={`/subscriber/${id}`} className="btn btn-primary btn-details" style={{ marginTop: "12px", width: "100%", textAlign: "center", fontSize: "14px", height: "36px" }}>
//                     Details
//                 </Link>
//                 {showAddButton && (
//                     <button
//                         onClick={() => setShowConfirmation(true)}
//                         disabled={isLoading}
//                         className="btn btn-primary btn-details"
//                         style={{ marginTop: "12px", width: "100%", textAlign: "center", fontSize: "14px", height: "36px" }}
//                     >
//                         {isLoading ? 'Adding...' : 'Add Subscriber'}
//                     </button>
//                 )}
//                 {alert.show && <Alert {...alert} removeAlert={showAlert} list={[]} />}

//                 {/* Assign group amount popup */}
//                 {showConfirmation && (
//                     <AssignGroupAmountPopup
//                         confirmAddSubscriber={confirmAddSubscriber}
//                         cancelAddSubscriber={cancelAddSubscriber}
//                     />
//                 )}
//             </div>
//         </Wrapper>
//     );
// };

// Styled components for Subscriber component layout
// const Wrapper = styled.section`
//     margin-bottom: 2rem;
//     box-shadow: 2px 5px 3px 0px rgba(0, 0, 0, 0.5);
//     transition: all 0.3s linear;
//     display: grid;
//     grid-template-rows: auto 1fr;
//     border-radius: 0.25rem;

//     &:hover {
//         box-shadow: 4px 10px 5px 0px rgba(0, 0, 0, 0.5);
//     }

//     img {
//         width: 100%;
//         height: auto;
//         object-fit: cover;
//         border-top-left-radius: 0.25rem;
//         border-top-right-radius: 0.25rem;
//     }

//     .cocktail-footer {
//         padding: 1.5rem;
//     }

//     .cocktail-footer h3,
//     .cocktail-footer h4 {
//         margin-bottom: 0.3rem;
//     }

//     .cocktail-footer h3 {
//         font-size: 2rem;
//     }

//     .cocktail-footer h4 {
//         color: var(--darkGrey);
//         margin-bottom: 0.5rem;
//     }

//     .img-container {
//     width: 70px;
//     height: 70px;
//     border-radius: 50%; /* Makes the container circular */
//     overflow: hidden; /* Ensures the image doesn't overflow the circular boundary */
//     display: flex;
//     justify-content: center;
//     align-items: center;
//     background: #f0f0f0; /* Optional: adds a background color for images that don't load */
// }

// .img-container img {
//     width: 100%;
//     height: 100%;
//     object-fit: cover; /* Ensures the image covers the container while maintaining proportions */
// }
// `;

export default Subscriber;
