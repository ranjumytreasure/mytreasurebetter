import React, { useEffect, useState } from "react";
import { FiCamera, FiUser, FiUpload } from "react-icons/fi";

const AvatarUploader = ({ handleSetImage, currentImage }) => {
  const [previewUrl, setPreviewUrl] = useState(currentImage);
  const [isHovered, setIsHovered] = useState(false);

  // Sync with parent state
  useEffect(() => {
    if (currentImage) {
      setPreviewUrl(currentImage);
    }
  }, [currentImage]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && (file.type.includes("png") || file.type.includes("jpg") || file.type.includes("jpeg"))) {
      const fileURL = URL.createObjectURL(file);
      setPreviewUrl(fileURL);
      handleSetImage(file);
    } else {
      alert("Please upload a valid image file (PNG or JPG).");
    }
  };

  return (
    <div className="text-center">
      <div
        className="relative inline-block group cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Avatar Container */}
        <div className="relative w-48 h-48 rounded-full overflow-hidden border-4 border-white shadow-xl bg-gray-100">
          {previewUrl && previewUrl !== 'https://i.imgur.com/ndu6pfe.png' ? (
            <img
              src={previewUrl}
              alt="Profile Avatar"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
          ) : null}
          <div
            className={`w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 ${previewUrl && previewUrl !== 'https://i.imgur.com/ndu6pfe.png' ? 'hidden' : 'flex'
              }`}
          >
            <FiUser className="w-16 h-16 text-gray-400" />
          </div>

          {/* Overlay on hover */}
          {isHovered && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center transition-opacity duration-200">
              <div className="text-white text-center">
                <FiUpload className="w-8 h-8 mx-auto mb-2" />
                <p className="text-sm font-medium">Change Photo</p>
              </div>
            </div>
          )}
        </div>

        {/* Camera Button */}
        <label className="absolute -bottom-2 -right-2 w-12 h-12 bg-gradient-to-r from-custom-red to-red-600 rounded-full shadow-lg cursor-pointer flex items-center justify-center hover:from-red-600 hover:to-red-700 transition-all duration-200 transform hover:scale-110 group">
          <input
            type="file"
            accept=".png, .jpg, .jpeg"
            onChange={handleFileChange}
            className="hidden"
          />
          <FiCamera className="w-6 h-6 text-white" />
        </label>

        {/* Upload Indicator */}
        <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <FiUpload className="w-3 h-3 text-white" />
        </div>
      </div>

      {/* Instructions */}
      <div className="mt-6 space-y-2">
        <p className="text-sm text-gray-600 font-medium">Profile Picture</p>
        <p className="text-xs text-gray-500">
          Click the camera icon to upload a new photo
        </p>
        <p className="text-xs text-gray-400">
          Recommended: Square image, at least 400x400 pixels
        </p>
      </div>
    </div>
  );
};

export default AvatarUploader;