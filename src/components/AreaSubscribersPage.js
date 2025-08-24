import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { API_BASE_URL } from '../utils/apiConfig';
import { useUserContext } from '../context/user_context';
import AreaSubscriberList from './AreaSubscriberList';
import './AreaSubscriberList.css';

const AreaSubscribersPage = () => {

    const { employeeId } = useParams(); // Extracting employeeId from URL

    const { user } = useUserContext();
    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState(null);
    const [filteredCount, setFilteredCount] = useState(0);
    const [empRegion, setEmpRegion] = useState(null);
    const fetchDueSubscribers = async () => {
        try {
            setIsLoading(true);
            const apiUrl = `${API_BASE_URL}/employee/${employeeId}`;
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
            const fetchedData = await response.json();
            console.log('fetchedData');
            console.log(fetchedData);
            setData(fetchedData.results.employeeRawDataResult);
            console.log(data);
            setEmpRegion(fetchedData.results.employeeRegionResult)
        } catch (error) {
            console.error('Error fetching groups:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {

        fetchDueSubscribers();
    }, [employeeId, user]);

    const refreshDueSubscribers = () => {
        fetchDueSubscribers();
    };


    const mainContainerStyle = {
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    };

    const handleFilteredCount = (count) => {
        setFilteredCount(count); // Update the count of filtered items
    };
    return <div style={mainContainerStyle}>
        {data && data.length > 0 ? (
            <section className='areacontainer'>
                <h3> Subscriber list ({filteredCount})</h3>

                {isLoading ? (
                    <p>Loading...</p>
                ) : (
                    <AreaSubscriberList people={data} empRegion={empRegion} onFilteredCount={handleFilteredCount} refreshDueSubscribers={refreshDueSubscribers} />
                )}
            </section>
        ) : (
            <section className='areacontainer'>
                <h3>No Receivable data is there to show</h3>
            </section>
        )
        }

    </div>
}

export default AreaSubscribersPage