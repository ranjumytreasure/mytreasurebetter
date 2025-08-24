import React, { useContext, useEffect, useState } from "react";
import AppContext from "./Context";
import "./styles.css";

const CommisionDetails = () => {
    const myContext = useContext(AppContext);
    const updateContext = myContext.groupDetails;

    // 🔹 Get group amount from context
    const groupAmt = updateContext.groupAmt || 0;

    // 🔹 Local state for percentage & amount
    const [localCommPercent, setLocalCommPercent] = useState(updateContext.commPercent || 5);
    const [localCommAmt, setLocalCommAmt] = useState(0);

    // ✅ Function to calculate commission amount (removes decimals)
    const calculateCommAmt = (percentage) => {
        return Math.round((groupAmt * percentage) / 100);
    };

    // ✅ Set default values based on commission type
    useEffect(() => {
        if (updateContext.commType === "ONEVERYAUCTION") {
            setLocalCommPercent(5);
        } else if (updateContext.commType === "LUMPSUM") {
            setLocalCommPercent(100);
        }
    }, [updateContext.commType]);

    // ✅ Auto-calculate commission amount & update context when values change
    useEffect(() => {
        const calculatedAmount = calculateCommAmt(localCommPercent);
        setLocalCommAmt(calculatedAmount);

        // 🔹 Update context to save in DB
        updateContext.setCommPercent(localCommPercent);
        updateContext.setCommAmt(calculatedAmount);
    }, [localCommPercent, groupAmt]);

    // ✅ Move to the next step
    const next = () => {
        if (!updateContext.commType) {
            console.log("Please select a commission type");
            return;
        }

        // 🔹 Ensure values are saved in context before moving forward
        updateContext.setCommPercent (localCommPercent);
        updateContext.setCommAmt(localCommAmt);
        updateContext.setStep(updateContext.currentPage + 1);
    };

    return (
        <div className="container">
            <img className="otpimg" src="https://ecall-messaging.com/wp-content/uploads/2020/11/eCall_Illustration_mTAN.svg" alt="otp-img" />
            <p>Enter the <b>Commision details</b></p>
            <h3>Commision details</h3>
            <div className="formContain">
                <form className="form">
                    <p><b>Commission Type:</b></p>
                    <label>
                        <input
                            type="radio"
                            value="ONEVERYAUCTION"
                            checked={updateContext.commType === "ONEVERYAUCTION"}
                            onChange={() => updateContext.setCommType("ONEVERYAUCTION")}
                        />
                        On Every Auction
                    </label>
                    <label>
                        <input
                            type="radio"
                            value="LUMPSUM"
                            checked={updateContext.commType === "LUMPSUM"}
                            onChange={() => updateContext.setCommType("LUMPSUM")}
                        />
                        Lump Sum
                    </label>

                    {/* Commission Percentage Input */}
                    <p><b>Commission Percentage:</b></p>
                    <div style={{ display: "flex", alignItems: "center" }}>
                        <input
                            className="formInput"
                            type="number"
                            value={localCommPercent}
                            onChange={(e) => setLocalCommPercent(Number(e.target.value))}
                            style={{ width: "80px", marginRight: "5px" }}
                        />
                        <span>%</span>
                    </div>

                    {/* Commission Amount Input (Readonly) */}
                    <p><b>Commission Amount:</b></p>
                    <input className="formInput" type="text" value={localCommAmt} readOnly />

                    <div className="multipleButtons">
                        <button className="multipleButton" type="button" onClick={() => updateContext.setStep(updateContext.currentPage - 1)}>
                            Previous
                        </button>
                        <button className="multipleButton" type="button" onClick={next}>
                            Next
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CommisionDetails;
