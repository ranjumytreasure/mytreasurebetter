// Section.js
import React, { useState } from 'react';
import AddNewPopup from './AddNewPopup';

const containerStyle = {
  display: 'flex',
  justifyContent: 'center', // Center the content horizontally
  alignItems: 'center', // Center the content vertically
  minHeight: '40vh', // Set the container height to at least 100% of the viewport height
};

const buttonContainerStyle = {
  display: 'flex',
  alignItems: 'center',
};

const circularButtonStyle = {
  borderRadius: '50%',
  width: '100px',
  height: '100px',
  backgroundColor: '#cd3240', // Change the background color to red
  color: 'white',
  border: 'none',
  cursor: 'pointer',
  marginRight: '20px', // Adjust the margin for equal spacing
};

const separatorStyle = {
  width: '2px',
  height: '70px',
  backgroundColor: '#ccc',
};

const Section = ({ groupId, onRefresh }) => {
  const [showPopup, setShowPopup] = useState(false);

  return (
    <div style={containerStyle}>
      <div style={buttonContainerStyle}>
        <button
          onClick={() => setShowPopup(true)}
          style={circularButtonStyle}
        >
          <label>+ Add New</label>
        </button>
        <div style={separatorStyle}></div>
        <button
          style={circularButtonStyle}
        >
          <label>+ Network List</label>
        </button>
      </div>

      {showPopup && (
        <AddNewPopup groupId={groupId} onRefresh={onRefresh} onClose={() => setShowPopup(false)} />
      )}
    </div>
  );
};

export default Section;
