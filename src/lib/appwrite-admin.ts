import { Client, Databases, ID } from 'node-appwrite';

const endpoint = process.env.APPWRITE_ENDPOINT || process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1';
const projectId = process.env.APPWRITE_PROJECT_ID || process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '';
const apiKey = process.env.APPWRITE_API_KEY || '';

if (!projectId || !apiKey) {
  // eslint-disable-next-line no-console
  console.warn('Appwrite admin is missing credentials. Check APPWRITE_PROJECT_ID and APPWRITE_API_KEY in .env.local');
}

const adminClient = new Client()
  .setEndpoint(endpoint)
  .setProject(projectId)
  .setKey(apiKey);

const databases = new Databases(adminClient);

export const ADMIN_DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || 'school_management';

export const adminCreateDocument = async (collectionId: string, data: any, permissions?: string[]) => {
  return databases.createDocument(ADMIN_DATABASE_ID, collectionId, ID.unique(), data, permissions);
};

export const adminUpdateDocument = async (collectionId: string, documentId: string, data: any) => {
  return databases.updateDocument(ADMIN_DATABASE_ID, collectionId, documentId, data);
};

export const adminDeleteDocument = async (collectionId: string, documentId: string) => {
  return databases.deleteDocument(ADMIN_DATABASE_ID, collectionId, documentId);
};

export const adminGetDocument = async (collectionId: string, documentId: string) => {
  return databases.getDocument(ADMIN_DATABASE_ID, collectionId, documentId);
};

export const adminListDocuments = async (collectionId: string, queries?: string[]) => {
  return databases.listDocuments(ADMIN_DATABASE_ID, collectionId, queries);
};
