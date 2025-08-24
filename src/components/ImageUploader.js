import React from 'react';
import "./ImageUpload.css";

const ImageUploader = ({ onChange, previewImage, altText, id }) => {
  return (
    <label htmlFor={id} className="custom-file-upload fas">
      <div className="img-wrap img-upload">
        <img src={previewImage} alt={altText} />
      </div>
      <input
        id={id}
        type="file"
        onChange={onChange}
        accept="image/*"
        style={{ display: 'none' }}
      />
    </label>
  );
};

export default ImageUploader;
