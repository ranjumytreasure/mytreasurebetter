import React from "react";
import { Link } from "react-router-dom";
import { FaPhone, FaRocket, FaShieldAlt, FaChartLine } from "react-icons/fa";

const Hero = () => {
    return (
        <section className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-red-50 flex items-center">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Content */}
                    <div className="space-y-8">
                        {/* Badge */}
                        <div className="inline-flex items-center px-4 py-2 rounded-full bg-red-100 text-red-800 text-sm font-medium">
                            <FaRocket className="w-4 h-4 mr-2" />
                            Revolutionary Chit Fund Platform
                        </div>

                        {/* Main Heading */}
                        <div className="space-y-4">
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                                Chit Fund Software &
                                <span className="text-red-600 block">Apps</span>
                            </h1>

                            {/* Contact Info */}
                            <div className="flex items-center space-x-3 text-lg text-gray-600">
                                <FaPhone className="w-5 h-5 text-red-600" />
                                <span className="font-semibold">Call @ +91 9942393237</span>
                            </div>
                        </div>

                        {/* Subheading */}
                        <h2 className="text-xl md:text-2xl text-gray-700 font-semibold">
                            Experience the Power of Technology with MyTreasure.in!
                        </h2>

                        {/* Description */}
                        <p className="text-lg text-gray-600 leading-relaxed max-w-2xl">
                            At Mytreasure.in, we understand the unique challenges faced by chit fund companies, and we're here to simplify and empower your business journey. As your dedicated technology partner, we provide innovative solutions to enhance efficiency, transparency, and overall business performance.
                        </p>

                        {/* Features */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                                    <FaShieldAlt className="w-5 h-5 text-red-600" />
                                </div>
                                <span className="text-sm font-medium text-gray-700">Secure & Transparent</span>
                            </div>
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                                    <FaChartLine className="w-5 h-5 text-red-600" />
                                </div>
                                <span className="text-sm font-medium text-gray-700">AI-Powered Analytics</span>
                            </div>
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                                    <FaRocket className="w-5 h-5 text-red-600" />
                                </div>
                                <span className="text-sm font-medium text-gray-700">Easy to Use</span>
                            </div>
                        </div>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link
                                to="/startagroup"
                                className="inline-flex items-center justify-center px-8 py-4 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                            >
                                <FaRocket className="w-5 h-5 mr-2" />
                                Start Your Group
                            </Link>
                            <Link
                                to="/signup"
                                className="inline-flex items-center justify-center px-8 py-4 border-2 border-red-600 text-red-600 font-semibold rounded-lg hover:bg-red-600 hover:text-white transition-all duration-300"
                            >
                                Get Started Free
                            </Link>
                        </div>
                    </div>

                    {/* Visual */}
                    <div className="relative">
                        <div className="relative z-10">
                            {/* Main SVG */}
                            <div className="transform hover:scale-105 transition-transform duration-500">
                                <svg width="449" height="449" viewBox="0 0 449 449" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto max-w-lg mx-auto">
                                    <path d="M56.125 149.662C56.125 108.333 89.629 74.8291 130.958 74.8291H318.042C359.37 74.8291 392.875 108.333 392.875 149.662V374.162H56.125V149.662Z" fill="#DE1738" />
                                    <mask id="mask0_2071_6239" maskUnits="userSpaceOnUse" x="168" y="196" width="112" height="112">
                                        <path d="M279.222 196.438H168.375V307.284H279.222V196.438Z" fill="white" />
                                    </mask>
                                    <g mask="url(#mask0_2071_6239)">
                                        <path d="M168.375 196.438H279.222V259.779L223.798 307.284L168.375 259.085V196.438Z" fill="white" />
                                        <path d="M218.753 270.333V226.515H201.977V217.127H245.578V226.515H228.801V270.333H218.753Z" fill="#DE1738" />
                                    </g>
                                    <path d="M355.452 336.75H93.5352V374.167H355.452V336.75Z" fill="white" />
                                    <path
                                        d="M397.552 152.473H51.4477C45.2483 152.473 40.2227 157.498 40.2227 163.698C40.2227 169.897 45.2483 174.923 51.4477 174.923H397.552C403.751 174.923 408.777 169.897 408.777 163.698C408.777 157.498 403.751 152.473 397.552 152.473Z"
                                        fill="white"
                                        stroke="white"
                                        strokeWidth="0.3"
                                    />
                                    <path
                                        d="M142.073 224.5H77.763C76.1486 224.5 74.8398 226.594 74.8398 229.177C74.8398 231.76 76.1486 233.854 77.763 233.854H142.073C143.687 233.854 144.996 231.76 144.996 229.177C144.996 226.594 143.687 224.5 142.073 224.5Z"
                                        fill="white"
                                    />
                                    <path
                                        d="M371.237 224.5H306.927C305.313 224.5 304.004 226.594 304.004 229.177C304.004 231.76 305.313 233.854 306.927 233.854H371.237C372.851 233.854 374.16 231.76 374.16 229.177C374.16 226.594 372.851 224.5 371.237 224.5Z"
                                        fill="white"
                                    />
                                </svg>
                            </div>
                        </div>

                        {/* Background Decorations */}
                        <div className="absolute -top-10 -right-10 w-72 h-72 bg-red-100 rounded-full opacity-20 animate-pulse"></div>
                        <div className="absolute -bottom-10 -left-10 w-96 h-96 bg-red-50 rounded-full opacity-30"></div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
