import React, { useEffect, useState } from 'react';
import { useDailyCollectionContext } from '../../context/dailyCollection/DailyCollectionContext';
import { FiX, FiUser, FiCalendar, FiDollarSign, FiCheckCircle, FiAlertCircle, FiTrash2 } from 'react-icons/fi';

const LoanDetails = ({ loan, onClose }) => {
    const { getLoanDetails, deleteLoan } = useDailyCollectionContext();
    const [loanData, setLoanData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        loadLoanDetails();
    }, [loan.id]);

    const loadLoanDetails = async () => {
        setIsLoading(true);
        const result = await getLoanDetails(loan.id);
        if (result.success) {
            setLoanData(result.data);
        }
        setIsLoading(false);
    };

    const handleDeleteLoan = async () => {
        setIsDeleting(true);
        try {
            const result = await deleteLoan(loan.id);
            if (result.success) {
                alert('Loan deleted successfully!');
                onClose(); // Close the modal
            } else {
                alert('Failed to delete loan: ' + (result.message || 'Unknown error'));
            }
        } catch (error) {
            console.error('Delete loan error:', error);
            alert('Failed to delete loan: ' + error.message);
        } finally {
            setIsDeleting(false);
            setShowDeleteConfirm(false);
        }
    };

    if (isLoading) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-xl p-8">
                    <div className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                    <p className="text-gray-600 mt-4 text-center">Loading loan details...</p>
                </div>
            </div>
        );
    }

    const { loan: loanInfo, receivables = [] } = loanData || {};

    // Debug: Log the data structure
    console.log("=== LOAN DETAILS DEBUG ===");
    console.log("Loan data:", loanData);
    console.log("Receivables:", receivables);
    console.log("First receivable:", receivables[0]);
    console.log("First receivable receipts:", receivables[0]?.receipts);
    console.log("=== END DEBUG ===");

    const paidReceivables = receivables.filter(r => r.is_paid).length;
    const pendingReceivables = receivables.filter(r => !r.is_paid).length;
    const totalPaid = receivables.reduce((sum, r) => {
        const paidAmount = r.receipts?.reduce((s, receipt) => s + parseFloat(receipt.paid_amount || 0), 0) || 0;
        return sum + paidAmount;
    }, 0);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 overflow-y-auto">
            <div className="bg-white rounded-xl shadow-2xl w-full h-full max-h-[95vh] my-2 flex flex-col">
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center rounded-t-xl">
                    <div>
                        <h2 className="text-xl font-bold text-gray-800">Loan Details</h2>
                        <p className="text-sm text-gray-600">Payment schedule and collection history</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setShowDeleteConfirm(true)}
                            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors flex items-center gap-2"
                        >
                            <FiTrash2 className="w-4 h-4" />
                            Delete Loan
                        </button>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <FiX className="w-5 h-5 text-gray-500" />
                        </button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6">
                    {/* Loan Summary */}
                    <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl p-6 text-white mb-6">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div>
                                <p className="text-red-100 text-xs mb-1">Principal Amount</p>
                                <p className="text-2xl font-bold text-white">₹{parseFloat(loanInfo?.principal_amount || 0).toFixed(2)}</p>
                            </div>
                            <div>
                                <p className="text-red-100 text-xs mb-1">Outstanding Balance</p>
                                <p className="text-2xl font-bold text-white">₹{parseFloat(loanInfo?.closing_balance || 0).toFixed(2)}</p>
                            </div>
                            <div>
                                <p className="text-red-100 text-xs mb-1">Per Cycle Due</p>
                                <p className="text-2xl font-bold text-white">₹{parseFloat(loanInfo?.daily_due_amount || 0).toFixed(2)}</p>
                            </div>
                            <div>
                                <p className="text-red-100 text-xs mb-1">Status</p>
                                <p className="text-2xl font-bold text-white">{loanInfo?.status || 'N/A'}</p>
                            </div>
                        </div>

                        <div className="mt-4 pt-4 border-t border-red-400 grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                            <div className="flex items-center gap-2">
                                <FiUser className="w-4 h-4" />
                                <span>{loanInfo?.subscriber?.name || loanInfo?.subscriber?.firstname || 'N/A'}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <FiCalendar className="w-4 h-4" />
                                <span>Start: {loanInfo?.start_date || 'N/A'}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <FiDollarSign className="w-4 h-4" />
                                <span>{loanInfo?.product?.product_name || 'N/A'}</span>
                            </div>
                        </div>
                    </div>

                    {/* Receivables Progress */}
                    <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="font-semibold text-gray-800">Collection Progress</h3>
                            <span className="text-sm text-gray-600">
                                {paidReceivables} / {receivables.length} cycles completed
                            </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                            <div
                                className="bg-green-500 h-3 rounded-full transition-all duration-300"
                                style={{ width: `${receivables.length ? (paidReceivables / receivables.length) * 100 : 0}%` }}
                            ></div>
                        </div>
                        <div className="flex justify-between mt-2 text-xs text-gray-600">
                            <span>Collected: ₹{totalPaid.toFixed(2)}</span>
                            <span>Pending: {pendingReceivables} cycles</span>
                        </div>
                    </div>

                    {/* Receivables Table */}
                    <div>
                        <h3 className="font-semibold text-gray-800 mb-4">Payment Schedule</h3>

                        {/* Desktop Table */}
                        <div className="hidden md:block bg-white border border-gray-200 rounded-xl overflow-hidden">
                            <table className="w-full">
                                <thead className="bg-gray-50 sticky top-0">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Due Date</th>
                                        <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Opening</th>
                                        <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Due Amount</th>
                                        <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Paid</th>
                                        <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Carry Fwd</th>
                                        <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Closing</th>
                                        <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Payment Details</th>
                                        <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {receivables.map((receivable, index) => {
                                        const paidAmount = receivable.receipts?.reduce((sum, r) => sum + parseFloat(r.paid_amount || 0), 0) || 0;
                                        const isPaid = receivable.is_paid;

                                        return (
                                            <tr key={receivable.id} className={`${isPaid ? 'bg-green-50' : ''} hover:bg-gray-50`}>
                                                <td className="px-4 py-3 text-sm">{receivable.due_date}</td>
                                                <td className="px-4 py-3 text-sm text-right">₹{parseFloat(receivable.opening_balance).toFixed(2)}</td>
                                                <td className="px-4 py-3 text-sm text-right font-semibold">₹{parseFloat(receivable.due_amount).toFixed(2)}</td>
                                                <td className="px-4 py-3 text-sm text-right text-green-600 font-semibold">
                                                    {paidAmount > 0 ? `₹${paidAmount.toFixed(2)}` : '-'}
                                                </td>
                                                <td className="px-4 py-3 text-sm text-right text-orange-600">
                                                    {parseFloat(receivable.carry_forward) > 0 ? `₹${parseFloat(receivable.carry_forward).toFixed(2)}` : '-'}
                                                </td>
                                                <td className="px-4 py-3 text-sm text-right">₹{parseFloat(receivable.closing_balance).toFixed(2)}</td>
                                                <td className="px-4 py-3 text-center">
                                                    {receivable.receipts && receivable.receipts.length > 0 ? (
                                                        <div className="text-xs">
                                                            {receivable.receipts.map((receipt, idx) => (
                                                                <div key={idx} className="text-green-600">
                                                                    ₹{parseFloat(receipt.paid_amount).toFixed(2)} via {receipt.payment_method}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    ) : (
                                                        <span className="text-gray-400">-</span>
                                                    )}
                                                </td>
                                                <td className="px-4 py-3 text-center">
                                                    {isPaid ? (
                                                        <FiCheckCircle className="w-5 h-5 text-green-600 inline" />
                                                    ) : (
                                                        <FiAlertCircle className="w-5 h-5 text-orange-500 inline" />
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile Card View */}
                        <div className="md:hidden space-y-3">
                            {receivables.map((receivable, index) => {
                                const paidAmount = receivable.receipts?.reduce((sum, r) => sum + parseFloat(r.paid_amount || 0), 0) || 0;
                                const isPaid = receivable.is_paid;

                                return (
                                    <div
                                        key={receivable.id}
                                        className={`${isPaid ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'} border rounded-lg p-3`}
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm font-semibold text-gray-800">{receivable.due_date}</span>
                                                {isPaid ? (
                                                    <FiCheckCircle className="w-4 h-4 text-green-600" />
                                                ) : (
                                                    <FiAlertCircle className="w-4 h-4 text-orange-500" />
                                                )}
                                            </div>
                                            <span className="text-xs text-gray-500">Cycle #{index + 1}</span>
                                        </div>
                                        <div className="grid grid-cols-2 gap-2 text-xs">
                                            <div>
                                                <span className="text-gray-500">Due:</span>
                                                <span className="font-semibold text-gray-800 ml-1">₹{parseFloat(receivable.due_amount).toFixed(2)}</span>
                                            </div>
                                            <div>
                                                <span className="text-gray-500">Paid:</span>
                                                <span className="font-semibold text-green-600 ml-1">
                                                    {paidAmount > 0 ? `₹${paidAmount.toFixed(2)}` : '-'}
                                                </span>
                                            </div>
                                            <div>
                                                <span className="text-gray-500">Opening:</span>
                                                <span className="font-semibold text-gray-800 ml-1">₹{parseFloat(receivable.opening_balance).toFixed(2)}</span>
                                            </div>
                                            <div>
                                                <span className="text-gray-500">Closing:</span>
                                                <span className="font-semibold text-gray-800 ml-1">₹{parseFloat(receivable.closing_balance).toFixed(2)}</span>
                                            </div>
                                        </div>

                                        {/* Payment Details for Mobile */}
                                        {receivable.receipts && receivable.receipts.length > 0 && (
                                            <div className="mt-2 pt-2 border-t border-gray-200">
                                                <div className="text-xs text-gray-500 mb-1">Payment Details:</div>
                                                {receivable.receipts.map((receipt, idx) => (
                                                    <div key={idx} className="text-xs text-green-600 bg-green-50 rounded px-2 py-1 mb-1">
                                                        ₹{parseFloat(receipt.paid_amount).toFixed(2)} via {receipt.payment_method} on {receipt.payment_date}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Delete Confirmation Modal */}
                {showDeleteConfirm && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60 p-4">
                        <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
                            <div className="p-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                                        <FiTrash2 className="w-6 h-6 text-red-600" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-800">Delete Loan</h3>
                                        <p className="text-sm text-gray-600">This action cannot be undone</p>
                                    </div>
                                </div>

                                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                                    <h4 className="font-semibold text-red-800 mb-2">⚠️ Warning: This will permanently delete:</h4>
                                    <ul className="text-sm text-red-700 space-y-1">
                                        <li>• The loan record (dc_loan)</li>
                                        <li>• All receivables (dc_receivables)</li>
                                        <li>• All payment receipts (dc_receipts)</li>
                                        <li>• All related ledger entries</li>
                                    </ul>
                                </div>

                                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                                    <h4 className="font-semibold text-gray-800 mb-2">Loan Details:</h4>
                                    <div className="text-sm text-gray-600 space-y-1">
                                        <p><strong>Subscriber:</strong> {loanInfo?.subscriber?.name || loanInfo?.subscriber?.firstname || 'N/A'}</p>
                                        <p><strong>Amount:</strong> ₹{parseFloat(loanInfo?.principal_amount || 0).toFixed(2)}</p>
                                        <p><strong>Status:</strong> {loanInfo?.status || 'N/A'}</p>
                                        <p><strong>Receivables:</strong> {receivables.length} records</p>
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setShowDeleteConfirm(false)}
                                        className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                        disabled={isDeleting}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleDeleteLoan}
                                        disabled={isDeleting}
                                        className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                                    >
                                        {isDeleting ? (
                                            <>
                                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                Deleting...
                                            </>
                                        ) : (
                                            <>
                                                <FiTrash2 className="w-4 h-4" />
                                                Delete Permanently
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Footer */}
                <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 rounded-b-xl">
                    <div className="flex justify-end">
                        <button
                            onClick={onClose}
                            className="px-6 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoanDetails;




