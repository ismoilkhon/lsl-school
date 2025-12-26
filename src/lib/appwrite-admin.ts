import { Client, Databases, Storage, ID, Permission, Role } from 'node-appwrite';

const endpoint = process.env.APPWRITE_ENDPOINT || process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://syd.cloud.appwrite.io/v1';
const projectId = process.env.APPWRITE_PROJECT_ID || process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '';
const apiKey = process.env.APPWRITE_API_KEY || '';

// Validate configuration
if (!projectId || !apiKey) {
  const missing = [];
  if (!projectId) missing.push('APPWRITE_PROJECT_ID or NEXT_PUBLIC_APPWRITE_PROJECT_ID');
  if (!apiKey) missing.push('APPWRITE_API_KEY');
  
  // eslint-disable-next-line no-console
  console.error(
    `[Appwrite Admin] Missing required environment variables: ${missing.join(', ')}\n` +
    'Please check your .env.local file and ensure these variables are set.'
  );
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
  if (!projectId || !apiKey) {
    throw new Error(
      'Appwrite admin client is not properly configured. Missing APPWRITE_PROJECT_ID or APPWRITE_API_KEY environment variables.'
    );
  }
  
  try {
    return await databases.listDocuments(ADMIN_DATABASE_ID, collectionId, queries);
  } catch (error: any) {
    console.error('[Appwrite Admin] Error listing documents:', {
      collectionId,
      databaseId: ADMIN_DATABASE_ID,
      error: error.message || error,
      endpoint,
      hasProjectId: !!projectId,
      hasApiKey: !!apiKey,
    });
    throw error;
  }
};
