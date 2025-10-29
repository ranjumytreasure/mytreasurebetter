import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';

const SimpleLocationPicker = ({ latitude, longitude, onLocationSelect, isOpen, onClose }) => {
    const [lat, setLat] = useState(latitude || '');
    const [lng, setLng] = useState(longitude || '');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (latitude && longitude) {
            setLat(latitude);
            setLng(longitude);
        }
    }, [latitude, longitude]);

    // Reset error when modal opens
    useEffect(() => {
        if (isOpen) {
            setError('');
        }
    }, [isOpen]);

    // Prevent body scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    const handleSubmit = (e) => {
        e.preventDefault();

        const latNum = parseFloat(lat);
        const lngNum = parseFloat(lng);

        if (isNaN(latNum) || isNaN(lngNum)) {
            setError('Please enter valid numeric coordinates');
            return;
        }

        if (latNum < -90 || latNum > 90) {
            setError('Latitude must be between -90 and 90');
            return;
        }

        if (lngNum < -180 || lngNum > 180) {
            setError('Longitude must be between -180 and 180');
            return;
        }

        setError('');
        onLocationSelect(latNum, lngNum);
        onClose();
    };

    const getCurrentLocation = () => {
        if (navigator.geolocation) {
            setIsLoading(true);
            setError('');
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setLat(position.coords.latitude.toString());
                    setLng(position.coords.longitude.toString());
                    setError('');
                    setIsLoading(false);
                },
                (error) => {
                    setError('Unable to get your location: ' + error.message);
                    setIsLoading(false);
                }
            );
        } else {
            setError('Geolocation is not supported by this browser');
        }
    };

    if (!isOpen) return null;

    // Render modal using Portal to escape parent container constraints
    return ReactDOM.createPortal(
        <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
            style={{ zIndex: 9999 }}
            onMouseMove={(e) => e.stopPropagation()}
        >
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
                {/* Header */}
                <div className="bg-gradient-to-r from-red-600 to-red-700 text-white p-6 rounded-t-2xl">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                                <span className="text-xl">📍</span>
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold">Enter Location</h2>
                                <p className="text-red-100 text-sm">Enter coordinates or use current location</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
                        >
                            <span className="text-white text-lg">×</span>
                        </button>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                            {error}
                        </div>
                    )}

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Latitude <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                step="any"
                                value={lat}
                                onChange={(e) => setLat(e.target.value)}
                                placeholder="e.g., 12.9716"
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-red-500"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Longitude <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                step="any"
                                value={lng}
                                onChange={(e) => setLng(e.target.value)}
                                placeholder="e.g., 77.5946"
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-red-500"
                                required
                            />
                        </div>
                    </div>

                    <div className="bg-blue-50 rounded-xl p-4">
                        <h3 className="font-semibold text-gray-800 mb-2">Quick Options:</h3>
                        <div className="space-y-2">
                            <button
                                type="button"
                                onClick={getCurrentLocation}
                                disabled={isLoading}
                                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {isLoading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                        Getting Location...
                                    </>
                                ) : (
                                    <>
                                        📍 Use My Current Location
                                    </>
                                )}
                            </button>
                            <div className="grid grid-cols-2 gap-2 text-xs">
                                <button
                                    type="button"
                                    onClick={() => { setLat('12.9716'); setLng('77.5946'); }}
                                    className="bg-gray-100 text-gray-700 py-2 px-3 rounded hover:bg-gray-200 transition-colors"
                                >
                                    Bangalore
                                </button>
                                <button
                                    type="button"
                                    onClick={() => { setLat('19.0760'); setLng('72.8777'); }}
                                    className="bg-gray-100 text-gray-700 py-2 px-3 rounded hover:bg-gray-200 transition-colors"
                                >
                                    Mumbai
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 bg-gray-500 text-white py-3 px-6 rounded-xl hover:bg-gray-600 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 bg-red-600 text-white py-3 px-6 rounded-xl hover:bg-red-700 transition-colors"
                        >
                            Confirm Location
                        </button>
                    </div>
                </form>
            </div>
        </div>,
        document.body
    );
};

export default React.memo(SimpleLocationPicker);
