import React, { useContext } from 'react';
import AppContext from './Context';
import './Multistepdesignstyles.css'; // Import the shared CSS file

const FinancialDetails = () => {
    const { financeDetails, stepDetails } = useContext(AppContext);
    const {
        annualIncome,
        setAnnualIncome,
        aadhar,
        setAadhar,
        pan,
        setPan,  
        occupation,
        setOccupation,    
     
    } = financeDetails;

    const { setStep } = stepDetails;

    const handleNext = () => setStep((prevStep) => prevStep + 1);
    const handlePrevious = () => setStep((prevStep) => prevStep - 1);

    return (
        <div className="multistepcontainer">
            <h2>Financial Details</h2>
            <div className="formContain">
                <form className="form">
                <input
                        className="formInput"
                        type="text"
                        placeholder="Occupation"
                        value={occupation}
                        onChange={(e) => setOccupation(e.target.value)}
                    />
                    <input
                        className="formInput"
                        type="number"
                        placeholder="Annual Income"
                        value={annualIncome}
                        onChange={(e) => setAnnualIncome(e.target.value)}
                    />
                     <input
                    className="formInput"
                        type="text"
                        placeholder="Aadhar"
                        value={aadhar}
                        onChange={(e) => setAadhar(e.target.value)}
                    />
                    <input
                    className="formInput"
                        type="text"
                        placeholder="Pan"
                        value={pan}
                        onChange={(e) => setPan(e.target.value)}
                    />
                    
                   
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

export default FinancialDetails;
