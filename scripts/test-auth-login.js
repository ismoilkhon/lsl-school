// Load environment variables from .env.local
require('dotenv').config({ path: '.env.local' });

const { Client, Account } = require('appwrite');

// Initialize Appwrite client for authentication testing
const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://syd.cloud.appwrite.io/v1')
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '');

const account = new Account(client);

async function testAuthLogin() {
    console.log('🔍 Testing authentication with credentials...');
    console.log('📋 Configuration:');
    console.log('Endpoint:', process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://syd.cloud.appwrite.io/v1');
    console.log('Project ID:', process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || 'NOT SET');

    // Test credentials
    const testEmail = 'admin@lsl.edu';
    const testPassword = 'password123'; // This might not be the correct password

    try {
        console.log('🔐 Testing login with:', testEmail);
        
        try {
            const session = await account.createEmailPasswordSession(testEmail, testPassword);
            console.log('✅ Login successful!');
            console.log('Session ID:', session.$id);
            
            // Get user data
            const user = await account.get();
            console.log('User data:', {
                id: user.$id,
                email: user.email,
                name: user.name,
                prefs: user.prefs
            });
            
            // Clean up session
            await account.deleteSessions();
            console.log('✅ Session cleaned up');
            
        } catch (error) {
            if (error.message && error.message.includes('Invalid credentials')) {
                console.log('❌ Invalid credentials - password might be incorrect');
                console.log('💡 You may need to reset the password in the Appwrite console');
            } else if (error.message && error.message.includes('Failed to fetch')) {
                console.log('❌ Network error - Failed to fetch');
                console.log('This indicates a CORS or network connectivity issue');
            } else {
                console.log('❌ Login failed:', error.message);
            }
        }

    } catch (error) {
        console.error('❌ Authentication test failed:', error);
    }
}

testAuthLogin();
