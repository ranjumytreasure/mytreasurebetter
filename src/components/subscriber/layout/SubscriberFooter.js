import React from 'react';
import { useSubscriberContext } from '../../../context/subscriber/SubscriberContext';

const SubscriberFooter = () => {
    const { user } = useSubscriberContext();
    return (
        <footer className="bg-gray-900 text-white py-8 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Company Information Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                    {/* Company Name & Logo */}
                    <div className="space-y-4">
                        <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 rounded-lg flex items-center justify-center overflow-hidden bg-white border border-gray-200">
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
                                    className={`w-full h-full bg-red-600 rounded-lg flex items-center justify-center ${user?.userCompany?.logo_s3_image ? 'hidden' : 'flex'}`}
                                    style={{ display: user?.userCompany?.logo_s3_image ? 'none' : 'flex' }}
                                >
                                    <span className="text-white text-xl font-bold">🏦</span>
                                </div>
                            </div>
                            <div>
                                <h4 className="text-xl font-bold text-white">
                                    {user?.userCompany?.companyName || user?.userCompany?.name || 'Treasure Financial Services'}
                                </h4>
                                <p className="text-sm text-gray-300">
                                    {user?.userCompany?.licenseNumber ?
                                        `License: ${user?.userCompany?.licenseNumber}` :
                                        'Licensed Financial Services Provider'
                                    }
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Phone Number */}
                    <div className="space-y-2">
                        <h5 className="text-lg font-semibold text-white mb-3">Contact Information</h5>
                        <div className="space-y-3">
                            {(user?.userCompany?.phone || user?.userCompany?.contactNumber) && (
                                <div className="flex items-center space-x-3">
                                    <span className="text-red-500 text-xl">📞</span>
                                    <div>
                                        <p className="text-sm text-gray-400">Phone</p>
                                        <p className="text-white font-medium">
                                            {user?.userCompany?.phone || user?.userCompany?.contactNumber}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Email Address */}
                    <div className="space-y-2">
                        <h5 className="text-lg font-semibold text-white mb-3">Email Support</h5>
                        <div className="space-y-3">
                            {(user?.userCompany?.email || user?.userCompany?.contactEmail) && (
                                <div className="flex items-center space-x-3">
                                    <span className="text-red-500 text-xl">✉️</span>
                                    <div>
                                        <p className="text-sm text-gray-400">Email</p>
                                        <p className="text-white font-medium break-all">
                                            {user?.userCompany?.email || user?.userCompany?.contactEmail}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Address Section */}
                {(user?.userCompany?.address || user?.userCompany?.companyAddress) && (
                    <div className="border-t border-gray-700 pt-6 mb-6">
                        <div className="flex items-start space-x-3">
                            <span className="text-red-500 text-xl mt-1">📍</span>
                            <div>
                                <h5 className="text-lg font-semibold text-white mb-2">Office Address</h5>
                                <p className="text-gray-300">
                                    {user?.userCompany?.address || user?.userCompany?.companyAddress}
                                    {user?.userCompany?.city && `, ${user?.userCompany?.city}`}
                                    {user?.userCompany?.state && `, ${user?.userCompany?.state}`}
                                    {user?.userCompany?.pincode && ` - ${user?.userCompany?.pincode}`}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Bottom Section - Links & Copyright */}
                <div className="border-t border-gray-700 pt-6">
                    <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                        {/* Legal Links */}
                        <div className="flex flex-wrap gap-6 justify-center md:justify-start">
                            <a href="/Privacy&Policy" className="text-gray-400 hover:text-white transition-colors duration-200 text-sm">
                                Privacy Policy
                            </a>
                            <a href="/Terms&Conditions" className="text-gray-400 hover:text-white transition-colors duration-200 text-sm">
                                Terms & Conditions
                            </a>
                            <a href="/help" className="text-gray-400 hover:text-white transition-colors duration-200 text-sm">
                                Help & Support
                            </a>
                        </div>

                        {/* Copyright & Version */}
                        <div className="flex items-center space-x-4 text-sm text-gray-400">
                            <p>&copy; 2024 {user?.userCompany?.companyName || user?.userCompany?.name || 'Treasure App'}. All rights reserved.</p>
                            <span className="hidden md:inline">•</span>
                            <p>Version 1.0.0</p>
                            {user?.userCompany?.website && (
                                <>
                                    <span className="hidden md:inline">•</span>
                                    <a
                                        href={user?.userCompany?.website}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-400 hover:text-blue-300 transition-colors duration-200"
                                    >
                                        🌐 Visit Website
                                    </a>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default SubscriberFooter;
