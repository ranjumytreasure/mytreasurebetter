import React, { useContext, useEffect, useRef } from 'react';
import AppContext from './Context';

const BusinessDetails = () => {
    const { businessDetails, stepDetails } = useContext(AppContext);
    const { businessType, setBusinessType, annualTurnover, setAnnualTurnover } = businessDetails;
    const { setStep, focusTrigger } = stepDetails;
    const firstInputRef = useRef(null);

    const handleNext = () => setStep((prevStep) => prevStep + 1);
    const handlePrevious = () => setStep((prevStep) => prevStep - 1);

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
        <div className="max-w-2xl mx-auto my-4 bg-white rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1 overflow-hidden">
            <div className="bg-red-600 text-white p-6 text-center">
                <h2 className="text-2xl font-bold font-['Poppins']">Business Details</h2>
            </div>
            <div className="p-8">
                <div className="flex flex-col p-4 w-full max-w-lg mx-auto">
                    <form className="flex flex-col">
                        <input
                            ref={firstInputRef}
                            className="rounded-lg border-2 border-gray-200 mb-4 px-4 py-3 text-base transition-colors duration-300 bg-white focus:outline-none focus:border-red-600 focus:shadow-lg focus:shadow-red-600/10"
                            type="text"
                            placeholder="Business Type"
                            value={businessType}
                            onChange={(e) => setBusinessType(e.target.value)}
                        />
                        <input
                            className="rounded-lg border-2 border-gray-200 mb-4 px-4 py-3 text-base transition-colors duration-300 bg-white focus:outline-none focus:border-red-600 focus:shadow-lg focus:shadow-red-600/10"
                            type="number"
                            placeholder="Annual Turnover"
                            value={annualTurnover}
                            onChange={(e) => setAnnualTurnover(e.target.value)}
                        />
                        <div className="flex gap-4 mt-6">
                            <button
                                type="button"
                                className="flex-1 bg-gradient-to-r from-red-600 to-red-700 text-white py-3 px-6 rounded-lg font-semibold transition-all duration-300 hover:from-red-700 hover:to-red-800 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-red-600/30"
                                onClick={handlePrevious}
                            >
                                Previous
                            </button>
                            <button
                                type="button"
                                className="flex-1 bg-gradient-to-r from-red-600 to-red-700 text-white py-3 px-6 rounded-lg font-semibold transition-all duration-300 hover:from-red-700 hover:to-red-800 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-red-600/30"
                                onClick={handleNext}
                            >
                                Next
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default BusinessDetails;
