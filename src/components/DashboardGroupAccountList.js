import React from 'react';
import { Link } from 'react-router-dom'; // Import Link

const DashboardGroupAccountList = ({ items }) => {
    return (
        <div className='subcriber-list'>
            <article className='subcriber-header' style={{ padding: "4px 16px" }}>
                <p >GroupName</p>
                <p >Amount</p>
                <p >Total</p>
                <p >Paid</p>
                <p >Due</p>

            </article>
            {items?.map((item, index) => {
                const { group_name, amount, total, paid, due, group_id } = item;
                const truncatedGroupName = group_name.length > 10 ? `${group_name.substring(0, 10)}...` : group_name;
                return (
                    <Link
                        to={`/groups/${group_id}/accounts/${group_id}`} // Replace with your route path
                        key={index}
                    >
                        <article className='subcriber-item' key={group_id}
                        >
                            <p className='title'>{truncatedGroupName}</p>
                            <p className='title'>{amount}</p>
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

export default DashboardGroupAccountList;
