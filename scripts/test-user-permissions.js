// Load environment variables from .env.local
require('dotenv').config({ path: '.env.local' });

const { Client, Account, Databases, ID } = require('appwrite');

// Initialize Appwrite client for testing
const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://syd.cloud.appwrite.io/v1')
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '');

const account = new Account(client);
const databases = new Databases(client);
const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || 'lsl_school_db';

async function testUserPermissions() {
    console.log('🔍 Testing user permissions and session...');
    console.log('📋 Configuration:');
    console.log('Endpoint:', process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://syd.cloud.appwrite.io/v1');
    console.log('Project ID:', process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || 'NOT SET');
    console.log('Database ID:', DATABASE_ID);

    try {
        // Test 1: Check if user is authenticated
        console.log('\n🔐 Test 1: Checking authentication status...');
        try {
            const user = await account.get();
            console.log('✅ User is authenticated:', {
                id: user.$id,
                email: user.email,
                name: user.name,
                prefs: user.prefs
            });
        } catch (error) {
            console.log('❌ User is not authenticated:', error.message);
            console.log('💡 You need to sign in first');
            return;
        }

        // Test 2: Try to read announcements
        console.log('\n📖 Test 2: Testing read permissions...');
        try {
            const announcements = await databases.listDocuments(DATABASE_ID, 'announcements');
            console.log('✅ Read permissions working - Found', announcements.documents.length, 'announcements');
        } catch (error) {
            console.log('❌ Read permissions failed:', error.message);
        }

        // Test 3: Try to create a test announcement
        console.log('\n✏️  Test 3: Testing create permissions...');
        try {
            const testAnnouncement = {
                title: 'Test Announcement',
                description: 'This is a test announcement to verify permissions',
                date: new Date().toISOString(),
                classId: '',
                authorId: 'admin',
                isActive: true
            };

            const created = await databases.createDocument(
                DATABASE_ID,
                'announcements',
                ID.unique(),
                testAnnouncement
            );
            console.log('✅ Create permissions working - Created announcement:', created.$id);

            // Clean up - delete the test announcement
            try {
                await databases.deleteDocument(DATABASE_ID, 'announcements', created.$id);
                console.log('✅ Delete permissions working - Cleaned up test announcement');
            } catch (deleteError) {
                console.log('⚠️  Delete permissions failed:', deleteError.message);
            }

        } catch (error) {
            console.log('❌ Create permissions failed:', error.message);
            console.log('🔍 Error details:', {
                code: error.code,
                message: error.message,
                response: error.response
            });
        }

        // Test 4: Check collection permissions
        console.log('\n🔧 Test 4: Checking collection permissions...');
        try {
            const collection = await databases.getCollection(DATABASE_ID, 'announcements');
            console.log('✅ Collection permissions:', {
                name: collection.name,
                permissions: collection.$permissions
            });
        } catch (error) {
            console.log('❌ Could not get collection info:', error.message);
        }

        console.log('\n✅ User permissions test completed!');

    } catch (error) {
        console.error('❌ Test failed:', error);
    }
}

testUserPermissions();
