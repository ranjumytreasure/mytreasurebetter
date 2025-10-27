import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FiDollarSign, FiTrendingUp, FiUsers, FiBarChart2, FiEye, FiRefreshCw } from 'react-icons/fi';
import { useCollector } from '../../context/CollectorProvider';

const CollectorDashboard = () => {
    const {
        user,
        receivables,
        isLoading,
        error,
        fetchReceivables,
        getAreaSummary,
        getOverallSummary
    } = useCollector();

    const hasFetched = useRef(false);

    useEffect(() => {
        // Fetch data on mount only if we don't have data
        if (!hasFetched.current && receivables.length === 0 && !isLoading) {
            hasFetched.current = true;
            fetchReceivables();
        }
    }, []); // Empty dependency - only run once on mount

    const handleRefresh = () => {
        console.log('🔄 Manual refresh triggered');
        fetchReceivables();
    };

    const areaSummary = getAreaSummary();
    const overallSummary = getOverallSummary();

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                        <p className="font-bold">Error</p>
                        <p>{error}</p>
                        <button
                            onClick={fetchReceivables}
                            className="mt-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Welcome Header */}
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">
                            Welcome, {user?.firstname} {user?.lastname}
                        </h1>
                        <p className="text-gray-600 mt-2">
                            Here's your collection overview and area-wise performance
                        </p>
                    </div>
                    <button
                        onClick={handleRefresh}
                        disabled={isLoading}
                        className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Refresh Dashboard"
                    >
                        <FiRefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
                        <span className="hidden md:inline">Refresh</span>
                    </button>
                </div>

                {/* Overall Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center">
                            <div className="p-3 rounded-full bg-red-100">
                                <FiDollarSign className="h-6 w-6 text-red-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Total Amount</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    ₹{overallSummary.totalAmount.toLocaleString()}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center">
                            <div className="p-3 rounded-full bg-green-100">
                                <FiTrendingUp className="h-6 w-6 text-green-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Collected</p>
                                <p className="text-2xl font-bold text-green-600">
                                    ₹{overallSummary.collected.toLocaleString()}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center">
                            <div className="p-3 rounded-full bg-orange-100">
                                <FiDollarSign className="h-6 w-6 text-orange-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Pending</p>
                                <p className="text-2xl font-bold text-orange-600">
                                    ₹{overallSummary.pending.toLocaleString()}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center">
                            <div className="p-3 rounded-full bg-blue-100">
                                <FiBarChart2 className="h-6 w-6 text-blue-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Collection Rate</p>
                                <p className="text-2xl font-bold text-blue-600">
                                    {overallSummary.collectionRate}%
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="mb-8">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Link
                            to="/chit-fund/collector/receivables"
                            className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6 flex items-center"
                        >
                            <div className="p-3 rounded-full bg-red-100">
                                <FiEye className="h-6 w-6 text-red-600" />
                            </div>
                            <div className="ml-4">
                                <h3 className="text-lg font-medium text-gray-900">View Receivables</h3>
                                <p className="text-gray-600">Check area-wise receivables and details</p>
                            </div>
                        </Link>

                        <div className="bg-white rounded-lg shadow p-6 flex items-center">
                            <div className="p-3 rounded-full bg-green-100">
                                <FiUsers className="h-6 w-6 text-green-600" />
                            </div>
                            <div className="ml-4">
                                <h3 className="text-lg font-medium text-gray-900">Assigned Areas</h3>
                                <p className="text-gray-600">{Object.keys(areaSummary).length} areas assigned</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Area-wise Performance */}
                <div className="bg-white rounded-lg shadow">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h2 className="text-xl font-semibold text-gray-900">Area-wise Performance</h2>
                        <p className="text-gray-600 mt-1">Overview of your assigned areas</p>
                    </div>

                    {Object.keys(areaSummary).length === 0 ? (
                        <div className="p-8 text-center">
                            <FiUsers className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No Areas Assigned</h3>
                            <p className="text-gray-600">You don't have any assigned areas yet.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Area Name
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Total Amount
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Collected
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Pending
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Customers
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Progress
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Action
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {Object.entries(areaSummary).map(([areaName, summary]) => {
                                        const progress = summary.totalAmount > 0
                                            ? (summary.collected / summary.totalAmount) * 100
                                            : 0;

                                        return (
                                            <tr key={areaName} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-gray-900">{areaName}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    ₹{summary.totalAmount.toLocaleString()}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                                                    ₹{summary.collected.toLocaleString()}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-orange-600">
                                                    ₹{summary.pending.toLocaleString()}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {summary.count}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="w-full bg-gray-200 rounded-full h-2 mr-2">
                                                            <div
                                                                className="bg-red-600 h-2 rounded-full"
                                                                style={{ width: `${Math.min(progress, 100)}%` }}
                                                            ></div>
                                                        </div>
                                                        <span className="text-sm text-gray-600">
                                                            {progress.toFixed(1)}%
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    <Link
                                                        to="/chit-fund/collector/receivables"
                                                        className="text-red-600 hover:text-red-900"
                                                    >
                                                        View Details
                                                    </Link>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CollectorDashboard;

