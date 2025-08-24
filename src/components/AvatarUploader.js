import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { FiCamera } from "react-icons/fi";

export const AvatarInput = styled.div`
  margin-bottom: 32px;
  position: relative;
  align-self: center;

  img {
    width: 186px;
    height: 186px;
    object-fit: cover;
    border-radius: 50%;
    border: 2px solid #ccc;
  }

  label {
    position: absolute;
    width: 48px;
    height: 48px;
    background: #312e38;
    border-radius: 50%;
    right: 0;
    bottom: 0;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;

    input {
      display: none;
    }

    svg {
      width: 20px;
      height: 20px;
      color: #f4ede8;
    }
  }
`;

const AvatarUploader = ({ handleSetImage, currentImage }) => {
  const [previewUrl, setPreviewUrl] = useState(currentImage);

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
    <div style={{ textAlign: "center" }}>
      <AvatarInput>
        <img src={previewUrl} alt="Avatar Placeholder" />
        <label>
          <input type="file" accept=".png, .jpg, .jpeg" onChange={handleFileChange} />
          <FiCamera />
        </label>
      </AvatarInput>
    </div>
  );
};

export default AvatarUploader;
