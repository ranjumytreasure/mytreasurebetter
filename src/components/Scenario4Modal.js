import React from 'react';
import { toast } from 'react-toastify';
import { useGroupDetailsContext } from '../context/group_context';
import { User, Phone, X, AlertTriangle, DollarSign, ExternalLink, MessageCircle } from 'lucide-react';

const Scenario4Modal = ({ isOpen, onClose, subscriber, groupId, scenarioData }) => {
    const { fetchGroups } = useGroupDetailsContext();

    const handleViewDetails = () => {
        // Navigate to detailed financial view or show expanded details
        // For now, we'll just refresh the group data
        if (groupId) {
            fetchGroups(groupId);
        }
        toast.info('Financial details will be shown in a detailed view');
    };

    const handleContactSupport = () => {
        // Open support ticket or contact form
        // For now, we'll just show a message
        toast.info('Support contact functionality will be implemented');
    };

    const handleClose = () => {
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="bg-gradient-to-r from-red-500 to-red-600 p-6 text-white relative">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-2xl font-bold mb-2">Deletion Blocked</h3>
                            <p className="text-red-100">Active financial records prevent deletion</p>
                        </div>
                        <button onClick={handleClose} className="text-white hover:text-red-200 transition-colors p-2 rounded-full hover:bg-white hover:bg-opacity-20">
                            <X size={24} />
                        </button>
                    </div>
                </div>

                <div className="p-6">
                    {/* Warning Message */}
                    <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-6">
                        <div className="flex items-center gap-3 mb-4">
                            <AlertTriangle size={24} className="text-red-600" />
                            <h4 className="text-lg font-semibold text-red-800">Deletion Not Allowed</h4>
                        </div>
                        <p className="text-red-700 mb-4">
                            This subscriber cannot be deleted because they have active financial obligations or recent payment activities.
                        </p>
                        <p className="text-red-700 text-sm">
                            Please resolve all financial matters before attempting deletion, or contact support for assistance.
                        </p>
                    </div>

                    {/* Financial Summary */}
                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 mb-6">
                        <div className="flex items-center gap-3 mb-4">
                            <DollarSign size={24} className="text-gray-600" />
                            <h4 className="text-lg font-semibold text-gray-800">Active Financial Records</h4>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-blue-600">
                                    {scenarioData?.financialSummary?.receivables || 0}
                                </div>
                                <div className="text-sm text-blue-700">Receivables</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-green-600">
                                    {scenarioData?.financialSummary?.receipts || 0}
                                </div>
                                <div className="text-sm text-green-700">Receipts</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-orange-600">
                                    {scenarioData?.financialSummary?.payables || 0}
                                </div>
                                <div className="text-sm text-orange-700">Payables</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-purple-600">
                                    {scenarioData?.financialSummary?.payments || 0}
                                </div>
                                <div className="text-sm text-purple-700">Payments</div>
                            </div>
                        </div>
                    </div>

                    {/* Subscriber Info */}
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6">
                        <h4 className="text-lg font-semibold text-blue-800 mb-4">Subscriber Information</h4>
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                {subscriber?.user_image_from_s3 ? (
                                    <img
                                        src={subscriber.user_image_from_s3}
                                        alt={subscriber?.name || "Subscriber"}
                                        className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-md"
                                    />
                                ) : (
                                    <div className="w-16 h-16 rounded-full bg-gray-200 border-2 border-white shadow-md flex items-center justify-center">
                                        <User size={20} className="text-gray-400" />
                                    </div>
                                )}
                            </div>
                            <div>
                                <h5 className="text-xl font-semibold text-gray-800">{subscriber?.name || "Unknown"}</h5>
                                <p className="text-gray-600 flex items-center gap-2">
                                    <Phone size={16} />
                                    {subscriber?.phone || "N/A"}
                                </p>
                                <p className="text-sm text-gray-500 mt-1">
                                    Group Subscriber ID: {subscriber?.group_subscriber_id}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Action Options */}
                    <div className="space-y-4">
                        <h4 className="text-lg font-semibold text-gray-800 mb-4">Available Actions:</h4>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {/* View Details Option */}
                            <div className="border border-blue-200 rounded-xl p-6 hover:bg-blue-50 transition-colors">
                                <div className="flex items-center gap-3 mb-3">
                                    <ExternalLink size={20} className="text-blue-600" />
                                    <h5 className="font-semibold text-blue-800">View Details</h5>
                                </div>
                                <p className="text-blue-700 text-sm mb-4">
                                    View detailed financial breakdown and transaction history.
                                </p>
                                <button
                                    onClick={handleViewDetails}
                                    className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    View Details
                                </button>
                            </div>

                            {/* Contact Support Option */}
                            <div className="border border-green-200 rounded-xl p-6 hover:bg-green-50 transition-colors">
                                <div className="flex items-center gap-3 mb-3">
                                    <MessageCircle size={20} className="text-green-600" />
                                    <h5 className="font-semibold text-green-800">Contact Support</h5>
                                </div>
                                <p className="text-green-700 text-sm mb-4">
                                    Get help from our support team for complex financial situations.
                                </p>
                                <button
                                    onClick={handleContactSupport}
                                    className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                                >
                                    Contact Support
                                </button>
                            </div>

                            {/* Close Option */}
                            <div className="border border-gray-200 rounded-xl p-6 hover:bg-gray-50 transition-colors">
                                <div className="flex items-center gap-3 mb-3">
                                    <X size={20} className="text-gray-600" />
                                    <h5 className="font-semibold text-gray-800">Close</h5>
                                </div>
                                <p className="text-gray-700 text-sm mb-4">
                                    Close this dialog and return to the subscriber list.
                                </p>
                                <button
                                    onClick={handleClose}
                                    className="w-full bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Additional Information */}
                    <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <div className="flex items-start gap-3">
                            <AlertTriangle size={16} className="text-yellow-600 mt-0.5" />
                            <div className="text-sm text-yellow-800">
                                <p className="font-medium mb-1">Why is deletion blocked?</p>
                                <p>
                                    Subscribers with active payables (money owed by the group) or recent payments cannot be deleted
                                    to maintain financial integrity and audit trails. Please resolve all financial matters first.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Scenario4Modal;
