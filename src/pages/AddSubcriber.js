import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';
import { useUserContext } from '../context/user_context';
import List from '../components/List';
import Alert from '../components/Alert';
import { API_BASE_URL } from '../utils/apiConfig';
import AvatarGroup from '../components/AvatarGroup';
// import AvatarGenerator from '../components/AvatarGenerator';
import AvatarUploader from '../components/AvatarUploader';
import AssignGroupAmountPopup from "../components/AssignGroupAmountPopup";
import ReactFlagsSelect from "react-flags-select";
import { useGroupDetailsContext } from '../context/group_context'

// Define countries array
const countries = [
  { value: "IN", label: "India", countryCode: "+91" },
  { value: "GB", label: "United Kingdom", countryCode: "+44" },
  { value: "LK", label: "Srilanka", countryCode: "+94" },
  { value: "NP", label: "Nepal", countryCode: "+977" },
  { value: "MY", label: "Malaysia", countryCode: "+60" },
  { value: "AE", label: "United Arab Emirates", countryCode: "+971" },
  { value: "SG", label: "Singapore", countryCode: "+65" },
  { value: "PK", label: "Pakistan", countryCode: "+92" },
  { value: "NG", label: "Nigeria", countryCode: "+234" },
  { value: "GH", label: "Ghana", countryCode: "+233" },
  { value: "TT", label: "Trinidad and Tobago", countryCode: "+1-868" },
  { value: "KE", label: "Kenya", countryCode: "+254" },
  { value: "ZA", label: "South Africa", countryCode: "+27" },
];


function AddSubcriber() {

  const { user } = useUserContext();
  const { groupId } = useParams();
  const [isLoading, setIsLoading] = useState(false);

  // const [image, setImage] = useState('');
  // const [previewImage, setPreviewImage] = useState('https://github.com/OlgaKoplik/CodePen/blob/master/profile.jpg?raw=true');
  const [altText, setAltText] = useState('');


  const history = useHistory();
  const [mob, setMob] = useState('');
  const [name, setName] = useState('');
  const [list, setList] = useState([]);
  const [isEditing, setIsEditing] = useState(false);

  const [editID, setEditID] = useState(null);
  const [alert, setAlert] = useState({ show: false, msg: '', type: '' });

  const [avatars, setAvatars] = useState(null);
  const [showList, setShowList] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isSubscriberAdded, setIsSubscriberAdded] = useState(false);


  // image upload
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentImage, setCurrentImage] = useState(null || "https://i.imgur.com/ndu6pfe.png");

  //country dropdown
  const [selectedCountry, setSelectedCountry] = useState("IN");

  const handleCountryChange = (countryCode) => {
    setSelectedCountry(countryCode);

  };

  const handleSetImage = (file) => {
    setSelectedImage(file);
  };
  //  const { state } = useGroupDetailsContext();
  //  const groupSubcriberResult = state?.data?.results?.groupSubcriberResult;


  const { data } = useGroupDetailsContext();

  console.log('Manikandan');
  console.log(data);

  const groupSubcriberResult = data?.results?.groupSubcriberResult || [];

  useEffect(() => {
    console.log("Group Subscriber Result from context:", groupSubcriberResult);

    setList(groupSubcriberResult);
    setAvatars(groupSubcriberResult);
    setIsLoading(false);

  }, [groupSubcriberResult]);

  // const fetchSubscribers = async () => {

  //   try {
  //     const apiUrl = `${API_BASE_URL}/groups/${groupId}/subscribers`;

  //     const response = await fetch(apiUrl, {
  //       method: 'GET',
  //       headers: {
  //         'Authorization': `Bearer ${user?.results?.token}`,
  //         'Content-Type': 'application/json',
  //       },
  //     });

  //     if (!response.ok) {
  //       throw new Error('Failed to fetch subscribers');
  //     }

  //     const data = await response.json();

  //     setList(data?.results?.subscriberList);
  //     setAvatars(data?.results?.subscriberList);
  //     // setTotalSubscribers(data?.total);
  //     setIsLoading(false);
  //   } catch (error) {
  //     console.error(error);
  //     setIsLoading(false);
  //   }
  // };

  // useEffect(() => {
  //   const fetchSubscribers = async () => {
  //     try {
  //       const apiUrl = `${API_BASE_URL}/groups/${groupId}/subscribers`;

  //       const response = await fetch(apiUrl, {
  //         method: 'GET',
  //         headers: {
  //           'Authorization': `Bearer ${user?.results?.token}`,
  //           'Content-Type': 'application/json',
  //         },
  //       });

  //       if (!response.ok) {
  //         throw new Error('Failed to fetch subscribers');
  //       }

  //       const data = await response.json();

  //       setList(data?.results?.subscriberList);
  //       setAvatars(data?.results?.subscriberList);
  //       // setTotalSubscribers(data?.total);
  //       setIsLoading(false);

  //     } catch (error) {
  //       console.error(error);
  //       setIsLoading(false);
  //     }
  //   };

  //   fetchSubscribers();
  // }, [groupId, isLoading]);

  const selectedCountryObj = countries.find((c) => c.value === selectedCountry);
  const countryCode = selectedCountryObj?.countryCode || '';
  const country = selectedCountryObj?.label || '';

  const handleAddSubscriber = (e) => {
    e.preventDefault();

    if (!mob) {
      showAlert(true, 'danger', 'Please enter a mobile number');
    } else if (!name) {
      showAlert(true, 'danger', 'Please enter a name');
    } else {
      setShowConfirmation(true); // Show confirmation modal
    }
  };

  // Confirm the addition of a subscriber
  const confirmAddSubscriber = (contributionAmount, contributionPercentage) => {

    postSubscriberData(contributionAmount, contributionPercentage);
  };

  // Submit subscriber data to the server
  const postSubscriberData = async (contributionAmount, contributionPercentage) => {
    setIsLoading(true);
    setShowConfirmation(false); // Close the confirmation modal
    let newImageUrl = '';

    if (selectedImage) {
      newImageUrl = await handleImageUpdate();
      console.log("Image URL:", newImageUrl);

      if (!newImageUrl) {
        setIsLoading(false);
        alert("Image upload failed.");
        return;
      }
    }
    const subData = {
      phoneOrEmail: mob,
      referredBy: user.results.userId,
      name: name,
      country: country,
      countryCode: countryCode,
      sourceSystem: 'WEB',
      groupId: groupId,
      userImage: newImageUrl || '', // Placeholder for image URL
      shareAmount: contributionAmount,  // Include contribution amount
      sharePercentage: contributionPercentage,
    };

    try {
      const apiUrl = `${API_BASE_URL}/subscribers`;
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${user?.results?.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(subData),
      });

      if (response.ok) {
        const subJsonObject = await response.json();
        showAlert(true, 'success', subJsonObject.message);
        setIsSubscriberAdded(true);
        //fetchSubscribers(); // Refresh the subscriber list
      } else {
        const errorResponse = await response.json();
        showAlert(true, 'danger', errorResponse.message);
      }
    } catch (error) {
      console.error('An error occurred while adding the subscriber:', error);
      showAlert(true, 'danger', 'Failed to add the subscriber');
    } finally {
      setIsLoading(false);
    }
  };



  // const confirmAddSubscriber = async () => {

  // };
  useEffect(() => {
    if (isSubscriberAdded) {
      setMob('');
      setName('');
      setSelectedImage(null);
      setCurrentImage("https://i.imgur.com/ndu6pfe.png?" + new Date().getTime()); // Prevent caching
      setSelectedCountry("IN");
      setIsSubscriberAdded(false); // Reset flag after clearing
    }
  }, [isSubscriberAdded]);


  const showAlert = (show = false, type = '', msg = '') => {
    setAlert({ show, type, msg });
  };


  const deleteGroupSubscriber = async (id) => {

    const apiUrl = `${API_BASE_URL}/groupsubscribers/${id}`;

    try {
      const response = await fetch(apiUrl, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${user?.results?.token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {


        showAlert(true, 'success', 'item removed');
        setList(list.filter((item) => item.id !== id));

        //fetchSubscribers(); // Refresh the list of subscribers after deleting one.
      } else {
        const errorResponse = await response.json();
        showAlert(true, 'danger', errorResponse.message);
      }
    } catch (error) {
      console.error('An error occurred while deleting the group subscriber:', error);
      showAlert(true, 'danger', 'An error occurred while deleting the group subscriber');
    } finally {
      setIsLoading(false);
    }
  };


  const removeItem = (id) => {
    deleteGroupSubscriber(id);
  };
  // const editItem = (id) => {
  //   const specificItem = list.find((item) => item.id === id);
  //   setIsEditing(true);
  //   setEditID(id);
  //   setMob(specificItem.title);
  // };
  const cancelAddSubscriber = () => {
    setShowConfirmation(false); // Close modal if user cancels
  };

  // Function to toggle the showList state
  const toggleList = () => {
    setShowList(!showList);
  };
  const handleBackButtonClick = () => {
    history.push(`/addgroupsubscriber/${groupId}`); // Use backticks (`) for template literals
  };
  const handleImageUpdate = async () => {
    if (!selectedImage) {
      return null;
    }

    const formData = new FormData();
    formData.append("image", selectedImage);


    try {
      const res = await fetch(`${API_BASE_URL}/images/update`, {
        method: "PUT",
        body: formData,
      });

      const data = await res.json();

      if (res.ok && data.imageUrl) {
        console.log('Pallam');
        console.log(data.imageUrl);
        setSelectedImage(null);
        return data.imageUrl; // ✅ return the actual imageUrl
      } else {
        alert(data.message || "Failed to update image");
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred while updating image.");
    }
  };
  return (
    <Wrapper className="section-center">
      <section className="container">
        <div className="button-container">
          <button className="back-button" onClick={handleBackButtonClick}>
            &#8592; {/* Unicode character for a left arrow */}
          </button>
          {/* <button className="show-list-btn" onClick={toggleList}>
            Show List
          </button> */}
        </div>

        <form className="addsubscriber-form" onSubmit={handleAddSubscriber}>
          {alert.show && <Alert {...alert} removeAlert={showAlert} list={list} />}
          <h3>Add Subscribers</h3>
          <div>
            <label htmlFor="country-select">Select your nationality:</label>
            <ReactFlagsSelect
              id="country-select"
              selected={selectedCountry}
              onSelect={handleCountryChange}
              countries={countries.map((country) => country.value)}
              showSelectedLabel={true}
              searchable={true}
            />
          </div>
          <p>
            Selected Country: {countries.find((c) => c.value === selectedCountry)?.label} (
            {countries.find((c) => c.value === selectedCountry)?.countryCode})
          </p>
          <AvatarUploader handleSetImage={handleSetImage} currentImage={currentImage} />

          <div className="name-container">
            {/* <AvatarGenerator
              seed={name || "Default"}
              width="50"
              height="50"
              setUserImageUrl={setAvatarImage}
            /> */}
            <input
              type="text"
              className="subcriber"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>


            <input
              type="text"
              className="subcriber"
              placeholder="e.g. 9942393237"
              value={mob}
              onChange={(e) => setMob(e.target.value)}
            />
          </div>
          <div>
            <button type="submit" className="submit-btn" disabled={isLoading}>
              {isLoading ? "Adding Subscriber" : isEditing ? "Edit" : "Add"}
            </button>
          </div>
          {/* <div>
            <AvatarGroup avatars={avatars} />
          </div> */}
        </form>

        {/* {list?.length > 0 && (
          <div className="subcriber-container">

            {showList && (
              <div className="list-modal">
                <button className="close-list-btn" onClick={toggleList}>
                  X
                </button>
                <List items={list} removeItem={removeItem} />
              </div>
            )}
          </div>
        )} */}

        {/* assign group amount of subscriber Pop-up */}
        {showConfirmation && (
          <AssignGroupAmountPopup confirmAddSubscriber={confirmAddSubscriber}
            cancelAddSubscriber={cancelAddSubscriber}>
          </AssignGroupAmountPopup>
        )}
      </section>
    </Wrapper>
  );
}

const Wrapper = styled.section`
  .container{
    width: 90vw;
    height: 600px;
    margin: 0 auto;
    max-width: 35rem;
    margin-top: 2rem;
    margin-bottom: 4rem;
    background: var(--clr-white);
    border-radius: var(--radius);
    box-shadow: var(--light-shadow);
    transition: var(--transition);
    padding: 2rem;
    position:relative;
    align-items: center;
  }
  .container:hover {
      box-shadow: var(--dark-shadow);
    }
    .addsubscriber-form h3 {
      color: var(--clr-primary-1);
      margin-bottom: 1.5rem;
      text-align: center;
    }
    .addsubscriber-form {
      display: flex;
      flex-direction: column;
      padding: 20px;    
    width:500px;
    height:400px;
    align-items:center; 

    }
    .form-control {
      display: flex;
      padding: 10px;
      flex-direction: column;
      width: 400px;
      
    }
    .name-container{
      display: grid;
      align-items: center;
      grid-template-columns: auto auto ;
      margin-bottom:10px;
    }
    .subcriber {
      padding: 0.25rem;   
      padding-left: 1rem;
      background: var(--clr-grey-10);
      border-top-left-radius: var(--radius);
      border-bottom-left-radius: var(--radius);
      border-top-Right-radius: var(--radius);
      border-bottom-Right-radius: var(--radius);
      border-color: transparent;
      font-size: 1rem;
      flex: 1 0 auto;
      margin-bottom:10px;
      color: var(--clr-grey-5);
    }
    .subcriber::placeholder {
      font-family: var(--ff-secondary);
      color: var(--clr-grey-5);
    }
    .submit-btn {
      bottom: 20px; /* Adjust as needed */
      right: 20px; /* Adjust as needed */
      padding: 0.5rem 1rem;
      background: var(--clr-red-dark); /* Use your application's primary color */
      border: none;
      color: var(--clr-white); /* Use an appropriate text color for readability */
      border-radius: var(--radius);
      cursor: pointer;
      transition: background 0.2s;
      width: 200px;
      margin-top:2px;
    }
    
    .submit-btn:hover {
      background: var(--clr-primary-5);
      color: var(--clr-white);
    }
    
    .subcriber-container {
      
      margin-top: o.5rem;
    }
    .subcriber-item {
      margin-top:12px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 0.5rem;
      transition: var(--transition);
      padding: 0.25rem 1rem;
      border-radius: var(--radius);
      text-transform: capitalize;
      img {
        height: 100%;
        width: 45px;
        border-radius: 50%;
        object-fit: cover;
      }
    }
    
    .subcriber-item:hover {
      color: var(--clr-grey-5);
      background: var(--clr-grey-10);
    }
    
    .subcriber-item:hover .title {
      color: var(--clr-grey-5);
    }
    .title {
      margin-bottom: 0;
      color: var(--clr-grey-1);
      letter-spacing: 2px;
      transition: var(--transition);
    }
    
    .edit-btn,
    .delete-btn {
      background: transparent;
      border-color: transparent;
      cursor: pointer;
      font-size: 0.7rem;
      margin: 0 0.15rem;
      transition: var(--transition);
    }
    
    .edit-btn {
      color: var(--clr-green-light);
    }
    
    .edit-btn:hover {
      color: var(--clr-green-dark);
    }
    
    .delete-btn {
      color: var(--clr-red-light);
    }
    
    .delete-btn:hover {
      color: var(--clr-red-dark);
    }
    
    .clear-btn {
      text-transform: capitalize;
      width: 10rem;
      height: 1.5rem;
      display: grid;
      align-items: center;
      background: transparent;
      border-color: transparent;
      color: var(--clr-red-light);
      margin: 0 auto;
      font-size: 0.85rem;
      letter-spacing: var(--spacing);
      cursor: pointer;
      transition: var(--transition);
      margin-top: 1.25rem;
    }
    
    .clear-btn:hover {
      color: var(--clr-red-dark);
    }
    .country-code {
      padding: 0.25rem;
      padding-left: 1rem;
      background: var(--clr-grey-10);
      border-top-left-radius: var(--radius);
      border-bottom-left-radius: var(--radius);
      border-top-Right-radius: var(--radius);
      border-bottom-Right-radius: var(--radius);
      border-color: transparent;
      font-size: 1rem;
      flex: 1 0 auto;
      color: var(--clr-grey-5);
    }
    
    .country-code::placeholder {
      font-family: var(--ff-secondary);
      color: var(--clr-grey-5);
    }
    .alert {
      margin-bottom: 1rem;
      height: 1.25rem;
      display: grid;
      align-items: center;
      text-align: center;
      font-size: 0.7rem;
      border-radius: 0.25rem;
      letter-spacing: var(--spacing);
      text-transform: capitalize;
    }
    
    .alert-danger {
      color: #721c24;
      background: #f8d7da;
    }
    
    .alert-success {
      color: #155724;
      background: #d4edda;
    }
    .followers {
      overflow: scroll;
      height: 260px;
      display: grid;
      grid-template-rows: repeat(auto-fill, minmax(45px, 1fr));
      gap: 1.25rem 1rem;
      padding: 1rem 2rem;
    }
    
    .list-modal {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 600px;
      height: 600px;
      background: var(--clr-white);
      border-radius: var(--radius);
      box-shadow: var(--light-shadow);
      overflow-y: scroll;
      padding: 1rem;
      z-index: 1000; /* Ensure it appears above other elements */
      @media (max-width: 768px) {
        width: 90%; /* Adjust the width for screens with a max-width of 768px */
        height: 90vh; /* Adjust the height for smaller screens */
        padding: 0.5rem; /* Reduce padding for smaller screens */
      }
    
      @media (max-width: 480px) {
        width: 95%; /* Further adjust the width for screens with a max-width of 480px */
        height: 85vh; /* Further adjust the height for smaller screens */
        padding: 0.25rem; /* Reduce padding for smaller screens */
      }
    }
    
    .close-list-btn {
      position: absolute;
      top: 0;
      right: 0;
      padding: 0.5rem;
      background: transparent;
      border: none;
      cursor: pointer;
      font-size: 1rem;
      color: var(--clr-grey-1);
      transition: color 0.2s;
    }
    
    .close-list-btn:hover {
      color: var(--clr-grey-5);
    }
    .button-container {
      display: flex;
      justify-content: space-between;
      align-items: center;
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      padding: 1rem;   
      
    }
    
    .clear-image-btn
    {
      
      bottom: 20px; /* Adjust as needed */
      right: 20px; /* Adjust as needed */
      padding: 0.5rem 1rem;
      background: var(--clr-red-dark); /* Use your application's primary color */
      border: none;
      color: var(--clr-white); /* Use an appropriate text color for readability */
      border-radius: var(--radius);
      cursor: pointer;
      transition: background 0.2s; 
    }
    .clear-image-btn:hover {
      background: var(--clr-primary-5); /* Change color on hover to match your theme */
    }
    .show-list-btn {
      
      bottom: 20px; /* Adjust as needed */
      right: 20px; /* Adjust as needed */
      padding: 0.5rem 1rem;
      background: var(--clr-red-dark); /* Use your application's primary color */
      border: none;
      color: var(--clr-white); /* Use an appropriate text color for readability */
      border-radius: var(--radius);
      cursor: pointer;
      transition: background 0.2s;
    }
    
    .show-list-btn:hover {
      background: var(--clr-primary-5); /* Change color on hover to match your theme */
    }
    .back-button {
      background: var(--clr-red-dark);
      color: var(--clr-white);
      border: none;
      border-radius: var(--radius);
      padding: 0.5rem ;

      cursor: pointer;
      font-size: 1rem;
      transition: background 0.2s;
    
      &:hover {
        background: var(--clr-primary-5); /* Change color on hover to match your theme */
      }
    }
    
    @media (max-width: 768px) {
      .form-control {
        flex-direction: column;
        align-items: center;
      }
    
      .subcriber, .country-code, .submit-btn {
        width: 100%;
        margin: 0.5rem 0;
      }
    }
    
    @media (max-width: 480px) {
      .country-code {
        font-size: 0.85rem;
      }
    } `
export default AddSubcriber;
