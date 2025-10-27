import React, { useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { useSubscriberContext } from '../../../context/subscriber/SubscriberContext';
import { useLanguage } from '../../../context/language_context';
import { FiMenu, FiX, FiUser, FiLogOut } from 'react-icons/fi';

const SubscriberHeader = () => {
    const history = useHistory();
    const location = useLocation();
    const { user, signOut } = useSubscriberContext();
    const { t } = useLanguage();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const menuItems = [
        {
            id: 'groups',
            label: t('my_groups'),
            path: '/chit-fund/subscriber/groups',
            icon: '👥'
        },
        {
            id: 'transactions',
            label: t('transactions'),
            path: '/chit-fund/subscriber/transactions',
            icon: '💳'
        },
        {
            id: 'dashboard',
            label: t('dashboard'),
            path: '/chit-fund/subscriber/dashboard',
            icon: '📊'
        },
        {
            id: 'profile',
            label: t('profile'),
            path: '/chit-fund/subscriber/profile',
            icon: '👤'
        }
    ];

    const handleMenuClick = (path) => {
        history.push(path);
        setIsMobileMenuOpen(false);
    };

    const handleLogout = () => {
        signOut();
        history.push('/chit-fund/subscriber/login');
        setIsMobileMenuOpen(false);
    };

    const isActive = (path) => {
        return location.pathname === path;
    };

    return (
        <header className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo Section */}
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 rounded-lg flex items-center justify-center shadow-md overflow-hidden bg-white border border-gray-200">
                                {user?.userCompany?.logo_s3_image ? (
                                    <img
                                        src={user.userCompany.logo_s3_image}
                                        alt={user?.userCompany?.companyName || user?.userCompany?.name || 'Company Logo'}
                                        className="w-full h-full object-cover rounded-lg"
                                        onError={(e) => {
                                            e.target.style.display = 'none';
                                            e.target.nextSibling.style.display = 'flex';
                                        }}
                                    />
                                ) : null}
                                <div
                                    className={`w-full h-full bg-gray-600 rounded-lg flex items-center justify-center ${user?.userCompany?.logo_s3_image ? 'hidden' : 'flex'}`}
                                    style={{ display: user?.userCompany?.logo_s3_image ? 'none' : 'flex' }}
                                >
                                    <span className="text-white text-lg font-bold">🏦</span>
                                </div>
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-gray-900">
                                    {user?.userCompany?.companyName || user?.userCompany?.name || 'Mytreasure'}
                                </h1>
                                <p className="text-xs text-gray-500">Subscriber Portal</p>
                            </div>
                        </div>
                    </div>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center space-x-1">
                        {menuItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => handleMenuClick(item.path)}
                                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 ${isActive(item.path)
                                    ? 'bg-red-500 text-white shadow-md'
                                    : 'text-gray-600 hover:text-red-500 hover:bg-red-50'
                                    }`}
                            >
                                <span className="text-lg">{item.icon}</span>
                                <span>{item.label}</span>
                            </button>
                        ))}
                    </nav>

                    {/* User Profile & Actions */}
                    <div className="flex items-center space-x-4">
                        {/* Welcome Message */}
                        <div className="hidden lg:flex items-center space-x-3">
                            <img
                                src={user?.user_image_s3_image || 'https://i.imgur.com/ndu6pfe.png'}
                                alt={user?.firstname || user?.name || user?.results?.firstname || user?.results?.name || 'User'}
                                className="w-8 h-8 rounded-full object-cover border-2 border-gray-200"
                                onError={(e) => {
                                    e.target.src = 'https://i.imgur.com/ndu6pfe.png';
                                }}
                            />
                            <div className="text-right">
                                <p className="text-sm font-medium text-gray-900">
                                    {t('welcome_message')}, {user?.firstname || user?.name || user?.results?.firstname || user?.results?.name || 'User'}!
                                </p>
                                <p className="text-xs text-gray-500">
                                    {user?.email || user?.results?.email || user?.phone || user?.results?.phone || 'Subscriber'}
                                </p>
                            </div>
                        </div>

                        {/* Logout Button */}
                        <button
                            onClick={handleLogout}
                            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 shadow-md hover:shadow-lg"
                        >
                            <FiLogOut className="w-4 h-4" />
                            <span className="hidden sm:inline">{t('logout')}</span>
                        </button>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="md:hidden p-2 rounded-lg text-gray-600 hover:text-red-500 hover:bg-red-50 transition-all duration-200"
                        >
                            {isMobileMenuOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Navigation Menu */}
                {isMobileMenuOpen && (
                    <div className="md:hidden border-t border-gray-200 bg-white">
                        <div className="px-2 pt-2 pb-3 space-y-1">
                            {menuItems.map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => handleMenuClick(item.path)}
                                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${isActive(item.path)
                                        ? 'bg-red-500 text-white shadow-md'
                                        : 'text-gray-600 hover:text-red-500 hover:bg-red-50'
                                        }`}
                                >
                                    <span className="text-xl">{item.icon}</span>
                                    <span>{item.label}</span>
                                </button>
                            ))}
                        </div>

                        {/* Mobile User Info */}
                        <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
                            <div className="flex items-center space-x-3">
                                <img
                                    src={user?.user_image_s3_image || 'https://i.imgur.com/ndu6pfe.png'}
                                    alt={user?.firstname || user?.name || user?.results?.firstname || user?.results?.name || 'User'}
                                    className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
                                    onError={(e) => {
                                        e.target.src = 'https://i.imgur.com/ndu6pfe.png';
                                    }}
                                />
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-900">
                                        {t('welcome_message')}, {user?.firstname || user?.name || user?.results?.firstname || user?.results?.name || 'User'}!
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {user?.email || user?.results?.email || user?.phone || user?.results?.phone || 'Subscriber'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
};

export default SubscriberHeader;
