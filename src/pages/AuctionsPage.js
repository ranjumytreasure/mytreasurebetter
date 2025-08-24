import React, { useState, useEffect } from "react";
import { API_BASE_URL, WEBSOCKET_URL } from "../utils/apiConfig";
import styled from "styled-components";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import io from "socket.io-client";
import { useParams } from "react-router-dom";
import { useUserContext } from "../context/user_context";
import { useHistory } from "react-router-dom";
import { Winner } from "../components/Winner";
import Modal from "../components/Modal";
import { UserInfo, GroupSubscriberDetailsPopup } from "../components";
import Alert from "../components/Alert";
import backIcon from '../assets/back.png'
import { FaEdit, FaTrash } from 'react-icons/fa';
import { useGroupDetailsContext } from '../context/group_context';
import "../style/Auctions.css";
import { toast } from 'react-toastify';


const AuctionsPage = () => {

    const history = useHistory();
    const { user } = useUserContext();
    const { data } = useGroupDetailsContext();
     
const groupsAccountsDetail = data?.results?.groupsAccountsDetail;
    // const { state: groupDetailsState } = useGroupDetailsContext();
    // const { data: groupsAccountsDetail } = groupDetailsState;
    //used for showing progress
    const [isPlacingBid, setIsPlacingBid] = useState(false);


    const { groupId, nextAuctionDate } = useParams();
    const [isAuctionOpen, setIsAuctionOpen] = useState(false);
    const [bidAmount, setBidAmount] = useState("");
    const [socket, setSocket] = useState(null);
    const [auctionId, setAuctionId] = useState(null);
    const [bidList, setBidList] = useState([]); // State to store the list of bids
    const [existingOpenAuction, setExistingOpenAuction] = useState(null); // State to store existing open auction ID
    const [isSubscriberDetailsOpen, setIsSubscriberDetailsOpen] = useState(false);

    const [isexistAucModalOpen, setIsexistAucModalOpen] = useState(false);
    // For auction Modal change
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [alert, setAlert] = useState({ show: false, msg: "", type: "" });

    const [selectedSubscriberidForBid, setSelectedSubscriberIdForBid] = useState(null);
    const [selectedgrpSubscriberidForBid, setSelectedgrpSubscriberIdForBid] = useState(null);
    const [selectedSubscriberimageForBid, setSelectedSubscriberImageForBid] = useState(null);
    const [selectedSubscribername, setSelectedSubscribername] = useState(null);
    const [selectedSubscriberphone, setSelectedSubscriberphone] = useState(null);




    // if its fixed take auction amount and put in text box
    useEffect(() => {
        if (groupsAccountsDetail?.results?.type === 'FIXED') {
            const pendingAuctions = groupsAccountsDetail.results.groupAccountResult
                ?.filter(item => item.auctionStatus === 'pending')
                .sort((a, b) => a.sno - b.sno);

            if (pendingAuctions && pendingAuctions.length > 0) {
                const firstAuctionAmount = pendingAuctions[0]?.auctionAmount;
                setBidAmount(firstAuctionAmount?.toString() || '');
            }
        }
    }, [groupsAccountsDetail]);


    const [auctDate, setAuctDate] = useState(() => {
        // Extract the value of nextAuctionDate from the URL path
        const match = window.location.pathname.match(/\/date\/nextAuctionDate=(\d{4}-\d{2}-\d{2})/);

        // If a match is found, extract the date
        if (match) {
            const nextAuctionDateParam = match[1];
            return nextAuctionDateParam;
        }
    });


    const [auctionType, setAuctionType] = useState(""); // State for auctionType
    const handleOpenModal = () => {
        setIsModalOpen(true);
    };
    const showAlert = (show = false, type = "", msg = "") => {
        setAlert({ show, type, msg });
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);

    };


    // Below two fucntion for modals  for existing auction 
    const handleOpenExistingAuctModal = () => {
        setIsexistAucModalOpen(true);
    };

    const handleCloseExistingAuctModal = () => {
        setIsexistAucModalOpen(false);
    };
    //
    const handleOpenAuction = () => {
        console.log("Auction Open Clicked");
        if (!auctionType) {
            toast.error("Please select an auction type before proceeding.");
            return;
        }
        socket.emit("joinGroup", groupId);

        // Use auctDate and auctionType from state
        socket.emit("openAuction", {
            groupId: groupId,
            userId: user.results.userId,
            sourceSystem: "WEB",
            auctDate: auctDate,
            auctionType: auctionType,
        });

        setIsModalOpen(false); // Close the modal
    };

    // end of modal change

    useEffect(() => {
        // Initialize the WebSocket connection when the component mounts
        const socket = io(WEBSOCKET_URL);
        setSocket(socket);

        // Listen for 'openAuction' event from the server
        socket.on("openAuction", (data) => {
            // You can use the 'auctionId' to join the auction
            console.log(data);
            console.log("Received auction ID:", data.groupAccountId);
            setAuctionId(data.groupAccountId);
            socket.emit("joinAuction", data.groupAccountId);
            setIsAuctionOpen(true);
            // Perform any logic to join the auction using the 'auctionId'
            // Example: socket.emit('joinAuction', auctionId);
        });
        socket.on("openAuctionError", (errorData) => {

            const errorMsg = errorData?.message?.trim() || "openAuctionError.";
            toast.error(errorMsg);
            // Handle the closing of the auction here
            console.log("Open auction  error:", errorData.message);

            // Perform any client-side actions related to the closed auction
        });

        socket.on("newBid", (data) => {
            // Handle the closing of the auction here
            console.log("new bid", data);
            // Add the new bid to the bidList state
            setBidList((prevBidList) => [...prevBidList, data.auctionObject]);
            console.log("new bid", data);
            toast.success("New bid placed!");
            //To clear text box
            setBidAmount("");
            setIsPlacingBid(false);
            // Perform any client-side actions related to the closed auction
        });

        // Listen for 'closeAuction' event from the server
        socket.on("closeAuction", (winningSub) => {
            // Handle the closing of the auction here
            console.log(winningSub);
            console.log(winningSub.auctionroomIdentifier);
            socket.emit("leaveAuction", winningSub.auctionroomIdentifier);
            setIsAuctionOpen(false);
            // Clear the bidList by setting it to an empty array
            setBidList([]);
            // Perform any client-side actions related to the closed auction
        });
        socket.on("closeGroup", (winningSub) => {
            // Handle the closing of the auction here
            console.log(winningSub);
            socket.emit("leaveGroup", winningSub.winnerObject.groupRoomIdentifier);
            // history.push(`/groups/${winningSub.winnerObject.groupId}/auctions/winner/${winningSub.winnerObject.reserveAmount}/winner`);
            history.push(`/groups/${winningSub.winnerObject.groupId}/auctions/winner/${winningSub.winnerObject.winnerAmount}/winner`, {
                winningSub: winningSub
            });
            // setIsAuctionOpen(false);
            // Clear the bidList by setting it to an empty array
            //setBidList([]);
            // Perform any client-side actions related to the closed auction
        });
        socket.on("closeAuctionError", (errorData) => {
            // Handle the closing of the auction here
            console.log("Auction close error:", errorData.message);
            setIsAuctionOpen(false);
            setExistingOpenAuction(null);
            // Perform any client-side actions related to the closed auction
        });

        socket.on("bidError", (errorData) => {
            // Handle the closing of the auction here
            const errorMsg = errorData?.message?.trim() || "bidError.";
            toast.error(errorMsg);


            //showAlert(true, "danger", errorData.message);
            console.log("PlaceBidError:", errorData);

            // Perform any client-side actions related to the closed auction
        });
        socket.on("existsAuction", (existsAuctionId) => {
            // Handle the closing of the auction here
            console.log("Existing open auction ID:", existsAuctionId);
            // Set the existing open auction ID in the state
            setExistingOpenAuction(existsAuctionId);
            setAuctionId(existsAuctionId);
            setIsAuctionOpen(false);
            // Open the new modal when existsAuction is triggered
            setIsexistAucModalOpen(true);
            // Perform any client-side actions related to the closed auction
        });

        // Listen for 'existingBids' event from the server
        socket.on("existingBids", (existingBids) => {
            // Update the bidList state with the existing bid data
            // Update bidList with existing bids using the spread operator
            setBidList((prevBidList) => [...prevBidList, ...existingBids]);
            setIsAuctionOpen(true);
        });

        // Cleanup the socket when the component unmounts
        return () => {
            if (socket) {
                socket.disconnect();
            }
        };
    }, []);

    const handleCloseExistingAuction = () => {
        // Perform the logic to close the existing open auction
        console.log("Close existing open auction:", existingOpenAuction);

        // You can emit a socket event to the server to close the auction if needed
        socket.emit("closeAuction", {
            groupId: groupId,
            userId: user.results.userId,
            sourceSystem: "web",
            groupCollectedBy: groupId,
            groupAccountId: existingOpenAuction,
        });



        // Clear the existing open auction from state
        setExistingOpenAuction(null);
    };

    const handleResumeExistingAuction = () => {
        // Perform the logic resume the auction
        socket.emit("getPrevBids", existingOpenAuction);

        socket.emit("joinGroup", groupId);
        socket.emit("joinAuction", existingOpenAuction);

        console.log("start existingOpenAuction");
        console.log(existingOpenAuction);

        console.log("end existingOpenAuction");
        setIsAuctionOpen(true);
        setIsModalOpen(false);
        setIsexistAucModalOpen(false);


    };

    const toggleAuction = () => {

        if (isAuctionOpen) {


            setSelectedSubscriberIdForBid(null);
            setSelectedgrpSubscriberIdForBid(null);
            setSelectedSubscribername(null);
            setSelectedSubscriberphone(null);

            // Perform database operations for closing the auction
            console.log(auctionId);
            socket.emit("joinAuction", auctionId);
            socket.emit("closeAuction", {
                groupId: groupId,
                userId: user.results.userId,
                sourceSystem: "WEB",
                groupCollectedBy: groupId,
                groupAccountId: auctionId,
            });
        } else if (!isAuctionOpen) {
            console.log("came from open auction");
            setIsModalOpen(true); // Open the modal for user input

        }
    };

    const openSubscriberDetails = () => {
        setIsSubscriberDetailsOpen(true);
    };

    const closeRightside = () => {
        setIsSubscriberDetailsOpen(false);
    }

    const closeSubscriberDetails = (grpSubscriberId, subscriberImage, name, phone, id) => {

        if (grpSubscriberId) {
            setSelectedSubscriberIdForBid(id !== undefined ? id : null);
            setSelectedgrpSubscriberIdForBid(grpSubscriberId !== undefined ? grpSubscriberId : null);
            setSelectedSubscriberImageForBid(subscriberImage !== undefined ? subscriberImage : null);
            setSelectedSubscribername(name !== undefined ? name : null);
            setSelectedSubscriberphone(phone !== undefined ? phone : null);
        }



        setIsSubscriberDetailsOpen(false);



    };

    const handlePlaceBid = (e) => {


        // if (!selectedgrpSubscriberidForBid) {
        //     toast.error("Please choose subricriber.");
        //     openSubscriberDetails();
        //     return;
        // }

        if (isPlacingBid) return;

        if (!bidAmount) {
            toast.error("Please enter the amount.");
            return;
        }


        if (selectedgrpSubscriberidForBid) {
            console.log("Placing bid with amount:", bidAmount);

            console.log("from auctions", selectedgrpSubscriberidForBid);

            // Open the popup with subscriber details
            setIsPlacingBid(true); // block UI

            // Use selectedBidId as grpUserId
            socket.emit("placeBid", {
                groupId: groupId,
                subscriberId: selectedSubscriberidForBid,
                grpSubscriberId: selectedgrpSubscriberidForBid,
                grpUserId: user.results.userId, // Use selectedBidId as grpUserId
                sourceSystem: "Mani",
                auctDate: "2023-12-20",
                amount: bidAmount,
                groupAccountId: auctionId,
            });

            // You can send the bid to the server or perform any other actions as needed.
        } else {
            // Update state to show an alert when selectedBidId is not available
            toast.error("Please choose subricriber.");
            openSubscriberDetails();
            // You can show an alert or perform other error handling actions.
        }
    };
    const handleBackButtonClick = () => {
        socket.emit("leaveGroup", groupId);
        history.push(`/groups/${groupId}`);
    };
    const closeSubscriberList = () => {
        // Reset the values and close the div
        setSelectedgrpSubscriberIdForBid(null);
        setSelectedSubscriberImageForBid(null);
        setSelectedSubscribername(null);
        setSelectedSubscriberphone(null);
        setSelectedSubscriberIdForBid(null);


        // You may also want to reset other state values here

        // Additional logic if needed...
    };






    return (
        <div className="auctions-container">
            <ToastContainer position="top-center" autoClose={3000} hideProgressBar />

            <div className="auction-header">
                <button onClick={handleBackButtonClick} className="back-button">
                    Back
                </button>
                <h1 className="auction-title">Auctions Page</h1>
            </div>
            {isModalOpen && (
                <Modal isOpen={handleOpenModal} onClose={handleCloseModal}>
                    <div className="modal-body">

                        <h2 className="modal-title">Auction Details</h2>
                        <div className="form-group">
                            <label>Auction Date:</label>
                            <input
                                type="date"
                                value={auctDate}
                                onChange={(e) => setAuctDate(e.target.value)}
                            />
                        </div>

                        <div className="form-group">
                            <label>Auction Type:</label>
                            <div className="radio-vertical">
                                <label>
                                    <input
                                        type="radio"
                                        name="auctionType"
                                        value="NORMALAUCTION"
                                        checked={auctionType === 'NORMALAUCTION'}
                                        onChange={() => setAuctionType('NORMALAUCTION')}
                                    />{' '}
                                    Normal Auction
                                </label>
                                <label>
                                    <input
                                        type="radio"
                                        name="auctionType"
                                        value="PROFITAUCTION"
                                        checked={auctionType === 'PROFITAUCTION'}
                                        onChange={() => setAuctionType('PROFITAUCTION')}
                                    />{' '}
                                    Profit Auction
                                </label>
                                <label>
                                    <input
                                        type="radio"
                                        name="auctionType"
                                        value="COMPANYCHIT"
                                        checked={auctionType === 'COMPANYCHIT'}
                                        onChange={() => setAuctionType('COMPANYCHIT')}
                                    />{' '}
                                    Company Chit
                                </label>
                            </div>
                        </div>

                        <div className="modal-actions">
                            <button className="modal-button" onClick={handleOpenAuction}>
                                Open Auction
                            </button>
                            <button
                                className="cancel-button"
                                onClick={() => setIsModalOpen(false)}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </Modal>
            )}

            {isAuctionOpen ?
                (
                    <div className="form-control">
                        {selectedgrpSubscriberidForBid && (
                            <div className="bidder-card">
                                <img
                                    src={selectedSubscriberimageForBid || 'default-image.jpg'}
                                    alt={selectedSubscribername}
                                    className="bidder-image"
                                />
                                <div className="bidder-details">
                                    <p className="bidder-name">{selectedSubscribername}</p>
                                    <div className="bidder-actions">
                                        <button onClick={openSubscriberDetails} className="bidder-btn">Subscribers List</button>
                                        <button onClick={closeSubscriberList} className="bidder-close">✕</button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {isPlacingBid && (
                            <div className="progress-bar">
                                <div className="progress-indicator" />
                            </div>
                        )}
                        <div className="form-group">
                            <input
                                type="text"
                                placeholder="Enter bid amount"
                                value={bidAmount}
                                onChange={(e) => setBidAmount(e.target.value)}
                                className="large-input"
                                disabled={isPlacingBid}
                            />
                            <button onClick={handlePlaceBid} className="submit-btn"
                                disabled={isPlacingBid}
                            >
                                {isPlacingBid ? "Placing Bid..." : "Place Bid"}
                            </button>
                            <button onClick={toggleAuction} className="submit-btn">
                                Close Auction
                            </button>
                        </div>
                    </div>
                ) :
                (<div className="auction-actions-row">
                    <FaEdit className="auction-icon" />
                    <button onClick={toggleAuction} className="open-auction-button">
                        Open Auction
                    </button>
                </div>
                )
            }
            {isexistAucModalOpen && (
                <Modal isOpen={handleOpenExistingAuctModal} onClose={handleCloseExistingAuctModal}>
                    <div className="modal-body">
                        <h2 className="modal-title">Resume or Close Existing Auction</h2>
                        <p>Existing open auction ID: <strong>{existingOpenAuction}</strong></p>
                        <div className="modal-actions">
                            <button className="cancel-button" onClick={handleCloseExistingAuction}>Close Auction</button>
                            <button className="pay-button" onClick={handleResumeExistingAuction}>Resume Auction</button>
                        </div>
                    </div>
                </Modal>

            )}

            {/* Render the SubscriberDetailsPopup when isSubscriberDetailsOpen is true */}
            {isSubscriberDetailsOpen && (
                <GroupSubscriberDetailsPopup onClose={closeSubscriberDetails}
                    onCloseRightSide={closeRightside}

                />
            )}

            {/* Display the list of bids */}
            {bidList && bidList.length > 0 ? (
                <div className="subcriber-container">
                    <h3>Bid List</h3>
                    <div className="subscriber-list">
                        {bidList
                            .slice()
                            .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                            .map((item, index) => {
                                const {
                                    firstname,
                                    name,
                                    phone,
                                    user_image,
                                    user_image_from_s3,
                                    amount,
                                    created_at,
                                } = item;

                                const createdAtDate = new Date(created_at);

                                const formattedTime = createdAtDate.toLocaleTimeString([], {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    second: '2-digit',
                                });

                                return (
                                    <article className="bidsubscriber-item" key={index}>
                                        <img
                                            src={user_image_from_s3 || 'default-image.jpg'}
                                            alt={name || firstname || "Bidder"}
                                            onError={(e) => (e.target.src = "default-image.jpg")}
                                            className="bid-avatar"
                                        />

                                        <p className="bid-name">{name || firstname}</p>
                                        <p className="bid-time">{formattedTime}</p>
                                        <p className="bid-amount">₹ {amount}</p>
                                    </article>

                                );
                            })}
                    </div>
                </div>
            ) : (
                <div className="no-bids-message">No Bids so far</div>
            )}

        </div>

        // <Wrapper className="section-center">
        //     <section className="container" style={{ position: "relative" }}>
        //         {isModalOpen && (
        //             <Modal isOpen={handleOpenModal} onClose={handleCloseModal}>
        //                 <h3 className="popup-header-text">Open Auction</h3>
        //                 <div style={{ marginTop: "20px" }}>
        //                     Auction Date :
        //                     <input type="date" value={auctDate} onChange={(e) => setAuctDate(e.target.value)} style={{ margin: "0 16px" }} />
        //                 </div>
        //                 <div style={{ marginTop: "10px" }}>
        //                     Auction Type :
        //                     <input type="radio" name="auctionType" value="Normal Auction" checked={auctionType === "NORMALAUCTION"} onChange={() => setAuctionType("NORMALAUCTION")} style={{ margin: "0 4px 0 16px" }} />
        //                     Normal Auction
        //                     <input type="radio" name="auctionType" value="Profit Auction" checked={auctionType === "PROFITAUCTION"} onChange={() => setAuctionType("PROFITAUCTION")} style={{ margin: "0 4px 0 16px" }} />
        //                     Profit Auction

        //                     <input type="radio" name="companyChit" value="Company Chit" checked={auctionType === "COMPANYCHIT"} onChange={() => setAuctionType("COMPANYCHIT")} style={{ margin: "0 4px 0 16px" }} />
        //                     Company Chit
        //                 </div>
        //                 <div>
        //                     <button className="successBtn" onClick={handleOpenAuction}>
        //                         Open Auction
        //                     </button>
        //                     <button className="cancelBtn" onClick={() => setIsModalOpen(false)}>
        //                         Cancel
        //                     </button>
        //                 </div>
        //             </Modal>
        //         )}
        //         <span style={{ position: "absolute", left: "20px", top: "18px", background: "transparent", borderRadius: "50%", padding: "5px", boxShadow: "0px 0px 5px rgba(0, 0, 0, 0.5)", zIndex: 1 }}>
        //             <button className="" style={{ display: "flex", background: "transparent", border: "unset" }} onClick={handleBackButtonClick}>
        //                 <img style={{ width: "16px", marginRight: "8px" }} src={backIcon} alt="Back" />
        //             </button>
        //         </span>
        //         <h3 style={{ marginTop: "12px" }}>Auctions Page</h3>
        //         {alert.show && <Alert {...alert} removeAlert={showAlert} list={list} />}
        //         {isAuctionOpen ? (
        //             <div className="form-control">

        //                 {selectedgrpSubscriberidForBid &&
        //                     (
        //                         <div className="subscriber-details">
        //                             {selectedSubscriberimageForBid ? (
        //                                 <img src={selectedSubscriberimageForBid} alt={selectedSubscribername}
        //                                     style={{ width: '50px', height: '50px' }} />
        //                             ) : (
        //                                 <img src="default-image.jpg" alt={selectedSubscribername} style={{ width: '50px', height: '50px' }} />
        //                             )}
        //                             <p>{selectedSubscribername}</p>
        //                             <button onClick={openSubscriberDetails} type="submit" className="btn">
        //                                 Subscribers List
        //                             </button>
        //                             <button onClick={closeSubscriberList} className="close-btnlist">
        //                                 X
        //                             </button>
        //                         </div>
        //                     )}
        //                 <div className="row">
        //                     <input type="text" className="subcriber" placeholder="Enter bid amount" value={bidAmount} onChange={(e) => setBidAmount(e.target.value)} />
        //                     <button onClick={handlePlaceBid} type="submit" className="submit-btn">
        //                         Place Bid
        //                     </button>
        //                     <button onClick={toggleAuction} type="submit" className="close-btn">
        //                         Close Auction
        //                     </button>
        //                 </div>
        //             </div>

        //         ) : (
        //             <button onClick={toggleAuction} type="submit" style={{ width: "180px" }} className="buttonStyleGreen">
        //                 Open Auction
        //             </button>
        //         )}

        //         {/* Display the existing open auction if available */}
        //         {isexistAucModalOpen && (
        //             <Modal isOpen={handleOpenExistingAuctModal} onClose={handleCloseExistingAuctModal}>
        //                 <div>
        //                     <p>Existing open auction ID: {existingOpenAuction}</p>
        //                     {/* Add a close button to close the existing open auction */}
        //                     <button className="cancelBtn"
        //                         onClick={handleCloseExistingAuction}>Close Auction</button>
        //                     <button className="successBtn" onClick={handleResumeExistingAuction}>Resume Auction</button>
        //                 </div>
        //             </Modal>
        //         )}
        //         {/* Render the SubscriberDetailsPopup when isSubscriberDetailsOpen is true */}
        //         {isSubscriberDetailsOpen && (
        //             <GroupSubscriberDetailsPopup onClose={closeSubscriberDetails}
        //                 onCloseRightSide={closeRightside}

        //             />
        //         )}

        //         {/* Display the list of bids */}
        //         {bidList && bidList.length > 0 ? (


        //             <div>
        //                 <div className="subcriber-container" >
        //                     <h3>Bid List</h3>
        //                     <div className="subscriber-list">
        //                         {bidList
        //                             .slice()
        //                             .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        //                             .map((item, index) => {
        //                                 console.log('Bid List');
        //                                 console.log(item);
        //                                 const { firstname, name, phone, user_image, user_image_from_s3, amount, created_at } = item;

        //                                 // Convert created_at to a Date object
        //                                 const createdAtDate = new Date(created_at);

        //                                 // Format time in HH:mm:ss format
        //                                 const formattedTime = createdAtDate.toLocaleTimeString([], {
        //                                     hour: '2-digit',
        //                                     minute: '2-digit',
        //                                     second: '2-digit',
        //                                 });

        //                                 return (
        //                                     <article className="bidsubscriber-item" key={index}>
        //                                         <img
        //                                             src={user_image_from_s3}
        //                                             alt={user_image ? name : "Default profile image"}
        //                                             onError={(e) => (e.target.src = "default-image.jpg")}
        //                                         />

        //                                         <p className="title">{formattedTime}</p>
        //                                         <p className="title">{name || firstname}</p>
        //                                         <p className="title">{amount}</p>
        //                                     </article>
        //                                 );
        //                             })}
        //                     </div>

        //                 </div>
        //             </div>
        //         ) : (
        //             <div></div>
        //         )}
        //     </section>
        // </Wrapper>
    );
};

export default AuctionsPage;
