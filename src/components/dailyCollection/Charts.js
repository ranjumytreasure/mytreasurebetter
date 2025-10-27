import React from 'react';
import { FiBarChart, FiPieChart, FiTrendingUp, FiTrendingDown } from 'react-icons/fi';

// Simple Chart Components (without external dependencies)
export const SimpleBarChart = ({ data, title, height = 200 }) => {
    if (!data || Object.keys(data).length === 0) {
        return (
            <div className="h-64 flex items-center justify-center text-gray-500">
                <div className="text-center">
                    <FiBarChart className="w-12 h-12 mx-auto mb-2" />
                    <p>No data available</p>
                </div>
            </div>
        );
    }

    const maxValue = Math.max(...Object.values(data));
    const entries = Object.entries(data);

    return (
        <div className="w-full">
            {title && <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>}
            <div className="space-y-3" style={{ height: `${height}px` }}>
                {entries.map(([label, value], index) => {
                    const percentage = (value / maxValue) * 100;
                    const colors = [
                        'bg-blue-500',
                        'bg-green-500',
                        'bg-purple-500',
                        'bg-orange-500',
                        'bg-red-500',
                        'bg-indigo-500',
                        'bg-pink-500',
                        'bg-yellow-500'
                    ];

                    return (
                        <div key={label} className="flex items-center gap-3">
                            <div className="w-20 text-sm font-medium text-gray-700 truncate">
                                {label}
                            </div>
                            <div className="flex-1 bg-gray-200 rounded-full h-6 relative">
                                <div
                                    className={`h-6 rounded-full ${colors[index % colors.length]} transition-all duration-500`}
                                    style={{ width: `${percentage}%` }}
                                />
                                <div className="absolute inset-0 flex items-center justify-center text-xs font-medium text-white">
                                    {value}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export const SimplePieChart = ({ data, title, height = 200 }) => {
    console.log('SimplePieChart received data:', data);
    console.log('SimplePieChart data type:', typeof data);
    console.log('SimplePieChart data keys:', Object.keys(data || {}));

    if (!data || Object.keys(data).length === 0) {
        console.log('SimplePieChart: No data available');
        return (
            <div className="h-64 flex items-center justify-center text-gray-500">
                <div className="text-center">
                    <FiPieChart className="w-12 h-12 mx-auto mb-2" />
                    <p>No data available</p>
                </div>
            </div>
        );
    }

    const total = Object.values(data).reduce((sum, value) => sum + value, 0);
    const entries = Object.entries(data);
    const colors = [
        'bg-blue-500',
        'bg-green-500',
        'bg-purple-500',
        'bg-orange-500',
        'bg-red-500',
        'bg-indigo-500',
        'bg-pink-500',
        'bg-yellow-500'
    ];

    return (
        <div className="w-full">
            {title && <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>}
            <div className="space-y-3">
                {entries.map(([label, value], index) => {
                    const percentage = ((value / total) * 100).toFixed(1);

                    return (
                        <div key={label} className="flex items-center gap-3">
                            <div className={`w-4 h-4 rounded-full ${colors[index % colors.length]}`} />
                            <div className="flex-1">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-gray-700">{label}</span>
                                    <span className="text-sm text-gray-500">{percentage}%</span>
                                </div>
                                <div className="text-xs text-gray-500">{value} items</div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export const SimpleLineChart = ({ data, title, height = 200 }) => {
    console.log('SimpleLineChart received data:', data);
    console.log('SimpleLineChart data type:', typeof data);
    console.log('SimpleLineChart data length:', data?.length);

    if (!data || data.length === 0) {
        console.log('SimpleLineChart: No data available');
        return (
            <div className="h-64 flex items-center justify-center text-gray-500">
                <div className="text-center">
                    <FiTrendingUp className="w-12 h-12 mx-auto mb-2" />
                    <p>No data available</p>
                </div>
            </div>
        );
    }

    const maxValue = Math.max(...data.map(item => item.value));
    const minValue = Math.min(...data.map(item => item.value));

    return (
        <div className="w-full">
            {title && <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>}
            <div className="relative" style={{ height: `${height}px` }}>
                <svg width="100%" height="100%" className="overflow-visible">
                    <polyline
                        fill="none"
                        stroke="#3B82F6"
                        strokeWidth="2"
                        points={data.map((item, index) => {
                            const x = (index / (data.length - 1)) * 100;
                            const y = 100 - ((item.value - minValue) / (maxValue - minValue)) * 100;
                            return `${x},${y}`;
                        }).join(' ')}
                    />
                    {data.map((item, index) => {
                        const x = (index / (data.length - 1)) * 100;
                        const y = 100 - ((item.value - minValue) / (maxValue - minValue)) * 100;
                        return (
                            <circle
                                key={index}
                                cx={x}
                                cy={y}
                                r="4"
                                fill="#3B82F6"
                                className="hover:r-6 transition-all"
                            />
                        );
                    })}
                </svg>
                <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-gray-500">
                    {data.map((item, index) => (
                        <span key={index}>{item.label}</span>
                    ))}
                </div>
            </div>
        </div>
    );
};

export const MetricCard = ({ title, value, icon: Icon, color, trend, format }) => {
    const colorClasses = {
        blue: 'bg-blue-50 text-blue-600',
        green: 'bg-green-50 text-green-600',
        purple: 'bg-purple-50 text-purple-600',
        orange: 'bg-orange-50 text-orange-600',
        red: 'bg-red-50 text-red-600',
        indigo: 'bg-indigo-50 text-indigo-600'
    };

    const formatValue = (val) => {
        if (format === 'currency') {
            return new Intl.NumberFormat('en-IN', {
                style: 'currency',
                currency: 'INR',
                maximumFractionDigits: 0
            }).format(val || 0);
        }
        if (format === 'percentage') {
            return `${(val || 0).toFixed(1)}%`;
        }
        return val?.toLocaleString() || 0;
    };

    return (
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
                    <p className="text-2xl font-bold text-gray-900">{formatValue(value)}</p>
                </div>
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${colorClasses[color]}`}>
                    <Icon className="w-6 h-6" />
                </div>
            </div>
            {trend !== null && trend !== undefined && (
                <div className="mt-4 flex items-center text-sm">
                    <span className={`flex items-center gap-1 ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {trend > 0 ? <FiTrendingUp className="w-4 h-4" /> : <FiTrendingDown className="w-4 h-4" />}
                        {Math.abs(trend)}%
                    </span>
                    <span className="text-gray-500 ml-2">vs last period</span>
                </div>
            )}
        </div>
    );
};

export const ProgressBar = ({ value, max, label, color = 'blue' }) => {
    const percentage = Math.min((value / max) * 100, 100);

    const colorClasses = {
        blue: 'bg-blue-500',
        green: 'bg-green-500',
        purple: 'bg-purple-500',
        orange: 'bg-orange-500',
        red: 'bg-red-500',
        indigo: 'bg-indigo-500'
    };

    return (
        <div className="w-full">
            <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">{label}</span>
                <span className="text-sm text-gray-500">{value}/{max}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                    className={`h-2 rounded-full ${colorClasses[color]} transition-all duration-300`}
                    style={{ width: `${percentage}%` }}
                />
            </div>
        </div>
    );
};

export const DataTable = ({ data, columns, title }) => {
    if (!data || data.length === 0) {
        return (
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                {title && <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>}
                <div className="text-center py-8 text-gray-500">
                    <FiBarChart className="w-12 h-12 mx-auto mb-2" />
                    <p>No data available</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {title && (
                <div className="p-6 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
                </div>
            )}
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            {columns.map((column, index) => (
                                <th
                                    key={index}
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                    {column.header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {data.map((row, rowIndex) => (
                            <tr key={rowIndex} className="hover:bg-gray-50">
                                {columns.map((column, colIndex) => (
                                    <td key={colIndex} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {column.render ? column.render(row[column.key], row) : row[column.key]}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
