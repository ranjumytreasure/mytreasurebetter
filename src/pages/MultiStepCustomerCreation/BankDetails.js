import React, { useContext, useEffect, useRef } from 'react';
import AppContext from './Context';

const BankDetails = () => {
    const { bankDetails, stepDetails } = useContext(AppContext);
    const { bankName, setBankName, branch, setBranch, bankIFSC, setBankIFSC, accountNumber, setAccountNumber } = bankDetails;
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
        <div className="max-w-4xl mx-auto my-6 bg-white rounded-3xl shadow-xl transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 overflow-hidden border border-gray-100">
            <div className="bg-gradient-to-r from-red-600 via-red-700 to-red-800 text-white p-8 text-center relative">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>
                <div className="relative z-10">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4 backdrop-blur-sm">
                        <span className="text-2xl">🏦</span>
                    </div>
                    <h2 className="text-3xl font-bold font-['Poppins'] mb-2">Bank Details</h2>
                    <p className="text-red-100 text-sm">Your banking information</p>
                </div>
            </div>
            <div className="p-8">
                <form className="space-y-6">
                    {/* Bank Name */}
                    <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700 font-['Poppins']">
                            Bank Name <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <input
                                ref={firstInputRef}
                                className="w-full px-4 py-4 text-base border-2 border-gray-200 rounded-xl transition-all duration-300 bg-white focus:outline-none focus:border-red-500 focus:shadow-lg focus:shadow-red-500/20 hover:border-gray-300"
                                type="text"
                                placeholder="Enter your bank name"
                                value={bankName}
                                onChange={(e) => setBankName(e.target.value)}
                            />
                            <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                                <span className="text-gray-400">🏦</span>
                            </div>
                        </div>
                    </div>

                    {/* Branch and IFSC */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-gray-700 font-['Poppins']">
                                Branch Name <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <input
                                    className="w-full px-4 py-4 text-base border-2 border-gray-200 rounded-xl transition-all duration-300 bg-white focus:outline-none focus:border-red-500 focus:shadow-lg focus:shadow-red-500/20 hover:border-gray-300"
                                    type="text"
                                    placeholder="Enter branch name"
                                    value={branch}
                                    onChange={(e) => setBranch(e.target.value)}
                                />
                                <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                                    <span className="text-gray-400">🏢</span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-gray-700 font-['Poppins']">
                                IFSC Code <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <input
                                    className="w-full px-4 py-4 text-base border-2 border-gray-200 rounded-xl transition-all duration-300 bg-white focus:outline-none focus:border-red-500 focus:shadow-lg focus:shadow-red-500/20 hover:border-gray-300"
                                    type="text"
                                    placeholder="Enter IFSC code"
                                    value={bankIFSC}
                                    onChange={(e) => setBankIFSC(e.target.value)}
                                />
                                <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                                    <span className="text-gray-400">🔢</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Account Number */}
                    <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700 font-['Poppins']">
                            Account Number <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <input
                                className="w-full px-4 py-4 text-base border-2 border-gray-200 rounded-xl transition-all duration-300 bg-white focus:outline-none focus:border-red-500 focus:shadow-lg focus:shadow-red-500/20 hover:border-gray-300"
                                type="number"
                                placeholder="Enter your account number"
                                value={accountNumber}
                                onChange={(e) => setAccountNumber(e.target.value)}
                            />
                            <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                                <span className="text-gray-400">💳</span>
                            </div>
                        </div>
                    </div>

                    {/* Bank Info Card */}
                    <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-2xl p-6 border border-red-200">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center">
                                <span className="text-white text-sm">🔒</span>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-800 font-['Poppins']">
                                Secure Banking
                            </h3>
                        </div>
                        <p className="text-sm text-gray-600">
                            Your banking information is encrypted and secure. We only use this for verification purposes.
                        </p>
                    </div>

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

export default BankDetails;
