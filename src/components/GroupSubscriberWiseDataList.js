import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Modal from 'react-modal';
import { API_BASE_URL } from '../utils/apiConfig';
import { useUserContext } from '../context/user_context';
import { FiDownload, FiPrinter } from 'react-icons/fi';
import { PDFDownloadLink } from '@react-pdf/renderer';
import Mypdf from '../components/PDF/Mypdf';
import loadingImage from "../images/preloader.gif";
import { FaPlus, FaMinus } from "react-icons/fa"; // ✅ Add icons
import ReceivableReceitPdf from "./PDF/ReceivableReceitPdf";
import { useGroupDetailsContext } from "../context/group_context";

const GroupSubscriberWiseDataList = ({ items }) => {
    const { groupId } = useParams();
    const { data } = useGroupDetailsContext();
    const [selectedSubscriber, setSelectedSubscriber] = useState(null);
    const [subscriberData, setSubscriberData] = useState(null);
    const { user } = useUserContext();
    const [modalLoading, setModalLoading] = useState(false);
    const [pdfData, setPdfData] = useState(null);

    const [expandedRowIndex, setExpandedRowIndex] = useState(null); // ✅ new state

    const userCompany = user?.results?.userCompany;
    const [groupName, setGroupName] = useState([]);

    const generateFileName = () => {
        const today = new Date();
        const date = today.getDate().toString().padStart(2, '0');
        const month = (today.getMonth() + 1).toString().padStart(2, '0');
        const year = today.getFullYear();
        return `SubscriberGroupWise_Receivable_${year}-${month}-${date}.pdf`;
    };

    useEffect(() => {
        if (data && data.results) {
            // Set groupTransactionInfo when data is available
            const { amount, type, commisionType, commissionAmount, groupName } = data.results;

            setGroupName(groupName);

        }
    }, [data]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (selectedSubscriber) {
                    setModalLoading(true);
                    const apiUrl = `${API_BASE_URL}/groups/${groupId}/customer-due/${selectedSubscriber.subscriber_id}`;

                    const response = await fetch(apiUrl, {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${user?.results?.token}`,
                            'Content-Type': 'application/json',
                        },
                    });

                    if (response.ok) {
                        const data = await response.json();
                        setSubscriberData(data.results.groupsWiseSubscriberResult);
                    }
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setModalLoading(false);
            }
        };

        if (selectedSubscriber) {
            fetchData();
        }
    }, [selectedSubscriber, groupId, user]);

    const openModal = (subscriber) => {
        setSelectedSubscriber(subscriber);
    };

    const closeModal = () => {
        setSelectedSubscriber(null);
        setSubscriberData(null);
        setModalLoading(false);
    };

    const handleGeneratePDFforindividualsubscriber = () => {
        if (!subscriberData) return;
        const formattedData = subscriberData.map(item => ({
            auct_date: item.auct_date,
            total_supposed_to_pay: item.total_supposed_to_pay,
            total_paid_amount: item.total_paid_amount,
            total_outstanding_balance: item.total_outstanding_balance
        }));
        setPdfData(formattedData);
    };

    const toggleExpandRow = (index) => {
        setExpandedRowIndex(expandedRowIndex === index ? null : index);
    };

    // Table Component - Exact GroupAccountList pattern
    const renderSubscriberWiseTable = () => (
        <div className="overflow-x-auto">
            <div className="bg-custom-red text-white rounded-lg overflow-hidden">
                <div className="grid grid-cols-5 gap-4 p-4 text-sm font-semibold">
                    <div className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span>Subscriber</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                        </svg>
                        <span>Total Amount</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>Paid Amount</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                        <span>Outstanding</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        <span>Actions</span>
                    </div>
                </div>
            </div>
            <div className="bg-white border border-gray-200 rounded-b-lg">
                {items?.map((item) => (
                    <div key={item.subscriber_id} className="grid grid-cols-5 gap-2 p-4 text-sm border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200">
                        <div className="text-gray-900 font-medium">
                            {item.name}
                        </div>
                        <div className="font-bold text-custom-red">
                            ₹{item.total_supposed_to_pay ?? 0}
                        </div>
                        <div className="font-medium text-green-600">
                            ₹{item.total_paid_amount ?? 0}
                        </div>
                        <div className={`font-medium ${(item.total_outstanding_balance ?? 0) > 0 ? 'text-red-600' : 'text-gray-600'}`}>
                            ₹{item.total_outstanding_balance ?? 0}
                        </div>
                        <div className="flex items-center">
                            <button
                                className="px-3 py-1 bg-custom-red text-white text-sm rounded-md hover:bg-red-700 transition-colors duration-200 shadow-sm hover:shadow-md"
                                onClick={() => openModal(item)}
                            >
                                View
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    // Empty State Component
    const EmptyState = () => (
        <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
            </div>
            <p className="text-gray-500 font-medium">No subscriber data available</p>
        </div>
    );

    return (
        <div>
            {items?.length > 0 ? renderSubscriberWiseTable() : <EmptyState />}

            <Modal
                isOpen={!!selectedSubscriber}
                onRequestClose={closeModal}
                contentLabel="Subscriber Details"
                style={{
                    overlay: { backgroundColor: "rgba(0,0,0,0.6)", zIndex: 1000 },
                    content: {
                        maxWidth: "850px",
                        margin: "auto",
                        borderRadius: "12px",
                        padding: "25px 35px",
                        border: "none",
                        boxShadow: "0 10px 40px rgba(0,0,0,0.4)",
                    },

                }}
            >
                {modalLoading ? (
                    <div style={{ textAlign: "center", padding: "60px" }}>
                        <img src={loadingImage} alt="loading" style={{ width: "80px" }} />
                        <p style={{ color: "#6b7280", marginTop: "16px", fontSize: "14px" }}>
                            Loading subscriber details...
                        </p>
                    </div>
                ) : (
                    selectedSubscriber && (
                        <div
                            className="modal-container"
                            style={{ fontFamily: "'Segoe UI', sans-serif", color: "#1f2937" }}
                        >
                            {/* Header + Action Buttons */}
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    flexWrap: "wrap",
                                    alignItems: "center",
                                    gap: "10px",
                                }}
                            >
                                <h2 style={{ fontSize: "22px", fontWeight: "600", margin: 0 }}>
                                    {selectedSubscriber.name}'s Details
                                </h2>
                                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                                    {pdfData ? (
                                        <PDFDownloadLink
                                            document={
                                                <Mypdf
                                                    tableData={pdfData}
                                                    tableHeaders={[
                                                        { title: "Auction Date", value: "auct_date" },
                                                        { title: "Total", value: "total_supposed_to_pay" },
                                                        { title: "Paid", value: "total_paid_amount" },
                                                        { title: "Due", value: "total_outstanding_balance" },
                                                    ]}
                                                    heading="Subscriber Auction Wise Receivable"
                                                    companyData={userCompany}
                                                />
                                            }
                                            fileName={generateFileName()}
                                        >
                                            {({ loading }) => (
                                                <button
                                                    onClick={() => setTimeout(() => setPdfData(null), 500)}
                                                    style={{
                                                        background: "#2563eb",
                                                        color: "white",
                                                        padding: "8px 14px",
                                                        borderRadius: "6px",
                                                        border: "none",
                                                        cursor: "pointer",
                                                        display: "flex",
                                                        alignItems: "center",
                                                        gap: "6px",
                                                    }}
                                                >
                                                    <FiDownload /> {loading ? "Preparing..." : "Download PDF"}
                                                </button>
                                            )}
                                        </PDFDownloadLink>
                                    ) : (
                                        <button
                                            onClick={handleGeneratePDFforindividualsubscriber}
                                            style={{
                                                background: "#2563eb",
                                                color: "white",
                                                padding: "8px 14px",
                                                borderRadius: "6px",
                                                border: "none",
                                                cursor: "pointer",
                                                display: "flex",
                                                alignItems: "center",
                                                gap: "6px",
                                            }}
                                        >
                                            <FiDownload /> Generate PDF
                                        </button>
                                    )}



                                    <button
                                        onClick={closeModal}
                                        style={{
                                            background: "transparent",
                                            border: "none",
                                            fontSize: "22px",
                                            cursor: "pointer",
                                            color: "#6b7280",
                                        }}
                                    >
                                        ✕
                                    </button>
                                </div>
                            </div>

                            {/* Profile */}
                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "row",
                                    flexWrap: "wrap",
                                    gap: "20px",
                                    marginTop: "20px",
                                    alignItems: "center",
                                }}
                            >
                                <img
                                    src={selectedSubscriber.user_image_from_s3}
                                    alt={selectedSubscriber.name}
                                    style={{
                                        width: "100px",
                                        height: "100px",
                                        borderRadius: "12px",
                                        objectFit: "cover",
                                        boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                                        border: "1px solid #e5e7eb",
                                    }}
                                />
                                <div style={{ fontSize: "14px", lineHeight: "1.6", minWidth: "150px" }}>
                                    <p>
                                        <strong>Total Amount:</strong> {selectedSubscriber.total_supposed_to_pay}
                                    </p>
                                    <p>
                                        <strong>Paid:</strong> {selectedSubscriber.total_paid_amount}
                                    </p>
                                    <p>
                                        <strong>Outstanding:</strong> {selectedSubscriber.total_outstanding_balance}
                                    </p>
                                </div>
                            </div>

                            {/* Auction Table */}
                            {subscriberData ? (
                                <div
                                    style={{
                                        marginTop: "20px",
                                        borderRadius: "12px",
                                        overflowX: "auto",
                                        boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
                                    }}
                                >
                                    <table
                                        style={{
                                            width: "100%",
                                            borderCollapse: "collapse",
                                            fontSize: "14px",
                                            minWidth: "600px",
                                        }}
                                    >
                                        <thead>
                                            <tr style={{ background: "#f3f4f6", textAlign: "left", fontWeight: "600" }}>
                                                <th style={{ padding: "12px" }}>Auction</th>
                                                <th style={{ padding: "12px" }}>Pay</th>
                                                <th style={{ padding: "12px" }}>Paid</th>
                                                <th style={{ padding: "12px" }}>Outstanding</th>
                                                <th style={{ padding: "12px" }}>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {subscriberData.map((item, index) => (
                                                <React.Fragment key={index}>
                                                    <tr style={{ borderBottom: "1px solid #e5e7eb" }}>
                                                        <td style={{ padding: "10px", display: "flex", alignItems: "center" }}>
                                                            {item.payments?.length > 0 && (
                                                                <button
                                                                    onClick={() => toggleExpandRow(index)}
                                                                    style={{
                                                                        marginRight: "10px",
                                                                        background: "transparent",
                                                                        border: "none",
                                                                        cursor: "pointer",
                                                                        color: "#2563eb",
                                                                    }}
                                                                >
                                                                    {expandedRowIndex === index ? <FaMinus /> : <FaPlus />}
                                                                </button>
                                                            )}
                                                            {item.auct_date}
                                                        </td>
                                                        <td style={{ padding: "10px" }}>{item.total_supposed_to_pay}</td>
                                                        <td style={{ padding: "10px" }}>{item.total_paid_amount}</td>
                                                        <td style={{ padding: "10px" }}>{item.total_outstanding_balance}</td>
                                                        <td style={{ padding: "10px", fontSize: "12px", color: "#6b7280" }}>
                                                            {item.payments?.length > 0 ? "Expand to download bills" : "-"}
                                                        </td>
                                                    </tr>

                                                    {/* Expanded Payments */}
                                                    {expandedRowIndex === index && item.payments?.length > 0 && (
                                                        <tr>
                                                            <td colSpan="5" style={{ background: "#f9fafb", padding: "12px 0" }}>
                                                                <table
                                                                    style={{
                                                                        width: "100%",
                                                                        borderCollapse: "collapse",
                                                                        fontSize: "14px",
                                                                    }}
                                                                >
                                                                    <thead>
                                                                        <tr style={{ background: "#e5e7eb" }}>
                                                                            <th style={{ padding: "8px" }}>Date</th>
                                                                            <th style={{ padding: "8px" }}>Amount</th>
                                                                            <th style={{ padding: "8px" }}>Method</th>
                                                                            <th style={{ padding: "8px" }}>Download</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        {item.payments.map((p) => (
                                                                            <tr key={p.id} style={{ borderBottom: "1px solid #ddd" }}>
                                                                                <td style={{ padding: "8px" }}>
                                                                                    {new Date(p.created_at).toLocaleDateString()}
                                                                                </td>
                                                                                <td style={{ padding: "8px" }}>{p.payment_amount}</td>
                                                                                <td style={{ padding: "8px" }}>{p.payment_method}</td>
                                                                                <td style={{ padding: "8px" }}>
                                                                                    <PDFDownloadLink
                                                                                        document={
                                                                                            <ReceivableReceitPdf
                                                                                                receivableData={{
                                                                                                    subscriberName: selectedSubscriber.name,
                                                                                                    paymentType: p.payment_type,
                                                                                                    paymentMethod: p.payment_method,
                                                                                                    groupName: groupName,
                                                                                                    auctionDate: new Date(p.created_at).toLocaleDateString(),
                                                                                                    paymentAmount: p.payment_amount,
                                                                                                }}
                                                                                                companyData={userCompany}
                                                                                            />
                                                                                        }
                                                                                        fileName={`Bill_${selectedSubscriber.name}_${new Date(
                                                                                            p.created_at
                                                                                        ).toISOString().slice(0, 10)}.pdf`}
                                                                                    >
                                                                                        {({ loading }) => (
                                                                                            <button
                                                                                                style={{
                                                                                                    background: "#2563eb",
                                                                                                    color: "white",
                                                                                                    padding: "6px 12px",
                                                                                                    borderRadius: "6px",
                                                                                                    border: "none",
                                                                                                    cursor: "pointer",
                                                                                                    display: "flex",
                                                                                                    alignItems: "center",
                                                                                                    gap: "4px",
                                                                                                }}
                                                                                            >
                                                                                                <FiDownload size={14} /> {loading ? "Preparing..." : "Download"}
                                                                                            </button>
                                                                                        )}
                                                                                    </PDFDownloadLink>
                                                                                </td>
                                                                            </tr>
                                                                        ))}
                                                                    </tbody>
                                                                </table>
                                                            </td>
                                                        </tr>
                                                    )}
                                                </React.Fragment>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <p style={{ marginTop: "20px", color: "#6b7280" }}>No items available</p>
                            )}
                        </div>
                    )
                )}
            </Modal>
        </div>
    );
};

export default GroupSubscriberWiseDataList;
