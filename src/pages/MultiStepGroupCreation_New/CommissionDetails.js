import React, { useContext, useEffect, useState, useRef } from "react";
import AppContext from "./Context";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Yellow bulb SVG icon
const BulbIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#f1c40f"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M9 18h6M10 22h4M12 2a7 7 0 0 1 7 7c0 3-3 5-3 5H8s-3-2-3-5a7 7 0 0 1 7-7z" />
  </svg>
);

function LabelWithHelp({ children, helpText }) {
  return (
    <label className="flex items-center gap-2 font-semibold text-gray-700 font-['Poppins']">
      {children}
      <div className="relative group cursor-pointer">
        <BulbIcon />
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-max max-w-[220px] bg-gray-800 text-white text-xs rounded-lg px-3 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-10">
          {helpText}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
        </div>
      </div>
    </label>
  );
}

export default function CommissionDetails() {
  const { groupDetails: updateContext } = useContext(AppContext);
  const firstInputRef = useRef(null);

  const groupAmt = updateContext.groupAmt || 0;
  const [localCommPercent, setLocalCommPercent] = useState(updateContext.commPercent || 5);
  const [localCommAmt, setLocalCommAmt] = useState(0);

  const calculateCommAmt = (percentage) => {
    return Math.round((groupAmt * percentage) / 100);
  };

  useEffect(() => {
    if (updateContext.commType === "ONEVERYAUCTION") {
      setLocalCommPercent(5);
    } else if (updateContext.commType === "LUMPSUM") {
      setLocalCommPercent(100);
    }
  }, [updateContext.commType]);

  useEffect(() => {
    const calculatedAmount = calculateCommAmt(localCommPercent);
    setLocalCommAmt(calculatedAmount);
    updateContext.setCommPercent(localCommPercent);
    updateContext.setCommAmt(calculatedAmount);
  }, [localCommPercent, groupAmt]);

  // Auto-focus first input when component mounts
  useEffect(() => {
    if (firstInputRef.current && updateContext.focusTrigger) {
      const timer = setTimeout(() => {
        firstInputRef.current.focus();
      }, 200); // Delay to ensure smooth scroll completes first

      return () => clearTimeout(timer);
    }
  }, [updateContext.focusTrigger]);

  const next = () => {
    if (!updateContext.commType) {
      toast.error("Please select a commission type");
      return;
    }
    updateContext.setCommPercent(localCommPercent);
    updateContext.setCommAmt(localCommAmt);
    updateContext.setStep(updateContext.currentPage + 1);
  };

  return (
    <div className="max-w-4xl mx-auto my-6 bg-white rounded-3xl shadow-xl transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 overflow-hidden border border-gray-100">
      <div className="bg-gradient-to-r from-red-600 via-red-700 to-red-800 text-white p-8 text-center relative">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>
        <div className="relative z-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4 backdrop-blur-sm">
            <span className="text-2xl">💰</span>
          </div>
          <h2 className="text-3xl font-bold font-['Poppins'] mb-2">Commission Details</h2>
          <p className="text-red-100 text-sm">Set up commission structure for your group</p>
        </div>
      </div>
      <div className="p-8">
        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
          <div className="space-y-2">
            <LabelWithHelp helpText="Select the type of commission to charge">
              Commission Type:
            </LabelWithHelp>
            <div className="space-y-3">
              <label className="relative cursor-pointer block">
                <input
                  ref={firstInputRef}
                  type="radio"
                  name="commType"
                  value="ONEVERYAUCTION"
                  checked={updateContext.commType === "ONEVERYAUCTION"}
                  onChange={() => updateContext.setCommType("ONEVERYAUCTION")}
                  className="sr-only"
                />
                <div className={`p-4 rounded-xl border-2 transition-all duration-300 ${updateContext.commType === "ONEVERYAUCTION"
                    ? 'border-red-500 bg-red-50 shadow-md'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${updateContext.commType === "ONEVERYAUCTION"
                        ? 'border-red-500 bg-red-500'
                        : 'border-gray-300'
                      }`}>
                      {updateContext.commType === "ONEVERYAUCTION" && (
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      )}
                    </div>
                    <span className="font-medium text-gray-800">On Every Auction</span>
                  </div>
                </div>
              </label>
              <label className="relative cursor-pointer block">
                <input
                  type="radio"
                  name="commType"
                  value="LUMPSUM"
                  checked={updateContext.commType === "LUMPSUM"}
                  onChange={() => updateContext.setCommType("LUMPSUM")}
                  className="sr-only"
                />
                <div className={`p-4 rounded-xl border-2 transition-all duration-300 ${updateContext.commType === "LUMPSUM"
                    ? 'border-red-500 bg-red-50 shadow-md'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${updateContext.commType === "LUMPSUM"
                        ? 'border-red-500 bg-red-500'
                        : 'border-gray-300'
                      }`}>
                      {updateContext.commType === "LUMPSUM" && (
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      )}
                    </div>
                    <span className="font-medium text-gray-800">Lump Sum</span>
                  </div>
                </div>
              </label>
            </div>
          </div>

          <div className="space-y-2">
            <LabelWithHelp helpText="Percentage of group amount as commission">
              Commission Percentage:
            </LabelWithHelp>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={localCommPercent}
                onChange={(e) => setLocalCommPercent(Number(e.target.value))}
                className="w-20 px-4 py-4 text-base border-2 border-gray-200 rounded-xl transition-all duration-300 bg-white focus:outline-none focus:border-red-500 focus:shadow-lg focus:shadow-red-500/20 hover:border-gray-300"
              />
              <span className="text-gray-600 font-medium">%</span>
            </div>
          </div>

          <div className="space-y-2">
            <LabelWithHelp helpText="Calculated commission amount based on percentage">
              Commission Amount:
            </LabelWithHelp>
            <input
              type="text"
              value={localCommAmt}
              readOnly
              className="w-full px-4 py-4 text-base border-2 border-gray-200 rounded-xl transition-all duration-300 bg-gray-50 focus:outline-none cursor-not-allowed"
            />
          </div>

          <div className="flex gap-4 pt-6">
            <button
              type="button"
              className="flex-1 bg-gradient-to-r from-gray-500 to-gray-600 text-white py-4 px-6 rounded-xl font-semibold transition-all duration-300 hover:from-gray-600 hover:to-gray-700 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-gray-500/30 flex items-center justify-center gap-2"
              onClick={() => updateContext.setStep(updateContext.currentPage - 1)}
            >
              <span>←</span>
              Previous
            </button>
            <button
              type="button"
              className="flex-1 bg-gradient-to-r from-red-600 to-red-700 text-white py-4 px-6 rounded-xl font-semibold transition-all duration-300 hover:from-red-700 hover:to-red-800 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-red-600/30 flex items-center justify-center gap-2"
              onClick={next}
            >
              Next
              <span>→</span>
            </button>
          </div>
        </form>
      </div>
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        toastStyle={{
          textAlign: 'center'
        }}
      />
    </div>
  );
}
