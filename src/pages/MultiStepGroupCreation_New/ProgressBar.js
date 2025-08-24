import React, { useContext } from 'react';
import { FaCheck } from 'react-icons/fa';
import AppContext from './Context';

const steps = [
  'Group Type',
  'Group Details',
  'Commission Details',
  'Auction Details',
  'Preview & Submit',
  'Finish',
];

const ProgressBar = () => {
  const { groupDetails } = useContext(AppContext);
  const currentStep = groupDetails.currentPage;

  return (
    <div className="progressbar-wrapper">
      {/* Heading */}
      <h2 className="progress-heading">Steps</h2>

      <div className="progressbar">
        {steps.map((label, index) => {
          const completed = index < currentStep;
          const active = index === currentStep;

          return (
            <div key={index} className="progress-step">
              <div
                className={`step-circle ${completed ? 'completed' : ''} ${active ? 'active' : ''
                  }`}
              >
                {completed ? <FaCheck size={14} /> : index + 1}
              </div>

              <div
                className={`step-label ${active ? 'active' : ''}`}
              >
                {label}
              </div>

              {/* "You are here" label & arrow only on active step */}
              {active && (
                <div className="you-are-here">
                  You are here
                </div>
              )}

              {/* Connector line (skip for last item) */}
              {index < steps.length - 1 && (
                <div
                  className={`step-line ${completed ? 'completed' : ''}`}
                ></div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProgressBar;

