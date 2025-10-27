import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiHome, FiUsers, FiLayers, FiBarChart2, FiLogOut } from 'react-icons/fi';

const ChitFundManagerNavbar = () => {
    const location = useLocation();

    const isActive = (path) => {
        return location.pathname === path;
    };

    const navItems = [
        { path: '/chit-fund/manager/dashboard', label: 'Dashboard', icon: FiBarChart2 },
        { path: '/chit-fund/manager/subscribers', label: 'Subscribers', icon: FiUsers },
        { path: '/chit-fund/manager/groups', label: 'Groups', icon: FiLayers },
        { path: '/chit-fund/manager/home', label: 'Home', icon: FiHome },
    ];

    return (
        <nav className="bg-white shadow-lg border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo and App Name */}
                    <div className="flex items-center">
                        <Link to="/chit-fund/manager/dashboard" className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-sm">CF</span>
                            </div>
                            <span className="text-xl font-bold text-gray-900">Chit Fund Manager</span>
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
                                        ? 'bg-blue-100 text-blue-700'
                                        : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                                        }`}
                                >
                                    <Icon className="w-4 h-4" />
                                    <span>{item.label}</span>
                                </Link>
                            );
                        })}
                    </div>

                    {/* User Menu */}
                    <div className="flex items-center space-x-4">
                        <button className="text-gray-600 hover:text-blue-600">
                            <FiLogOut className="w-5 h-5" />
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
                                        ? 'bg-blue-100 text-blue-700'
                                        : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
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

export default ChitFundManagerNavbar;
