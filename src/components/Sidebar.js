import React from 'react'
import logo from '../assets/logo.png'
import { Link } from 'react-router-dom'
import {
  FaTimes,
  FaHome,
  FaPlay,
  FaQuestionCircle,
  FaInfoCircle
} from 'react-icons/fa'
import { links } from '../utils/constants'
import CartButtons from './CartButtons'
import { useUserContext } from '../context/user_context'

const Sidebar = () => {
  const { isLoggedIn, isSidebarOpen, closeSidebar } = useUserContext();

  // Icon mapping for navigation links
  const getIconForLink = (text) => {
    switch (text.toLowerCase()) {
      case 'start group':
        return <FaPlay className="w-5 h-5" />;
      case 'help':
        return <FaQuestionCircle className="w-5 h-5" />;
      case 'faq':
        return <FaInfoCircle className="w-5 h-5" />;
      default:
        return null;
    }
  };

  return (
    <div className={`fixed inset-0 z-50 lg:hidden ${isSidebarOpen ? 'block' : 'hidden'}`}>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300"
        onClick={closeSidebar}
      />

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 w-80 bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <Link to="/" onClick={closeSidebar}>
              <img
                src={logo}
                alt="Treasure"
                className="h-10 w-auto"
              />
            </Link>
            <button
              type="button"
              onClick={closeSidebar}
              className="p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors duration-200"
            >
              <FaTimes className="w-6 h-6" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 px-6 py-6">
            <ul className="space-y-2">
              {isLoggedIn && (
                <li>
                  <Link
                    to="/home"
                    onClick={closeSidebar}
                    className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 group"
                  >
                    <FaHome className="w-5 h-5" />
                    Home
                  </Link>
                </li>
              )}
              {links.map((link) => {
                const { id, text, url } = link;
                return (
                  <li key={id}>
                    <Link
                      to={url}
                      onClick={closeSidebar}
                      className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 group"
                    >
                      {getIconForLink(text)}
                      {text}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* User Actions */}
          <div className="p-6 border-t border-gray-200">
            <CartButtons />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
