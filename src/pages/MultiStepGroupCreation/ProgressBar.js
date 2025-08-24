import React, { useContext } from 'react';
import AppContext from './Context';

const ProgressBar = () => {
    const myContext = useContext(AppContext);
    const updateContext = myContext.groupDetails;

    const completedSteps = updateContext.currentPage; // Number of completed steps

    const totalSteps = 5; // Total number of steps in your form

    // Calculate the percentage of completed steps
    const percent = (completedSteps / totalSteps) * 100;

    const background = {
        backgroundColor: '#dee2e6',
        height: 8,
        width: 350,
        borderRadius: 20,
    }

    const progress = {
        backgroundColor: '#43aa8b',
        height: 8,
        width: percent + '%', // Use the percentage for width
        borderRadius: 20,
    }

    const text = {
        fontSize: 12,
        color: '#8d99ae',
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '2rem' }}>
            <p style={text}>{completedSteps} of {totalSteps} completed</p>
            <div style={background}>
                <div style={progress}>
                </div>
            </div>
        </div>
    );
};

export default ProgressBar;
