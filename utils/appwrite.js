import { Client, Storage, ID } from 'react-native-appwrite'; 
import mime from 'mime'; 
import * as FileSystem from 'expo-file-system/legacy'; 

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

//file upload logic
        const cleanUri = fileUri.split('?')[0]; 
        const fileExtension = cleanUri.split('.').pop().toLowerCase();
        const mimeType = mime.getType(fileExtension) || 'image/jpeg';
        
        const fileInfo = await FileSystem.getInfoAsync(cleanUri);
        if (!fileInfo.exists) throw new Error('Local file not found!');
        
        const fileToUpload = {
            uri: cleanUri, 
            name: fileName, 
            type: mimeType, 
            size: fileInfo.size, 
        };

// upload to Appwrite
        const res = await storage.createFile(BUCKET_ID, ID.unique(), fileToUpload);
        const fileUrl = `${APPWRITE_ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${res.$id}/view?project=${PROJECT_ID}`;
        console.log("Generated Manual URL:", fileUrl);
        return { ...res, url: fileUrl };
        
    } catch (err) {
        console.error('UPLOAD ERROR:', err);
        throw err; 
    }
}