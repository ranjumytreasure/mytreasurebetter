import React, { useContext } from 'react';
import AppContext from './Context';
import './Multistepdesignstyles.css'; // Import the shared CSS file

const ContactDetails = () => {
    const { contactDetails, stepDetails } = useContext(AppContext);
    const {
        phone,
        setPhone,
    } = contactDetails;

    const { setStep } = stepDetails;

    const handleNext = () => setStep((prevStep) => prevStep + 1);
    const handlePrevious = () => setStep((prevStep) => prevStep - 1);

    return (
        <div className="multistepcontainer">
            <h2>Contact Details</h2>
            <div className="formContain">
                <form className="form">


                    <input
                      className="formInput"
                        type="text"
                        placeholder="Phone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
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

export default ContactDetails;
