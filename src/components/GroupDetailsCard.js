import React, { useState, useEffect } from "react";
// import { SubContext } from '../context/subscribecontext';
import styled from "styled-components";
import { MdBusiness, MdLocationOn, MdLink, MdDataObject, MdTimeline, MdTimeToLeave } from "react-icons/md";
import { FontAwesomeIcon } from "react-icons/fa";
import { useHistory, useParams } from "react-router-dom";
import List from "../components/List";
import Alert from "../components/Alert";
import { API_BASE_URL } from "../utils/apiConfig";
import { useUserContext } from "../context/user_context";
import SendReminderModal from "../components/SendReminderModal"

const GroupDetailsCard = ({ groups, yourdue, customerdue, nextAuctionDate, startTime, endTime, commisionType, is_commision_taken, commision, emi, isGroupProgress, groupType, groupSubcriberResult }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { user } = useUserContext();
    const [list, setList] = useState([]);
    // const { subscriber } = React.useContext(SubContext);
    const history = useHistory();
    const { groupId } = useParams();
    const [localCommision, setLocalCommision] = useState(commision);
    const [lumsumCommissionType, setLumsumCommissionType] = useState("");
    useEffect(() => {
        // This effect will run when the 'commision' prop changes
        // It updates the 'localCommision' state with the new 'commision' value
        setLocalCommision(commision);
    }, [commision]);

    const [isLoading, setIsLoading] = useState(false);
    const [alert, setAlert] = useState({ show: false, msg: "", type: "" });
    const [auctDate, setAuctDate] = useState(() => {
        // Format nextAuctionDate to "YYYY-MM-DD" if it exists

        if (nextAuctionDate) {
            const date = new Date(nextAuctionDate);
            const formattedDate = date.toISOString().split("T")[0]; // Format as "YYYY-MM-DD"
            return formattedDate;
        } else {
            return ""; // Default to an empty string if nextAuctionDate is not available
        }
    });
    const showAlert = (show = false, type = "", msg = "") => {
        setAlert({ show, type, msg });
    };
    const clearList = () => {
        showAlert(true, "danger", "empty list");
        // setList([]);
    };
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!auctDate) {
            showAlert(true, "danger", "Please enter the auction date");
        } else if (!localCommision) {
            showAlert(true, "danger", "Please enter the commission value");
        } else {
            setIsLoading(true);

            const commissionData = {
                auctDate: auctDate,
                commision: commision,
                groupId: groupId,
                sourceSystem: "WEB",
                emi: emi,
                lumsumCommissionType: lumsumCommissionType,
                // Add other data related to the commission if needed
            };

            console.log(commissionData);
            // Construct the URL for the API endpoint
            const apiUrl = `${API_BASE_URL}/group-commision`;

            try {
                const response = await fetch(apiUrl, {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${user?.results?.token}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(commissionData),
                });
                console.log(response);
                if (response.ok) {
                    console.log("mani- inserted");
                    const commissionJsonObject = await response.json();
                    console.log(commissionJsonObject);
                    showAlert(true, "success", commissionJsonObject.message);
                    setIsLoading(false);

                    // Add any additional logic or state updates if needed

                    // Clear the input
                    setAuctDate("");
                } else {
                    const errorResponse = await response.json();
                    console.log(errorResponse);
                    showAlert(true, "danger", errorResponse.message);
                }
            } catch (error) {
                console.error("An error occurred while submitting the commission:", error);
                // Handle the error, e.g., show an error message to the user
            } finally {
                setIsLoading(false);
            }
        }
    };

    const handleGoToAuctions = () => {
        history.push(`/groups/${groupId}/auctions/date/nextAuctionDate=${nextAuctionDate}`);
    };

    const subscriber = {
        avatar_url: "https://picsum.photos/200/200",
        html_url: "@john_smilga",
        name: "John Smilga",
        company: "Creator of Coding Addict",
        blog: "Coding Addict",
        bio: "", // You didn't provide a value for bio, so I left it empty.
        location: "TamilNadu, India",
        twitter_username: "Mani", // You didn't provide a value for twitter_username, so I left it empty.
    };

    const { avatar_url, html_url, name, company, blog, bio, location, twitter_username } = subscriber;
    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };
    const handleYourDueClick = () => {
        // Redirect to the YourDuePage for the specific groupId
        history.push(`/groups/${groupId}/your-due`);
    };
    const handleCustomerDueClick = () => {
        // Redirect to the YourDuePage for the specific groupId
        history.push(`/groups/${groupId}/customer-due`);
    };
    return (
        <Wrapper>
            <header>
                <div className="groupscount">
                    <div className="circle red" style={{ color: "#fff" }}>
                        {groups[0]?.groupsCompleted} / {groups[0]?.totalTenture}
                    </div>
                    <p style={{ fontSize: "14px", marginTop: "4px", paddingLeft: "2px" }}>Groups</p>
                </div>
                <div className="duecount" onClick={handleYourDueClick}>
                    <div className="circle red" style={{ color: "#fff" }}>
                        {yourdue[0]?.pending_amount}
                    </div>
                    <p style={{ fontSize: "14px", marginTop: "4px", paddingLeft: "2px" }}>Your Due</p>
                </div>
                <div className="duecount" onClick={handleCustomerDueClick}>
                    <div className="circle red" style={{ color: "#fff" }}>
                        {customerdue[0]?.pending_amount}
                    </div>
                    <p style={{ fontSize: "14px", marginTop: "4px", paddingLeft: "4px" }}>Customer Due</p>
                </div>
                {/* <div className='more'>
          <div className="circle red" style={{color:"#fff"}}>

          </div>
          <p>More</p>
        </div> */}
            </header>

            <div className="links" style={{ paddingLeft: "8px" }}>
                <p>
                    <MdDataObject></MdDataObject> <span style={{ width: "110px" }}>Auction Date</span>: {nextAuctionDate}{" "}
                </p>
                <p>
                    <MdTimeline></MdTimeline> <span style={{ width: "110px" }}>Start Time</span>: {startTime}{" "}
                </p>
                <p>
                    <MdTimeToLeave></MdTimeToLeave> <span style={{ width: "110px" }}>End Time</span>: {endTime}{" "}
                </p>
                <p>
                    <MdLocationOn></MdLocationOn> <span style={{ width: "110px" }}>Location</span>: {location || "earth"}{" "}
                </p>
                {/* <a href={'https://${blog}'}>
          <MdLink></MdLink>
          {blog}
        </a> */}
            </div>

            {isGroupProgress !== "CLOSED" && (
                <button className="buttonStyle" onClick={handleGoToAuctions}>
                    Go To Auction
                </button>
            )}
            {/* <SendReminderModal/> */}
            {commisionType === "LUMPSUM" ? (
                is_commision_taken ? (
                    <button className="buttonStyleGreen" disabled="true">
                        Lumpsum Commision Taken
                    </button>
                ) : (
                    <button className="buttonStyle" onClick={openModal}>
                        Take Lumpsum Commision
                    </button>
                )
            ) : null}
            {isModalOpen && (
                <Modal>
                    <ModalContent>
                        <div style={{ textAlign: "left" }}>
                            {alert.show && <Alert {...alert} removeAlert={showAlert} list={list} />}
                            <h2 className="popup-header-text">Take Lumpsum Commission</h2>
                            <div style={{ marginTop: "24px" }}>
                                Auction Date:
                                <input type="date" value={auctDate} onChange={(e) => setAuctDate(e.target.value)} style={{ margin: "0 4px 0 16px" }} />
                            </div>
                            <div style={{ marginTop: "12px" }}>
                                Commision:
                                <input type="text" value={localCommision} placeholder="Enter Commission Value" onChange={(e) => setLocalCommision(e.target.value)} style={{ margin: "0 4px 0 16px" }} />
                            </div>
                            <div style={{ marginTop: "12px" }}>
                                <label>
                                    <input type="radio" id="withDue" name="commissionType" value="withDue" onChange={() => setLumsumCommissionType("withDue")} style={{ margin: "0 4px 0 0" }} />
                                    <label htmlFor="withDue">With Due</label>
                                </label>
                                {groupType === "ACCUMULATIVE" ? (
                                    <label>
                                        <input type="radio" id="withReserve" name="commissionType" value="withReserve" onChange={() => setLumsumCommissionType("withReserve")} style={{ margin: "0 4px 0 16px" }} />
                                        <label htmlFor="withReserve">With Reserve</label>
                                    </label>
                                ) : null}
                            </div>
                            <div>
                                <button onClick={handleSubmit} className="successBtn">
                                    Submit
                                </button>
                                <button onClick={closeModal} className="cancelBtn">
                                    Close
                                </button>
                            </div>
                        </div>
                    </ModalContent>
                </Modal>
            )}
        </Wrapper>
    );
};
const Wrapper = styled.article`
    background: var(--clr-white);
    padding: 20px 12px;
    border-top-right-radius: var(--radius);
    border-bottom-left-radius: var(--radius);
    border-bottom-right-radius: var(--radius);
    position: relative;
    &::before {
        content: "Highlights";
        position: absolute;
        top: 0;
        left: 0;
        transform: translateY(-100%);
        background: var(--clr-white);
        color: var(--clr-grey-5);
        border-top-right-radius: var(--radius);
        border-top-left-radius: var(--radius);
        text-transform: capitalize;
        padding: 0.5rem 1rem 0 1rem;
        letter-spacing: var(--spacing);
        font-size: 1rem;
        font-weight:500;
    }

    header {
        display: grid;
        grid-template-columns: auto auto auto;
        align-items: center;
        justify-content: left;
        column-gap: 1rem;
        row-gap: 2px;
        margin-bottom: 2rem;

        h4 {
            margin-bottom: 0.25rem;
        }
        p {
            margin-bottom: 0;
        }
    }
    .circle {
        width: 5rem;
        height: 5rem;
        border-radius: 50%;
        background-color: #cd3240;
        // margin-right: 20px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }
    .groupscount {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }
    .duecount {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        cursor: pointer;
    }
    .more {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }

    .links {
        p,
        a {
            margin-bottom: 0.25rem;
            display: flex;
            align-items: center;
            svg {
                margin-right: 0.5rem;
                font-size: 1.3rem;
            }
        }
        a {
            color: var(--clr-primary-5);
            transition: var(--transition);
            svg {
                color: var(--clr-grey-5);
            }
            &:hover {
                color: var(--clr-primary-3);
            }
        }
    }

    gotoauction {
        display: flex;
        flex-direction: column;
        align-items: left;
    }

    .label {
        flex: 1; /* Distribute the available space equally among the labels */
        text-align: left; /* Center-align the text within each label */
    }
    
    .buttonStyle {
        border-radius: 5px;
        background-color: #cd3240;
        border: 2px solid transparent;
        color: var(--clr-white);
        width: 290px;
        padding: 8px;
        margin-top: 20px;
        margin-right:12px;
        align-items: center;
        cursor: pointer;
    }
`;
const Modal = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
`;

const ModalContent = styled.div`
    width: 100%;
    max-width: 600px;
    background: white;
    padding: 24px 28px 28px;
    border-radius: 8px;
    text-align: center;
    display: flex;
    flex-direction: column; /* Display items in a column */
    align-items: center; /* Center items horizontally */
    gap: 1rem; /* Add spacing between items */
`;

export default GroupDetailsCard;
