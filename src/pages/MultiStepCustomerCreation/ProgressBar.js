import React, { useContext } from 'react';
import AppContext from './Context';

const ProgressBar = () => {
    const { stepDetails } = useContext(AppContext);

    // Safely access the current step
    const completedSteps = stepDetails?.step ?? 0; // Use `step` from context and fallback to 0 if undefined
    const totalSteps = 9; // Total number of steps in your form

    // Calculate the percentage of completed steps
    const percent = Math.min((completedSteps / totalSteps) * 100, 100); // Ensure percentage doesn't exceed 100

    // Styles
    const background = {
        backgroundColor: '#dee2e6',
        height: 8,
        width: 350,
        borderRadius: 20,
    };

    const progress = {
        backgroundColor: '#43aa8b',
        height: 8,
        width: `${percent}%`,
        borderRadius: 20,
    };

    const text = {
        fontSize: 12,
        color: '#8d99ae',
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '2rem' }}>
            <p style={text}>
                Step {completedSteps + 1} of {totalSteps + 1} {/* Display step as 1-indexed for clarity */}
            </p>
            <div style={background}>
                <div style={progress}></div>
            </div>
        </div>
    );
};

export default ProgressBar;
