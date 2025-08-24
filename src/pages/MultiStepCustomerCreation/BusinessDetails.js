import React, { useContext } from 'react';
import AppContext from './Context';
import './Multistepdesignstyles.css'; // Import the shared CSS file

const BusinessDetails = () => {
    const { businessDetails, stepDetails } = useContext(AppContext);
    const { businessType, setBusinessType, annualTurnover, setAnnualTurnover } = businessDetails;
    const { setStep } = stepDetails;

    const handleNext = () => setStep((prevStep) => prevStep + 1);
    const handlePrevious = () => setStep((prevStep) => prevStep - 1);

    return (
        <div className="multistepcontainer">
            <h2>Business Details</h2>
            <div className="formContain">
                <form className="form">
                    <input
                    className="formInput"
                        type="text"
                        placeholder="Business Type"
                        value={businessType}
                        onChange={(e) => setBusinessType(e.target.value)}
                    />
                    <input
                    className="formInput"
                        type="number"
                        placeholder="Annual Turnover"
                        value={annualTurnover}
                        onChange={(e) => setAnnualTurnover(e.target.value)}
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

export default BusinessDetails;
