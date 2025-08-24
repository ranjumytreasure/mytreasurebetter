import React from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { Link } from 'react-router-dom'; // Import Link

const formatDate = (dateString) => {
    console.log('formatDate');
    console.log(dateString);
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    const formattedDate = new Date(dateString).toLocaleDateString(undefined, options);
    return formattedDate;
};

const GroupAccountList = ({ items, removeItem, editItem, type }) => {


    const renderFixedView = () => (
        <div className='subcriber-list'>
            <article className='subcriber-header' style={{ padding: "4px 16px" }}>
               <p>S.No</p>
                <p>Date</p>
                <p>Due</p>
                <p>Profit</p>
                <p>Comm</p>
                <p>PrizeMoney</p>               
                          
            </article>
            {items?.map((item, index) => {
                const { grpAccountId, group_id, auctionDate, auctionAmount, commision, profit, customerDue, auctionStatus,prizeMoney,sno } = item;
                const formattedAuctionDate = formatDate(auctionDate);

                return (
                    // <Link to={`/groups/${group_id}/accounts/${grpAccountId}`} key={index}>
                        <article className='subcriber-item'>
                        <p className='title'>{sno ?? 0}</p>
                            <p className={`title ${auctionStatus === 'completed' ? 'completed-date' : ''}`}>{formattedAuctionDate}</p>
                            <p className='title'>{customerDue ?? 0}</p>
                            <p className='title'>{profit ?? 0}</p>
                            <p className='title'>{commision ?? 0}</p>
                            <p className='title'>{prizeMoney ?? 0}</p>
                            <p className='title'>{auctionAmount ?? 0}</p>
                           
                           
                        
                        </article>
                    //</Link>
                );
            })}
        </div>
    );

    const renderAccumulativeView = () => {
        return (
            <div className='subcriber-list'>
                <article className='subcriber-header' style={{ padding: "4px 16px" }}>
                <p>S.No</p>
                    <p>Date</p>
                    <p>AucAmt</p>
                    <p>Commision</p>
                    <p>Reserve</p>
                    <p>Due</p>
                </article>
                {items?.map((item, index) => {
                    const {
                        grpAccountId,
                        group_id,
                        auctionDate,
                        auctionAmount,
                        commision,
                        reserve,
                        customerDue,
                        auctionStatus,sno
                    } = item;
    
                    return (
                        // <Link to={`/groups/${group_id}/accounts/${grpAccountId}`} key={index}>
                            <article className='subcriber-item'>
                            <p className='title'>{sno ?? 0}</p>
                                <p className={`title ${auctionStatus === 'completed' ? 'completed-date' : ''}`}>{formatDate(auctionDate)}</p>
                                <p className='title'>{auctionAmount ?? 0}</p>
                                <p className='title'>{commision ?? 0}</p>
                                <p className='title'>{reserve ?? 0}</p>
                                <p className='title'>{customerDue ?? 0}</p>
                            </article>
                       // </Link>
                    );
                })}
            </div>
        );
    };
    
    const renderDeductiveView = () => {
        return (
            <div className='subcriber-list'>
                <article className='subcriber-header' style={{ padding: "4px 16px" }}>
                <p>S.No</p>
                    <p>Date</p>
                    <p>AucAmt</p>
                    <p>Commision</p>
                    <p>Profit</p>
                    <p>Due</p>
                </article>
                {items?.map((item, index) => {
                    const {
                        grpAccountId,
                        group_id,
                        auctionDate,
                        auctionAmount,
                        commision,
                        profit,
                        customerDue,
                        auctionStatus,
                        sno
                    } = item;
    
                    return (
                        // <Link to={`/groups/${group_id}/accounts/${grpAccountId}`} key={index}>
                            <article className='subcriber-item'>

                            <p className='title'>{sno ?? 0}</p>
                                <p className={`title ${auctionStatus === 'completed' ? 'completed-date' : ''}`}>{formatDate(auctionDate)}</p>
                                <p className='title'>{auctionAmount ?? 0}</p>
                                <p className='title'>{commision ?? 0}</p>
                                <p className='title'>{profit ?? 0}</p>
                                <p className='title'>{customerDue ?? 0}</p>
                            </article>
                        // </Link>
                    );
                })}
            </div>
        );
    };

    
    // Conditional return based on type
    if (type.trim() === 'FIXED') {
        return renderFixedView();
    } else if (type.trim() === 'DEDUCTIVE') {
        return renderDeductiveView();
    } else if (type.trim() === 'ACCUMULATIVE') {
        return renderAccumulativeView();
    } else {
        return <div>No data to display.</div>;
    }
};

export default GroupAccountList;
