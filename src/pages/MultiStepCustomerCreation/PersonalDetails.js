import React, { useContext, useEffect, useRef } from 'react';
import AppContext from './Context';

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

    const { setStep, focusTrigger } = stepDetails;
    const firstInputRef = useRef(null);

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

    // Auto-focus first input when component mounts
    useEffect(() => {
        if (firstInputRef.current) {
            const timer = setTimeout(() => {
                firstInputRef.current.focus();
            }, 200); // Delay to ensure smooth scroll completes first

            return () => clearTimeout(timer);
        }
    }, [focusTrigger]);

    return (
        <div className="max-w-4xl mx-auto my-6 bg-white rounded-3xl shadow-xl transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 overflow-hidden border border-gray-100">
            <div className="bg-gradient-to-r from-red-600 via-red-700 to-red-800 text-white p-8 text-center relative">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>
                <div className="relative z-10">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4 backdrop-blur-sm">
                        <span className="text-2xl">👤</span>
                    </div>
                    <h2 className="text-3xl font-bold font-['Poppins'] mb-2">Personal Details</h2>
                    <p className="text-red-100 text-sm">Tell us about yourself</p>
                </div>
            </div>
            <div className="p-8">
                <form className="space-y-6">
                    {/* Name Field */}
                    <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700 font-['Poppins']">
                            Full Name <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <input
                                ref={firstInputRef}
                                className="w-full px-4 py-4 text-base border-2 border-gray-200 rounded-xl transition-all duration-300 bg-white focus:outline-none focus:border-red-500 focus:shadow-lg focus:shadow-red-500/20 hover:border-gray-300"
                                type="text"
                                placeholder="Enter your full name"
                                value={subscriberName}
                                onChange={(e) => setSubscriberName(e.target.value)}
                            />
                            <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                                <span className="text-gray-400">👤</span>
                            </div>
                        </div>
                    </div>

                    {/* Date of Birth and Age */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-gray-700 font-['Poppins']">
                                Date of Birth <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <input
                                    className="w-full px-4 py-4 text-base border-2 border-gray-200 rounded-xl transition-all duration-300 bg-white focus:outline-none focus:border-red-500 focus:shadow-lg focus:shadow-red-500/20 hover:border-gray-300"
                                    type="date"
                                    value={dob}
                                    onChange={handleDobChange}
                                />
                                <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                                    <span className="text-gray-400">📅</span>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-gray-700 font-['Poppins']">
                                Age
                            </label>
                            <div className="relative">
                                <input
                                    className="w-full px-4 py-4 text-base border-2 border-gray-200 rounded-xl transition-all duration-300 bg-gray-50 focus:outline-none cursor-not-allowed"
                                    type="number"
                                    placeholder="Auto-calculated"
                                    value={age || ""}
                                    readOnly
                                />
                                <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                                    <span className="text-gray-400">🎂</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Gender Selection */}
                    <div className="space-y-3">
                        <label className="block text-sm font-semibold text-gray-700 font-['Poppins']">
                            Gender <span className="text-red-500">*</span>
                        </label>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {['Male', 'Female', 'Other'].map((option) => (
                                <label key={option} className="relative cursor-pointer">
                                    <input
                                        type="radio"
                                        name="gender"
                                        value={option}
                                        checked={gender === option}
                                        onChange={() => setGender(option)}
                                        className="sr-only"
                                    />
                                    <div className={`p-4 rounded-xl border-2 transition-all duration-300 text-center ${gender === option
                                        ? 'border-red-500 bg-red-50 text-red-700 shadow-md'
                                        : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                                        }`}>
                                        <span className="text-lg mb-1 block">
                                            {option === 'Male' ? '👨' : option === 'Female' ? '👩' : '👤'}
                                        </span>
                                        <span className="font-medium">{option}</span>
                                    </div>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Marital Status */}
                    <div className="space-y-3">
                        <label className="block text-sm font-semibold text-gray-700 font-['Poppins']">
                            Marital Status <span className="text-red-500">*</span>
                        </label>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {['Single', 'Married', 'Other'].map((option) => (
                                <label key={option} className="relative cursor-pointer">
                                    <input
                                        type="radio"
                                        name="maritalStatus"
                                        value={option}
                                        checked={maritalStatus === option}
                                        onChange={() => setMaritalStatus(option)}
                                        className="sr-only"
                                    />
                                    <div className={`p-4 rounded-xl border-2 transition-all duration-300 text-center ${maritalStatus === option
                                        ? 'border-red-500 bg-red-50 text-red-700 shadow-md'
                                        : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                                        }`}>
                                        <span className="text-lg mb-1 block">
                                            {option === 'Single' ? '💍' : option === 'Married' ? '💑' : '🤝'}
                                        </span>
                                        <span className="font-medium">{option}</span>
                                    </div>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Education */}
                    <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700 font-['Poppins']">
                            Education Level
                        </label>
                        <div className="relative">
                            <input
                                className="w-full px-4 py-4 text-base border-2 border-gray-200 rounded-xl transition-all duration-300 bg-white focus:outline-none focus:border-red-500 focus:shadow-lg focus:shadow-red-500/20 hover:border-gray-300"
                                type="text"
                                placeholder="e.g., Bachelor's Degree, High School, etc."
                                value={education}
                                onChange={(e) => setEducation(e.target.value)}
                            />
                            <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                                <span className="text-gray-400">🎓</span>
                            </div>
                        </div>
                    </div>
                    {/* Spouse Details - Only show if married */}
                    {maritalStatus === "Married" && (
                        <div className="bg-gradient-to-r from-pink-50 to-red-50 rounded-2xl p-6 border border-pink-200">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-red-500 rounded-full flex items-center justify-center">
                                    <span className="text-white text-sm">💕</span>
                                </div>
                                <h3 className="text-lg font-semibold text-gray-800 font-['Poppins']">
                                    {gender === "Male" ? "Wife" : "Husband"} Details
                                </h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <label className="block text-sm font-semibold text-gray-700 font-['Poppins']">
                                        {gender === "Male" ? "Wife" : "Husband"} Name
                                    </label>
                                    <div className="relative">
                                        <input
                                            className="w-full px-4 py-3 text-base border-2 border-gray-200 rounded-xl transition-all duration-300 bg-white focus:outline-none focus:border-pink-500 focus:shadow-lg focus:shadow-pink-500/20 hover:border-gray-300"
                                            type="text"
                                            placeholder={`Enter ${gender === "Male" ? "wife" : "husband"}'s name`}
                                            value={spouseName}
                                            onChange={(e) => setSpouseName(e.target.value)}
                                        />
                                        <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                                            <span className="text-gray-400">👤</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-semibold text-gray-700 font-['Poppins']">
                                        Date of Birth
                                    </label>
                                    <div className="relative">
                                        <input
                                            className="w-full px-4 py-3 text-base border-2 border-gray-200 rounded-xl transition-all duration-300 bg-white focus:outline-none focus:border-pink-500 focus:shadow-lg focus:shadow-pink-500/20 hover:border-gray-300"
                                            type="date"
                                            value={spouseDob}
                                            onChange={handleSpouseDobChange}
                                        />
                                        <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                                            <span className="text-gray-400">📅</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-semibold text-gray-700 font-['Poppins']">
                                        Age
                                    </label>
                                    <div className="relative">
                                        <input
                                            className="w-full px-4 py-3 text-base border-2 border-gray-200 rounded-xl transition-all duration-300 bg-gray-50 focus:outline-none cursor-not-allowed"
                                            type="number"
                                            placeholder="Auto-calculated"
                                            value={spouseAge || ""}
                                            readOnly
                                        />
                                        <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                                            <span className="text-gray-400">🎂</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Navigation Buttons */}
                    <div className="flex gap-4 pt-6">
                        <button
                            type="button"
                            className="flex-1 bg-gradient-to-r from-gray-500 to-gray-600 text-white py-4 px-6 rounded-xl font-semibold transition-all duration-300 hover:from-gray-600 hover:to-gray-700 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-gray-500/30 flex items-center justify-center gap-2"
                            onClick={handlePrevious}
                        >
                            <span>←</span>
                            Previous
                        </button>
                        <button
                            type="button"
                            className="flex-1 bg-gradient-to-r from-red-600 to-red-700 text-white py-4 px-6 rounded-xl font-semibold transition-all duration-300 hover:from-red-700 hover:to-red-800 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-red-600/30 flex items-center justify-center gap-2"
                            onClick={handleNext}
                        >
                            Next
                            <span>→</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PersonalDetails;
