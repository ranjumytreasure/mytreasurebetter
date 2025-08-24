import React, { useContext } from 'react';
import AppContext from './Context';
import './styles.css';

const GroupType = () => {
    const myContext = useContext(AppContext);
    const updateContext = myContext.groupDetails;

    const next = () => {
        if (updateContext.groupType == null) {
            console.log('Please select a group type');
        } else {
            updateContext.setStep(updateContext.currentPage + 1);
        }
    };

    return (
        <div className="container">
            {/* <p>Choose the <b>group type</b> of the group details entered <b>{updateContext.groupName}</b></p> */}
            <img className="otpimg" src="https://ecall-messaging.com/wp-content/uploads/2020/11/eCall_Illustration_mTAN.svg" alt="otp-img" />

            <div className="formContain">
                <form className="form">
                    <p>Choose the <b>group type :</b> </p>
                    <label>
                        <input
                            type="radio"
                            value="Accumulative"
                            checked={updateContext.groupType === 'Accumulative'}
                            onChange={() => updateContext.setGroupType('Accumulative')}
                        />
                        Accumulative
                    </label>
                    <label>
                        <input
                            type="radio"
                            value="Deductive"
                            checked={updateContext.groupType === 'Deductive'}
                            onChange={() => updateContext.setGroupType('Deductive')}
                        />
                        Deductive
                    </label>
                    <label>
                        <input
                            type="radio"
                            value="Fixed"
                            checked={updateContext.groupType === 'Fixed'}
                            onChange={() => updateContext.setGroupType('Fixed')}
                        />
                        Fixed
                    </label>

                    <button type="button" className="formSubmit" onClick={next}>Next</button>
                </form>
            </div>
        </div>
    );
};

export default GroupType;
