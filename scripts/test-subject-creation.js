// Load environment variables from .env.local
require('dotenv').config({ path: '.env.local' });

const { Client, Databases, ID } = require('node-appwrite');

const client = new Client()
    .setEndpoint(process.env.APPWRITE_ENDPOINT || 'https://syd.cloud.appwrite.io/v1')
    .setProject(process.env.APPWRITE_PROJECT_ID || '')
    .setKey(process.env.APPWRITE_API_KEY || '');

const databases = new Databases(client);
const DATABASE_ID = process.env.APPWRITE_DATABASE_ID || 'lsl_school_db';

async function testSubjectCreation() {
    console.log('🧪 Testing subject creation...');
    console.log('📋 Database ID:', DATABASE_ID);
    
    try {
        // Test creating a subject without credits
        const testSubject = {
            name: 'Test Subject',
            code: 'TEST',
            description: 'This is a test subject'
        };

        console.log('  ➕ Creating test subject without credits field...');
        
        const created = await databases.createDocument(
            DATABASE_ID,
            'subjects',
            ID.unique(),
            testSubject
        );
        
        console.log('  ✅ Subject created successfully without credits:', created.$id);
        
        // Clean up - delete the test subject
        await databases.deleteDocument(DATABASE_ID, 'subjects', created.$id);
        console.log('  🧹 Cleaned up test subject');
        
        console.log('\n📋 Conclusion:');
        console.log('- Subjects can be created without the credits field');
        console.log('- The credits field is optional or not required');
        console.log('- You can create subjects in the application');
        
    } catch (error) {
        console.error('  ❌ Error creating test subject:', error.message);
        console.log('\n📋 Conclusion:');
        console.log('- There is an issue with the subjects collection');
        console.log('- Check the collection schema in Appwrite console');
    }
}

testSubjectCreation().catch(console.error);
