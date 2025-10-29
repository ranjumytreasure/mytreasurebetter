# Map Integration Installation Guide

To enable the map functionality for selecting latitude and longitude coordinates, you need to install the required dependencies.

## Installation Steps

1. **Install the required packages:**
   ```bash
   npm install react-leaflet leaflet
   ```

2. **Import Leaflet CSS in your main App.js or index.js:**
   ```javascript
   import 'leaflet/dist/leaflet.css';
   ```

## Features Added

### 1. MapLocationPicker Component
- Interactive map using OpenStreetMap tiles
- Click to select location
- Real-time coordinate display
- Modal interface with confirmation
- Mobile-responsive design

### 2. AddressDetails Integration
- New "Location Coordinates" section
- Map picker button
- Display selected coordinates
- Seamless integration with existing form

### 3. Form Submission
- Latitude and longitude included in address data
- Coordinates displayed in preview
- Data sent to backend API

## Usage

1. Navigate to the add company multi-subscriber page: `http://localhost:3000/chit-fund/user/addcompanymultisubscriber/1`
2. Fill in the address details
3. Click "Select Location on Map" button
4. Click on the map to select your location
5. Confirm the selection
6. The coordinates will be automatically filled and included in the form submission

## Technical Details

- **Map Library**: React Leaflet (free, no API key required)
- **Map Provider**: OpenStreetMap
- **Default Location**: Bangalore, India (12.9716, 77.5946)
- **Coordinate Precision**: 6 decimal places
- **Mobile Support**: Fully responsive design

## Troubleshooting

If you encounter issues:

1. Ensure all dependencies are installed
2. Check that Leaflet CSS is imported
3. Verify the MapLocationPicker component is properly imported
4. Check browser console for any JavaScript errors

The map functionality is now fully integrated and ready to use!

