import React, { useState, useEffect } from "react";
import { useGroupDetailsContext } from "../context/group_context";
import "../style/AssignGroupAmountPopup.css";

const AssignGroupAmountPopup = ({ confirmAddSubscriber, cancelAddSubscriber }) => {
  const { data } = useGroupDetailsContext();
  const groupData = data;

  const [groupAmount, setGroupAmount] = useState("");
  const [contributionAmount, setContributionAmount] = useState("");
  const [contributionPercentage, setContributionPercentage] = useState(100);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const amount = groupData?.results?.amount || "";
    setGroupAmount(amount);
    setContributionAmount(amount);
    setContributionPercentage(100);
  }, [groupData?.results?.amount]);

  useEffect(() => {
    if (contributionAmount && groupAmount) {
      const amt = parseFloat(contributionAmount);
      const grp = parseFloat(groupAmount);
      if (!isNaN(amt) && !isNaN(grp) && grp !== 0) {
        setContributionPercentage(((amt / grp) * 100).toFixed(2));
      }
    }
  }, [contributionAmount, groupAmount]);

  const handleConfirm = async () => {
    if (!groupAmount || isNaN(groupAmount)) {
      alert("Please enter a valid group amount.");
      return;
    }

    if (!contributionAmount || isNaN(contributionAmount)) {
      alert("Please enter a valid contribution amount.");
      return;
    }

    setIsLoading(true);
    await confirmAddSubscriber(contributionAmount, contributionPercentage);
    setIsLoading(false);
  };

  return (
    <div className="assign-popup-overlay">
      <div className="assign-popup-box">
        <h2 className="popup-title">Assign Group Amount</h2>

        <div className="popup-field">
          <label>Group Amount</label>
          <input type="number" value={groupAmount} readOnly />
        </div>

        <div className="popup-field">
          <label>Contribution Amount</label>
          <input
            type="number"
            value={contributionAmount}
            onChange={(e) => setContributionAmount(e.target.value)}
          />
        </div>

        <div className="popup-field">
          <label>Contribution %</label>
          <input type="text" value={contributionPercentage} readOnly />
        </div>

        <div className="popup-buttons">
          <button
            className="popup-btn confirm-btn"
            onClick={handleConfirm}
            disabled={isLoading}
          >
            {isLoading ? "Processing..." : "Confirm"}
          </button>
          <button className="popup-btn cancel-btn" onClick={cancelAddSubscriber}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssignGroupAmountPopup;

// const AssignGroupAmountPopup = ({ confirmAddSubscriber, cancelAddSubscriber }) => {
//     const history = useHistory();
//     const { state } = useGroupDetailsContext();

//     // Data from context
//     const groupData = state.data;

//     // Local state for the input values
//     const [groupAmount, setGroupAmount] = useState(groupData?.results?.amount || '');
//     const [contributionAmount, setContributionAmount] = useState(groupData?.results?.amount || '');  // Default value same as groupAmount
//     const [contributionPercentage, setContributionPercentage] = useState(100);  // Default percentage 100%
//     const [isLoading, setIsLoading] = useState(false); // For handling loading state

//     // Update groupAmount whenever groupData.results.amount changes
//     useEffect(() => {
//         setGroupAmount(groupData?.results?.amount || '');
//         setContributionAmount(groupData?.results?.amount || '');  // Keep default as same as groupAmount
//         setContributionPercentage(100);  // Keep default percentage as 100%
//     }, [groupData?.results?.amount]);

//     // Calculate the contribution percentage when contributionAmount changes
//     useEffect(() => {
//         if (contributionAmount && groupAmount) {
//             const amount = parseFloat(contributionAmount);
//             const group = parseFloat(groupAmount);

//             if (amount === group) {
//                 setContributionPercentage(100);  // If contribution amount is same as group amount, set percentage to 100%
//             } else {
//                 const percentage = (amount / group) * 100;
//                 setContributionPercentage(percentage.toFixed(2));  // Calculate percentage
//             }
//         }
//     }, [contributionAmount, groupAmount]);

//     const handleContributionAmountChange = (e) => {
//         setContributionAmount(e.target.value);
//     };

//     const handleConfirm = async () => {
//         // Add validation for groupAmount and contributionAmount
//         if (!groupAmount || isNaN(groupAmount)) {
//             alert("Please enter a valid group amount.");
//             return;
//         }

//         if (!contributionAmount || isNaN(contributionAmount)) {
//             alert("Please enter a valid contribution amount.");
//             return;
//         }

//         setIsLoading(true); // Set loading state to true while confirming
//         console.log("Confirmed group amount:", groupAmount);
//         console.log("Confirmed contribution amount:", contributionAmount);
//         console.log("Calculated contribution percentage:", contributionPercentage);

//         // Pass both contributionAmount and contributionPercentage to the parent component
//         await confirmAddSubscriber(contributionAmount, contributionPercentage);  // Pass both values to parent

//         setIsLoading(false); // Reset loading state after completion
//     };

//     const handleCancel = () => {
//         cancelAddSubscriber(); // Cancel and close the popup
//         history.goBack();
//     };

//     return (
//         <div className="popup-container">
//             <div className="popup-body">
//                 <h3>Assign Group Amount</h3>

//                 {/* Group Amount Input - Read-Only */}
//                 <div className="input-container">
//                     <label htmlFor="groupAmount">Group Amount:</label>
//                     <input
//                         type="text"
//                         id="groupAmount"
//                         value={groupAmount}
//                         readOnly
//                     />
//                 </div>

//                 {/* Contribution Amount Input */}
//                 <div className="input-container">
//                     <label htmlFor="contributionAmount">Contribution Amount:</label>
//                     <input
//                         type="text"
//                         id="contributionAmount"
//                         value={contributionAmount}
//                         onChange={handleContributionAmountChange}
//                     />
//                 </div>

//                 {/* Contribution Percentage (Read-Only) */}
//                 <div className="input-container">
//                     <label htmlFor="contributionPercentage">Contribution Percentage:</label>
//                     <input
//                         type="text"
//                         id="contributionPercentage"
//                         value={contributionPercentage || ''}
//                         readOnly
//                     />
//                 </div>

//                 {/* Buttons */}
//                 <div className="button-container">
//                     <button onClick={handleConfirm} disabled={isLoading}>
//                         {isLoading ? "Processing..." : "Confirm"}
//                     </button>
//                     <button onClick={handleCancel} disabled={isLoading}>
//                         Cancel
//                     </button>
//                 </div>
//             </div>
//         </div>
//     );
// };


