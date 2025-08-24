import React from 'react';

function FlagOption({ label, flag }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <img src={flag} alt={`${label} Flag`} style={{ marginRight: '8px', width: '24px', height: 'auto' }} />
      {label}
    </div>
  );
}

export default FlagOption;
