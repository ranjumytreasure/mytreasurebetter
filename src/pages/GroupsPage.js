// import { useEffect } from 'react';
// import { Groups, GroupSubscriber, UserInfo } from '../components';
// import { useParams } from 'react-router-dom';
// import loadingImage from '../images/preloader.gif';
// import { useGroupDetailsContext } from '../context/group_context';

// const GroupsPage = () => {
//   const { groupId } = useParams();
//   const { state, fetchGroups } = useGroupDetailsContext();

//   useEffect(() => {
//     if (groupId) {
//       fetchGroups(groupId);
//     }
//   }, [groupId, fetchGroups]);

//   if (state.isLoading) {
//     return (
//       <>
//         <img src={loadingImage} className='loading-img' alt='loading' />
//         <div className="placeholder" style={{ height: '50vh' }}></div>
//       </>
//     );
//   }

//   return (
//     <>
//       <UserInfo data={state.data} />
//       <Groups data={state.data} />
//       <GroupSubscriber data={state.data} />
//     </>
//   );
// };

// export default GroupsPage;





// import  { useState, useEffect } from 'react';
// import {  Groups, GroupSubscriber, UserInfo } from '../components';
// import {  useParams } from 'react-router-dom';
// import { API_BASE_URL } from '../utils/apiConfig';
// import { useUserContext } from '../context/user_context';
// import { useGroupDetailsContext } from '../context/group_context';
// import loadingImage from '../images/preloader.gif';

// const GroupsPage = () => {


//     const { groupId } = useParams();
//     const {  user, isLoading, setIsLoading } = useUserContext();
//     const [data, setData] = useState(null); // Initialize data as null

//     const { state: groupDetailsState, dispatch: groupDetailsDispatch } = useGroupDetailsContext();



//     useEffect(() => {
//         const fetchGroups = async () => {
//             try {
//                 setIsLoading(true);
//                 const apiUrl = `${API_BASE_URL}/users/groups/${groupId}`;
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

//                 // Dispatch an action to set the data in the context
//                 // Dispatch an action to set the data in the context
//                 groupDetailsDispatch({ type: 'SET_DATA', payload: fetchedData });
//                 console.log('*******mani-Fetched Data****************')
//                 console.log(fetchedData);
//                 console.log('***********Fetched Data************');


//             } catch (error) {
//                 console.error('Error fetching groups:', error);
//             } finally {
//                 setIsLoading(false);
//             }
//         };
//         fetchGroups();
//     }, [groupId, setIsLoading, groupDetailsDispatch]); // Fetch data whenever the groupId changes

//     if (isLoading) {
//         return (
//             <>
//                 <img src={loadingImage} className='loading-img' alt='loding' />
//                 <div className="placeholder" style={{ height: '50vh' }}></div>
//             </>
//         );
//     }

//     return (<>
//         <UserInfo data={data} />
//         <Groups data={data} />
//         <GroupSubscriber data={data} />
//     </>
//     );




// }

// export default GroupsPage


// pages/GroupsPage.js
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { UserInfo, Groups, GroupSubscriber } from "../components";
import loadingImage from "../images/preloader.gif";
import { useGroupDetailsContext } from "../context/group_context";

const GroupsPage = () => {
    const { groupId } = useParams();
    const { data, isLoading, fetchGroups } = useGroupDetailsContext();

    useEffect(() => {
        if (groupId) {
            fetchGroups(groupId);
        }
    }, [groupId]);

    if (isLoading) {
        return (
            <>
                <img src={loadingImage} className="loading-img" alt="loading" />
                <div className="placeholder" style={{ height: "50vh" }}></div>
            </>
        );
    }

    const hasData = data && Object.keys(data).length > 0;

    return (
        <>
            {hasData ? (
                <>
                    <UserInfo data={data} />
                    <Groups data={data} />
                    <GroupSubscriber data={data} />
                </>
            ) : (
                <div style={{ textAlign: "center", marginTop: "2rem" }}>
                    No data available.
                </div>
            )}
        </>
    );
};

export default GroupsPage;
