
// components/EditableField.js
import React from 'react';


// const EditableField = ({ label, value, editable, onChange, placeholder }) => {
//   return (
//     <div style={{ display: 'flex', marginBottom: '10px', alignItems: 'center' }}>
//       <label style={{ minWidth: '150px', fontWeight: 'bold' }}>{label}:</label>
//       {editable ? (
//         <input
//           type="text"
//           value={value}
//           onChange={(e) => onChange(e.target.value)}
//           placeholder={placeholder}
//           style={{
//             padding: '6px 10px',
//             fontSize: '14px',
//             flex: 1,
//             height: '32px',
//             border: '1px solid #ccc',
//             borderRadius: '4px',
//           }}
//         />
//       ) : (
//         <span style={{ flex: 1 }}>{value || '—'}</span>
//       )}
//     </div>
//   );
// };

const EditableField = ({ label, value, editable, onChange, placeholder, readOnly = false }) => {
  const isDateField = label.toLowerCase().includes('date');

  const formatDateForDisplay = (dateStr) => {
    if (!dateStr) return '—';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB');
  };

  const isEditableField = editable && !readOnly;

  return (
    <div style={{ display: 'flex', marginBottom: '10px', alignItems: 'center' }}>
      <label style={{ minWidth: '150px', fontWeight: 'bold' }}>{label}:</label>
      {isEditableField ? (
        <input
          type={isDateField ? 'date' : 'text'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          style={{
            padding: '6px 10px',
            fontSize: '14px',
            flex: 1,
            height: '32px',
            border: '1px solid #ccc',
            borderRadius: '4px',
          }}
        />
      ) : (
        <span
          style={{
            flex: 1,
            backgroundColor: readOnly ? '#f0f0f0' : 'transparent',
            padding: '6px 10px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            borderRadius: '4px',
          }}
        >
          {isDateField ? formatDateForDisplay(value) : (value || '—')}
        </span>
      )}
    </div>
  );
};




export default EditableField;
