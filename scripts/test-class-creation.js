const { Client, Databases } = require('node-appwrite');
require('dotenv').config({ path: '.env.local' });

const client = new Client()
    .setEndpoint(process.env.APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1')
    .setProject(process.env.APPWRITE_PROJECT_ID || '')
    .setKey(process.env.APPWRITE_API_KEY || '');

const databases = new Databases(client);
const DATABASE_ID = process.env.APPWRITE_DATABASE_ID || 'lsl_school_db';
const COLLECTION_ID = 'classes';

async function testClassCreation() {
    try {
        console.log('🧪 Testing class creation without capacity attribute...');

        // Try to create a class without capacity
        const testClass = {
            name: 'Test Class',
            supervisorId: null,
            academicYear: '2024-2025',
            isActive: true
        };

        const result = await databases.createDocument(
            DATABASE_ID,
            COLLECTION_ID,
            'unique()',
            testClass
        );

        console.log('✅ Successfully created class without capacity:', result.$id);

        // Clean up - delete the test class
        await databases.deleteDocument(DATABASE_ID, COLLECTION_ID, result.$id);
        console.log('🧹 Cleaned up test class');

    } catch (error) {
        console.error('❌ Error creating class:', error.message);
        console.error('Full error:', error);
    }
}

testClassCreation();
