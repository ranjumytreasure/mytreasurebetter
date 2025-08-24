import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useUserContext } from "../context/user_context";
import AvatarUploader from '../components/AvatarUploader';
import Alert from '../components/Alert';
import { API_BASE_URL } from '../utils/apiConfig';
import { uploadImage } from "../utils/uploadImage";
import { downloadImage } from "../utils/downloadImage"; // Assuming this works
import "../style/PersonalSettings.css";

function PersonalSettings() {
  const { user, updateUserDetails } = useUserContext();
  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState({ show: false, msg: '', type: '' });
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('https://i.imgur.com/ndu6pfe.png'); // Default image
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    dob: '',
    gender: '',
    user_image: '', // Store image key in DB
  });

  /** ✅ Load User Data */
  useEffect(() => {
    console.log("🔥 useEffect triggered! Checking user image...");

    if (user?.results?.user_image) {
      const { firstname, lastname, dob, gender } = user.results;
      setFormData({ firstname, lastname, dob, gender });


      const userImage = user.results.user_image;
      console.log("✅ user_image from DB:", userImage);

      if (userImage.includes("s3.ap-south-1.amazonaws.com")) {
        console.log("🔹 Fetching from AWS S3...");
        fetchImage(userImage);
      } else {
        console.log("✅ Using direct image URL:", userImage);
        setPreviewUrl(userImage); // Directly set image preview
      }
    } else {
      console.warn("⚠️ No user image found, using default.");
      setPreviewUrl('https://i.imgur.com/ndu6pfe.png');
    }
  }, [user?.results?.user_image]);

  /** ✅ Fetch Image from AWS */
  const fetchImage = async (user_image) => {
    if (!user_image) return;

    setIsLoading(true);
    try {
      const imageKey = user_image.split('/').pop();
      console.log("🔹 Fetching image for key:", imageKey);
      const imageUrl = await downloadImage(imageKey, API_BASE_URL);

      console.log("✅ Downloaded Image URL:", imageUrl);

      if (imageUrl) {
        setPreviewUrl(imageUrl);
      } else {
        console.warn("⚠️ No valid image found, using default.");
        setPreviewUrl('https://i.imgur.com/ndu6pfe.png');
      }
    } catch (error) {
      console.error("❌ Error fetching image:", error);
      setPreviewUrl('https://i.imgur.com/ndu6pfe.png');
    }
    setIsLoading(false);
  };

  /** ✅ Handle Form Input */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  /** ✅ Handle Image Upload & Preview */
  const handleSetImage = (file) => {
    if (file) {
      const fileURL = URL.createObjectURL(file);
      setPreviewUrl(fileURL);
      setImage(file);
    }
  };

  /** ✅ Handle Form Submission */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let uploadedImageUrl = formData.user_image; // Keep existing if no new upload

      if (image instanceof File) {
        uploadedImageUrl = await uploadImage(image, API_BASE_URL);
        if (!uploadedImageUrl) throw new Error("Image upload failed.");
      }

      const body = JSON.stringify({ ...formData, user_image: uploadedImageUrl });
      const headers = {
        'Authorization': `Bearer ${user?.results?.token}`,
        'Content-Type': 'application/json',
      };

      const response = await fetch(`${API_BASE_URL}/users`, {
        method: 'PUT',
        headers,
        body,
      });

      if (response.ok) {
        const responseData = await response.json();
        showAlert(true, 'success', responseData.message);
        updateUserDetails(responseData);
      } else {
        const errorData = await response.json();
        showAlert(true, 'danger', errorData.message);
      }
    } catch (error) {
      showAlert(true, 'danger', 'Error occurred while submitting the form.');
    } finally {
      setIsLoading(false);
    }
  };

  /** ✅ Show Alert Message */
  const showAlert = (show = false, type = '', msg = '') => {
    setAlert({ show, type, msg });
    setTimeout(() => setAlert({ show: false, msg: '', type: '' }), 3000);
  };

  return (

    <div className="ps-container">
      <div className="ps-inner-container">
        <h3 className="ps-title">Personal Details</h3>
        <AvatarUploader handleSetImage={handleSetImage} currentImage={previewUrl} />

        <form className="ps-form" onSubmit={handleSubmit}>
          <input
            className="ps-form-input"
            type="text"
            placeholder="First name"
            name="firstname"
            value={formData.firstname}
            onChange={handleChange}
          />
          <input
            className="ps-form-input"
            type="text"
            placeholder="Last name"
            name="lastname"
            value={formData.lastname}
            onChange={handleChange}
          />

          <input
            className="ps-form-input"
            type="date"
            name="dob"
            value={formData.dob}
            onChange={handleChange}
          />
          <div className="ps-gender">
            <h4>Gender</h4>
            <div className="ps-gender-options">
              <label>
                <input
                  type="radio"
                  name="gender"
                  value="male"
                  checked={formData.gender === 'male'}
                  onChange={handleChange}
                />
                Male
              </label>
              <label>
                <input
                  type="radio"
                  name="gender"
                  value="female"
                  checked={formData.gender === 'female'}
                  onChange={handleChange}
                />
                Female
              </label>
            </div>
          </div>

          {alert.show && <Alert {...alert} removeAlert={showAlert} />}

          <button
            className={`ps-submit ${isLoading ? 'disabled' : ''}`}
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? 'Updating...' : 'Save'}
          </button>
        </form>
      </div>
    </div>


  );
}




// const Wrapper = styled.section`
//   display: flex;
//   flex-direction: column;
//   align-items: center;

//   .container {
//     max-width: 35rem;
//     margin: 2rem auto;
//     padding: 2rem;
//     background: #fff;
//     border-radius: var(--radius);
//     box-shadow: var(--light-shadow);
//   }

//   .form {
//     display: flex;
//     flex-direction: column;
//   }

//   .formInput {
//     border-radius: 5px;
//     border: 1px solid #ccc;
//     margin-bottom: 10px;
//     padding: 10px;
//   }

//   .formSubmit {
//     border-radius: 5px;
//     background-color: #cd3240;
//     color: #fff;
//     padding: 10px;
//     cursor: pointer;
//   }

//   .formSubmit.disabled {
//     background-color: #ccc;
//     cursor: not-allowed;
//   }

//   .gender-options {
//     display: flex;
//     gap: 10px;
//   }
// `;

export default PersonalSettings;
