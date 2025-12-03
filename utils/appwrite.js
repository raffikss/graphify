import { Client, Storage, ID } from 'react-native-appwrite'; 
import mime from 'mime'; 
import { getInfoAsync } from 'expo-file-system/legacy'; 

// configs for appwrite
const APPWRITE_ENDPOINT = 'https://fra.cloud.appwrite.io/v1';
const PROJECT_ID = '691d202c0002b3965f0c'; 
const BUCKET_ID = '691d264700133916532c'; 

const client = new Client();
client.setEndpoint(APPWRITE_ENDPOINT).setProject(PROJECT_ID);

export const storage = new Storage(client);

export async function uploadFileToStorage(fileUri, fileName = `exercise-file-${Date.now()}.jpg`) {
    try {
        if (!fileUri) throw new Error('File URI is missing.');

        console.log('Attempting to upload file:', fileUri);
        
        // Clean up URI - remove query parameters and handle different URI formats
        let cleanUri = fileUri.split('?')[0]; 
        
        // Handle different URI formats (file://, content://, etc.)
        if (cleanUri.startsWith('content://')) {
            // For content URIs on Android, we might need to handle differently
            // For now, try to use as-is
            cleanUri = fileUri;
        } else if (cleanUri.startsWith('file://')) {
            // Remove file:// prefix for file system access
            cleanUri = cleanUri.substring(7);
        }
        
        // Determine file extension and mime type
        let fileExtension = cleanUri.split('.').pop().toLowerCase();
        if (!fileExtension || fileExtension.length > 4) {
            // If extension is not clear, default to jpg for images
            fileExtension = 'jpg';
        }
        
        const mimeType = mime.getType(fileExtension) || 'image/jpeg';
        
        console.log('Processing file with URI:', cleanUri, 'Mime type:', mimeType);
        
        // Get file info
        let fileInfo;
        try {
            fileInfo = await getInfoAsync(cleanUri);
            console.log('File info:', fileInfo);
        } catch (fileErr) {
            console.error('File system access error:', fileErr);
            // If direct access fails, try with original URI
            fileInfo = await getInfoAsync(fileUri);
            cleanUri = fileUri;
            console.log('Using original URI for file access:', cleanUri);
        }
        
        if (!fileInfo.exists) throw new Error('Local file not found!');
        
        const fileToUpload = {
            uri: cleanUri, 
            name: fileName, 
            type: mimeType, 
            size: fileInfo.size || 0, // Use 0 if size is not available
        };

        console.log('Uploading file:', fileToUpload);
        
        // upload to Appwrite
        const res = await storage.createFile(BUCKET_ID, ID.unique(), fileToUpload);
        const fileUrl = `${APPWRITE_ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${res.$id}/view?project=${PROJECT_ID}`;
        console.log("Generated Manual URL:", fileUrl);
        return { ...res, url: fileUrl };
        
    } catch (err) {
        console.error('UPLOAD ERROR:', err);
        console.error('Error details:', err.message, err.stack);
        throw err; 
    }
}