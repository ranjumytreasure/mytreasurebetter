import React, { useEffect } from 'react';
import { useCompanySubscriberContext } from '../../context/companysubscriber_context';
import { FiPhone, FiMail, FiMapPin, FiUser } from 'react-icons/fi';

const SubscribersPage = () => {
    console.log('SubscribersPage: Component rendering');

    // Always call the hook at the top level
    const context = useCompanySubscriberContext();
    console.log('SubscribersPage: Context received:', context);

    const { companySubscribers = [], isLoading = false, fetchCompanySubscribers } = context || {};

    // Use companySubscribers as subscribers
    const subscribers = companySubscribers;

    useEffect(() => {
        if (fetchCompanySubscribers) {
            fetchCompanySubscribers();
        }
    }, [fetchCompanySubscribers]);

    // If context is not available, show error message
    if (!context) {
        return (
            <div className="p-4 sm:p-6 lg:p-8">
                <div className="max-w-7xl mx-auto">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                        <h3 className="text-lg font-semibold text-red-800 mb-2">Context Error</h3>
                        <p className="text-red-600">CompanySubscriberContext is not available. Please check the provider setup.</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Subscribers</h1>
                    <p className="text-sm text-gray-600 mt-1">
                        All subscribers available for Daily Collection
                    </p>
                </div>

                {/* Loading State */}
                {isLoading && subscribers.length === 0 && (
                    <div className="flex justify-center items-center py-20">
                        <div className="text-center">
                            <div className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                            <p className="text-gray-600">Loading subscribers...</p>
                        </div>
                    </div>
                )}

                {/* Empty State */}
                {!isLoading && subscribers.length === 0 && (
                    <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-4xl">👥</span>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">No Subscribers Found</h3>
                        <p className="text-gray-600 mb-6">
                            Subscribers can be added from the main Treasure app
                        </p>
                    </div>
                )}

                {/* Subscribers Grid */}
                {!isLoading && subscribers.length > 0 && (
                    <>
                        {/* Stats Summary */}
                        <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 mb-6">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <FiUser className="w-6 h-6 text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 font-medium">Total Subscribers</p>
                                    <p className="text-2xl font-bold text-gray-800">{subscribers.length}</p>
                                </div>
                            </div>
                        </div>

                        {/* Desktop Table View */}
                        <div className="hidden md:block bg-white rounded-xl shadow-sm overflow-hidden">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            Subscriber
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            Contact
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            Email
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            Address
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {subscribers.map((subscriber) => (
                                        <tr key={subscriber.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                                                        <span className="text-blue-600 font-bold text-sm">
                                                            {(subscriber.name || subscriber.firstname || 'U').charAt(0).toUpperCase()}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-gray-900">
                                                            {subscriber.name || subscriber.firstname || 'N/A'}
                                                        </p>
                                                        <p className="text-sm text-gray-500">
                                                            ID: {subscriber.id?.substring(0, 8)}...
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                                    <FiPhone className="w-4 h-4" />
                                                    {subscriber.phone || 'N/A'}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                                    <FiMail className="w-4 h-4" />
                                                    {subscriber.email || 'N/A'}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-start gap-2 text-sm text-gray-600">
                                                    <FiMapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                                    <span className="line-clamp-2">
                                                        {subscriber.address || subscriber.street_address || 'N/A'}
                                                    </span>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile Card View */}
                        <div className="md:hidden space-y-4">
                            {subscribers.map((subscriber) => (
                                <div
                                    key={subscriber.id}
                                    className="bg-white rounded-xl shadow-sm p-4 border border-gray-200"
                                >
                                    <div className="flex items-start gap-3 mb-3">
                                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                                            <span className="text-blue-600 font-bold text-lg">
                                                {(subscriber.name || subscriber.firstname || 'U').charAt(0).toUpperCase()}
                                            </span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-semibold text-gray-900 truncate">
                                                {subscriber.name || subscriber.firstname || 'N/A'}
                                            </h3>
                                            <p className="text-xs text-gray-500">
                                                ID: {subscriber.id?.substring(0, 12)}...
                                            </p>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        {subscriber.phone && (
                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <FiPhone className="w-4 h-4 flex-shrink-0" />
                                                <span>{subscriber.phone}</span>
                                            </div>
                                        )}
                                        {subscriber.email && (
                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <FiMail className="w-4 h-4 flex-shrink-0" />
                                                <span className="truncate">{subscriber.email}</span>
                                            </div>
                                        )}
                                        {(subscriber.address || subscriber.street_address) && (
                                            <div className="flex items-start gap-2 text-sm text-gray-600">
                                                <FiMapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                                <span className="line-clamp-2">
                                                    {subscriber.address || subscriber.street_address}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default SubscribersPage;

