import React, { useState, useEffect } from 'react';
import { FiX, FiSave } from 'react-icons/fi';

const ProductForm = ({ product, onSave, onCancel, isLoading }) => {
    const [formData, setFormData] = useState({
        product_name: '',
        frequency: 'DAILY',
        duration: '',
        interest_rate: '0.00'
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (product) {
            setFormData({
                product_name: product.product_name || '',
                frequency: product.frequency || 'DAILY',
                duration: product.duration || '',
                interest_rate: product.interest_rate || '0.00'
            });
        }
    }, [product]);

    const validate = () => {
        const newErrors = {};

        if (!formData.product_name.trim()) {
            newErrors.product_name = 'Product name is required';
        }

        if (!formData.duration || parseInt(formData.duration) <= 0) {
            newErrors.duration = 'Duration must be greater than 0';
        }

        if (parseFloat(formData.interest_rate) < 0 || parseFloat(formData.interest_rate) > 100) {
            newErrors.interest_rate = 'Interest rate must be between 0 and 100';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (validate()) {
            onSave(formData);
        }
    };

    // Example calculation
    const exampleLoanAmount = 10000;
    const perCycleDue = formData.duration > 0
        ? (exampleLoanAmount / parseInt(formData.duration)).toFixed(2)
        : 0;
    const interestAmount = (exampleLoanAmount * parseFloat(formData.interest_rate || 0) / 100).toFixed(2);
    const cashInHand = (exampleLoanAmount - parseFloat(interestAmount)).toFixed(2);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center rounded-t-xl">
                    <h2 className="text-xl font-bold text-gray-800">
                        {product ? 'Edit Product' : 'Add New Product'}
                    </h2>
                    <button
                        onClick={onCancel}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        disabled={isLoading}
                    >
                        <FiX className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6">
                    <div className="space-y-5">
                        {/* Product Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Product Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="product_name"
                                value={formData.product_name}
                                onChange={handleChange}
                                className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all ${errors.product_name ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                placeholder='e.g., "100 Days Daily"'
                                disabled={isLoading}
                            />
                            {errors.product_name && (
                                <p className="mt-1 text-sm text-red-500">{errors.product_name}</p>
                            )}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            {/* Frequency */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Frequency <span className="text-red-500">*</span>
                                </label>
                                <select
                                    name="frequency"
                                    value={formData.frequency}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                                    disabled={isLoading}
                                >
                                    <option value="DAILY">Daily</option>
                                    <option value="WEEKLY">Weekly</option>
                                </select>
                            </div>

                            {/* Duration */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Duration (Cycles) <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    name="duration"
                                    value={formData.duration}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all ${errors.duration ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    placeholder="100"
                                    min="1"
                                    disabled={isLoading}
                                />
                                {errors.duration && (
                                    <p className="mt-1 text-sm text-red-500">{errors.duration}</p>
                                )}
                            </div>
                        </div>

                        {/* Interest Rate */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Interest Rate (%) <span className="text-gray-500 text-xs">Optional</span>
                            </label>
                            <input
                                type="number"
                                name="interest_rate"
                                value={formData.interest_rate}
                                onChange={handleChange}
                                className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all ${errors.interest_rate ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                placeholder="0.00"
                                step="0.01"
                                min="0"
                                max="100"
                                disabled={isLoading}
                            />
                            {errors.interest_rate && (
                                <p className="mt-1 text-sm text-red-500">{errors.interest_rate}</p>
                            )}
                            <p className="mt-1 text-xs text-gray-500">
                                Interest deducted from principal at disbursement (0 for no interest)
                            </p>
                        </div>

                        {/* Example Calculation */}
                        {formData.duration > 0 && (
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <h4 className="font-semibold text-blue-800 mb-3">Example Calculation (₹10,000 loan)</h4>
                                <div className="grid grid-cols-2 gap-3 text-sm">
                                    <div>
                                        <p className="text-blue-700">Per Cycle Due:</p>
                                        <p className="font-bold text-blue-900">₹{perCycleDue}</p>
                                    </div>
                                    <div>
                                        <p className="text-blue-700">Total Cycles:</p>
                                        <p className="font-bold text-blue-900">{formData.duration}</p>
                                    </div>
                                    {parseFloat(formData.interest_rate) > 0 && (
                                        <>
                                            <div>
                                                <p className="text-blue-700">Interest Amount:</p>
                                                <p className="font-bold text-orange-600">₹{interestAmount}</p>
                                            </div>
                                            <div>
                                                <p className="text-blue-700">Cash in Hand:</p>
                                                <p className="font-bold text-green-700">₹{cashInHand}</p>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 mt-6 pt-6 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="flex-1 px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                            disabled={isLoading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-6 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <FiSave className="w-4 h-4" />
                                    {product ? 'Update Product' : 'Create Product'}
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProductForm;















