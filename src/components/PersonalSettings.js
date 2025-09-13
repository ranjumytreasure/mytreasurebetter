import React, { useState, useEffect } from 'react';
import { useUserContext } from "../context/user_context";
import AvatarUploader from '../components/AvatarUploader';
import { API_BASE_URL } from '../utils/apiConfig';
import { uploadImage } from "../utils/uploadImage";
import { downloadImage } from "../utils/downloadImage";

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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header Section */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-red-600 to-red-700 px-8 py-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Personal Settings</h1>
                <p className="text-red-100">Update your personal information and profile</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          {/* Avatar Section */}
          <div className="text-center mb-8">
            <AvatarUploader handleSetImage={handleSetImage} currentImage={previewUrl} />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="firstname" className="block text-sm font-semibold text-gray-700">
                  First Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <input
                    id="firstname"
                    type="text"
                    placeholder="Enter your first name"
                    name="firstname"
                    value={formData.firstname}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="lastname" className="block text-sm font-semibold text-gray-700">
                  Last Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <input
                    id="lastname"
                    type="text"
                    placeholder="Enter your last name"
                    name="lastname"
                    value={formData.lastname}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Date of Birth */}
            <div className="space-y-2">
              <label htmlFor="dob" className="block text-sm font-semibold text-gray-700">
                Date of Birth
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <input
                  id="dob"
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                />
              </div>
            </div>

            {/* Gender Selection */}
            <div className="space-y-4">
              <label className="block text-sm font-semibold text-gray-700">
                Gender
              </label>
              <div className="grid grid-cols-2 gap-4">
                <label className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-red-300 hover:bg-red-50 transition-all duration-200 group">
                  <input
                    type="radio"
                    name="gender"
                    value="male"
                    checked={formData.gender === 'male'}
                    onChange={handleChange}
                    className="w-4 h-4 text-red-600 focus:ring-red-500 border-gray-300"
                  />
                  <div className="ml-3 flex items-center gap-2">
                    <svg className="w-5 h-5 text-red-500 group-hover:text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span className="font-medium text-gray-700 group-hover:text-red-700">Male</span>
                  </div>
                </label>

                <label className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-red-300 hover:bg-red-50 transition-all duration-200 group">
                  <input
                    type="radio"
                    name="gender"
                    value="female"
                    checked={formData.gender === 'female'}
                    onChange={handleChange}
                    className="w-4 h-4 text-red-600 focus:ring-red-500 border-gray-300"
                  />
                  <div className="ml-3 flex items-center gap-2">
                    <svg className="w-5 h-5 text-red-500 group-hover:text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span className="font-medium text-gray-700 group-hover:text-red-700">Female</span>
                  </div>
                </label>
              </div>
            </div>

            {/* Success/Error Messages */}
            {alert.show && (
              <div className="pt-4">
                <div className={`p-4 rounded-lg border ${alert.type === 'success'
                  ? 'bg-green-50 border-green-200 text-green-800'
                  : alert.type === 'danger'
                    ? 'bg-red-50 border-red-200 text-red-800'
                    : 'bg-blue-50 border-blue-200 text-blue-800'
                  }`}>
                  <div className="flex items-center gap-3">
                    {alert.type === 'success' && (
                      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                    {alert.type === 'danger' && (
                      <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    )}
                    <span className="font-medium">{alert.msg}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-6">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-4 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Updating Profile...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                    Update Profile
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}




export default PersonalSettings;
