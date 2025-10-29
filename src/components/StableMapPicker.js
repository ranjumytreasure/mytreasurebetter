import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';

const StableMapPicker = ({ latitude, longitude, onLocationSelect, isOpen, onClose }) => {
    const [selectedPosition, setSelectedPosition] = useState(null);
    const [mapLoaded, setMapLoaded] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const mapRef = useRef(null);
    const mapInstanceRef = useRef(null);
    const isMountedRef = useRef(true);
    const timeoutRef = useRef(null);

    useEffect(() => {
        if (latitude && longitude) {
            setSelectedPosition([latitude, longitude]);
        }
    }, [latitude, longitude]);

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

    useEffect(() => {
        isMountedRef.current = true;

        if (isOpen && mapRef.current && !mapLoaded && !isLoading) {
            loadMap();
        }

        // Cleanup when modal closes
        return () => {
            isMountedRef.current = false;
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
                timeoutRef.current = null;
            }
            if (mapInstanceRef.current) {
                if (mapInstanceRef.current.map) {
                    mapInstanceRef.current.map.off();
                    mapInstanceRef.current.map.remove();
                }
                mapInstanceRef.current = null;
            }
            setMapLoaded(false);
            setIsLoading(false);
        };
    }, [isOpen]);

    const loadMap = () => {
        if (!isMountedRef.current) return;
        setIsLoading(true);

        timeoutRef.current = setTimeout(() => {
            if (!isMountedRef.current) return;
            import('leaflet').then((L) => {
                if (!isMountedRef.current) return;
                try {
                    // Fix for default markers
                    delete L.Icon.Default.prototype._getIconUrl;
                    L.Icon.Default.mergeOptions({
                        iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
                        iconUrl: require('leaflet/dist/images/marker-icon.png'),
                        shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
                    });

                    // Create map with stable configuration
                    const map = L.map(mapRef.current, {
                        preferCanvas: false, // Use SVG for better stability
                        zoomControl: true,
                        attributionControl: true,
                        zoomSnap: 1,
                        zoomDelta: 1,
                        wheelPxPerZoomLevel: 120,
                        doubleClickZoom: true,
                        boxZoom: false,
                        keyboard: true,
                        scrollWheelZoom: true,
                        dragging: true,
                        touchZoom: true,
                        tap: true,
                        bounceAtZoomLimits: true,
                        maxBounds: null,
                        maxBoundsViscosity: 0.0,
                        worldCopyJump: false,
                        crs: L.CRS.EPSG3857,
                        // Prevent resizing
                        zoomAnimation: false,
                        fadeAnimation: false,
                        markerZoomAnimation: false
                    }).setView([latitude || 12.9716, longitude || 77.5946], 13);

                    // Use a more stable tile layer
                    const tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
                        maxZoom: 18,
                        minZoom: 1,
                        tileSize: 256,
                        zoomOffset: 0,
                        updateWhenIdle: false,
                        updateWhenZooming: true,
                        keepBuffer: 4,
                        maxNativeZoom: 18,
                        subdomains: ['a', 'b', 'c'],
                        bounds: [[-90, -180], [90, 180]]
                    });

                    tileLayer.addTo(map);

                    // Wait for tiles to load
                    tileLayer.on('load', () => {
                        if (isMountedRef.current) {
                            setMapLoaded(true);
                            setIsLoading(false);
                        }
                    });

                    // Prevent map from resizing
                    map.on('resize', () => {
                        // Do nothing - prevent resize
                    });

                    // Force map to stay within bounds
                    map.on('viewreset', () => {
                        map.invalidateSize({ animate: false });
                    });

                    // Add click event listener
                    map.on('click', (e) => {
                        const { lat, lng } = e.latlng;
                        setSelectedPosition([lat, lng]);

                        // Remove existing marker
                        if (mapInstanceRef.current.marker) {
                            map.removeLayer(mapInstanceRef.current.marker);
                        }

                        // Add new marker
                        const marker = L.marker([lat, lng]).addTo(map);
                        marker.bindPopup(`
                            <div style="text-align: center; font-family: Arial, sans-serif;">
                                <p style="margin: 0 0 8px 0; font-weight: bold; color: #333;">Selected Location</p>
                                <p style="margin: 0 0 4px 0; font-size: 12px; color: #666;">Lat: ${lat.toFixed(6)}</p>
                                <p style="margin: 0 0 8px 0; font-size: 12px; color: #666;">Lng: ${lng.toFixed(6)}</p>
                                <button onclick="window.selectLocation(${lat}, ${lng})" 
                                        style="margin: 0; padding: 6px 12px; background: #dc2626; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 12px;">
                                    Select This Location
                                </button>
                            </div>
                        `).openPopup();

                        mapInstanceRef.current.marker = marker;
                    });

                    // Prevent map from resizing
                    map.whenReady(() => {
                        map.invalidateSize();
                    });

                    mapInstanceRef.current = { map, marker: null, tileLayer };

                } catch (error) {
                    console.error('Error loading map:', error);
                    if (isMountedRef.current) {
                        setIsLoading(false);
                    }
                }
            }).catch((error) => {
                console.error('Error importing Leaflet:', error);
                if (isMountedRef.current) {
                    setIsLoading(false);
                }
            });
        }, 200);
    };

    // Global function for popup button
    useEffect(() => {
        window.selectLocation = (lat, lng) => {
            onLocationSelect(lat, lng);
            onClose();
        };

        return () => {
            delete window.selectLocation;
        };
    }, [onLocationSelect, onClose]);

    const handleConfirmLocation = () => {
        if (selectedPosition) {
            onLocationSelect(selectedPosition[0], selectedPosition[1]);
            onClose();
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
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl h-[80vh] flex flex-col">
                {/* Header */}
                <div className="bg-gradient-to-r from-red-600 to-red-700 text-white p-6 rounded-t-2xl">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                                <span className="text-xl">📍</span>
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold">Select Location</h2>
                                <p className="text-red-100 text-sm">Click on the map to select your location</p>
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

                {/* Map Container */}
                <div className="flex-1 relative" style={{ minHeight: '400px', maxHeight: '500px' }}>
                    {isLoading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-b-2xl z-10">
                            <div className="text-center">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
                                <p className="text-gray-600">Loading map...</p>
                            </div>
                        </div>
                    )}
                    <div
                        ref={mapRef}
                        style={{
                            height: '400px',
                            width: '100%',
                            position: 'relative',
                            overflow: 'hidden',
                            borderRadius: '0 0 1rem 1rem',
                            maxHeight: '500px',
                            minHeight: '400px'
                        }}
                    />
                </div>

                {/* Footer */}
                <div className="p-6 bg-gray-50 rounded-b-2xl">
                    <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-600">
                            {selectedPosition ? (
                                <div>
                                    <p className="font-semibold">Selected Coordinates:</p>
                                    <p>Latitude: {parseFloat(selectedPosition[0]).toFixed(6)}</p>
                                    <p>Longitude: {parseFloat(selectedPosition[1]).toFixed(6)}</p>
                                </div>
                            ) : (
                                <p>Click on the map to select a location</p>
                            )}
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={onClose}
                                className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirmLocation}
                                disabled={!selectedPosition}
                                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                            >
                                Confirm Location
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default React.memo(StableMapPicker);
