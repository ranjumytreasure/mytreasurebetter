import React, { useState, useEffect } from 'react';
import { GroupWiseOverallDue, GroupAccountWiseOverallDue } from '../components';
import { useHistory, useParams } from 'react-router-dom';
import { API_BASE_URL } from '../utils/apiConfig';
import { useUserContext } from '../context/user_context';
import loadingImage from '../images/preloader.gif';

const CustomerDue = () => {

    const history = useHistory();
    const { groupId } = useParams();
    const { isLoggedIn, user, isLoading, setIsLoading } = useUserContext();
    const [data, setData] = useState([]);

    const [GroupWiseOverallDuedata, setGroupWiseOverallDue] = useState({
        group_id: "",
        total_supposed_to_pay: "",
        total_paid_amount: "",
        total_outstanding_balance: "",
    });

    useEffect(() => {
        const fetchGroups = async () => {
            try {
                setIsLoading(true);
                // const apiUrl = `${API_BASE_URL}/users/groups/${groupId}`;
                const apiUrl = `${API_BASE_URL}/groups/${groupId}/customer-due`;

             
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
                console.log('Salem');
                console.log(fetchedData);
                const firstGroup = fetchedData.results.groupsWiseResult[0];

                if (firstGroup) {
                    setGroupWiseOverallDue({
                        group_id: firstGroup.group_id || "",
                        total_supposed_to_pay: firstGroup.total_supposed_to_pay || "",
                        total_paid_amount: firstGroup.total_paid_amount || "",
                        total_outstanding_balance: firstGroup.total_outstanding_balance || "",
                    });
                }

                const groupAccountWiseResult = fetchedData.results.groupAccountWiseResult;

                if (groupAccountWiseResult) {
                    setData(fetchedData);
                }

            } catch (error) {
                console.error('Error fetching groups:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchGroups();
    }, [groupId, setIsLoading]); // Fetch data whenever the groupId changes
    useEffect(() => {
        console.log(GroupWiseOverallDuedata); // This will log the updated state
    }, [GroupWiseOverallDuedata]);
    if (isLoading) {
        return (
            <>
                <img src={loadingImage} className='loading-img' alt='loding' />
                <div className="placeholder" style={{ height: '50vh' }}></div>
            </>
        );
    }

    return (<>
        <GroupWiseOverallDue GroupWiseOverallDuedata={GroupWiseOverallDuedata} />
        <GroupAccountWiseOverallDue data={data} />
    </>
    );


}
export default CustomerDue