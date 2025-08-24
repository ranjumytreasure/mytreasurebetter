import React, { useState } from "react";
import { useLedgerAccountContext } from "../context/ledgerAccount_context";
import { useLedgerEntryContext } from "../context/ledgerEntry_context";
import { useUserContext } from "../context/user_context";
import "../style/ReceivablePayementModal.css";
import { API_BASE_URL } from '../utils/apiConfig';

const PayablePaymentModal = ({ isOpen, onClose, payable, fetchPayables }) => {
    const { isLoggedIn, user } = useUserContext();
    console.log(payable);
    const { ledgerAccounts, fetchLedgerAccounts } = useLedgerAccountContext();
    const { fetchLedgerEntries } = useLedgerEntryContext();
    const [isConfirming, setIsConfirming] = useState(false);


    const [paymentMethod, setPaymentMethod] = useState("");
    const [paymentType, setPaymentType] = useState("full");
    const [partialAmount, setPartialAmount] = useState("");
    const [loading, setLoading] = useState(false);
    const [receiptData, setReceiptData] = useState(null);
    const [payableDate, setPayableDate] = useState(() => {
        const today = new Date().toISOString().split("T")[0];
        return today;
    });

    const membershipId = user?.results?.userAccounts?.[0]?.parent_membership_id;

    if (!isOpen || !payable) return null;

    const {
        name,
        phone,
        group_name,
        auct_date,
        user_image_from_s3,
        pytotal,
        pbpaid,
        pbdue
    } = payable;

    const formatCurrency = (amt) => `₹${Number(amt).toLocaleString("en-IN")}`;
    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric"
        });
    };

    const handlePartialAmountChange = (e) => {
        const value = e.target.value;
        if (!isNaN(value) && Number(value) >= 0) {
            setPartialAmount(value);
        }
    };

  

    const handleConfirmPayment = async () => {
        setLoading(true);

        const selectedAccount = ledgerAccounts.find(acc => acc.account_name === paymentMethod);
        const paymentMethodId = selectedAccount?.id || null;

        const paymentAmount = paymentType === 'full'
            ? pbdue > 0 ? pbdue : pytotal
            : parseFloat(partialAmount || 0);

        const payload = {
            payableReceivalbeId: payable.id,
            paymentMethod,
            paymentMethodId,
            paymentStatus: "SUCCESS",
            paymentType,
            paymentTransactionRef: "FUTURE",
            payableCode: "002",
            paymentAmount: parseFloat(paymentAmount),
            subscriberId: payable.subscriber_id,
            grpSubscriberId: payable.group_subscriber_id,
            sourceSystem: "WEB",
            type: 1, // Indicates Payable (vs Receivable)
            groupId: payable.group_id,
            grpAccountId: payable.group_account_id,
            transactedDate: payableDate,
            groupName: group_name,
            subscriberName: name,
            auctionDate: auct_date,
            membershipId
        };

        try {
            const response = await fetch(`${API_BASE_URL}/payments-receipts`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${user?.results?.token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                const data = await response.json();
                setReceiptData({ ...payload, subscriberName: payable.username });
                setTimeout(() => fetchPayables(), 2000);
                fetchLedgerAccounts();
                fetchLedgerEntries();
            } else {
                const err = await response.json();
                console.error("Payment error:", err);
            }
        } catch (error) {
            console.error("Network error:", error);
        } finally {
            setLoading(false);
        }
    }

    // const handleSubmit = async () => {
    //     setLoading(true);

    //     const selectedAccount = ledgerAccounts.find(acc => acc.account_name === paymentMethod);
    //     const paymentMethodId = selectedAccount?.id || null;

    //     const paymentAmount = paymentType === 'full'
    //         ? pbdue > 0 ? pbdue : pytotal
    //         : parseFloat(partialAmount || 0);

    //     const payload = {
    //         payableReceivalbeId: payable.id,
    //         paymentMethod,
    //         paymentMethodId,
    //         paymentStatus: "SUCCESS",
    //         paymentType,
    //         paymentTransactionRef: "FUTURE",
    //         payableCode: "002",
    //         paymentAmount: parseFloat(paymentAmount),
    //         subscriberId: payable.subscriber_id,
    //         grpSubscriberId: payable.group_subscriber_id,
    //         sourceSystem: "WEB",
    //         type: 1, // Indicates Payable (vs Receivable)
    //         groupId: payable.group_id,
    //         grpAccountId: payable.group_account_id,
    //         transactedDate: payableDate,
    //         groupName: group_name,
    //         subscriberName: name,
    //         auctionDate: auct_date,
    //         membershipId
    //     };

    //     try {
    //         const response = await fetch(`${API_BASE_URL}/payments-receipts`, {
    //             method: "POST",
    //             headers: {
    //                 Authorization: `Bearer ${user?.results?.token}`,
    //                 "Content-Type": "application/json"
    //             },
    //             body: JSON.stringify(payload)
    //         });

    //         if (response.ok) {
    //             const data = await response.json();
    //             setReceiptData({ ...payload, subscriberName: payable.username });
    //             setTimeout(() => fetchPayables(), 2000);
    //             fetchLedgerAccounts();
    //             fetchLedgerEntries();
    //         } else {
    //             const err = await response.json();
    //             console.error("Payment error:", err);
    //         }
    //     } catch (error) {
    //         console.error("Network error:", error);
    //     } finally {
    //         setLoading(false);
    //     }
    // };

    const handlePrint = () => {
        const printContents = document.querySelector('.receipt-container').innerHTML;
        const printWindow = window.open('', '', 'height=600,width=800');
        printWindow.document.write('<html><head><title>Receipt</title>');
        printWindow.document.write('<style>body { font-family: Arial; padding: 20px; } .receipt-row { display: flex; justify-content: space-between; padding: 4px 0; }</style>');
        printWindow.document.write('</head><body>');
        printWindow.document.write(printContents);
        printWindow.document.write('</body></html>');
        printWindow.document.close();
        printWindow.print();
    };

    const handleDownload = () => {
        const receipt = document.querySelector('.receipt-container').innerHTML;
        const blob = new Blob([receipt], { type: 'text/html' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'payable-receipt.html';
        link.click();
    };


    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button className="modal-close-button" onClick={onClose}>&times;</button>

                {!receiptData ? (
                    <>
                        {!isConfirming ? (
                            <>
                                <div className="modal-header">
                                    <img
                                        src={user_image_from_s3 || "/default.jpg"}
                                        alt={name}
                                        className="subscriber-img"
                                        onError={(e) => (e.target.src = "/default.jpg")}
                                    />
                                    <div className="subscriber-info">
                                        <h2 className="subscriber-name">{name}</h2>
                                        <p className="subscriber-detail">Group: {group_name}</p>
                                        <p className="subscriber-detail">Auction Date: {formatDate(auct_date)}</p>
                                    </div>
                                </div>

                                <div className="modal-body">
                                    <div className="payment-summary-bar">
                                        <div className="summary-item">
                                            <div className="label">Total</div>
                                            <div className="value total">{formatCurrency(pytotal)}</div>
                                        </div>
                                        <div className="summary-item">
                                            <div className="label">Paid</div>
                                            <div className="value paid">{formatCurrency(pbpaid)}</div>
                                        </div>
                                        <div className="summary-item">
                                            <div className="label">Due</div>
                                            <div className="value due">{formatCurrency(pbdue)}</div>
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="payableDate">Payable Date:</label>
                                        <input
                                            type="date"
                                            id="payableDate"
                                            className="large-input"
                                            value={payableDate}
                                            onChange={(e) => setPayableDate(e.target.value)}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Payment Method:</label>
                                        <select
                                            className="payment-select"
                                            value={paymentMethod}
                                            onChange={(e) => setPaymentMethod(e.target.value)}
                                        >
                                            <option value="">Select Account</option>
                                            {ledgerAccounts.map((acc) => (
                                                <option key={acc.id} value={acc.account_name}>
                                                    {acc.account_name}
                                                </option>
                                            ))}
                                        </select>
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
                                                        setPartialAmount("");
                                                    }}
                                                />{" "}
                                                Full Payment
                                            </label>
                                            <label>
                                                <input
                                                    type="radio"
                                                    value="partial"
                                                    checked={paymentType === "partial"}
                                                    onChange={() => setPaymentType("partial")}
                                                />{" "}
                                                Partial Payment
                                            </label>
                                        </div>
                                    </div>

                                    {paymentType === "partial" && (
                                        <div className="form-group">
                                            <label htmlFor="partialAmount">Enter Partial Amount:</label>
                                            <input
                                                type="number"
                                                id="partialAmount"
                                                className="large-input"
                                                value={partialAmount}
                                                onChange={handlePartialAmountChange}
                                                placeholder="₹0.00"
                                                min="0"
                                            />
                                        </div>
                                    )}

                                    <div className="modal-actions">
                                        <button className="cancel-button" onClick={onClose}>
                                            Cancel
                                        </button>
                                        <button
                                            className="pay-button"
                                            onClick={() => setIsConfirming(true)}
                                            disabled={
                                                loading || !paymentMethod || (paymentType === "partial" && !partialAmount)
                                            }
                                        >
                                            {loading ? (
                                                <span className="loading-text">
                                                    <span className="spinner" /> Processing...
                                                </span>
                                            ) : (
                                                "Pay"
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="confirmation-screen">
                                <div className="confirmation-header">🔒 Confirm Payment</div>
                                <div className="confirmation-row">
                                    <span className="receipt-label">Subscriber Name:</span>
                                    <span className="receipt-value">{name}</span>
                                </div>
                                <div className="confirmation-row">
                                    <span className="receipt-label">Group:</span>
                                    <span className="receipt-value">{group_name}</span>
                                </div>
                                <div className="confirmation-row">
                                    <span className="receipt-label">Auction Date:</span>
                                    <span className="receipt-value">{formatDate(auct_date)}</span>
                                </div>
                                <div className="confirmation-row">
                                    <span className="receipt-label">Payable Date:</span>
                                    <span className="receipt-value">{formatDate(payableDate)}</span>
                                </div>
                                <div className="confirmation-row">
                                    <span className="receipt-label">Payment Method:</span>
                                    <span className="receipt-value">{paymentMethod}</span>
                                </div>
                                <div className="confirmation-row">
                                    <span className="receipt-label">Payment Type:</span>
                                    <span className="receipt-value">
                                        {paymentType === "full" ? "Full Payment" : "Partial Payment"}
                                    </span>
                                </div>
                                {paymentType === "partial" && (
                                    <div className="confirmation-row">
                                        <span className="receipt-label">Partial Amount:</span>
                                        <span className="receipt-value">{formatCurrency(partialAmount)}</span>
                                    </div>
                                )}
                                {paymentType === "full" && (
                                    <div className="confirmation-row">
                                        <span className="receipt-label">Paying Amount:</span>
                                        <span className="receipt-value">
                                            {formatCurrency(pbdue > 0 ? pbdue : pytotal)}
                                        </span>
                                    </div>
                                )}
                                <div className="confirmation-actions">
                                    <button className="cancel-button" onClick={() => setIsConfirming(false)}>
                                        Back
                                    </button>
                                    <button className="pay-button" onClick={handleConfirmPayment}>
                                        {loading ? <span className="spinner" /> : "Confirm Payment"}
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="modal-body receipt-view">
                        <div className="receipt-container">
                            <h2 className="receipt-header">✅ Payment Successful</h2>
                            <hr className="receipt-divider" />
                            <div className="receipt-row">
                                <span className="receipt-label">Subscriber Name:</span>
                                <span className="receipt-value">{name}</span>
                            </div>
                            <div className="receipt-row">
                                <span className="receipt-label">Payable Date:</span>
                                <span className="receipt-value">{formatDate(payableDate)}</span>
                            </div>
                            <div className="receipt-row">
                                <span className="receipt-label">Group Name:</span>
                                <span className="receipt-value">{group_name}</span>
                            </div>
                            <div className="receipt-row">
                                <span className="receipt-label">Auction Date:</span>
                                <span className="receipt-value">{formatDate(auct_date)}</span>
                            </div>
                            <div className="receipt-row">
                                <span className="receipt-label">Amount Paid:</span>
                                <span className="receipt-value">{formatCurrency(receiptData.paymentAmount)}</span>
                            </div>
                            <div className="receipt-row">
                                <span className="receipt-label">Payment Method:</span>
                                <span className="receipt-value">{receiptData.paymentMethod}</span>
                            </div>
                            <div className="receipt-row">
                                <span className="receipt-label">Payment Type:</span>
                                <span className="receipt-value">{receiptData.paymentType}</span>
                            </div>
                            <div className="modal-actions">
                                <button className="cancel-button" onClick={onClose}>Close</button>
                                <button className="pay-button" onClick={handlePrint}>Print</button>
                                <button className="pay-button" onClick={handleDownload}>Download</button>
                            </div>
                        </div>
                    </div>
                )}


                {/* {!receiptData ? (
                    <>
                        <div className="modal-header">
                            <img
                                src={user_image_from_s3 || "/default.jpg"}
                                alt={name}
                                className="subscriber-img"
                                onError={(e) => (e.target.src = "/default.jpg")}
                            />
                            <div className="subscriber-info">
                                <h2 className="subscriber-name">{name}</h2>
                                <p className="subscriber-detail">Group: {group_name}</p>
                                <p className="subscriber-detail">Auction Date: {formatDate(auct_date)}</p>
                            </div>
                        </div>

                        <div className="modal-body">
                            <div className="payment-summary-bar">
                                <div className="summary-item">
                                    <div className="label">Total</div>
                                    <div className="value total">{formatCurrency(pytotal)}</div>
                                </div>
                                <div className="summary-item">
                                    <div className="label">Paid</div>
                                    <div className="value paid">{formatCurrency(pbpaid)}</div>
                                </div>
                                <div className="summary-item">
                                    <div className="label">Due</div>
                                    <div className="value due">{formatCurrency(pbdue)}</div>
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="payableDate">Payable Date:</label>
                                <input
                                    type="date"
                                    id="payableDate"
                                    className="large-input"
                                    value={payableDate}
                                    onChange={(e) => setPayableDate(e.target.value)}
                                />
                            </div>

                            <div className="form-group">
                                <label>Payment Method:</label>
                                <select
                                    className="payment-select"
                                    value={paymentMethod}
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                >
                                    <option value="">Select Account</option>
                                    {ledgerAccounts.map((acc) => (
                                        <option key={acc.id} value={acc.account_name}>
                                            {acc.account_name}
                                        </option>
                                    ))}
                                </select>
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
                                                setPartialAmount("");
                                            }}
                                        /> Full Payment
                                    </label>
                                    <label>
                                        <input
                                            type="radio"
                                            value="partial"
                                            checked={paymentType === "partial"}
                                            onChange={() => setPaymentType("partial")}
                                        /> Partial Payment
                                    </label>
                                </div>
                            </div>

                            {paymentType === "partial" && (
                                <div className="form-group">
                                    <label htmlFor="partialAmount">Enter Partial Amount:</label>
                                    <input
                                        type="number"
                                        id="partialAmount"
                                        className="large-input"
                                        value={partialAmount}
                                        onChange={handlePartialAmountChange}
                                        placeholder="₹0.00"
                                        min="0"
                                    />
                                </div>
                            )}

                            <div className="modal-actions">
                                <button className="cancel-button" onClick={onClose}>Cancel</button>
                                <button
                                    className="pay-button"
                                   onClick={() => setIsConfirming(true)}
                                    disabled={loading || !paymentMethod || (paymentType === "partial" && !partialAmount)}
                                >
                                    {loading ? (
                                        <span className="loading-text">
                                            <span className="spinner" /> Processing...
                                        </span>
                                    ) : (
                                        "Pay"
                                    )}
                                </button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="modal-body receipt-view">
                        <div className="receipt-container">
                            <h2 className="receipt-header">✅ Payment Successful</h2>
                            <hr className="receipt-divider" />
                            <div className="receipt-row">
                                <span className="receipt-label">Subscriber Name:</span>
                                <span className="receipt-value">{name}</span>
                            </div>
                            <div className="receipt-row">
                                <span className="receipt-label">Payable Date:</span>
                                <span className="receipt-value">{formatDate(payableDate)}</span>
                            </div>
                            <div className="receipt-row">
                                <span className="receipt-label">Group Name:</span>
                                <span className="receipt-value">{group_name}</span>
                            </div>
                            <div className="receipt-row">
                                <span className="receipt-label">Auction Date:</span>
                                <span className="receipt-value">{formatDate(auct_date)}</span>
                            </div>
                            <div className="receipt-row">
                                <span className="receipt-label">Amount Paid:</span>
                                <span className="receipt-value">{formatCurrency(receiptData.paymentAmount)}</span>
                            </div>
                            <div className="receipt-row">
                                <span className="receipt-label">Payment Method:</span>
                                <span className="receipt-value">{receiptData.paymentMethod}</span>
                            </div>
                            <div className="receipt-row">
                                <span className="receipt-label">Payment Type:</span>
                                <span className="receipt-value">{receiptData.paymentType}</span>
                            </div>
                            <div className="modal-actions">
                                <button className="cancel-button" onClick={onClose}>Close</button>
                                <button className="pay-button" onClick={handlePrint}>Print</button>
                                <button className="pay-button" onClick={handleDownload}>Download</button>
                            </div>
                        </div>
                    </div>
                )} */}
            </div>
        </div>
    );
};

export default PayablePaymentModal;
