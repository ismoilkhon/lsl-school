// Load environment variables from .env.local
require('dotenv').config({ path: '.env.local' });

const { Client, Databases } = require('node-appwrite');

// Initialize Appwrite client
const client = new Client()
    .setEndpoint(process.env.APPWRITE_ENDPOINT || 'https://syd.cloud.appwrite.io/v1')
    .setProject(process.env.APPWRITE_PROJECT_ID || '')
    .setKey(process.env.APPWRITE_API_KEY || '');

const databases = new Databases(client);
const DATABASE_ID = process.env.APPWRITE_DATABASE_ID || 'lsl_school_db';

async function testConnection() {
    console.log('🔍 Testing database connection...');
    console.log('📋 Environment Variables:');
    console.log('APPWRITE_ENDPOINT:', process.env.APPWRITE_ENDPOINT);
    console.log('APPWRITE_PROJECT_ID:', process.env.APPWRITE_PROJECT_ID);
    console.log('APPWRITE_DATABASE_ID:', process.env.APPWRITE_DATABASE_ID);

    try {
        // Test database access
        const database = await databases.get(DATABASE_ID);
        console.log('✅ Database found:', database.name);

        // Test collections access
        const collections = await databases.listCollections(DATABASE_ID);
        console.log('✅ Collections found:', collections.collections.length);

        // Test teachers collection specifically
        try {
            const teachers = await databases.listDocuments(DATABASE_ID, 'teachers');
            console.log('✅ Teachers collection accessible, found', teachers.documents.length, 'teachers');
        } catch (error) {
            console.log('❌ Error accessing teachers collection:', error.message);
        }

        console.log('✅ Database connection test completed successfully!');

    } catch (error) {
        console.error('❌ Database connection test failed:', error);
    }
}

testConnection();
