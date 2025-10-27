import React, { useState } from 'react';
import { useDailyCollectionContext } from '../../context/dailyCollection/DailyCollectionContext';
import { FiX, FiDollarSign } from 'react-icons/fi';

const LoanForm = ({ products, subscribers, onClose }) => {
    const { disburseLoan } = useDailyCollectionContext();
    const [formData, setFormData] = useState({
        subscriber_id: '',
        product_id: '',
        principal_amount: '',
        start_date: new Date().toISOString().split('T')[0],
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const selectedProduct = products.find(p => p.id === formData.product_id);
    const calculatedDue = formData.principal_amount && selectedProduct
        ? (parseFloat(formData.principal_amount) / selectedProduct.duration).toFixed(2)
        : 0;

    const validate = () => {
        const newErrors = {};

        if (!formData.subscriber_id) {
            newErrors.subscriber_id = 'Please select a subscriber';
        }
        if (!formData.product_id) {
            newErrors.product_id = 'Please select a product';
        }
        if (!formData.principal_amount || parseFloat(formData.principal_amount) <= 0) {
            newErrors.principal_amount = 'Please enter a valid amount';
        }
        if (!formData.start_date) {
            newErrors.start_date = 'Please select a start date';
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

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validate()) return;

        setIsLoading(true);
        const result = await disburseLoan(formData);
        setIsLoading(false);

        if (result.success) {
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center rounded-t-xl">
                    <div>
                        <h2 className="text-xl font-bold text-gray-800">Disburse New Loan</h2>
                        <p className="text-sm text-gray-600 mt-1">Create loan and auto-generate receivables</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        disabled={isLoading}
                    >
                        <FiX className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6">
                    <div className="space-y-5">
                        {/* Subscriber Selection */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Select Subscriber <span className="text-red-500">*</span>
                            </label>
                            <select
                                name="subscriber_id"
                                value={formData.subscriber_id}
                                onChange={handleChange}
                                className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all ${errors.subscriber_id ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                disabled={isLoading}
                            >
                                <option value="">-- Choose Subscriber --</option>
                                {subscribers.map((sub) => (
                                    <option key={sub.id} value={sub.id}>
                                        {sub.name || sub.firstname} - {sub.phone}
                                    </option>
                                ))}
                            </select>
                            {errors.subscriber_id && (
                                <p className="mt-1 text-sm text-red-500">{errors.subscriber_id}</p>
                            )}
                        </div>

                        {/* Product Selection */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Loan Product <span className="text-red-500">*</span>
                            </label>
                            <select
                                name="product_id"
                                value={formData.product_id}
                                onChange={handleChange}
                                className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all ${errors.product_id ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                disabled={isLoading}
                            >
                                <option value="">-- Choose Product --</option>
                                {products.map((prod) => (
                                    <option key={prod.id} value={prod.id}>
                                        {prod.product_name} ({prod.frequency} - {prod.duration} cycles)
                                    </option>
                                ))}
                            </select>
                            {errors.product_id && (
                                <p className="mt-1 text-sm text-red-500">{errors.product_id}</p>
                            )}
                            {selectedProduct && (
                                <div className="mt-2 p-3 bg-blue-50 rounded-lg">
                                    <p className="text-xs text-blue-800">
                                        <strong>Product Details:</strong> {selectedProduct.frequency} collection • {selectedProduct.duration} installments
                                        {selectedProduct.interest_rate && ` • ${selectedProduct.interest_rate}% interest`}
                                    </p>
                                </div>
                            )}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            {/* Principal Amount */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Principal Amount <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FiDollarSign className="text-gray-400" />
                                    </div>
                                    <input
                                        type="number"
                                        name="principal_amount"
                                        value={formData.principal_amount}
                                        onChange={handleChange}
                                        className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all ${errors.principal_amount ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                        placeholder="10000"
                                        step="0.01"
                                        disabled={isLoading}
                                    />
                                </div>
                                {errors.principal_amount && (
                                    <p className="mt-1 text-sm text-red-500">{errors.principal_amount}</p>
                                )}
                            </div>

                            {/* Start Date */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Start Date <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="date"
                                    name="start_date"
                                    value={formData.start_date}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all ${errors.start_date ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    disabled={isLoading}
                                />
                                {errors.start_date && (
                                    <p className="mt-1 text-sm text-red-500">{errors.start_date}</p>
                                )}
                            </div>
                        </div>

                        {/* Calculation Summary */}
                        {formData.principal_amount && selectedProduct && (
                            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                <h4 className="font-semibold text-green-800 mb-3">Loan Summary</h4>
                                <div className="grid grid-cols-2 gap-3 text-sm">
                                    <div>
                                        <p className="text-green-700">Principal Amount:</p>
                                        <p className="font-bold text-green-900">₹{parseFloat(formData.principal_amount).toFixed(2)}</p>
                                    </div>
                                    <div>
                                        <p className="text-green-700">Per Cycle Due:</p>
                                        <p className="font-bold text-green-900">₹{calculatedDue}</p>
                                    </div>
                                    <div>
                                        <p className="text-green-700">Total Installments:</p>
                                        <p className="font-bold text-green-900">{selectedProduct.duration}</p>
                                    </div>
                                    <div>
                                        <p className="text-green-700">Frequency:</p>
                                        <p className="font-bold text-green-900">{selectedProduct.frequency}</p>
                                    </div>
                                </div>
                                <div className="mt-3 pt-3 border-t border-green-200">
                                    <p className="text-xs text-green-700">
                                        📅 {selectedProduct.duration} receivables will be auto-generated starting from {formData.start_date}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 mt-6 pt-6 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={onClose}
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
                                    Disbursing...
                                </>
                            ) : (
                                <>
                                    <FiDollarSign className="w-4 h-4" />
                                    Disburse Loan
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LoanForm;















