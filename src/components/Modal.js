

// const Modal = ({ isOpen, onClose, children }) => {
//     console.log("came in modal");
//     console.log(isOpen);
//     if (!isOpen) {
//         return null;
//     }

//     // Inline CSS styles for the modal container and content
//     const modalStyle = {
//         display: "block", // Show the modal when isOpen is true
//         position: "fixed",
//         top: 0,
//         left: 0,
//         width: "100%",
//         height: "100%",
//         backgroundColor: "rgba(0, 0, 0, 0.5)",
//         zIndex: 1,
//         justifyContent: "center",
//         alignItems: "center",
//     };

//     const modalContentStyle = {
//         height: "100vh",
//         width: "100%",
//         padding: "20px",
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "center",
//         backgroundColor: "rgba(0,0,0,0.5)",
//     };
//     const basedivStyle = {
//         height:"auto",
//         width:"100%",
//         maxWidth:"600px",
//         backgroundColor: "white",
//         padding: "24px 28px 28px",
//         borderRadius: "8px",
//     };

//     return (
//         <div className="modal" style={modalStyle}>
//             <div className="modal-content" style={modalContentStyle}>
//                 <div className="basediv" style={basedivStyle}>
//                     {children}
//                     {/* <button onClick={onClose}>Close</button> */}
//                 </div>
//             </div>
//         </div>
//     );
// };

import React from "react";

const Modal = ({ isOpen, onClose, children }) => {
    if (!isOpen) {
        return null;
    }

    const overlayStyle = {
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        zIndex: 1000,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    };

    const modalStyle = {
        width: "100%",
        maxWidth: "600px",
        backgroundColor: "white",
        padding: "24px 28px 28px",
        borderRadius: "8px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
    };

    return (
        <div style={overlayStyle} onClick={onClose}>
            <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
                {children}
                {/* Optional close button */}
                {/* <button onClick={onClose}>Close</button> */}
            </div>
        </div>
    );
};

export default Modal;


