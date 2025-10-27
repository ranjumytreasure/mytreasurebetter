import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { FiMenu, FiX, FiLogOut, FiBarChart2, FiDollarSign, FiList } from 'react-icons/fi';
import { useCollector } from '../../context/CollectorProvider';

const CollectorHeader = () => {
    const { user, logout } = useCollector();
    const history = useHistory();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        history.push('/chit-fund/collector/login');
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <header className="bg-red-600 text-white shadow-lg fixed w-full top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo and Title */}
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <h1 className="text-xl font-bold">Collector Portal</h1>
                        </div>
                    </div>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex space-x-8">
                        <Link
                            to="/chit-fund/collector/receivables"
                            className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium hover:bg-red-700 transition-colors"
                        >
                            <FiDollarSign className="h-4 w-4" />
                            <span>Receivables</span>
                        </Link>
                        <Link
                            to="/chit-fund/collector/advance-history"
                            className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium hover:bg-red-700 transition-colors"
                        >
                            <FiList className="h-4 w-4" />
                            <span>Advance History</span>
                        </Link>
                        <Link
                            to="/chit-fund/collector/dashboard"
                            className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium hover:bg-red-700 transition-colors"
                        >
                            <FiBarChart2 className="h-4 w-4" />
                            <span>Dashboard</span>
                        </Link>
                    </nav>

                    {/* User Info and Logout */}
                    <div className="hidden md:flex items-center space-x-4">
                        <div className="text-sm">
                            <span className="font-medium">
                                {user?.firstname} {user?.lastname}
                            </span>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium hover:bg-red-700 transition-colors"
                        >
                            <FiLogOut className="h-4 w-4" />
                            <span>Logout</span>
                        </button>
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden">
                        <button
                            onClick={toggleMenu}
                            className="inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                        >
                            {isMenuOpen ? (
                                <FiX className="block h-6 w-6" />
                            ) : (
                                <FiMenu className="block h-6 w-6" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Mobile Navigation */}
                {isMenuOpen && (
                    <div className="md:hidden">
                        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-red-700 rounded-md mt-2">
                            <Link
                                to="/chit-fund/collector/receivables"
                                className="flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium hover:bg-red-600 transition-colors"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                <FiDollarSign className="h-4 w-4" />
                                <span>Receivables</span>
                            </Link>
                            <Link
                                to="/chit-fund/collector/advance-history"
                                className="flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium hover:bg-red-600 transition-colors"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                <FiList className="h-4 w-4" />
                                <span>Advance History</span>
                            </Link>
                            <Link
                                to="/chit-fund/collector/dashboard"
                                className="flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium hover:bg-red-600 transition-colors"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                <FiBarChart2 className="h-4 w-4" />
                                <span>Dashboard</span>
                            </Link>
                            <div className="border-t border-red-500 pt-2 mt-2">
                                <div className="px-3 py-2 text-sm text-red-100">
                                    {user?.firstname} {user?.lastname}
                                </div>
                                <button
                                    onClick={() => {
                                        handleLogout();
                                        setIsMenuOpen(false);
                                    }}
                                    className="flex items-center space-x-2 w-full px-3 py-2 rounded-md text-base font-medium hover:bg-red-600 transition-colors"
                                >
                                    <FiLogOut className="h-4 w-4" />
                                    <span>Logout</span>
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
};

export default CollectorHeader;
