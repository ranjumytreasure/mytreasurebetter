import React, { useState } from 'react';
import './Multistepdesignstyles.css';
import AppContext from './Context';
import PhotoDetails from './PhotoDetails';
import PersonalDetails from './PersonalDetails';
import NomineeDetails from './NomineeDetails';
import BusinessDetails from './BusinessDetails';
import AddressDetails from './AddressDetails';
import BankDetails from './BankDetails';
import FinancialDetails from './FinancialDetails';
import ContactDetails from './ContactDetails';
import PreviewAndSubmit from './PreviewAndSubmit';
import Finish from './Finish';
import ProgressBar from './ProgressBar';

const SubscriberStepForm = () => {
    const [step, setStep] = useState(0);

    // Personal Details
    const [subscriberName, setSubscriberName] = useState("");
    const [image, setImage] = useState("");
    const [age, setAge] = useState("");
    const [dob, setDob] = useState("");
    const [gender, setGender] = useState("");
    const [maritalStatus, setMaritalStatus] = useState("");
    const [nationality, setNationality] = useState("IN");
    const [education, setEducation] = useState("");
    const [spouseName, setSpouseName] = useState("");
    const [spouseDob, setSpouseDob] = useState("");
    const [spouseAge, setSpouseAge] = useState("");
    const [occupation, setOccupation] = useState("");
    const [annualIncome, setAnnualIncome] = useState("");
    const [pan, setPan] = useState("");
    const [aadhar, setAadhar] = useState("");
    const [streetName, setStreetName] = useState("");
    const [villageName, setVillageName] = useState("");
    const [pincode, setPincode] = useState("");
    const [taluk, setTaluk] = useState("");
    const [district, setDistrict] = useState("");
    const [phone, setPhone] = useState("");
    // Bank Details
    const [bankName, setBankName] = useState("");
    const [branch, setBranch] = useState("");
    const [bankIFSC, setBankIFSC] = useState("");
    const [accountNumber, setAccountNumber] = useState("");


    // Nominee Details
    const [nominee, setNominee] = useState("");
    const [relationship, setRelationship] = useState("");

    // Business Details
    const [businessType, setBusinessType] = useState("");
    const [annualTurnover, setAnnualTurnover] = useState("");
    const [password, setPassword] = useState("");

    const contextValues = {
        stepDetails: { step, setStep },
        personalDetails: {
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
            nationality,
            setNationality,
            education,
            setEducation,
            spouseName, 
            setSpouseName,
            spouseDob, 
            setSpouseDob,
            spouseAge,
            setSpouseAge
        
        },
        photoDetails: {
            image,
            setImage
        },
        contactDetails: {
            phone,
            setPhone
        },
        addressDetails: {
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
        },

        financeDetails: {
            occupation,
            setOccupation,
            annualIncome,
            setAnnualIncome,
            pan,
            setPan,
            aadhar,
            setAadhar,
        },

        nomineeDetails: { nominee, setNominee, relationship, setRelationship },
        businessDetails: { businessType, setBusinessType, annualTurnover, setAnnualTurnover },

        // ✅ Add Bank Details
        bankDetails: {
            bankName,
            setBankName,
            branch,
            setBranch,
            bankIFSC,
            setBankIFSC,
            accountNumber,
            setAccountNumber
        },

        // ✅ Include password state
        password,
        setPassword

    };

    return (
        <AppContext.Provider value={contextValues}>
            <div className="multistepmain">
                <div className="multistepbody">
                    <div className="multistepwrapper">
                        <ProgressBar />
                        {step === 0 && <PhotoDetails />}
                        {step === 1 && <PersonalDetails />}
                        {step === 2 &&
                            <ContactDetails />}
                        {step === 3 &&
                            <AddressDetails />}
                        {step === 4 &&
                            <BankDetails />}
                        {step === 5 &&
                            <FinancialDetails />}
                        {step === 6 && <NomineeDetails />}
                        {step === 7 && <BusinessDetails />}
                        {step === 8 && <PreviewAndSubmit />}
                        {step === 9 && <Finish />}
                    </div>
                </div>
            </div>
        </AppContext.Provider>
    );
};

export default SubscriberStepForm;
