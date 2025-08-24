import React, { useContext } from 'react';
import AppContext from './Context';
import './Multistepdesignstyles.css'; // Import the shared CSS file

const AddressDetails = () => {
    const { addressDetails, stepDetails } = useContext(AppContext);
    const {
        streetName,
        setStreetName,
        villageName,
        setVillageName,
        pincode,
        setPincode,
        taluk,
        setTaluk,
        district,
        setDistrict
    } = addressDetails;

    const { setStep } = stepDetails;

    
    const handleNext = () => setStep((prevStep) => prevStep + 1);
    const handlePrevious = () => setStep((prevStep) => prevStep - 1);

    return (
        <div className="multistepcontainer">
            <h2>Address Details</h2>
            <div className="formContain">
                <form className="form">

                    <input
                        className="formInput"
                        type="text"
                        placeholder="Street Name"
                        value={streetName}
                        onChange={(e) => setStreetName(e.target.value)}
                    />
                    <input
                    className="formInput"
                        type="text"
                        placeholder="Village Name"
                        value={villageName}
                        onChange={(e) => setVillageName(e.target.value)}
                    />
                    <input
                    className="formInput"
                        type="number"
                        placeholder="Pincode"
                        value={pincode}
                        onChange={(e) => setPincode(e.target.value)}
                    />
                    <input
                    className="formInput"
                        type="text"
                        placeholder="Taluk"
                        value={taluk}
                        onChange={(e) => setTaluk(e.target.value)}
                    />
                    <input
                    className="formInput"
                        type="text"
                        placeholder="District"
                        value={district}
                        onChange={(e) => setDistrict(e.target.value)}
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

export default AddressDetails;
