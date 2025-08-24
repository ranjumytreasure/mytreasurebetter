import React, { useContext, useEffect } from 'react';
import AppContext from './Context';
import './Multistepdesignstyles.css'; // Import the shared CSS file

const PersonalDetails = () => {
    const { personalDetails, stepDetails } = useContext(AppContext);
    const {
        subscriberName,
        setSubscriberName,
        age,
        setAge,
        dob,
        setDob,
        gender,
        setGender,
        maritalStatus,
        setMaritalStatus,
        education,
        setEducation,
        spouseName,
        setSpouseName,
        spouseDob,
        setSpouseDob,
        spouseAge,
        setSpouseAge,
    } = personalDetails;

    const { setStep } = stepDetails;

    const handleNext = () => setStep((prevStep) => prevStep + 1);
    const handlePrevious = () => setStep((prevStep) => prevStep - 1);

    // Function to calculate age from DOB
    const calculateAge = (dob) => {
        if (!dob) return 0; // Return 0 if no DOB is selected

        const birthDate = new Date(dob);
        if (isNaN(birthDate)) return 0; // Handle invalid date inputs

        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        const dayDiff = today.getDate() - birthDate.getDate();

        // Adjust age if the birthday hasn't occurred yet this year
        if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
            age--;
        }

        return age;
    };

    // Handle DOB change and calculate age
    const handleDobChange = (e) => {
        const selectedDob = e.target.value;
        setDob(selectedDob);
        setAge(calculateAge(selectedDob)); // Update age immediately
    };

       // Handle Spouse DOB change and calculate age
       const handleSpouseDobChange = (e) => {
        const selectedDob = e.target.value;
        setSpouseDob(selectedDob);
        setSpouseAge(calculateAge(selectedDob));
    };

    // Update age whenever DOB changes
    useEffect(() => {
        if (dob) {
            setAge(calculateAge(dob));
        }
    }, [dob, setAge]); // Ensure age updates correctly even if dob is set elsewhere

    return (
        <div className="multistepcontainer">
            <h2>Personal Details</h2>
            <div className="formContain">
                <form className="form">
                    <input
                        className="formInput"
                        type="text"
                        placeholder="Name"
                        value={subscriberName}
                        onChange={(e) => setSubscriberName(e.target.value)}
                    />
                    <p>Date of Birth</p>
                    <input
                        className="formInput"
                        type="date"
                        placeholder="Date of Birth"
                        value={dob}
                        onChange={handleDobChange}
                    />
                    <input
                        className="formInput"
                        type="number"
                        placeholder="Age"
                        value={age || ""}
                        readOnly // Make it read-only so users can't manually edit it
                    />

                    <p>Gender</p>
                    <div className="radio-group">
                        <label>
                            <input
                                type="radio"
                                name="gender"
                                value="Male"
                                checked={gender === 'Male'}
                                onChange={() => setGender('Male')}
                            />
                            Male
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="gender"
                                value="Female"
                                checked={gender === 'Female'}
                                onChange={() => setGender('Female')}
                            />
                            Female
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="gender"
                                value="Other"
                                checked={gender === 'Other'}
                                onChange={() => setGender('Other')}
                            />
                            Other
                        </label>
                    </div>

                    <p>Marital Status</p>
                    <div className="radio-group">
                        <label>
                            <input
                                type="radio"
                                name="maritalStatus"
                                value="Single"
                                checked={maritalStatus === 'Single'}
                                onChange={() => setMaritalStatus('Single')}
                            />
                            Single
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="maritalStatus"
                                value="Married"
                                checked={maritalStatus === 'Married'}
                                onChange={() => setMaritalStatus('Married')}
                            />
                            Married
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="maritalStatus"
                                value="Other"
                                checked={maritalStatus === 'Other'}
                                onChange={() => setMaritalStatus('Other')}
                            />
                            Other
                        </label>
                    </div>

                    <input
                        className="formInput"
                        type="text"
                        placeholder="Education"
                        value={education}
                        onChange={(e) => setEducation(e.target.value)}
                    />
                     {/* Show spouse details only if marital status is "Married" */}
                     {maritalStatus === "Married" && (
                        <>
                            <p>{gender === "Male" ? "Wife" : "Husband"} Name</p>
                            <input
                                className="formInput"
                                type="text"
                                placeholder={`${gender === "Male" ? "Wife" : "Husband"} Name`}
                                value={spouseName}
                                onChange={(e) => setSpouseName(e.target.value)}
                            />

                            <p>{gender === "Male" ? "Wife" : "Husband"} Date of Birth</p>
                            <input
                                className="formInput"
                                type="date"
                                value={spouseDob}
                                onChange={handleSpouseDobChange}
                            />

                            <input
                                className="formInput"
                                type="number"
                                placeholder={`${gender === "Male" ? "Wife" : "Husband"} Age`}
                                value={spouseAge || ""}
                                readOnly
                            />
                        </>
                    )}

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

export default PersonalDetails;
