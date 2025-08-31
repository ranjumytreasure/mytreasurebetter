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
import { hasPermission } from '../rbacPermissionUtils';




const Nav = () => {
  const [scrolled, setScrolled] = useState(false);
  const { isLoggedIn, isSidebarOpen, openSidebar, closeSidebar, userRole } = useUserContext();

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



