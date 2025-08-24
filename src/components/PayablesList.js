import React, { useState, useEffect, useRef } from 'react';
import { API_BASE_URL } from '../utils/apiConfig';
import { MdOutlineAttachMoney, MdLocationOn, MdLink, MdDataObject, MdTimeline, MdTimeToLeave } from "react-icons/md";
import Modal from "./Modal";
import { useUserContext } from "../context/user_context";
import Alert from '../components/Alert';
import loadingImage from '../images/preloader.gif';


const PayablesList = ({ payables, region, onFilteredCount, refreshPayables }) => {


 const [list, setList] = useState([]);
    const [paymentSuccess, setPaymentSuccess] = useState(false);    
    const [isPaymentSuccess, setIsPaymentSuccess] = useState(false);
    const [alert, setAlert] = useState({ show: false, msg: "", type: "" });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedSubscriber, setSelectedSubscriber] = useState(null);
    const { isLoggedIn, user } = useUserContext();
    
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchText, setSearchText] = useState('');
    const [searchLocation, setSearchLocation] = useState('');
    const [filteredPeople, setFilteredPeople] = useState([]);

    const [paymentType, setPaymentType] = useState(""); // State to track payment type (partial or full)
    const [partialAmount, setPartialAmount] = useState(""); // State to store partial payment amount
    const [paymentMethod, setPaymentMethod] = useState("");

    



    useEffect(() => {
        const filterPeople = () => {
            // Filter the people list based on selected aob
            const filteredByLocation = searchLocation
                ? payables.filter(person =>
                    person.aob && person.aob.toLowerCase() === searchLocation.toLowerCase()
                )
                : payables;

            // Filter the people list based on search text and 'name' field
            const filteredByName = filteredByLocation.filter(person =>
                person.name && person.name.toLowerCase().includes(searchText.toLowerCase()));

            // Update the filteredPeople state with the filtered result
            setFilteredPeople(filteredByName);
            onFilteredCount(filteredByName.length);
        };

        filterPeople();
    }, [payables, searchText, searchLocation]);

       const handlePartialPayment = () => {
        setPaymentType("partial");
    };

    const handleFullPayment = () => {
        setPaymentType("full");
    };

    const handlePartialAmountChange = (e) => {
        setPartialAmount(e.target.value);
    };
    const showAlert = (show = false, type = "", msg = "") => {
        setAlert({ show, type, msg });
    };


    const handleSearchChange = (e) => {
        setSearchText(e.target.value);
    };
    const handleLocationChange = (e) => {
        setSearchLocation(e.target.value);
    };
    const handleCloseModal = () => {
        setIsModalOpen(false);
        // Reset any necessary state variables
        setSelectedSubscriber(null);
    };

    const handlePayButtonClick = (subscriber, e) => {
        setSelectedSubscriber(subscriber);
        setIsModalOpen(true);

    };
    const handlePaymentMethodChange = (e) => {
        setPaymentMethod(e.target.value);
    };

    const handlePayment = async () => {

        if (!paymentMethod) {
            showAlert(true, "danger", "Please select a payment method.");
            return;
        }

        if (!paymentType) {
            showAlert(true, "danger", "Please select a payment type.");
            return;
        }
        if (paymentType === "partial" && partialAmount === "") {
            showAlert(true, "danger", "Please enter the partial amount.");
            return;
        }
        // Prompt user for confirmation before payment
        const isConfirmed = window.confirm("Are you sure you want to proceed with the payment?");
        if (!isConfirmed) {
            return; // User cancelled payment
        }

        let eresponseData = null;


        // Implement your payment logic here based on the selected paymentMethod
        if (paymentMethod === "Online") {
            // Process online payment
            console.log(`Online payment for ${selectedSubscriber.username} with ID ${selectedSubscriber.subscriber_id} is processed.`);

            const updatedOnlinePayementData = {
                payableReceivalbeId: selectedSubscriber.id,
                paymentMethod: paymentMethod,
                paymentStatus: "SUCCESS",
                paymentType: paymentType,
                paymentTransactionRef: "FUTURE",
                payableCode: "001",
                paymentAmount: paymentType === 'full' ? selectedSubscriber.pbdue
                    > 0 ? selectedSubscriber.pbdue : selectedSubscriber.pytotal
                    : partialAmount,
                subscriberId: selectedSubscriber.subscriber_id,
                grpSubscriberId: selectedSubscriber.group_subscriber_id,
                sourceSystem: "WEB",
                type: 1, // for payables
                groupId: selectedSubscriber.group_id,
                grpAccountId: selectedSubscriber.group_account_id
            };
            console.log("check form data");
            console.log(updatedOnlinePayementData);

            const apiUrl = `${API_BASE_URL}/payments-receipts`;
            try {
                const response = await fetch(apiUrl, {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${user?.results?.token}`, // Include the Bearer token
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(updatedOnlinePayementData),
                });
                console.log(response);

                if (response.ok) {
                    const responseData = await response.json();
                    console.log(responseData);
                    showAlert(true, "success", responseData.message);
                    setIsPaymentSuccess(true); // Set the state to true
                    setPaymentSuccess(true);
                    setTimeout(() => {
                        refreshPayables();
                    }, 2000);
                } else {
                    eresponseData = await response.json();
                    console.log(eresponseData);

                    showAlert(true, "danger", eresponseData.message);
                }
            } catch (error) {
                // Handle network or fetch error, update the message state
                showAlert(true, "danger", eresponseData.message);
            } finally {
                setLoading(false); // Hide loading bar when data fetching is complete
            }
        } else if (paymentMethod === "Cash") {
            // Process online payment
            console.log(`Online payment for ${selectedSubscriber.username} with ID ${selectedSubscriber.subscriber_id} is processed.`);

            const updatedOnlinePayementData = {

                payableReceivalbeId: selectedSubscriber.id,
                paymentMethod: paymentMethod,
                paymentStatus: "SUCCESS",
                paymentType: paymentType,
                paymentTransactionRef: "FUTURE",
                payableCode: "001",
                paymentAmount: paymentType === 'full' ? selectedSubscriber.pbdue
                    > 0 ? selectedSubscriber.pbdue : selectedSubscriber.pytotal
                    : partialAmount,
                subscriberId: selectedSubscriber.subscriber_id,
                grpSubscriberId: selectedSubscriber.group_subscriber_id,
                sourceSystem: "WEB",
                type: 1,// for payables

                groupId: selectedSubscriber.group_id,
                grpAccountId: selectedSubscriber.group_account_id
            };
            

            const apiUrl = `${API_BASE_URL}/payments-receipts`;
            try {
                const response = await fetch(apiUrl, {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${user?.results?.token}`, // Include the Bearer token
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(updatedOnlinePayementData),
                });
             

                if (response.ok) {
                    const responseData = await response.json();
                    console.log(responseData);
                    showAlert(true, "success", responseData.message);
                    setIsPaymentSuccess(true); // Set the state to true
                    setPaymentSuccess(true);
                    // Delay the execution of refreshPayables() for a short period
                    setTimeout(() => {
                        refreshPayables();
                    }, 2000);
                } else {
                    eresponseData = await response.json();
                    console.log(eresponseData);

                    showAlert(true, "danger", eresponseData.message);
                }
            } catch (error) {
                // Handle network or fetch error, update the message state
                showAlert(true, "danger", eresponseData.message);
            } finally {
                setLoading(false); // Hide loading bar when data fetching is complete
            }
            // Process cash payment
            console.log(`Cash payment for ${selectedSubscriber.username} with ID ${selectedSubscriber.subscriber_id} is processed.`);
        }


    };
    useEffect(() => {
        if (payables && payables.length > 0) {
            setLoading(false);
        }
    }, [payables]);

    if (loading) {
        return (
            <>
                <img src={loadingImage} className='loading-img' alt='loding' />
                <div className="placeholder" style={{ height: '50vh' }}></div>
            </>
        );
    }
    if (error) {
        return <p>Error: {error}</p>;
    }

    return (
        <>
            <select
                id="location"
                onChange={handleLocationChange}
                value={searchLocation}
                style={{
                    height: '40px', // Adjust the height value as needed
                    padding: '0.25rem',
                    paddingLeft: '1rem',
                    background: 'var(--clr-grey-10)',
                    borderTopLeftRadius: 'var(--radius)',
                    borderBottomLeftRadius: 'var(--radius)',
                    borderTopRightRadius: 'var(--radius)',
                    borderBottomRightRadius: 'var(--radius)',
                    borderColor: 'transparent',
                    fontSize: '1rem',
                    flex: '1 0 auto',
                    color: 'var(--clr-grey-5)',
                    marginBottom: '1rem',
                    marginRight: "12px"
                }}
            >
                <option value="">All Regions</option>
                {region.map(region => (
                    <option key={region.id} value={region.aob}>{region.aob}</option>
                ))}
            </select>

            <input
                type="text"
                id="search"
                value={searchText}
                onChange={handleSearchChange}
                placeholder="Enter name to search"
                style={{
                    height: '40px', // Adjust the height value as needed
                    padding: '0.25rem',
                    paddingLeft: '1rem',
                    background: 'var(--clr-grey-10)',
                    borderTopLeftRadius: 'var(--radius)',
                    borderBottomLeftRadius: 'var(--radius)',
                    borderTopRightRadius: 'var(--radius)',
                    borderBottomRightRadius: 'var(--radius)',
                    borderColor: 'transparent',
                    fontSize: '1rem',
                    flex: '1 0 auto',
                    color: 'var(--clr-grey-5)',
                    marginBottom: '1rem'
                }}
            />
            {filteredPeople.map((person, index) => {

                const { name, phone, user_image_from_s3, pytotal,
                    pbpaid,
                    pbdue,
                    rbtotal,
                    rbpaid,
                    rbdue,
                    payments,
                    receipts,
                    id,
                    group_id,
                    subscriber_id,
                    group_subscriber_id,
                    group_account_id,
                    auct_date, group_name, unique_id, payment_for } = person;
                return (
                    <React.Fragment key={unique_id}>
                        <article className='receivable'>
                            {/* {signedUrls[user_image] ? (
                                <img src={signedUrls[user_image]} alt={name} style={{ alignSelf: "self-start" }} />
                            ) : (
                                <img src="default-image.jpg" alt={name} style={{ alignSelf: "self-start" }} />
                            )} */}
                            
                                <img
                                    src={user_image_from_s3 || "default-image.jpg"}
                                    alt={name}
                                    style={{ alignSelf: "self-start", width: "50px", height: "50px", borderRadius: "50%" }}
                                    onError={(e) => { e.target.src = "default-image.jpg"; }}  // Fallback in case of error
                                />

                            
                            <div className='finance'>
                                <div class="grid-item">Name :</div>
                                <div class="grid-item">{name}</div>

                                <div class="grid-item">Phone :</div>
                                <div class="grid-item">{phone}</div>

                                <div class="grid-item">Group Name :</div>
                                <div class="grid-item">{group_name}</div>

                                <div class="grid-item">Auction Dt:</div>
                                <div class="grid-item">{auct_date}</div>

                                <div class="grid-item">Payement for:</div>
                                <div class="grid-item">{payment_for}</div>

                            </div>
                            <div className='finance'>
                                <div class="grid-item">Payable Due:</div>
                                <div class="grid-item">{pytotal}</div>
                                <div class="grid-item">Payable Paid :</div>
                                <div class="grid-item">{pbpaid}</div>

                                <div class="grid-item">Payable Bal :</div>
                                <div class="grid-item">{pbdue}</div>

                                <div class="grid-item">Receivable Due:</div>
                                <div class="grid-item">{rbdue}</div>

                                <div class="grid-item"> <button onClick={(e) => handlePayButtonClick(person, e)}>Pay</button></div>

                            </div>

                        </article>
                        {index !== payables.length - 1 && <hr />} {/* Add line if it's not the last item */}
                    </React.Fragment>
                );
            })}

            <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
                {alert.show && <Alert {...alert} removeAlert={showAlert} list={list} />}
                {/* Modal content */}
                {selectedSubscriber && (
                    <>
                        <h2 style={{ marginTop: "16px" }}>Payment Confirmation</h2>
                        <div>
                            <img src={selectedSubscriber.user_image_from_s3} alt={selectedSubscriber.name} style={{ width: '50px', height: '50px', background: "#f0f0f0" }} />
                            <h3 style={{ marginBottom: "12px" }}>{selectedSubscriber.name}</h3>
                            <p>Group Name: {selectedSubscriber.group_name}</p>
                            <p>Phone: {selectedSubscriber.phone}</p>


                        </div>

                        <div className="links" style={{ paddingLeft: "8px" }}>

                            <p>
                                <MdOutlineAttachMoney  ></MdOutlineAttachMoney  > <span style={{ width: "110px" }}>Payement For</span>: {selectedSubscriber.payement_for}{" "}
                            </p>

                            <p>
                                <MdOutlineAttachMoney  ></MdOutlineAttachMoney  > <span style={{ width: "110px" }}>Payement Due</span>: {selectedSubscriber.pytotal}{" "}
                            </p>
                            <p>
                                <MdTimeline></MdTimeline> <span style={{ width: "110px" }}>Paid</span>: {selectedSubscriber.pbpaid}{" "}
                            </p>
                            <p>
                                <MdTimeToLeave></MdTimeToLeave> <span style={{ width: "110px" }}>Balance</span>: {selectedSubscriber.pbdue}{" "}
                            </p>
                            <p>
                                <MdLocationOn></MdLocationOn> <span style={{ width: "110px" }}>Balance Receivables</span>: {selectedSubscriber.rbdue || "earth"}{" "}
                            </p>

                        </div>

                        <div>
                            {/* Select payment method */}
                            <h4 style={{ marginTop: "16px", marginBottom: "4px" }}>Select Payment Method:</h4>
                            <label style={{ marginRight: "20px" }}>
                                <input type="radio" name="paymentMethod" value="Cash" checked={paymentMethod === "Cash"} style={{ marginRight: "8px" }} onChange={handlePaymentMethodChange} />
                                Cash Payment
                            </label>
                            <label style={{ marginRight: "20px" }}>
                                <input type="radio" name="paymentMethod" value="Online" checked={paymentMethod === "Online"} style={{ marginRight: "8px" }} onChange={handlePaymentMethodChange} />
                                Online Payment
                            </label>
                        </div>

                        <div>
                            <h4 style={{ marginTop: "16px", marginBottom: "4px" }}>Select Payment Type:</h4>
                            <label style={{ marginRight: "20px" }}>
                                <input type="radio" name="paymentType" value="partial" checked={paymentType === "partial"} style={{ marginRight: "8px" }} onChange={handlePartialPayment} />
                                Partial Payment
                            </label>
                            <label style={{ marginRight: "20px" }}>
                                <input type="radio" name="paymentType" value="full" checked={paymentType === "full"} style={{ marginRight: "8px" }} onChange={handleFullPayment} />
                                Full Payment
                            </label>
                            {paymentType === "partial" && (
                                <div>
                                    <label htmlFor="partialAmount">Enter Partial Amount:</label>
                                    <input type="number" id="partialAmount" value={partialAmount} onChange={handlePartialAmountChange} />
                                </div>
                            )}
                            <button className='payButton'
                            onClick={handlePayment} style={{ marginTop: "24px" }}>Submit</button>
                            <button className='payButton' onClick={handleCloseModal} style={{ marginTop: "20px" }}>Cancel</button>
                        </div>
                    </>
                )}
            </Modal>

        </>
    );
};

export default PayablesList;
