import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiHome, FiCreditCard, FiUsers, FiFileText, FiLogOut } from 'react-icons/fi';

const TwoWheelerFinanceNavbar = () => {
    const location = useLocation();

    const isActive = (path) => {
        return location.pathname === path;
    };

    const navItems = [
        { path: '/two-wheeler-finance/dashboard', label: 'Dashboard', icon: FiHome },
        { path: '/two-wheeler-finance/loans', label: 'Loans', icon: FiCreditCard },
        { path: '/two-wheeler-finance/customers', label: 'Customers', icon: FiUsers },
        { path: '/two-wheeler-finance/reports', label: 'Reports', icon: FiFileText },
    ];

    return (
        <nav className="bg-white shadow-lg border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo and App Name */}
                    <div className="flex items-center">
                        <Link to="/two-wheeler-finance/dashboard" className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-sm">TW</span>
                            </div>
                            <span className="text-xl font-bold text-gray-900">Two Wheeler Finance</span>
                        </Link>
                    </div>

                    {/* Navigation Links */}
                    <div className="hidden md:flex items-center space-x-8">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive(item.path)
                                            ? 'bg-purple-100 text-purple-700'
                                            : 'text-gray-600 hover:text-purple-600 hover:bg-gray-50'
                                        }`}
                                >
                                    <Icon className="w-4 h-4" />
                                    <span>{item.label}</span>
                                </Link>
                            );
                        })}
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden">
                        <button className="text-gray-600 hover:text-purple-600">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Mobile Navigation */}
                <div className="md:hidden">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium ${isActive(item.path)
                                            ? 'bg-purple-100 text-purple-700'
                                            : 'text-gray-600 hover:text-purple-600 hover:bg-gray-50'
                                        }`}
                                >
                                    <Icon className="w-4 h-4" />
                                    <span>{item.label}</span>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default TwoWheelerFinanceNavbar;













