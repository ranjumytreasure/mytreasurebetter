import React, { useContext } from 'react';
import AppContext from './Context';
import './Multistepdesignstyles.css';

const BankDetails = () => {
    const { bankDetails, stepDetails } = useContext(AppContext);
    const { bankName, setBankName, branch, setBranch, bankIFSC, setBankIFSC, accountNumber, setAccountNumber } = bankDetails;
    const { setStep } = stepDetails;

    const handleNext = () => setStep((prevStep) => prevStep + 1);
    const handlePrevious = () => setStep((prevStep) => prevStep - 1);

    return (
        <div className="multistepcontainer">
            <h2>Bank Details</h2>
            <div className="formContain">
                <form className="form">
                    <input
                        className="formInput"
                        type="text"
                        placeholder="Bank Name"
                        value={bankName}
                        onChange={(e) => setBankName(e.target.value)}
                    />
                    <input
                        className="formInput"
                        type="text"
                        placeholder="Branch"
                        value={branch}
                        onChange={(e) => setBranch(e.target.value)}
                    />
                    <input
                        className="formInput"
                        type="text"
                        placeholder="Bank IFSC Code"
                        value={bankIFSC}
                        onChange={(e) => setBankIFSC(e.target.value)}
                    />
                    <input
                        className="formInput"
                        type="number"
                        placeholder="Account Number"
                        value={accountNumber}
                        onChange={(e) => setAccountNumber(e.target.value)}
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

export default BankDetails;
