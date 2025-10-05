import React, { useState, useMemo } from 'react';
import { useGroupsDetailsContext } from '../context/groups_context';
import { toast, ToastContainer } from 'react-toastify';
import { FiTrash2, FiAlertTriangle, FiLoader, FiSearch, FiFilter, FiX } from 'react-icons/fi';
import 'react-toastify/dist/ReactToastify.css';

const ManageGroups = () => {
    const { state, deleteGroup } = useGroupsDetailsContext();
    const { groups, isLoading, error } = state;
    const [deletingGroupId, setDeletingGroupId] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedGroup, setSelectedGroup] = useState(null);

    // Filter states
    const [searchTerm, setSearchTerm] = useState('');
    const [amountFilter, setAmountFilter] = useState('');
    const [showFilters, setShowFilters] = useState(false);

    // Filter groups based on search term and amount
    const filteredGroups = useMemo(() => {
        return groups.filter(group => {
            const matchesSearch = searchTerm === '' ||
                (group.group_name && group.group_name.toLowerCase().includes(searchTerm.toLowerCase()));

            const matchesAmount = amountFilter === '' ||
                (group.amount && group.amount.toString().includes(amountFilter));

            return matchesSearch && matchesAmount;
        });
    }, [groups, searchTerm, amountFilter]);

    // Clear all filters
    const clearFilters = () => {
        setSearchTerm('');
        setAmountFilter('');
    };

    const handleDeleteClick = (group) => {
        setSelectedGroup(group);
        setShowDeleteModal(true);
    };

    const handleConfirmDelete = async () => {
        if (!selectedGroup) return;

        setDeletingGroupId(selectedGroup.id);
        try {
            await deleteGroup(selectedGroup.id);
            toast.success('Group deleted successfully!');
        } catch (error) {
            toast.error('Failed to delete group. Please try again.');
        } finally {
            setDeletingGroupId(null);
            setShowDeleteModal(false);
            setSelectedGroup(null);
        }
    };

    const handleCancelDelete = () => {
        setShowDeleteModal(false);
        setSelectedGroup(null);
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0,
        }).format(amount);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    if (error) {
        return (
            <div className="p-6">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-red-800">Error: {error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Manage Groups</h2>
                <p className="text-gray-600">View and manage all your groups. Delete groups to remove them permanently.</p>
            </div>

            {/* Filter Section */}
            <div className="mb-6 bg-gray-50 rounded-lg p-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    {/* Search Bar */}
                    <div className="flex-1 max-w-md">
                        <div className="relative">
                            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                            <input
                                type="text"
                                placeholder="Search by group name..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            {searchTerm && (
                                <button
                                    onClick={() => setSearchTerm('')}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    <FiX className="h-4 w-4" />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Filter Controls */}
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                        >
                            <FiFilter className="h-4 w-4" />
                            <span>Filters</span>
                        </button>

                        {(searchTerm || amountFilter) && (
                            <button
                                onClick={clearFilters}
                                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
                            >
                                Clear All
                            </button>
                        )}
                    </div>
                </div>

                {/* Advanced Filters */}
                {showFilters && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Filter by Amount
                                </label>
                                <input
                                    type="text"
                                    placeholder="Enter amount to filter..."
                                    value={amountFilter}
                                    onChange={(e) => setAmountFilter(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* Results Summary */}
                {(searchTerm || amountFilter) && (
                    <div className="mt-3 text-sm text-gray-600">
                        Showing {filteredGroups.length} of {groups.length} groups
                        {searchTerm && <span> matching "{searchTerm}"</span>}
                        {amountFilter && <span> with amount containing "{amountFilter}"</span>}
                    </div>
                )}
            </div>

            {isLoading && groups.length === 0 ? (
                <div className="flex items-center justify-center py-12">
                    <div className="flex items-center space-x-2">
                        <FiLoader className="animate-spin h-6 w-6 text-blue-600" />
                        <span className="text-gray-600">Loading groups...</span>
                    </div>
                </div>
            ) : filteredGroups.length === 0 ? (
                <div className="text-center py-12">
                    <div className="text-gray-400 mb-4">
                        <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                        {groups.length === 0 ? 'No groups found' : 'No groups match your filters'}
                    </h3>
                    <p className="text-gray-500">
                        {groups.length === 0
                            ? 'You don\'t have any groups to manage yet.'
                            : 'Try adjusting your search terms or filters.'
                        }
                    </p>
                    {groups.length > 0 && (searchTerm || amountFilter) && (
                        <button
                            onClick={clearFilters}
                            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                        >
                            Clear Filters
                        </button>
                    )}
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {filteredGroups.map((group) => (
                        <div key={group.id} className="bg-white rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow duration-200">
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="text-lg font-semibold text-gray-900 truncate">
                                        {group.group_name || 'Unnamed Group'}
                                    </h3>
                                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${group.groupProgress === 'FUTURE'
                                        ? 'bg-blue-100 text-blue-800'
                                        : group.groupProgress === 'ACTIVE'
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-gray-100 text-gray-800'
                                        }`}>
                                        {group.groupProgress || 'Unknown'}
                                    </span>
                                </div>

                                <div className="space-y-3 mb-4">
                                    <div className="flex justify-between">
                                        <span className="text-sm text-gray-500">Amount:</span>
                                        <span className="text-sm font-medium text-gray-900">
                                            {formatCurrency(group.amount || 0)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-gray-500">Type:</span>
                                        <span className="text-sm font-medium text-gray-900">
                                            {group.type || 'N/A'}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-gray-500">Tenure:</span>
                                        <span className="text-sm font-medium text-gray-900">
                                            {group.tenure || 0} months
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-gray-500">Members:</span>
                                        <span className="text-sm font-medium text-gray-900">
                                            {group.totalMembers || 0}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-gray-500">Auction Date:</span>
                                        <span className="text-sm font-medium text-gray-900">
                                            {group.auctDate ? formatDate(group.auctDate) : 'N/A'}
                                        </span>
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-gray-200">
                                    <button
                                        onClick={() => handleDeleteClick(group)}
                                        disabled={deletingGroupId === group.id}
                                        className="w-full flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                                    >
                                        {deletingGroupId === group.id ? (
                                            <>
                                                <FiLoader className="animate-spin h-4 w-4 mr-2" />
                                                Deleting...
                                            </>
                                        ) : (
                                            <>
                                                <FiTrash2 className="h-4 w-4 mr-2" />
                                                Delete Group
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteModal && selectedGroup && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                    <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                        <div className="mt-3 text-center">
                            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                                <FiAlertTriangle className="h-6 w-6 text-red-600" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                Delete Group
                            </h3>
                            <div className="mt-2 px-7 py-3">
                                <p className="text-sm text-gray-500 mb-4">
                                    Are you sure you want to delete the group <strong>"{selectedGroup.group_name}"</strong>?
                                </p>
                                <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-4">
                                    <p className="text-sm text-red-800">
                                        <strong>Warning:</strong> This action will permanently delete all data associated with this group including:
                                    </p>
                                    <ul className="text-sm text-red-700 mt-1 list-disc list-inside">
                                        <li>Group information and settings</li>
                                        <li>All financial transactions</li>
                                        <li>Member subscriptions</li>
                                        <li>All historical records</li>
                                    </ul>
                                </div>
                                <p className="text-sm text-red-600 font-medium">
                                    This action cannot be undone!
                                </p>
                            </div>
                            <div className="flex space-x-3 px-4 py-3">
                                <button
                                    onClick={handleCancelDelete}
                                    className="flex-1 px-4 py-2 bg-gray-300 text-gray-800 text-base font-medium rounded-md shadow-sm hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleConfirmDelete}
                                    disabled={deletingGroupId === selectedGroup.id}
                                    className="flex-1 px-4 py-2 bg-red-600 text-white text-base font-medium rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {deletingGroupId === selectedGroup.id ? 'Deleting...' : 'Delete'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
        </div>
    );
};

export default ManageGroups;