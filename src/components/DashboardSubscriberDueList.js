import React from 'react';
import { Link } from 'react-router-dom'; // Import Link

const DashboardSubscriberDueList = ({ items }) => {
    return (
        <div className='subcriber-list'>
            <article className='subcriber-header' style={{ padding: "4px 16px" }}>
                <p >SubscriberName</p>
                <p >Total</p>
                <p >Paid</p>
                <p >Due</p>

            </article>
            {items?.map((item, index) => {
                const { name, total, paid, due, subscriber_id } = item;
                const truncatedName = name && name.length > 10 ? `${name.substring(0, 10)}...` : name;

                return (
                    <Link
                        to={`/groups/${subscriber_id}/accounts/${subscriber_id}`} // Replace with your route path
                        key={index}
                    >
                        <article className='subcriber-item' key={subscriber_id}
                        >
                            <p className='title'>{truncatedName}</p>

                            <p className='title'>{total}</p>
                            <p className='title'>                                {paid}</p>
                            <p className='title'>                                {due}</p>

                        </article>
                    </Link>
                );
            })}
        </div>
    );
};

export default DashboardSubscriberDueList;
