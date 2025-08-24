import React, { useEffect, useState } from 'react';
import { useGroupDetailsContext } from '../context/group_context';
import BidSubscriberList from './BidSubscriberList'
import "../style/GroupSubscriberDetailsPopup.css";

//data 

//sub compoent while submitting bid need to show the subscribers going to bid
// const GroupSubscriberDetailsPopup = ({ onClose, onCloseRightSide }) => {

//     const { state: groupDetailsState } = useGroupDetailsContext();
//     const { data: groups } = groupDetailsState;
//     console.log(groups.results.groupSubcriberResult);
//     const [people, setPeople] = useState(groups.results.groupSubcriberResult)
//     const [filteredCount, setFilteredCount] = useState(0);

//     useEffect(() => {

//         // Access 'groups' data here
//         // Extract the 'subscribers' array from 'groups' data
//         console.log(groups);

//         // const items = groups ? groups.results.subscribers || [] : [];

//         // Add your logic here using 'groups' data
//     }, [groups]);

//     // Rest of your component code...
//     const handleBidClick = (grpSubid, user_image_from_s3, name, phone, id) => {

//         console.log('Clicked on bid with ID:', grpSubid);
//         if (grpSubid) {
//             onClose(grpSubid, user_image_from_s3, name, phone, id);
//         }
//         else {
//             onClose(null, null, null, null, null);
//         }
//     };
//     const handleFilteredCount = (count) => {
//         setFilteredCount(count); // Update the count of filtered items
//     };

//     return (
//         <div>

//             <section className='bidcontainer'>
//                 <h3>{filteredCount} Group Subscribers</h3>
//                 <BidSubscriberList people={people} onBidClick={handleBidClick} onFilteredCount={handleFilteredCount} />
//                 <button onClick={() => setPeople([])}>clear all</button>
//                 <div className='close-button' onClick={onCloseRightSide}>
//                     X
//                 </div>
//             </section>


//         </div>

//     );
// };
const GroupSubscriberDetailsPopup = ({ onClose, onCloseRightSide }) => {
    // const { state: groupDetailsState } = useGroupDetailsContext();
    // const { data: groups } = groupDetailsState;
    // const [people, setPeople] = useState(groups.results.groupSubcriberResult || []);

    const { data } = useGroupDetailsContext();

    const groups = data?.results?.groups;
    const people = data?.results?.groupSubcriberResult;

    const [filteredCount, setFilteredCount] = useState(0);

    const handleBidClick = (grpSubid, user_image_from_s3, name, phone, id) => {
        onClose(grpSubid, user_image_from_s3, name, phone, id);
    };

    const handleFilteredCount = (count) => setFilteredCount(count);

    return (
        <div className="subscriber-popup-container">
            <h3>{filteredCount} Group Subscribers</h3>
            <BidSubscriberList
                people={people}
                onBidClick={handleBidClick}
                onFilteredCount={handleFilteredCount}
            />

            <button className="close-button" onClick={onCloseRightSide}>×</button>
        </div>
    );
};


export default GroupSubscriberDetailsPopup;
