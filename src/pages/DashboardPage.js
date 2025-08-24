import React, { useState, useEffect } from 'react';
import { DashboardMasterInfo, DashboardGroups, DashboardAreaWiseGroups } from '../components';
import { useHistory, useParams } from 'react-router-dom';
import { API_BASE_URL } from '../utils/apiConfig';
import { useUserContext } from '../context/user_context';
import { useDashboardContext } from '../context/dashboard_context';

import loadingImage from '../images/preloader.gif';



const DashboardPage = () => {

    const { user } = useUserContext();
    const { updateDashboardDetails } = useDashboardContext();



    const [isLoading, setIsLoading] = useState(true); // Define isLoading state
    const [data, setData] = useState(null); // Define data state

    useEffect(() => {
        const fetchDashboardDetails = async () => {
            try {
                setIsLoading(true);
                const apiUrl = `${API_BASE_URL}/dashboard`;
                const response = await fetch(apiUrl, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${user?.results?.token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch groups');
                }
                const dashboardData = await response.json();
                updateDashboardDetails(dashboardData)


            } catch (error) {
                console.error('Error fetching dashboard details:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchDashboardDetails();
    }, [user]); // Fetch data whenever the groupId changes

    if (isLoading) {
        return (
            <>
                <img src={loadingImage} className='loading-img' alt='loding' />
                <div className="placeholder" style={{ height: '50vh' }}></div>
            </>
        );
    }

    return (<>
        <DashboardMasterInfo />
        {/* <DashboardGroups /> */}
        <DashboardAreaWiseGroups />

    </>
    );


}

export default DashboardPage
