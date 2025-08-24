import React, { useContext } from 'react';
import AppContext from './Context';
import './Multistepdesignstyles.css'; // Import the shared CSS file

const NomineeDetails = () => {
    const { nomineeDetails, stepDetails } = useContext(AppContext);
    const { nominee, setNominee, relationship, setRelationship } = nomineeDetails;
    const { setStep } = stepDetails;

    const relationshipOptions = [
        "Son",
        "Mother",
        "Father",
        "Brother",
        "Sister",
        "Spouse",
        "Grandfather",
        "Grandmother",
        "Uncle",
        "Aunt",
        "Cousin",
        "Other",
    ];

    const handleNext = () => setStep((prevStep) => prevStep + 1);
    const handlePrevious = () => setStep((prevStep) => prevStep - 1);

    return (
        <div className="multistepcontainer">
            <h2>Nominee Details</h2>
            <div className="formContain">
                <form className="form">
                    <input
                        className="formInput"
                        type="text"
                        placeholder="Nominee Name"
                        value={nominee}
                        onChange={(e) => setNominee(e.target.value)}
                    />
                   {/* Relationship Dropdown */}
                   <select
                        className="formInput"
                        value={relationship}
                        onChange={(e) => setRelationship(e.target.value)}
                    >
                        <option value="">Select Relationship</option>
                        {relationshipOptions.map((option, index) => (
                            <option key={index} value={option}>
                                {option}
                            </option>
                        ))}
                    </select>
                    <div className="buttonGroup">
                        <button type="button" className="formSubmit" onClick={handlePrevious}>
                            Previous
                        </button>
                        <button type="button" className="formSubmit" onClick={handleNext}>
                            Next
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default NomineeDetails;
