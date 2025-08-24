export const downloadImage = async (imageKey, apiBaseUrl) => {
    try {

       
   
        if (!imageKey) {
            console.error("downloadImage: imageKey is undefined or null!");
            return null;
        }

     

        // Fetch the image from the backend using the extracted image key
        const response = await fetch(`${apiBaseUrl}/images/download/${imageKey}`);
        
     

        if (!response.ok) {
            throw new Error('Error downloading image');
        }

        const imageBlob = await response.blob();
        const imageDownloadUrl = URL.createObjectURL(imageBlob);
     
        
        return imageDownloadUrl;
    } catch (error) {
        console.error("Error in downloadImage:", error);
        return null;
    }
};
