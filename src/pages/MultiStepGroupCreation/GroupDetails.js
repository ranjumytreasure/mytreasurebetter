import React, { useContext, useEffect } from 'react';
import AppContext from './Context';
import './styles.css';

const GroupDetails = () => {
    const myContext = useContext(AppContext);
    const updateContext = myContext.groupDetails;

    useEffect(() => {
        updateContext.setGroupName(updateContext.groupName || '');
        updateContext.setGroupAmt(updateContext.groupAmt || '');
        updateContext.setNoOfSub(updateContext.groupNoOfSub || '');
        updateContext.setNoOfMonths(updateContext.groupNoOfMonths || '');
    }, []);

    const next = () => {
        if (!updateContext.groupName) {
            console.log('Please enter Group Name');
        } else if (!updateContext.groupAmt) {
            console.log('Please enter Group Amount');
        } else if (
            updateContext.groupType === 'Fixed' && !updateContext.groupNoOfMonths
        ) {
            console.log('Please enter No of Months');
        } else if (
            updateContext.groupType !== 'Fixed' && !updateContext.groupNoOfSub
        ) {
            console.log('Please enter No of Subscribers');
        } else {
            updateContext.setStep(updateContext.currentPage + 1);
        }
    };
    return (
        <div className="container">
            <p>Enter the <b>group details</b></p>
            <h3>Group details</h3>
            <form className="form">
                <input className="formInput" type="text" placeholder="Group name" value={updateContext.groupName} onChange={e => updateContext.setGroupName(e.target.value)} required />

                <input className="formInput" type="text" placeholder="Group amount" value={updateContext.groupAmt} onChange={e => updateContext.setGroupAmt(e.target.value)} required />

                {updateContext.groupType === 'Fixed' ? (
                    <input
                        className="formInput"
                        type="text"
                        placeholder="No of Months"
                        value={updateContext.groupNoOfMonths}
                        onChange={e => updateContext.setNoOfMonths(e.target.value)}
                        required
                    />
                ) : (
                    <input
                        className="formInput"
                        type="text"
                        placeholder="No of Subscribers"
                        value={updateContext.groupNoOfSub}
                        onChange={e => updateContext.setNoOfSub(e.target.value)}
                        required
                    />
                )}

                <div className="multipleButtons">
                        <button className="multipleButton" value="Previous" type="button" onClick={() => updateContext.setStep(updateContext.currentPage - 1)}>Previous</button>
                        <button className="multipleButton" value="Next" type="button" onClick={next}>Next</button>
                    </div>
                
            </form>
        </div>
    );
};

export default GroupDetails;
