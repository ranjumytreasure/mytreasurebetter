import React, { useContext } from 'react';
import { useHistory } from 'react-router-dom'; // Import useHistory
import AppContext from '../pages/MultiStepGroupCreation/Context'

const GroupDataInNavbar = () => {
    // const { groupDetails } = useContext(AppContext);
    const history = useHistory(); // Get access to the router's history object

    // Initialize storedGroupData to null or a default value
    let storedGroupData = null;

    try {
        storedGroupData = JSON.parse(localStorage.getItem('unauthenticatedGroup'));
    } catch (error) {
        console.error('Error parsing stored group data:', error);
        // Handle the error gracefully, e.g., set default values or show an error message
    }

    const handleContinueClick = () => {

        if (storedGroupData) {
            // Use history.push to navigate to '/startagroup' with state data
            console.log('Stored Group Data:', storedGroupData);
            history.push('/startagroup', { storedGroupData });
        }

    };

    return (
        <div className="partialGroupData">
            {storedGroupData && (
                <div>
                    <p>Partially Entered Group Data:</p>
                    <button type='button' onClick={handleContinueClick}>Continue</button>
                    <p>Group Name: {storedGroupData.groupName}</p>
                    {/* Display other group details similarly */}

                </div>
            )}
        </div>
    );
};

export default GroupDataInNavbar;
