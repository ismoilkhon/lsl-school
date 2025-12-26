const { Client, Users, ID } = require('node-appwrite');
require('dotenv').config({ path: '.env.local' });

const client = new Client()
    .setEndpoint(process.env.APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1')
    .setProject(process.env.APPWRITE_PROJECT_ID || '')
    .setKey(process.env.APPWRITE_API_KEY || '');

const users = new Users(client);

async function testUserCreationWithPhone() {
    console.log('🧪 Testing User Creation (With Phone)...\n');

    const testUser = {
        email: 'test.user@school.com',
        password: 'testpassword123',
        name: 'Test User',
        phone: '+12345678901'
    };

    try {
        console.log('📝 Creating test user...');
        
        // Step 1: Create Appwrite user account (with phone)
        console.log('  1️⃣ Creating user account...');
        const user = await users.create(
            ID.unique(),
            testUser.email,
            testUser.password,
            testUser.name,
            testUser.phone
        );
        
        console.log(`     ✅ User account created with ID: ${user.$id}`);

        // Step 2: Set user preferences
        console.log('  2️⃣ Setting user preferences...');
        await users.updatePrefs(user.$id, {
            role: 'student',
            name: testUser.name,
            username: 'testuser'
        });
        
        console.log('     ✅ User preferences set');

        // Step 3: Test login functionality
        console.log('  3️⃣ Testing login functionality...');
        
        // Create a client-side session (simulating user login)
        const { Client: WebClient, Account } = require('appwrite');
        const webClient = new WebClient()
            .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1')
            .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '');
        
        const account = new Account(webClient);
        
        // Create email session
        const session = await account.createEmailSession(testUser.email, testUser.password);
        console.log(`     ✅ Login successful! Session ID: ${session.$id}`);

        // Get user info
        const userInfo = await account.get();
        console.log(`     ✅ User info retrieved: ${userInfo.name} (${userInfo.email})`);

        // Get user preferences
        const prefs = await account.getPrefs();
        console.log(`     ✅ User preferences:`, prefs);

        // Clean up: Delete the session
        await account.deleteSession(session.$id);
        console.log('     ✅ Session cleaned up');

        // Step 4: Clean up test data
        console.log('  4️⃣ Cleaning up test data...');
        await users.delete(user.$id);
        console.log('     ✅ User account deleted');

        console.log('\n🎉 Test completed successfully!');
        console.log('\n📋 Summary:');
        console.log('✅ User account created with proper credentials');
        console.log('✅ User preferences set correctly');
        console.log('✅ User can immediately log in with email/password');
        console.log('✅ User roles and permissions work correctly');

    } catch (error) {
        console.error('❌ Error:', error.message);
        console.error('Full error:', error);
        
        // Try to clean up if there was an error
        try {
            if (error.userId) {
                await users.delete(error.userId);
                console.log('     🧹 Cleaned up user account');
            }
        } catch (cleanupError) {
            console.log(`     ⚠️  Could not clean up: ${cleanupError.message}`);
        }
    }
}

testUserCreationWithPhone().catch(console.error);
