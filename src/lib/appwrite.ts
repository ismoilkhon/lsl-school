import { Client, Databases, Account, ID, Storage } from 'appwrite';

// Initialize Appwrite client
const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1')
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '');

// Initialize services
export const databases = new Databases(client);
export const account = new Account(client);
export const storage = new Storage(client);

// Database ID (you'll need to create this in Appwrite)
export const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || 'school_management';
export const BUCKET_ID = process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID || 'uploads';

// Collection IDs
export const COLLECTIONS = {
    ADMINS: 'admins',
    TEACHERS: 'teachers',
    PARENTS: 'parents',
    SUBJECTS: 'subjects',
    CLASSES: 'classes',
    STUDENTS: 'students',
    LESSONS: 'lessons',
    EXAMS: 'exams',
    ASSIGNMENTS: 'assignments',
    RESULTS: 'results',
    ATTENDANCES: 'attendances',
    EVENTS: 'events',
    ANNOUNCEMENTS: 'announcements',
    GRADES: 'grades',
} as const;

// Helper function to create a new document
export const createDocument = async (
    collectionId: string,
    data: any,
    permissions?: string[]
) => {
    try {
        return await databases.createDocument(
            DATABASE_ID,
            collectionId,
            ID.unique(),
            data,
            permissions
        );
    } catch (error) {
        console.error('Error creating document:', error);
        throw error;
    }
};

// Helper function to get documents
export const getDocuments = async (
    collectionId: string,
    queries?: string[]
) => {
    try {
        return await databases.listDocuments(
            DATABASE_ID,
            collectionId,
            queries
        );
    } catch (error) {
        console.error('Error getting documents:', error);
        throw error;
    }
};

// Helper function to get a single document
export const getDocument = async (
    collectionId: string,
    documentId: string
) => {
    try {
        return await databases.getDocument(
            DATABASE_ID,
            collectionId,
            documentId
        );
    } catch (error) {
        console.error('Error getting document:', error);
        throw error;
    }
};

// Helper function to update a document
export const updateDocument = async (
    collectionId: string,
    documentId: string,
    data: any
) => {
    try {
        return await databases.updateDocument(
            DATABASE_ID,
            collectionId,
            documentId,
            data
        );
    } catch (error) {
        console.error('Error updating document:', error);
        throw error;
    }
};

// Helper function to delete a document
export const deleteDocument = async (
    collectionId: string,
    documentId: string
) => {
    try {
        return await databases.deleteDocument(
            DATABASE_ID,
            collectionId,
            documentId
        );
    } catch (error) {
        console.error('Error deleting document:', error);
        throw error;
    }
};

export default client;
