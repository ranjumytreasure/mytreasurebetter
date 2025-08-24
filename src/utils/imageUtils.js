import imageCompression from 'browser-image-compression';

/**
 * Compress an image (Base64 string) to reduce its size.
 * 
 * @param {string} base64Image - The Base64 string of the image to be compressed.
 * @param {object} options - Compression options (optional).
 * @returns {Promise<string>} - The compressed Base64 string.
 */
export const compressImage = async (base64Image, options = {}) => {
    try {
        // Convert Base64 to File object
        const file = base64ToFile(base64Image);

        // Default compression options
        const defaultOptions = {
            maxSizeMB: 0.2,              // Maximum size in MB
            maxWidthOrHeight: 800,      // Maximum dimensions in pixels
            useWebWorker: true,         // Use Web Workers for better performance
        };

        // Merge custom options with defaults
        const compressionOptions = { ...defaultOptions, ...options };

        // Compress the file
        const compressedFile = await imageCompression(file, compressionOptions);

        // Convert the compressed file back to Base64
        return await fileToBase64(compressedFile);
    } catch (error) {
        console.error('Image compression error:', error);
        return base64Image; // Fallback to original image if compression fails
    }
};

/**
 * Convert a Base64 string to a File object.
 * 
 * @param {string} base64 - The Base64 string to be converted.
 * @returns {File} - A File object.
 */
export const base64ToFile = (base64) => {
    const byteString = atob(base64.split(',')[1]);
    const mimeType = base64.match(/:(.*?);/)[1];
    const arrayBuffer = new Uint8Array(byteString.length);

    for (let i = 0; i < byteString.length; i++) {
        arrayBuffer[i] = byteString.charCodeAt(i);
    }

    return new File([arrayBuffer], 'compressed-image', { type: mimeType });
};

/**
 * Convert a File object to a Base64 string.
 * 
 * @param {File} file - The File object to be converted.
 * @returns {Promise<string>} - The Base64 string.
 */
export const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(file);
    });
};
