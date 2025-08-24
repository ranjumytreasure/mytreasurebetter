// import React, { useState } from "react";
// import { useLedgerAccountContext } from "../context/ledgerAccount_context";
// import { useLedgerEntryContext } from "../context/ledgerEntry_context";

// import { useUserContext } from "../context/user_context";
// import "../style/ReceivablePayementModal.css";
// import { API_BASE_URL } from '../utils/apiConfig';

// import { PDFDownloadLink } from '@react-pdf/renderer';
// import { FiDownload } from 'react-icons/fi';
// import ReceivableReceitPdf from './PDF/ReceivableReceitPdf';


// const ReceivablePayementModal = ({ isOpen, onClose, receivable, fetchReceivables }) => {
//     //start of PDF generation code

//     const [isDownloading, setIsDownloading] = useState(false);
//     const { isLoggedIn, user } = useUserContext();
//     const [isConfirming, setIsConfirming] = useState(false);


//     const userCompany = user?.results?.userCompany;
//     const { ledgerAccounts, fetchLedgerAccounts } = useLedgerAccountContext();

//     const { fetchLedgerEntries } = useLedgerEntryContext();



//     const [paymentMethod, setPaymentMethod] = useState("");
//     const [paymentType, setPaymentType] = useState("full");
//     const [partialAmount, setPartialAmount] = useState("");
//     const [loading, setLoading] = useState(false);
//     const [receiptData, setReceiptData] = useState(null);
//     const [receivableDate, setReceivableDate] = useState(() => {
//         const today = new Date().toISOString().split("T")[0]; // Format: yyyy-mm-dd
//         return today;
//     });
//     const membershipId = user?.results?.userAccounts?.[0]?.parent_membership_id;

//     if (!isOpen || !receivable) return null;


//     const {
//         name,
//         phone,
//         group_name,
//         auct_date,
//         user_image_from_s3,
//         rbtotal,
//         rbpaid,
//         rbdue,
//         total_wallet_balance,
//         group_specific_balance
//     } = receivable;

//     const formatCurrency = (amt) => `₹${Number(amt).toLocaleString("en-IN")}`;
//     const formatDate = (dateStr) => {
//         const date = new Date(dateStr);
//         return date.toLocaleDateString("en-GB", {
//             day: "2-digit",
//             month: "short",
//             year: "numeric"
//         });
//     };

//     const handlePartialAmountChange = (e) => {
//         const value = e.target.value;
//         if (!isNaN(value) && Number(value) >= 0) {
//             setPartialAmount(value);
//         }
//     };

//     const handleConfirmPayment = async () => {
//         setLoading(true);

//         const selectedAccount = ledgerAccounts.find(acc => acc.account_name === paymentMethod);
//         const paymentMethodId = selectedAccount?.id || null;

//         const paymentAmount = paymentType === 'full'
//             ? rbdue > 0 ? rbdue : rbtotal
//             : parseFloat(partialAmount || 0);

//         const payload = {
//             payableReceivalbeId: receivable.id,
//             paymentMethod,
//             paymentMethodId, // ✅ now properly assigned
//             paymentStatus: "SUCCESS",
//             paymentType,
//             paymentTransactionRef: "FUTURE",
//             payableCode: "001",
//             paymentAmount: parseFloat(paymentAmount),
//             subscriberId: receivable.subscriber_id,
//             grpSubscriberId: receivable.group_subscriber_id,
//             sourceSystem: "WEB",
//             type: 2,
//             groupId: receivable.group_id,
//             grpAccountId: receivable.group_account_id,
//             transactedDate: receivableDate,
//             groupName: group_name,
//             subscriberName: name,
//             auctionDate: auct_date,
//             membershipId
//         };

//         console.log(payload);
//         const apiUrl = `${API_BASE_URL}/payments-receipts`;

//         try {
//             const response = await fetch(apiUrl, {
//                 method: "POST",
//                 headers: {
//                     Authorization: `Bearer ${user?.results?.token}`,
//                     "Content-Type": "application/json"
//                 },
//                 body: JSON.stringify(payload)
//             });

//             if (response.ok) {
//                 const data = await response.json();
//                 setReceiptData({ ...payload, subscriberName: receivable.name });
//                 setTimeout(() => fetchReceivables(), 2000);
//                 fetchLedgerAccounts();
//                 fetchLedgerEntries();
//             } else {
//                 const err = await response.json();
//                 console.error("Payment error:", err);

//             }
//         } catch (error) {
//             console.error("Network error:", error);

//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleSubmit = async () => {

//         setIsConfirming(true);
//     };

//     const handlePrint = () => {
//         const printContents = document.querySelector('.receipt-container').innerHTML;
//         const printWindow = window.open('', '', 'height=600,width=800');
//         printWindow.document.write('<html><head><title>Receipt</title>');
//         printWindow.document.write('<style>body { font-family: Arial; padding: 20px; } .receipt-row { display: flex; justify-content: space-between; padding: 4px 0; }</style>');
//         printWindow.document.write('</head><body>');
//         printWindow.document.write(printContents);
//         printWindow.document.write('</body></html>');
//         printWindow.document.close();
//         printWindow.print();
//     };




//     return (
//         <div className="modal-overlay">
//             <div className="modal-content">

//                 <button className="modal-close-button" onClick={onClose}>&times;</button>





//                 {!receiptData ? (
//                     isConfirming ? (
//                         <div className="confirmation-screen">
//                             <div className="confirmation-header">🔒 Confirm Payment</div>

//                             <div className="confirmation-body">
//                                 <div className="confirmation-row">
//                                     <span className="receipt-label">Subscriber Name:</span>
//                                     <span className="receipt-value">{name}</span>
//                                 </div>
//                                 <div className="confirmation-row">
//                                     <span className="receipt-label">Group:</span>
//                                     <span className="receipt-value">{group_name}</span>
//                                 </div>
//                                 <div className="confirmation-row">
//                                     <span className="receipt-label">Auction Date:</span>
//                                     <span className="receipt-value">{formatDate(auct_date)}</span>
//                                 </div>
//                                 <div className="confirmation-row">
//                                     <span className="receipt-label">Receivable Date:</span>
//                                     <span className="receipt-value">{formatDate(receivableDate)}</span>
//                                 </div>
//                                 <div className="confirmation-row">
//                                     <span className="receipt-label">Payment Method:</span>
//                                     <span className="receipt-value">{paymentMethod}</span>
//                                 </div>
//                                 <div className="confirmation-row">
//                                     <span className="receipt-label">Payment Type:</span>
//                                     <span className="receipt-value">{paymentType === "full" ? "Full Payment" : "Partial Payment"}</span>
//                                 </div>
//                                 {paymentType === "partial" && (
//                                     <div className="confirmation-row">
//                                         <span className="receipt-label">Partial Amount:</span>
//                                         <span className="receipt-value">{formatCurrency(partialAmount)}</span>
//                                     </div>
//                                 )}
//                                 {paymentType === "full" && (
//                                     <div className="confirmation-row">
//                                         <span className="receipt-label">Paying Amount:</span>
//                                         <span className="receipt-value">{formatCurrency(rbdue > 0 ? rbdue : rbtotal)}</span>
//                                     </div>
//                                 )}
//                             </div>

//                             <div className="confirmation-actions">
//                                 <button className="cancel-button" onClick={() => setIsConfirming(false)}>Back</button>
//                                 <button className="pay-button" onClick={handleConfirmPayment} disabled={loading}>
//                                     {loading ? <span className="spinner" /> : "Confirm Payment"}
//                                 </button>
//                             </div>
//                         </div>

//                     ) : (
//                         <>
//                             <div className="modal-header">
//                                 <img src={user_image_from_s3 || "/default.jpg"} alt={name} className="subscriber-img" onError={(e) => (e.target.src = "/default.jpg")} />
//                                 <div className="subscriber-info">
//                                     <h2 className="subscriber-name">{name}</h2>
//                                     <p className="subscriber-detail">Group: {group_name}</p>
//                                     <p className="subscriber-detail">Auction Date: {formatDate(auct_date)}</p>
//                                 </div>
//                             </div>

//                             <div className="modal-body">


//                                 <div className="form-group">
//                                     <label>Receivable Date:</label>
//                                     <input type="date" className="large-input" value={receivableDate} onChange={(e) => setReceivableDate(e.target.value)} />
//                                 </div>

//                                 <div className="form-group">
//                                     <label>Payment Method:</label>
//                                     <select className="payment-select" value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
//                                         <option value="">Select Account</option>
//                                         {ledgerAccounts.map(acc => <option key={acc.id} value={acc.account_name}>{acc.account_name}</option>)}
//                                     </select>
//                                 </div>
//                                 <div className="payment-summary-bar">
//                                     <div className="summary-item"><div className="label">Total</div><div className="value total">{formatCurrency(rbtotal)}</div></div>
//                                     <div className="summary-item"><div className="label">Paid</div><div className="value paid">{formatCurrency(rbpaid)}</div></div>
//                                     <div className="summary-item"><div className="label">Due</div><div className="value due">{formatCurrency(rbdue)}</div></div>
//                                 </div>
//                                 <div className="summary-box">
//                                     <span>Tot Advance: ₹{total_wallet_balance}</span>
//                                     <span>Grp Advance: ₹{group_specific_balance}</span>
//                                 </div>
//                                 <div className="form-group">
//                                     <label>Payment Type:</label>
//                                     <div className="radio-group">
//                                         <label>
//                                             <input type="radio" value="full" checked={paymentType === "full"} onChange={() => { setPaymentType("full"); setPartialAmount(""); }} /> Full Payment
//                                         </label>
//                                         <label>
//                                             <input type="radio" value="partial" checked={paymentType === "partial"} onChange={() => setPaymentType("partial")} /> Partial Payment
//                                         </label>
//                                     </div>
//                                 </div>

//                                 {paymentType === "partial" && (
//                                     <div className="form-group">
//                                         <label>Partial Amount:</label>
//                                         <input type="number" className="large-input" value={partialAmount} onChange={handlePartialAmountChange} placeholder="₹0.00" min="0" />
//                                     </div>
//                                 )}

//                                 <div className="modal-actions">
//                                     <button className="cancel-button" onClick={onClose}>Cancel</button>
//                                     <button className="pay-button" onClick={handleSubmit} disabled={!paymentMethod || (paymentType === "partial" && !partialAmount)}>
//                                         Pay
//                                     </button>
//                                 </div>
//                             </div>
//                         </>
//                     )
//                 ) : (
//                     <div className="modal-body receipt-view">
//                         <div className="receipt-container">
//                             <h2 className="receipt-header">✅ Payment Successful</h2>
//                             <hr className="receipt-divider" />
//                             <div className="receipt-row"><span className="receipt-label">Subscriber Name:</span><span className="receipt-value">{name}</span></div>
//                             <div className="receipt-row"><span className="receipt-label">Receivable Date:</span><span className="receipt-value">{formatDate(receivableDate)}</span></div>
//                             <div className="receipt-row"><span className="receipt-label">Group Name:</span><span className="receipt-value">{group_name}</span></div>
//                             <div className="receipt-row"><span className="receipt-label">Auction Date:</span><span className="receipt-value">{formatDate(auct_date)}</span></div>
//                             <div className="receipt-row"><span className="receipt-label">Amount Paid:</span><span className="receipt-value">{formatCurrency(receiptData.paymentAmount)}</span></div>
//                             <div className="receipt-row"><span className="receipt-label">Payment Method:</span><span className="receipt-value">{receiptData.paymentMethod}</span></div>
//                             <div className="receipt-row"><span className="receipt-label">Payment Type:</span><span className="receipt-value">{receiptData.paymentType}</span></div>
//                             <div className="receipt-row"><span className="receipt-label">Transaction Ref:</span><span className="receipt-value">{receiptData.paymentTransactionRef}</span></div>
//                         </div>

//                         <div className="receipt-actions">
//                             <button className="action-button" onClick={handlePrint}>🖨️ Print</button>
//                             <div style={{ marginTop: '20px', textAlign: 'center' }}>
//                                 <PDFDownloadLink
//                                     document={<ReceivableReceitPdf receivableData={receiptData} companyData={userCompany} />}
//                                     fileName={`Receipt-${receiptData.subscriberName}-${Date.now()}.pdf`}
//                                     className="action-button"
//                                     onClick={() => {
//                                         setIsDownloading(true);
//                                         setTimeout(() => setIsDownloading(false), 3000);
//                                     }}
//                                 >
//                                     {() => isDownloading ? "Downloading..." : <><FiDownload style={{ marginRight: 5 }} /> Download PDF</>}
//                                 </PDFDownloadLink>
//                             </div>
//                         </div>
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default ReceivablePayementModal;


// ReceivablePayementModal.js
import React, { useState, useEffect } from "react";
import { useLedgerAccountContext } from "../context/ledgerAccount_context";
import { useLedgerEntryContext } from "../context/ledgerEntry_context";
import { useUserContext } from "../context/user_context";
import { toast, ToastContainer } from "react-toastify";
import { API_BASE_URL } from "../utils/apiConfig";
import ReceivableReceitPdf from "./PDF/ReceivableReceitPdf";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { FiDownload } from "react-icons/fi";
import { FaRupeeSign, FaCheckCircle, FaMoneyBillWave, FaBalanceScale, FaExclamationCircle } from 'react-icons/fa';
import 'react-toastify/dist/ReactToastify.css';
import "../style/ReceivablePayementModal.css";

const ReceivablePayementModal = ({ isOpen, onClose, receivable, fetchReceivables }) => {
    const [groupAdvanceInput, setGroupAdvanceInput] = useState("");
    const [paymentType, setPaymentType] = useState("full");
    const [useGroupAdvance, setUseGroupAdvance] = useState(false);
    const [partialAmount, setPartialAmount] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("");
    const [isConfirming, setIsConfirming] = useState(false);
    const [receiptData, setReceiptData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);
    const { ledgerAccounts, fetchLedgerAccounts } = useLedgerAccountContext();
    const { fetchLedgerEntries } = useLedgerEntryContext();
    const { user } = useUserContext();
    const userCompany = user?.results?.userCompany;
    const membershipId = user?.results?.userAccounts?.[0]?.parent_membership_id;
    const [receivableDate, setReceivableDate] = useState(
  new Date().toISOString().split("T")[0]);

    const totalDue = receivable?.rbdue ?? 0;
    const group_specific_balance = receivable?.group_specific_balance ?? 0;

    const [advanceApplied, setAdvanceApplied] = useState(0);
    const [balanceAdvance, setBalanceAdvance] = useState(0);
    const [remainingDue, setRemainingDue] = useState(totalDue);
    const [parsedPartialAmount, setParsedPartialAmount] = useState(totalDue);

    useEffect(() => {
        const advanceInput = useGroupAdvance ? parseFloat(groupAdvanceInput || "0") : 0;
        const partialInput = paymentType === "partial" ? parseFloat(partialAmount || "0") : 0;

        const applicableAdvance = Math.min(advanceInput, group_specific_balance, totalDue);
        const totalPaid = partialInput + applicableAdvance;

        const remainingDue = totalPaid <= totalDue ? totalDue - totalPaid : 0;
        const excess = totalPaid > totalDue ? totalPaid - totalDue : 0;

        const remainingGroupAdvance = group_specific_balance - applicableAdvance;
        const balanceAdvance = remainingGroupAdvance + excess;

        setAdvanceApplied(applicableAdvance);
        setParsedPartialAmount(partialInput);
        setRemainingDue(remainingDue);
        setBalanceAdvance(balanceAdvance);
    }, [
        partialAmount,
        groupAdvanceInput,
        useGroupAdvance,
        paymentType,
        totalDue,
        group_specific_balance
    ]);




    if (!isOpen || !receivable) return null;

    const {
        name,
        group_name,
        auct_date,
        user_image_from_s3,
        rbtotal,
        rbpaid,
        rbdue,
        total_wallet_balance
    } = receivable;

    const formatCurrency = (amt) => `₹${Number(amt).toLocaleString("en-IN")}`;
    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    const handleConfirmPayment = async () => {
        setLoading(true);
        const selectedAccount = ledgerAccounts.find(acc => acc.account_name === paymentMethod);
        const paymentMethodId = selectedAccount?.id || null;
        const paymentAmount = paymentType === 'full'
            ? rbdue > 0 ? rbdue : rbtotal
            : parseFloat(partialAmount || 0);

        const payload = {
            payableReceivalbeId: receivable.id,
            paymentMethod,
            paymentMethodId,
            paymentStatus: "SUCCESS",
            paymentType,
            paymentTransactionRef: "FUTURE",
            payableCode: "001",
            paymentAmount: parseFloat(paymentAmount),
            subscriberId: receivable.subscriber_id,
            grpSubscriberId: receivable.group_subscriber_id,
            sourceSystem: "WEB",
            type: 2,
            groupId: receivable.group_id,
            grpAccountId: receivable.group_account_id,
            transactedDate: receivableDate,
            groupName: group_name,
            subscriberName: name,
            auctionDate: auct_date,
            membershipId,
            useGroupAdvanceflag: useGroupAdvance,
            groupAdvanceUsed: advanceApplied,
            deductionPaymentMethodId: selectedAccount?.id || null
        };

        try {
            const response = await fetch(`${API_BASE_URL}/receipts`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${user?.results?.token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                const data = await response.json();
                setReceiptData({ ...payload, subscriberName: name });
                setTimeout(() => fetchReceivables(), 2000);
                fetchLedgerAccounts();
                fetchLedgerEntries();
            } else {
                const err = await response.json();
                toast.error(err.message || "Payment failed.");
            }
        } catch (error) {
            toast.error("❌ Network error. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = () => {
        if (!paymentMethod) {
            toast.error("\u274c Please select a payment method.");
            return;
        }
        if (paymentType === "full" && useGroupAdvance && group_specific_balance < totalDue) {
            toast.error("\u274c Not enough group advance. Please choose partial payment.");
            return;
        }
        setIsConfirming(true);
    };

    const handlePrint = () => {
        const printContents = document.querySelector('.receipt-container')?.innerHTML;
        const printWindow = window.open('', '', 'height=600,width=800');
        printWindow.document.write('<html><head><title>Receipt</title>');
        printWindow.document.write('<style>body { font-family: Arial; padding: 20px; } .receipt-row { display: flex; justify-content: space-between; padding: 4px 0; }</style>');
        printWindow.document.write('</head><body>');
        printWindow.document.write(printContents);
        printWindow.document.write('</body></html>');
        printWindow.document.close();
        printWindow.print();
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <ToastContainer position="top-center" />
                <button className="modal-close-button" onClick={onClose}>&times;</button>

                <div className="modal-header">
                    <img src={user_image_from_s3 || "/default.jpg"} alt="User" className="subscriber-img" />
                    <div className="subscriber-info">
                        <h2 className="subscriber-name">{name}</h2>
                        <p className="pay-subscriber-detail">Group: {group_name}</p>
                        <p className="pay-subscriber-detail">Auction: {formatDate(auct_date)}</p>
                    </div>
                </div>

                {isConfirming && !receiptData ? (
                    <div className="confirmation-screen">
                        <div className="confirmation-header">🔒 Confirm Payment</div>
                        <div className="confirmation-body">
                            <div className="confirmation-row"><span className="receipt-label">Subscriber:</span><span className="receipt-value">{name}</span></div>
                            <div className="confirmation-row"><span className="receipt-label">Group:</span><span className="receipt-value">{group_name}</span></div>
                            <div className="confirmation-row"><span className="receipt-label">Auction:</span><span className="receipt-value">{formatDate(auct_date)}</span></div>
                            <div className="confirmation-row"><span className="receipt-label">Receivable Date:</span><span className="receipt-value">{formatDate(receivableDate)}</span></div>
                            <div className="confirmation-row"><span className="receipt-label">Payment Method:</span><span className="receipt-value">{paymentMethod}</span></div>


                            <div className="confirmation-row"><span className="receipt-label">Payment Type:</span><span className="receipt-value">{paymentType}</span></div>
                            <div className="confirmation-row"><span className="receipt-label">Total Due:</span><span className="receipt-value">{formatCurrency(totalDue)}</span></div>
                            {useGroupAdvance && (
                                <>
                                    <div className="confirmation-row"><span className="receipt-label">Advance Applied:</span><span className="receipt-value">{formatCurrency(advanceApplied)}</span></div>
                                    <div className="confirmation-row"><span className="receipt-label">Balance Advance:</span><span className="receipt-value">{formatCurrency(balanceAdvance)}</span></div>
                                </>
                            )}
                            {paymentType === "partial" && (
                                <div className="confirmation-row"><span className="receipt-label">Partial Amount:</span><span className="receipt-value">{formatCurrency(parsedPartialAmount)}</span></div>
                            )}
                        </div>
                        <div className="confirmation-actions">
                            <button className="cancel-button" onClick={() => setIsConfirming(false)}>Back</button>
                            <button className="pay-button" onClick={handleConfirmPayment} disabled={loading}>
                                {loading ? "Processing..." : "Confirm Payment"}
                            </button>
                        </div>
                    </div>
                ) : receiptData ? (
                    <div className="modal-body receipt-view">
                        <div className="receipt-container">
                            <h2 className="receipt-header">✅ Payment Successful</h2>
                            <hr className="receipt-divider" />
                            <div className="receipt-row"><span className="receipt-label">Subscriber Name:</span><span className="receipt-value">{receiptData.subscriberName}</span></div>
                            <div className="receipt-row"><span className="receipt-label">Receivable Date:</span><span className="receipt-value">{formatDate(receivableDate)}</span></div>
                            <div className="receipt-row"><span className="receipt-label">Group Name:</span><span className="receipt-value">{group_name}</span></div>
                            <div className="receipt-row"><span className="receipt-label">Auction Date:</span><span className="receipt-value">{formatDate(auct_date)}</span></div>
                            <div className="receipt-row"><span className="receipt-label">Amount Paid:</span><span className="receipt-value">{formatCurrency(receiptData.paymentAmount)}</span></div>
                            <div className="receipt-row"><span className="receipt-label">Payment Method:</span><span className="receipt-value">{receiptData.paymentMethod}</span></div>
                            <div className="receipt-row"><span className="receipt-label">Payment Type:</span><span className="receipt-value">{receiptData.paymentType}</span></div>
                            <div className="receipt-row"><span className="receipt-label">Transaction Ref:</span><span className="receipt-value">{receiptData.paymentTransactionRef}</span></div>
                        </div>

                        <div className="receipt-actions">
                            <button className="action-button" onClick={handlePrint}>🖨️ Print</button>
                            <div style={{ marginTop: '20px', textAlign: 'center' }}>
                                <PDFDownloadLink
                                    document={<ReceivableReceitPdf receivableData={receiptData} companyData={userCompany} />}
                                    fileName={`Receipt-${receiptData.subscriberName}-${Date.now()}.pdf`}
                                    className="action-button"
                                    onClick={() => {
                                        setIsDownloading(true);
                                        setTimeout(() => setIsDownloading(false), 3000);
                                    }}
                                >
                                    {() => isDownloading ? "Downloading..." : <><FiDownload style={{ marginRight: 5 }} /> Download PDF</>}
                                </PDFDownloadLink>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="modal-body">
                        <div className="form-group">
                            <label>Receivable Date</label>
                            <input
  type="date"
  className="large-input"
  value={receivableDate}
  onChange={(e) => setReceivableDate(e.target.value)}
/>

                        </div>

                        <div className="form-group">
                            <label>Payment Method</label>
                            <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                                <option value="">-- Select --</option>
                                {ledgerAccounts.map((acc) => (
                                    <option key={acc.id} value={acc.account_name}>{acc.account_name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="payment-summary-bar">
                            <div className="summary-item"><div className="label">Total</div><div className="value total">{formatCurrency(rbtotal)}</div></div>
                            <div className="summary-item"><div className="label">Paid</div><div className="value paid">{formatCurrency(rbpaid)}</div></div>
                            <div className="summary-item"><div className="label">Due</div><div className="value due">{formatCurrency(rbdue)}</div></div>
                        </div>

                        <div className="summary-box">
                            <span>Tot Advance: {formatCurrency(total_wallet_balance)}</span>
                            <span>Grp Advance: {formatCurrency(group_specific_balance)}</span>
                        </div>

                        <div className="form-group">
                            <label>Payment Type:</label>
                            <div className="radio-group">
                                <label>
                                    <input
                                        type="radio"
                                        value="full"
                                        checked={paymentType === "full"}
                                        onChange={() => {
                                            setPaymentType("full");
                                            // ✅ Always reset useGroupAdvance when switching to full
                                            setUseGroupAdvance(false);
                                            setGroupAdvanceInput("0");
                                            setPartialAmount("0");
                                        }}
                                    />
                                    Full Payment
                                </label>

                                <label>
                                    <input
                                        type="radio"
                                        value="partial"
                                        checked={paymentType === "partial"}
                                        onChange={() => {
                                            setPaymentType("partial");

                                            // ❗ Reset group advance usage and related inputs
                                            setUseGroupAdvance(false);
                                            setGroupAdvanceInput("0");
                                            setPartialAmount(totalDue.toString());
                                        }}
                                    />
                                    Partial Payment
                                </label>
                            </div>

                        </div>

                        <div className="form-group">
                            <label>
                                <input
                                    type="checkbox"
                                    checked={useGroupAdvance}
                                    onChange={(e) => {
                                        const checked = e.target.checked;
                                        setUseGroupAdvance(checked);

                                        if (!checked) {
                                            // Reset advance if unchecked
                                            setGroupAdvanceInput("0");
                                            if (paymentType === "partial") {
                                                setPartialAmount(totalDue.toString());
                                            }
                                        } else {
                                            // Use advance: apply minimum available
                                            const adv = Math.min(group_specific_balance, totalDue);
                                            setGroupAdvanceInput(adv.toString());
                                            const userPayable = totalDue - adv;
                                            setPartialAmount(userPayable.toString());
                                        }
                                    }}
                                />
                                Use Group Advance
                            </label>
                        </div>



                        {paymentType === "partial" && (
                            <>
                                {useGroupAdvance && (
                                    <div className="form-group">
                                        <label>Group Advance Used:</label>
                                        <input
                                            type="number"
                                            className="large-input"
                                            value={groupAdvanceInput}
                                            onChange={(e) => {
                                                const val = Math.min(Number(e.target.value), group_specific_balance, totalDue);
                                                setGroupAdvanceInput(val.toString());
                                                setPartialAmount(Math.max(totalDue - val, 0).toString());
                                            }}
                                            min="0"
                                            max={group_specific_balance}
                                        />
                                    </div>
                                )}

                                <div className="form-group">
                                    <label>Partial Amount:</label>
                                    <input
                                        type="number"
                                        className="large-input"
                                        value={partialAmount}
                                        onChange={(e) => {
                                            const val = Number(e.target.value);
                                            setPartialAmount(val.toString());
                                        }}
                                        min="0"
                                        max={totalDue}
                                        placeholder="₹0.00"
                                    />

                                </div>
                            </>
                        )}


                        {useGroupAdvance && (
                            <div className="group-advance-summary">
                                <div className="summary-row"><span className="summary-label"><FaMoneyBillWave /> Total Due:</span><span>{formatCurrency(totalDue)}</span></div>
                                <div className="summary-row"><span className="summary-label"><FaCheckCircle /> Advance Applied:</span><span>{formatCurrency(advanceApplied)}</span></div>
                                {paymentType === 'partial' && (
                                    <div className="summary-row">
                                        <span className="summary-label"><FaRupeeSign /> Partial Amount:</span>
                                        <span>{formatCurrency(parsedPartialAmount)}</span>
                                    </div>
                                )}
                                <div className="summary-row">
                                    <span className="summary-label"><FaExclamationCircle /> Remaining Due:</span>
                                    <span>{formatCurrency(remainingDue)}</span>
                                </div>

                                <div className="summary-row"><span className="summary-label"><FaBalanceScale /> Balance Advance:</span><span>{formatCurrency(balanceAdvance)}</span></div>
                            </div>
                        )}

                        <div className="modal-actions">
                            <button className="cancel-button" onClick={onClose}>Cancel</button>
                            <button className="pay-button" onClick={handleSubmit} disabled={!paymentMethod || (paymentType === "partial" && !partialAmount)}>Pay</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );

};

export default ReceivablePayementModal;





















