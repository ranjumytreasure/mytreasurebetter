import React, { useContext, useEffect, useRef, useState, useCallback } from 'react';
import AppContext from './Context';
import FixedMapPicker from '../../components/FixedMapPicker';
import SimpleLocationPicker from '../../components/SimpleLocationPicker';

const AddressDetails = () => {
    const { addressDetails, stepDetails } = useContext(AppContext);
    const {
        streetName,
        setStreetName,
        villageName,
        setVillageName,
        pincode,
        setPincode,
        taluk,
        setTaluk,
        district,
        setDistrict,
        latitude,
        setLatitude,
        longitude,
        setLongitude
    } = addressDetails;

    const { setStep, focusTrigger } = stepDetails;
    const firstInputRef = useRef(null);
    const [isMapOpen, setIsMapOpen] = useState(false);
    const [useSimplePicker, setUseSimplePicker] = useState(false);

    const handleNext = () => setStep((prevStep) => prevStep + 1);
    const handlePrevious = () => setStep((prevStep) => prevStep - 1);

    const handleLocationSelect = useCallback((lat, lng) => {
        setLatitude(lat.toString());
        setLongitude(lng.toString());
    }, [setLatitude, setLongitude]);

    const openMapPicker = () => {
        setIsMapOpen(true);
        setUseSimplePicker(false);
    };

    const openSimplePicker = () => {
        setIsMapOpen(true);
        setUseSimplePicker(true);
    };

    const closeMapPicker = useCallback(() => {
        setIsMapOpen(false);
        setUseSimplePicker(false);
    }, []);

    // Geocoding: Convert address to coordinates
    const [isGeocodingLoading, setIsGeocodingLoading] = useState(false);

    const geocodeAddress = async () => {
        // Build address string from form fields
        const addressParts = [streetName, villageName, taluk, district, pincode].filter(Boolean);

        if (addressParts.length === 0) {
            alert('Please enter at least some address details to locate on map');
            return;
        }

        const fullAddress = addressParts.join(', ');
        setIsGeocodingLoading(true);

        try {
            // Use OpenStreetMap Nominatim API (free, no API key required)
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(fullAddress)}&limit=1`,
                {
                    headers: {
                        'Accept': 'application/json',
                        'User-Agent': 'TreasureApp/1.0' // Required by Nominatim
                    }
                }
            );

            if (!response.ok) {
                throw new Error('Geocoding service unavailable');
            }

            const data = await response.json();

            if (data && data.length > 0) {
                const { lat, lon } = data[0];
                setLatitude(lat);
                setLongitude(lon);
                alert(`✅ Location found!\n\nAddress: ${fullAddress}\nCoordinates: ${parseFloat(lat).toFixed(6)}, ${parseFloat(lon).toFixed(6)}`);
            } else {
                alert('❌ Location not found. Please try:\n- Adding more address details\n- Checking spelling\n- Using the map picker to select manually');
            }
        } catch (error) {
            console.error('Geocoding error:', error);
            alert('❌ Unable to locate address. Please use the map picker to select location manually.');
        } finally {
            setIsGeocodingLoading(false);
        }
    };

    // Auto-focus first input when component mounts
    useEffect(() => {
        if (firstInputRef.current) {
            const timer = setTimeout(() => {
                firstInputRef.current.focus();
            }, 200); // Delay to ensure smooth scroll completes first

            return () => clearTimeout(timer);
        }
    }, [focusTrigger]);

    return (
        <div className="max-w-4xl mx-auto my-6 bg-white rounded-3xl shadow-xl transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 overflow-hidden border border-gray-100">
            <div className="bg-gradient-to-r from-red-600 via-red-700 to-red-800 text-white p-8 text-center relative">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>
                <div className="relative z-10">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4 backdrop-blur-sm">
                        <span className="text-2xl">🏠</span>
                    </div>
                    <h2 className="text-3xl font-bold font-['Poppins'] mb-2">Address Details</h2>
                    <p className="text-red-100 text-sm">Where do you live?</p>
                </div>
            </div>
            <div className="p-8">
                <form className="space-y-6">
                    {/* Street Address */}
                    <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700 font-['Poppins']">
                            Street Address <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <input
                                ref={firstInputRef}
                                className="w-full px-4 py-4 text-base border-2 border-gray-200 rounded-xl transition-all duration-300 bg-white focus:outline-none focus:border-red-500 focus:shadow-lg focus:shadow-red-500/20 hover:border-gray-300"
                                type="text"
                                placeholder="Enter your street address"
                                value={streetName}
                                onChange={(e) => setStreetName(e.target.value)}
                            />
                            <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                                <span className="text-gray-400">🏘️</span>
                            </div>
                        </div>
                    </div>

                    {/* Village and District */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-gray-700 font-['Poppins']">
                                Village/City <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <input
                                    className="w-full px-4 py-4 text-base border-2 border-gray-200 rounded-xl transition-all duration-300 bg-white focus:outline-none focus:border-red-500 focus:shadow-lg focus:shadow-red-500/20 hover:border-gray-300"
                                    type="text"
                                    placeholder="Enter village or city name"
                                    value={villageName}
                                    onChange={(e) => setVillageName(e.target.value)}
                                />
                                <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                                    <span className="text-gray-400">🏘️</span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-gray-700 font-['Poppins']">
                                District <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <input
                                    className="w-full px-4 py-4 text-base border-2 border-gray-200 rounded-xl transition-all duration-300 bg-white focus:outline-none focus:border-red-500 focus:shadow-lg focus:shadow-red-500/20 hover:border-gray-300"
                                    type="text"
                                    placeholder="Enter district name"
                                    value={district}
                                    onChange={(e) => setDistrict(e.target.value)}
                                />
                                <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                                    <span className="text-gray-400">🏛️</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Taluk and Pincode */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-gray-700 font-['Poppins']">
                                Taluk/Tehsil
                            </label>
                            <div className="relative">
                                <input
                                    className="w-full px-4 py-4 text-base border-2 border-gray-200 rounded-xl transition-all duration-300 bg-white focus:outline-none focus:border-red-500 focus:shadow-lg focus:shadow-red-500/20 hover:border-gray-300"
                                    type="text"
                                    placeholder="Enter taluk or tehsil name"
                                    value={taluk}
                                    onChange={(e) => setTaluk(e.target.value)}
                                />
                                <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                                    <span className="text-gray-400">🏢</span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-gray-700 font-['Poppins']">
                                Postal Code <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <input
                                    className="w-full px-4 py-4 text-base border-2 border-gray-200 rounded-xl transition-all duration-300 bg-white focus:outline-none focus:border-red-500 focus:shadow-lg focus:shadow-red-500/20 hover:border-gray-300"
                                    type="number"
                                    placeholder="Enter postal code"
                                    value={pincode}
                                    onChange={(e) => setPincode(e.target.value)}
                                />
                                <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                                    <span className="text-gray-400">📮</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Address Summary */}
                    <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-2xl p-6 border border-red-200">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center">
                                <span className="text-white text-sm">📍</span>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-800 font-['Poppins']">
                                Address Summary
                            </h3>
                        </div>
                        <p className="text-sm text-gray-600">
                            {streetName && villageName && district && pincode ? (
                                `${streetName}, ${villageName}, ${district} - ${pincode}`
                            ) : (
                                "Complete the fields above to see your address summary"
                            )}
                        </p>
                    </div>

                    {/* Location Picker */}
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                                <span className="text-white text-sm">🗺️</span>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-800 font-['Poppins']">
                                Location Coordinates
                            </h3>
                        </div>

                        <div className="space-y-4">
                            <p className="text-sm text-gray-600">
                                Select your exact location on the map for precise coordinates
                            </p>

                            {/* Auto-Locate from Address Button */}
                            <div className="bg-white rounded-xl p-4 border border-blue-200">
                                <div className="flex items-center gap-3 mb-3">
                                    <span className="text-2xl">🎯</span>
                                    <div className="flex-1">
                                        <h4 className="text-sm font-semibold text-gray-800">Auto-Locate from Address</h4>
                                        <p className="text-xs text-gray-600">Automatically find coordinates based on your address</p>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={geocodeAddress}
                                    disabled={isGeocodingLoading || (!streetName && !villageName && !district)}
                                    className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-300 hover:from-green-700 hover:to-emerald-700 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-green-600/30 flex items-center justify-center gap-2 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed disabled:transform-none"
                                >
                                    {isGeocodingLoading ? (
                                        <>
                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                            Searching...
                                        </>
                                    ) : (
                                        <>
                                            <span className="text-lg">🔍</span>
                                            Find My Location from Address
                                        </>
                                    )}
                                </button>
                                {(!streetName && !villageName && !district) && (
                                    <p className="text-xs text-amber-600 mt-2 text-center">
                                        💡 Fill in address fields above first
                                    </p>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <button
                                    type="button"
                                    onClick={openMapPicker}
                                    className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-300 hover:from-blue-700 hover:to-indigo-700 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-600/30 flex items-center justify-center gap-2"
                                >
                                    <span className="text-lg">🗺️</span>
                                    {latitude && longitude ? 'Update Location on Map' : 'Select Location on Map'}
                                </button>
                                <button
                                    type="button"
                                    onClick={openSimplePicker}
                                    className="bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-300 hover:from-green-700 hover:to-emerald-700 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-green-600/30 flex items-center justify-center gap-2"
                                >
                                    <span className="text-lg">📍</span>
                                    {latitude && longitude ? 'Update Coordinates' : 'Enter Coordinates'}
                                </button>
                            </div>

                            <div className="bg-white rounded-xl p-4 border border-blue-200" style={{ minHeight: '88px' }}>
                                {(latitude && longitude) ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-1">
                                                Latitude
                                            </label>
                                            <div className="px-3 py-2 bg-gray-50 rounded-lg border text-sm font-mono">
                                                {latitude}
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-1">
                                                Longitude
                                            </label>
                                            <div className="px-3 py-2 bg-gray-50 rounded-lg border text-sm font-mono">
                                                {longitude}
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-center h-full text-sm text-gray-500">
                                        Coordinates will appear here after selection
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Navigation Buttons */}
                    <div className="flex gap-4 pt-6">
                        <button
                            type="button"
                            className="flex-1 bg-gradient-to-r from-gray-500 to-gray-600 text-white py-4 px-6 rounded-xl font-semibold transition-all duration-300 hover:from-gray-600 hover:to-gray-700 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-gray-500/30 flex items-center justify-center gap-2"
                            onClick={handlePrevious}
                        >
                            <span>←</span>
                            Previous
                        </button>
                        <button
                            type="button"
                            className="flex-1 bg-gradient-to-r from-red-600 to-red-700 text-white py-4 px-6 rounded-xl font-semibold transition-all duration-300 hover:from-red-700 hover:to-red-800 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-red-600/30 flex items-center justify-center gap-2"
                            onClick={handleNext}
                        >
                            Next
                            <span>→</span>
                        </button>
                    </div>
                </form>
            </div>

            {/* Location Picker Modals */}
            {isMapOpen && (
                <div>
                    {useSimplePicker ? (
                        <SimpleLocationPicker
                            latitude={latitude}
                            longitude={longitude}
                            onLocationSelect={handleLocationSelect}
                            isOpen={isMapOpen}
                            onClose={closeMapPicker}
                        />
                    ) : (
                        <FixedMapPicker
                            latitude={latitude}
                            longitude={longitude}
                            onLocationSelect={handleLocationSelect}
                            isOpen={isMapOpen}
                            onClose={closeMapPicker}
                        />
                    )}
                </div>
            )}
        </div>
    );
};

export default AddressDetails;
