// import React, { useState, useEffect } from 'react';
// import { GroupWiseOverallUserDue, GroupAccountWiseOverallUserDue } from '../components';
// import { useParams } from 'react-router-dom';
// import { API_BASE_URL } from '../utils/apiConfig';
// import { useUserContext } from '../context/user_context';
// import loadingImage from '../images/preloader.gif';

// const UserDue = () => {


//     const { groupId } = useParams();
//     const { user, isLoading, setIsLoading } = useUserContext();
//     const [data, setData] = useState([]);

//     const [GroupWiseOverallUserDuedata, setGroupWiseOverallUserDuedata] = useState({
//         group_id: "",
//         total_supposed_to_pay: "",
//         total_paid_amount: "",
//         total_outstanding_balance: "",
//     });


//     useEffect(() => {
//         const fetchGroups = async () => {
//             try {
//                 setIsLoading(true);
//                 // const apiUrl = `${API_BASE_URL}/users/groups/${groupId}`;
//                 const apiUrl = `${API_BASE_URL}/groups/${groupId}/your-due`;

//                 console.log(apiUrl);
//                 const response = await fetch(apiUrl, {
//                     method: 'GET',
//                     headers: {
//                         'Authorization': `Bearer ${user?.results?.token}`,
//                         'Content-Type': 'application/json',
//                     },
//                 });

//                 if (!response.ok) {
//                     throw new Error('Failed to fetch groups');
//                 }

//                 const fetchedData = await response.json();
             
//                 setData(fetchedData);
//                 const firstGroup = fetchedData.results.groupWiseResult[0];

//                 if (firstGroup) {
//                     setGroupWiseOverallUserDuedata({
//                         group_id: firstGroup.group_id || "",
//                         total_supposed_to_pay: firstGroup.total_supposed_to_pay || "",
//                         total_paid_amount: firstGroup.total_paid_amount || "",
//                         total_outstanding_balance: firstGroup.total_outstanding_balance || "",
//                     });
//                 }

//                 const groupAccountWiseResult = fetchedData.results.groupAccountWiseResult;



//             } catch (error) {
//                 console.error('Error fetching groups:', error);
//             } finally {
//                 setIsLoading(false);
//             }
//         };
//         fetchGroups();
//     }, [groupId, setIsLoading]); // Fetch data whenever the groupId changes
//     useEffect(() => {
       

//         console.log(GroupWiseOverallUserDuedata); // This will log the updated state
       
//     }, [GroupWiseOverallUserDuedata]);

//     if (isLoading) {
//         return (
//             <>
//                 <img src={loadingImage} className='loading-img' alt='loding' />
//                 <div className="placeholder" style={{ height: '50vh' }}></div>
//             </>
//         );
//     }
 
//     return (<>
//         <GroupWiseOverallUserDue GroupWiseOverallUserDuedata={GroupWiseOverallUserDuedata} />
//         <GroupAccountWiseOverallUserDue data={data} />

//     </>
//     );
// }
// export default UserDue

import React, { useState, useEffect } from 'react';
import {YourDue  } from '../components';
import { useParams } from 'react-router-dom';
import { API_BASE_URL } from '../utils/apiConfig';
import { useUserContext } from '../context/user_context';
import loadingImage from '../images/preloader.gif';

const UserDue = () => {
  const { groupId } = useParams();
  const { user, isLoading, setIsLoading } = useUserContext();
  const [data, setData] = useState([]);
  const [GroupWiseOverallUserDuedata, setGroupWiseOverallUserDuedata] = useState({
    group_id: '',
    total_supposed_to_pay: '',
    total_paid_amount: '',
    total_outstanding_balance: '',
  });

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        setIsLoading(true);
        const apiUrl = `${API_BASE_URL}/groups/${groupId}/your-due`;

        const response = await fetch(apiUrl, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${user?.results?.token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) throw new Error('Failed to fetch groups');

        const fetchedData = await response.json();
        setData(fetchedData);

        const firstGroup = fetchedData.results.groupWiseResult[0];
        if (firstGroup) {
          setGroupWiseOverallUserDuedata({
            group_id: firstGroup.group_id || '',
            total_supposed_to_pay: firstGroup.total_supposed_to_pay || '',
            total_paid_amount: firstGroup.total_paid_amount || '',
            total_outstanding_balance: firstGroup.total_outstanding_balance || '',
          });
        }

      } catch (error) {
        console.error('Error fetching groups:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGroups();
  }, [groupId, setIsLoading]);

  if (isLoading) {
    return (
      <>
        <img src={loadingImage} className="loading-img" alt="loading" />
        <div className="placeholder" style={{ height: '50vh' }}></div>
      </>
    );
  }

  return (
    <>
      <YourDue data={data} GroupWiseOverallUserDuedata={GroupWiseOverallUserDuedata} />
    </>
  );
};

export default UserDue;