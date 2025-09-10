import React, { useState, useEffect } from 'react';
import logo from '../assets/logo.png'
import {
  FaBars,
  FaHome,
  FaPlay,
  FaQuestionCircle,
  FaInfoCircle,
  FaUser,
  FaSignOutAlt,
  FaSignInAlt,
  FaUserPlus
} from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { links } from '../utils/constants';
import CartButtons from './CartButtons';
import { useUserContext } from '../context/user_context';
import { useBilling } from '../context/billing_context';
import { hasPermission } from '../rbacPermissionUtils';




const Nav = () => {
  const [scrolled, setScrolled] = useState(false);
  const { isLoggedIn, isSidebarOpen, openSidebar, closeSidebar, userRole } = useUserContext();
  const { subscription } = useBilling();

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setScrolled(scrollPosition > 80);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Format amount for display
  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount || 0);
  };

  // Get billing status and grace period
  const getBillingStatus = () => {
    if (!subscription) return { status: 'unknown', message: 'No subscription', color: 'gray', daysLeft: 0 };

    // Use the calculated values from backend
    const graceStatus = subscription.grace_status;
    const daysRemaining = subscription.days_remaining || 0;
    const daysOverdue = subscription.days_overdue || 0;
    const overdueAmount = subscription.overdue_amount || 0;
    const monthsOverdue = subscription.months_overdue || 0;
    const amount = subscription.amount || 0;

    if (graceStatus === 'paid') {
      return {
        status: 'paid',
        message: `${formatAmount(amount)} Paid`,
        color: 'green',
        daysLeft: 0
      };
    } else if (graceStatus === 'in_grace') {
      const message = daysRemaining > 0 ? `${formatAmount(amount)} - ${daysRemaining} days left` : `${formatAmount(amount)} - Grace period active`;
      const color = daysRemaining <= 7 ? 'red' : 'blue';
      return { status: 'grace', message, color, daysLeft: daysRemaining };
    } else if (graceStatus === 'overdue') {
      const totalOverdue = overdueAmount > 0 ? overdueAmount : (amount * monthsOverdue);
      return {
        status: 'overdue',
        message: `${formatAmount(totalOverdue)} Unpaid`,
        color: 'red',
        daysLeft: -daysOverdue
      };
    } else {
      return { status: 'unknown', message: 'Unknown status', color: 'gray', daysLeft: 0 };
    }
  };

  // Icon mapping for navigation links
  const getIconForLink = (text) => {
    switch (text.toLowerCase()) {
      case 'start group':
        return <FaPlay className="w-4 h-4" />;
      case 'help':
        return <FaQuestionCircle className="w-4 h-4" />;
      case 'faq':
        return <FaInfoCircle className="w-4 h-4" />;
      default:
        return null;
    }
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
      ? 'bg-gradient-to-r from-red-600 via-red-700 to-red-800 shadow-lg backdrop-blur-sm'
      : 'bg-white shadow-sm'
      }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center">
              <img
                src={logo}
                alt="Treasure"
                className="h-12 w-auto transition-transform duration-300 hover:scale-105"
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {isLoggedIn && hasPermission(userRole, 'viewHome') && (
                <Link
                  to="/home"
                  className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 ${scrolled
                    ? 'text-white hover:text-red-100 hover:bg-white/10'
                    : 'text-gray-700 hover:text-red-600 hover:bg-red-50'
                    }`}
                >
                  <FaHome className="w-4 h-4" />
                  Home
                </Link>
              )}
              {isLoggedIn && (
                <Link
                  to="/my-billing"
                  className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 relative ${scrolled
                    ? 'text-white hover:text-red-100 hover:bg-white/10'
                    : 'text-gray-700 hover:text-red-600 hover:bg-red-50'
                    }`}
                >
                  <div className="relative">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                    {getBillingStatus().status !== 'unknown' && (
                      <span className={`absolute -top-1 -right-1 w-2 h-2 rounded-full ${getBillingStatus().color === 'red' ? 'bg-red-500' :
                        getBillingStatus().color === 'blue' ? 'bg-blue-500' :
                          getBillingStatus().color === 'green' ? 'bg-green-500' : 'bg-gray-500'
                        }`}></span>
                    )}
                  </div>
                  <span>Billing</span>
                  {getBillingStatus().status !== 'unknown' && (
                    <span className={`text-xs px-1.5 py-0.5 rounded-full ${getBillingStatus().color === 'red' ? 'bg-red-100 text-red-800' :
                      getBillingStatus().color === 'blue' ? 'bg-blue-100 text-blue-800' :
                        getBillingStatus().color === 'green' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                      {getBillingStatus().message}
                    </span>
                  )}
                </Link>
              )}
              {links.map((link) => {
                const { id, text, url } = link;
                return (
                  <Link
                    key={id}
                    to={url}
                    className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 ${scrolled
                      ? 'text-white hover:text-red-100 hover:bg-white/10'
                      : 'text-gray-700 hover:text-red-600 hover:bg-red-50'
                      }`}
                  >
                    {getIconForLink(text)}
                    {text}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* User Actions */}
          <div className="hidden lg:block">
            <CartButtons scrolled={scrolled} />
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <button
              type="button"
              onClick={openSidebar}
              className={`inline-flex items-center justify-center p-2 rounded-md transition-all duration-300 ${scrolled
                ? 'text-white hover:text-red-100 hover:bg-white/10'
                : 'text-gray-700 hover:text-red-600 hover:bg-red-50'
                }`}
              aria-controls="mobile-menu"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              <FaBars className="block h-6 w-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Indicator */}
      <div className="lg:hidden">
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          {isLoggedIn && hasPermission(userRole, 'viewHome') && (
            <Link
              to="/home"
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-base font-medium transition-all duration-300 ${scrolled
                ? 'text-white hover:text-red-100 hover:bg-white/10'
                : 'text-gray-700 hover:text-red-600 hover:bg-red-50'
                }`}
            >
              <FaHome className="w-4 h-4" />
              Home
            </Link>
          )}
          {isLoggedIn && (
            <Link
              to="/my-billing"
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-base font-medium transition-all duration-300 relative ${scrolled
                ? 'text-white hover:text-red-100 hover:bg-white/10'
                : 'text-gray-700 hover:text-red-600 hover:bg-red-50'
                }`}
            >
              <div className="relative">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
                {getBillingStatus().status !== 'unknown' && (
                  <span className={`absolute -top-1 -right-1 w-2 h-2 rounded-full ${getBillingStatus().color === 'red' ? 'bg-red-500' :
                    getBillingStatus().color === 'blue' ? 'bg-blue-500' :
                      getBillingStatus().color === 'green' ? 'bg-green-500' : 'bg-gray-500'
                    }`}></span>
                )}
              </div>
              <span>Billing</span>
              {getBillingStatus().status !== 'unknown' && (
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${getBillingStatus().color === 'red' ? 'bg-red-100 text-red-800' :
                  getBillingStatus().color === 'blue' ? 'bg-blue-100 text-blue-800' :
                    getBillingStatus().color === 'green' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                  {getBillingStatus().message}
                </span>
              )}
            </Link>
          )}
          {links.map((link) => {
            const { id, text, url } = link;
            return (
              <Link
                key={id}
                to={url}
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-base font-medium transition-all duration-300 ${scrolled
                  ? 'text-white hover:text-red-100 hover:bg-white/10'
                  : 'text-gray-700 hover:text-red-600 hover:bg-red-50'
                  }`}
              >
                {getIconForLink(text)}
                {text}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default Nav;



