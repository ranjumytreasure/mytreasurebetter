
import React, { useEffect, useState } from 'react';
import { GoRepo } from 'react-icons/go';
import { FiUsers, FiUserPlus } from 'react-icons/fi';
import { FaMoneyBillWave, FaCheckCircle, FaExclamationCircle } from "react-icons/fa";
import { PDFDownloadLink } from '@react-pdf/renderer';
import AuctionWinnerReceiptPdf from '../components/PDF/AuctionWinnerReceiptPdf';
import { useUserContext } from '../context/user_context';
import { useGroupDetailsContext } from '../context/group_context';
import "../style/YourDue.css";


const formatDate = (dateString) => {
    if (!dateString) return '';
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
};

const YourDue = ({ data, GroupWiseOverallUserDuedata }) => {
    const { user } = useUserContext();
    const { state } = useGroupDetailsContext();
    const userCompany = user?.results?.userCompany;
    const groupData = state?.data;

    const [accountWiseData, setAccountWiseData] = useState([]);
    const [totalDue, setTotalDue] = useState('0');
    const [totalPaid, setTotalPaid] = useState('0');
    const [totalOutstanding, setTotalOutstanding] = useState('0');

    useEffect(() => {
        if (data?.results?.groupsAccountWiseResult) {
            setAccountWiseData(data.results.groupsAccountWiseResult);
        }

        if (GroupWiseOverallUserDuedata) {
            const {
                total_supposed_to_pay,
                total_paid_amount,
                total_outstanding_balance,
            } = GroupWiseOverallUserDuedata;

            setTotalDue(total_supposed_to_pay ?? 0);
            setTotalPaid(total_paid_amount ?? 0);
            setTotalOutstanding(total_outstanding_balance ?? 0);
        }
    }, [data, GroupWiseOverallUserDuedata]);

    const summaryItems = [
        {
            id: 1,
            icon: <FaMoneyBillWave className="icon" />, // Money bill for Total Amount
            label: 'Total Amount',
            value: totalDue,
            color: 'pink',
        },
        {
            id: 2,
            icon: <FaCheckCircle className="icon" />, // Green check for paid
            label: 'Total Paid',
            value: totalPaid ?? '0',
            color: 'green',
        },
        {
            id: 3,
            icon: <FaExclamationCircle className="icon" />, // Alert for outstanding
            label: 'Total Outstanding',
            value: totalOutstanding ?? '0',
            color: 'purple',
        },
    ];

    if (!data || !data.results) return <p>No data available.</p>;

    return (
        <div className="your-due-container">
            <h2 className="your-due-title">Your Due</h2>

            <div className="summary-cards">
                {summaryItems.map(({ id, icon, label, value, color }) => (
                    <article key={id} className="item">
                        <span className={color}>{icon}</span>
                        <div>
                            <h3>₹{value ?? 0}</h3>

                            <p>{label}</p>
                        </div>
                    </article>
                ))}
            </div>

            <div className="your-due-table your-due-header">
                <div>Auction Date</div>
                <div>Image</div>
                <div>Name</div>
                <div>Total Amount</div>
                <div>Paid</div>
                <div>Outstanding</div>
                <div>Download</div>
            </div>

            {accountWiseData.map((item) => {
                const {
                    auct_date,
                    id,
                    user_image_from_s3,
                    user_image_base64format,
                    name,
                    total_supposed_to_pay,
                    total_paid_amount,
                    total_outstanding_balance,
                    payment_mode,
                } = item;

                const formattedAuctionDate = formatDate(auct_date);

                return (
                    <div key={id} className="your-due-table your-due-row">
                        <span data-label="Auction Date">{formattedAuctionDate}</span>

                        <span data-label="Image">
                            <img src={user_image_from_s3} alt={name} className="due-image" />

                        </span>

                        <span data-label="Name">{name}</span>

                        <span data-label="Total">₹{total_supposed_to_pay ?? 0}</span>
                        <span data-label="Paid">₹{total_paid_amount ?? 0}</span>
                        <span data-label="Due">₹{total_outstanding_balance ?? 0}</span>


                        <span data-label="Receipt">
                            <PDFDownloadLink
                                document={
                                    <AuctionWinnerReceiptPdf
                                        winnerData={{
                                            winnerImage: user_image_base64format,
                                            winnerName: name,
                                            auctionDate: formattedAuctionDate,
                                            amountTaken: total_supposed_to_pay ?? 0,
                                            prizeMoney: total_supposed_to_pay ?? 0,
                                            balance: total_outstanding_balance ?? 0,
                                            paymentMode: payment_mode ?? 'Online',
                                            groupName: groupData?.results?.groupName ?? '',
                                            amount: groupData?.results?.amount ?? '',
                                            startDate: formatDate(groupData?.results?.startDate) ?? '',
                                        }}
                                        companyData={userCompany}
                                    />
                                }
                                fileName={`Auction_Receipt_${name}_${formattedAuctionDate}.pdf`}
                                style={{
                                    display: 'inline-block',
                                    padding: '4px 8px',
                                    backgroundColor: '#28a745',
                                    color: '#fff',
                                    textDecoration: 'none',
                                    borderRadius: '4px',
                                    fontSize: '12px',
                                }}
                            >
                                {({ loading }) => (loading ? 'Preparing PDF...' : 'Download')}
                            </PDFDownloadLink>
                        </span>
                    </div>


                );
            })}
        </div>
    );
};

export default YourDue;


