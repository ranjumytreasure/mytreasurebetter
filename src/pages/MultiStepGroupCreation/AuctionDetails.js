import React, { useContext } from 'react';
import AppContext from './Context';
import './styles.css';

const AuctionDetails = () => {
    const myContext = useContext(AppContext);
    const updateContext = myContext.groupDetails;

    const next = () => {

        if (
            updateContext.auctFreq !== '' &&
            updateContext.auctionPlace !== '' &&
            updateContext.firstAuctDate !== '' &&
            updateContext.auctStartTime !== '' &&
            updateContext.auctEndTime !== ''
        ) {
            updateContext.setStep(updateContext.currentPage + 1);
        } else {
            console.log('Please fill in all auction details');
        }
    };

    return (
        <div className="container">
            <p>Enter the auction details of the group details entered <b>{updateContext.groupName}</b></p>
            {/* <img
                className="otpimg"
                src="https://ecall-messaging.com/wp-content/uploads/2020/11/eCall_Illustration_mTAN.svg"
                alt="otp-img"
            /> */}
            <div className="formContain">
                <form className="form">
                    <p>Auction frequency</p>
                    <div className="radio-group">

                        <div className="radio-item">
                            <label>
                                <input
                                    type="radio"
                                    value="MONTHLY"
                                    checked={updateContext.auctFreq === 'MONTHLY'}
                                    onChange={() => updateContext.setAuctFreq('MONTHLY')}
                                />
                                Monthly
                            </label>
                        </div>
                        <div className="radio-item">
                            <label>
                                <input
                                    type="radio"
                                    value="WEEKLY"
                                    checked={updateContext.auctFreq === 'WEEKLY'}
                                    onChange={() => updateContext.setAuctFreq('WEEKLY')}
                                />
                                Weekly
                            </label>
                        </div>
                        <div className="radio-item">
                            <label>
                                <input
                                    type="radio"
                                    value="DAILY"
                                    checked={updateContext.auctFreq === 'DAILY'}
                                    onChange={() => updateContext.setAuctFreq('DAILY')}
                                />
                                Daily
                            </label>
                        </div>
                    </div>
                    <p>Auction date</p>
                    <input className="formInput"
                        type="date"
                        value={updateContext.firstAuctDate}
                        onChange={e => updateContext.setFirstAuctdt(e.target.value)}
                        placeholder="Auction Date"
                        required
                    />
                    <p>Auction start time</p>
                    <input className="formInput"
                        type="time"
                        value={updateContext.auctStartTime}
                        onChange={e => updateContext.setAuctStartTime(e.target.value)}
                        placeholder="Auction Start Time"
                        required
                    />
                    <p>Auction end time</p>
                    <input className="formInput"
                        type="time"
                        value={updateContext.auctEndTime}
                        onChange={e => updateContext.setAuctEndTime(e.target.value)}
                        placeholder="Auction End Time"
                        required
                    />
                    <p>Auction place</p>
                    <div className="radio-group">
                        <div className="radio-item">
                            <label>
                                <input
                                    type="radio"
                                    value="Office"
                                    checked={updateContext.auctPlace === 'Office'}
                                    onChange={() => updateContext.setAuctPlace('Office')}
                                />
                                Office
                            </label>
                        </div>
                        <div className="radio-item">
                            <label>
                                <input
                                    type="radio"
                                    value="Online"
                                    checked={updateContext.auctPlace === 'Online'}
                                    onChange={() => updateContext.setAuctPlace('Online')}
                                />
                                Online
                            </label>
                        </div>
                        <div className="radio-item">
                            <label>
                                <input
                                    type="radio"
                                    value="Both"
                                    checked={updateContext.auctPlace === 'Both'}
                                    onChange={() => updateContext.setAuctPlace('Both')}
                                />
                                Both
                            </label>
                        </div>
                    </div>

                    <div className="multipleButtons">
                        <button
                            className="multipleButton"
                            value="Previous"
                            type="button"
                            onClick={() => updateContext.setStep(updateContext.currentPage - 1)}
                        >
                            Previous
                        </button>
                        <button className="multipleButton" value="Next" type="button" onClick={next}>
                            Next
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AuctionDetails;
