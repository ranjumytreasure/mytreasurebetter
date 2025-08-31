import React, { useContext, useState, useEffect } from 'react';
import AppContext from './Context';
import { Check } from 'lucide-react';

const ProgressBar = () => {
  const { groupDetails } = useContext(AppContext);
  const [showSticky, setShowSticky] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Safely access the current step
  const currentStep = groupDetails?.currentPage ?? 0;
  const setStep = groupDetails?.setStep;
  const totalSteps = 5; // Total number of steps in your form

  // Step labels
  const stepLabels = [
    'Group Type',
    'Group Details',
    'Commission',
    'Auction',
    'Preview',
    'Complete'
  ];

  // Scroll detection logic
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Show sticky progress bar when scrolling down past 200px
      if (currentScrollY > 200 && currentScrollY > lastScrollY) {
        setShowSticky(true);
      }
      // Hide sticky progress bar when scrolling up or at top
      else if (currentScrollY < lastScrollY || currentScrollY <= 200) {
        setShowSticky(false);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // Handle step click
  const handleStepClick = (stepIndex) => {
    if (setStep && stepIndex <= currentStep) {
      setStep(stepIndex);
    }
  };

  // Reusable progress bar component
  const ProgressBarContent = ({ isSticky = false }) => (
    <div className={`w-full max-w-4xl mx-auto ${isSticky ? 'p-3' : 'mb-6 p-6'} bg-gradient-to-r from-white to-gray-50 ${isSticky ? 'rounded-lg shadow-lg' : 'rounded-2xl shadow-lg'} transition-all duration-300 ${isSticky ? 'border-b border-gray-200' : 'hover:shadow-xl border-2 border-red-200'}`}>
      {!isSticky && (
        <div className="relative mb-6">
          {/* Title integrated into border */}
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-white px-4">
            <span className="text-sm font-bold text-red-600 font-['Poppins']">Group Creation</span>
          </div>
          {/* Current step indicator */}
          <div className="flex items-center justify-center gap-3 pt-4">
            <div className="inline-flex items-center justify-center w-8 h-8 bg-gradient-to-r from-red-500 to-red-600 rounded-full shadow-md">
              <span className="text-white font-bold text-sm">{currentStep + 1}</span>
            </div>
            <p className="text-sm text-gray-600 font-medium">
              {stepLabels[currentStep]} • Step {currentStep + 1} of {totalSteps + 1}
            </p>
          </div>
        </div>
      )}

      {isSticky && (
        <div className="text-center mb-3">
          <div className="inline-flex items-center gap-2">
            <div className="w-6 h-6 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xs">{currentStep + 1}</span>
            </div>
            <p className="text-sm font-semibold text-gray-800 font-['Poppins']">
              {stepLabels[currentStep]} • Step {currentStep + 1} of {totalSteps + 1}
            </p>
          </div>
        </div>
      )}

      <div className={`flex items-center justify-between relative overflow-x-auto ${isSticky ? 'py-1' : 'py-4'}`}>
        {stepLabels.map((label, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;
          const isClickable = index <= currentStep;

          return (
            <div key={index} className={`flex flex-col items-center relative flex-1 ${isSticky ? 'min-w-[40px]' : 'min-w-[50px]'}`}>
              <div
                className={`
                                    ${isSticky ? 'w-7 h-7' : 'w-10 h-10'} rounded-full flex items-center justify-center transition-all duration-300 relative z-10
                                    ${isCompleted
                    ? 'bg-gradient-to-r from-green-500 to-green-600 border-2 border-green-600 text-white shadow-lg shadow-green-500/30'
                    : isCurrent
                      ? 'bg-gradient-to-r from-red-500 to-red-600 border-2 border-red-600 text-white shadow-lg shadow-red-500/30 animate-pulse'
                      : 'bg-gradient-to-r from-gray-100 to-gray-200 border-2 border-gray-300 text-gray-500'
                  }
                                    ${isClickable ? 'cursor-pointer hover:scale-110 hover:shadow-lg transition-all duration-200' : 'cursor-default'}
                                `}
                onClick={() => handleStepClick(index)}
              >
                {isCompleted ? (
                  <Check className="text-white" size={isSticky ? 12 : 14} />
                ) : (
                  <span className={`font-bold ${isSticky ? 'text-xs' : 'text-sm'}`}>{index + 1}</span>
                )}
              </div>
              {!isSticky && (
                <span className={`
                                    mt-1 text-xs font-medium text-center transition-colors duration-300
                                    ${isCompleted ? 'text-green-600 font-semibold' : isCurrent ? 'text-red-600 font-semibold' : 'text-gray-600'}
                                `}>
                  {label}
                </span>
              )}
              {index < totalSteps && (
                <div className={`
                                    absolute ${isSticky ? 'top-3.5' : 'top-5'} left-1/2 w-full h-1 z-0 transition-all duration-300
                                    ${isCompleted
                    ? 'bg-gradient-to-r from-green-500 to-green-600 shadow-sm'
                    : 'bg-gradient-to-r from-gray-200 to-gray-300'
                  }
                                `}></div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <>
      {/* Original Progress Bar */}
      <ProgressBarContent isSticky={false} />

      {/* Sticky Progress Bar */}
      <div className={`
                fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out
                ${showSticky ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}
            `}>
        <div className="bg-white/95 backdrop-blur-sm border-b border-gray-200">
          <ProgressBarContent isSticky={true} />
        </div>
      </div>
    </>
  );
};

export default ProgressBar;

