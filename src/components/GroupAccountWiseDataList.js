import React, { useState, useEffect } from 'react';
import { FiDownload } from 'react-icons/fi';
import { PDFDownloadLink } from '@react-pdf/renderer';
import Mypdf from '../components/PDF/Mypdf';
import { useUserContext } from '../context/user_context';


const formatDate = (dateString) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
};

const GroupAccountWiseDataList = ({ items }) => {
    const { user } = useUserContext();
    const [pdfData, setPdfData] = useState(null);
    const [previewImageUrl, setPreviewImageUrl] = useState('');
    const userCompany = user?.results?.userCompany;
    const [companyName, setCompanyName] = useState(null);
    const [previewImage, setPreviewImage] = useState('https://github.com/OlgaKoplik/CodePen/blob/master/profile.jpg?raw=true');

    const generateFileName = () => {
        const today = new Date();
        return `SubscriberGroupWise_Receivable_${today.getFullYear()}-${(today.getMonth() + 1)
            .toString()
            .padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}.pdf`;
    };



    useEffect(() => {
        if (userCompany?.[0]?.name) {
            setCompanyName(userCompany[0].name);

        }
    }, [user]);

    const handleGeneratePDF = () => {
        const formattedData = items.map((item) => ({
            auct_date: item.auct_date,
            total_supposed_to_pay: item.total_supposed_to_pay,
            total_paid_amount: item.total_paid_amount,
            total_outstanding_balance: item.total_outstanding_balance,
        }));
        setPdfData(formattedData);
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '12px' }}>
                {pdfData ? (
                    <PDFDownloadLink
                        document={
                            <Mypdf
                                tableData={pdfData}
                                previewImageUrl={previewImageUrl}
                                tableHeaders={[
                                    { title: 'Auction Date', value: 'auct_date' },
                                    { title: 'Total', value: 'total_supposed_to_pay' },
                                    { title: 'Paid', value: 'total_paid_amount' },
                                    { title: 'Due', value: 'total_outstanding_balance' },
                                ]}
                                heading="Group AuctionWise Receivable"
                                companyName={companyName}
                                companyData={userCompany}
                                base64Logo={previewImageUrl}
                            />
                        }
                        fileName={generateFileName()}
                    >
                        {({ loading }) =>
                            loading ? (
                                'Loading document...'
                            ) : (
                                <button className="download-button" onClick={() => setTimeout(() => setPdfData(null), 500)}>
                                    <FiDownload /> Download PDF
                                </button>
                            )
                        }
                    </PDFDownloadLink>
                ) : (
                    <button className="download-button" onClick={handleGeneratePDF}>
                        <FiDownload /> Generate PDF
                    </button>
                )}
            </div>

            <div className="subcriber-list">
                <div className="subscriber-header">
                    <p className="col col-name">Auct Date</p>
                    <p className="col col-amount">Total</p>
                    <p className="col col-paid">Paid</p>
                    <p className="col col-due">Outstanding</p>
                </div>

                {items?.map((item, index) => (
                    <div key={index} className="subscriber-data">
                        <p className="col col-name">{formatDate(item.auct_date)}</p>
                        <p className="col col-amount">{item.total_supposed_to_pay ?? 0}</p>
                        <p className="col col-paid">{item.total_paid_amount ?? 0}</p>
                        <p className="col col-due">{item.total_outstanding_balance ?? 0}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default GroupAccountWiseDataList;
