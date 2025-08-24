import React, { useContext } from 'react';
import AppContext from './Context';
import './Multistepdesignstyles.css';

import { useUserContext } from '../../context/user_context';
import { useHistory } from 'react-router-dom';

const Finish = () => {
    const { user, isLoggedIn } = useUserContext();
    const myContext = useContext(AppContext);

    const { stepDetails, personalDetails, password: tempPassword } = myContext || {};
    const { setStep } = stepDetails || {};
    const password = tempPassword ?? "Not Available";
    const subscriberName = personalDetails?.subscriberName ?? "Subscriber";

    const history = useHistory();

    const handleBackButtonClick = () => {
        history.push('/home'); // Redirect to the home page
    };

    const handleMultiStepSubscriber = () => {
        if (setStep) {
            setStep(0); // Reset to step 0
        }
    };

    return (
        <div className="multistepcontainer finish-container">
            <p className="finish-heading">New Subscriber <strong>{subscriberName}</strong> has been created successfully.</p>
            <img
                className="done"
                src="https://www.svgrepo.com/show/13650/success.svg"
                alt="success"
            />
            <p>Thank you for providing your details.</p>
            <p className="password-box">Your temporary password is: {password}</p>

            {isLoggedIn && (
                <button className="back-button" onClick={handleBackButtonClick}>
                    Back to Home
                </button>
            )}

            <div className="next-step">
                <p>Would you like to add another subscriber?</p>
                <button
                    className="add-more-button"
                    onClick={handleMultiStepSubscriber} // ✅ Function is now called
                >
                    + Add Another Subscriber
                </button>
            </div>
        </div>
    );
};

export default Finish;
