import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
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
    const [focusTrigger, setFocusTrigger] = useState(0);
    const history = useHistory();

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

    // Scroll to top whenever step changes
    useEffect(() => {
        // Small delay to ensure DOM has updated
        const timer = setTimeout(() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 100);

        return () => clearTimeout(timer);
    }, [step]);

    // Handle back to home navigation
    const handleBackToHome = () => {
        history.push('/chit-fund/user/home');
    };

    const contextValues = {
        stepDetails: {
            step,
            setStep: (newStep) => {
                setStep(newStep);
                setFocusTrigger(prev => prev + 1); // Trigger focus on step change
            },
            focusTrigger
        },
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
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pb-4">
                <div className="flex flex-col items-center p-4 max-w-6xl mx-auto">
                    {/* Back to Home Button */}
                    <div className="w-full max-w-4xl mb-4">
                        <button
                            onClick={handleBackToHome}
                            className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-all duration-300 hover:shadow-lg"
                        >
                            <span className="text-lg">←</span>
                            Back to Home
                        </button>
                    </div>

                    <div className="flex flex-col justify-between items-center w-full max-w-4xl">
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
