import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { FiEye, FiEyeOff, FiUser, FiLock } from 'react-icons/fi';
import { useCollector } from '../../context/CollectorProvider';

const CollectorLogin = () => {
    const { login, isAuthenticated, isLoading } = useCollector();
    const history = useHistory();
    const [formData, setFormData] = useState({
        phone: '',
        password: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});

    // Redirect if already authenticated
    useEffect(() => {
        if (isAuthenticated) {
            history.push('/collector/receivables');
        }
    }, [isAuthenticated, history]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.phone.trim()) {
            newErrors.phone = 'Phone number is required';
        } else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
            newErrors.phone = 'Please enter a valid 10-digit phone number';
        }

        if (!formData.password.trim()) {
            newErrors.password = 'Password is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        const result = await login(formData);
        if (result.success) {
            history.push('/collector/receivables');
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                {/* Header */}
                <div className="text-center">
                    <div className="mx-auto h-16 w-16 bg-red-600 rounded-full flex items-center justify-center">
                        <FiUser className="h-8 w-8 text-white" />
                    </div>
                    <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                        Collector Login
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Sign in to access your collector portal
                    </p>
                </div>

                {/* Login Form */}
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        {/* Phone Number */}
                        <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                                Phone Number
                            </label>
                            <div className="mt-1 relative">
                                <input
                                    id="phone"
                                    name="phone"
                                    type="tel"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className={`appearance-none rounded-md relative block w-full px-3 py-2 pl-10 border ${errors.phone
                                        ? 'border-red-300 text-red-900 placeholder-red-300 focus:outline-none focus:ring-red-500 focus:border-red-500'
                                        : 'border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-red-500 focus:border-red-500'
                                        } focus:z-10 sm:text-sm`}
                                    placeholder="Enter your phone number"
                                />
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FiUser className="h-5 w-5 text-gray-400" />
                                </div>
                            </div>
                            {errors.phone && (
                                <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                            )}
                        </div>

                        {/* Password */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Password
                            </label>
                            <div className="mt-1 relative">
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={formData.password}
                                    onChange={handleChange}
                                    className={`appearance-none rounded-md relative block w-full px-3 py-2 pl-10 pr-10 border ${errors.password
                                        ? 'border-red-300 text-red-900 placeholder-red-300 focus:outline-none focus:ring-red-500 focus:border-red-500'
                                        : 'border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-red-500 focus:border-red-500'
                                        } focus:z-10 sm:text-sm`}
                                    placeholder="Enter your password"
                                />
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FiLock className="h-5 w-5 text-gray-400" />
                                </div>
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                    onClick={togglePasswordVisibility}
                                >
                                    {showPassword ? (
                                        <FiEyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                    ) : (
                                        <FiEye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                    )}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                            )}
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${isLoading
                                ? 'bg-red-400 cursor-not-allowed'
                                : 'bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500'
                                } transition-colors`}
                        >
                            {isLoading ? (
                                <div className="flex items-center">
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                    Signing in...
                                </div>
                            ) : (
                                'Sign In'
                            )}
                        </button>
                    </div>

                    {/* Footer */}
                    <div className="text-center">
                        <p className="text-sm text-gray-600">
                            Collector Portal - Treasure Artifacts
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CollectorLogin;
