// Load environment variables from .env.local
require('dotenv').config({ path: '.env.local' });

const { Client, Account } = require('appwrite');

// Initialize Appwrite client for authentication testing
const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://syd.cloud.appwrite.io/v1')
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '');

const account = new Account(client);

async function testAuthConnection() {
    console.log('🔍 Testing Appwrite authentication connection...');
    console.log('📋 Configuration:');
    console.log('Endpoint:', process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://syd.cloud.appwrite.io/v1');
    console.log('Project ID:', process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || 'NOT SET');

    try {
        // Test basic connection by trying to get current user (should fail if not authenticated, but should not be a network error)
        console.log('🔐 Testing authentication endpoint...');
        
        try {
            await account.get();
            console.log('✅ Authentication endpoint accessible (user is authenticated)');
        } catch (error) {
            if (error.message && error.message.includes('missing scope')) {
                console.log('✅ Authentication endpoint accessible (no active session - expected)');
            } else if (error.message && error.message.includes('Failed to fetch')) {
                console.log('❌ Network error - Failed to fetch');
                console.log('This indicates a CORS or network connectivity issue');
            } else {
                console.log('✅ Authentication endpoint accessible (other error - expected):', error.message);
            }
        }

        // Test session creation endpoint (this should work even without authentication)
        console.log('🔐 Testing session creation endpoint...');
        try {
            // This will fail with invalid credentials, but should not be a network error
            await account.createEmailPasswordSession('test@test.com', 'wrongpassword');
        } catch (error) {
            if (error.message && error.message.includes('Invalid credentials')) {
                console.log('✅ Session creation endpoint accessible (invalid credentials - expected)');
            } else if (error.message && error.message.includes('Failed to fetch')) {
                console.log('❌ Network error - Failed to fetch');
                console.log('This indicates a CORS or network connectivity issue');
            } else {
                console.log('✅ Session creation endpoint accessible (other error - expected):', error.message);
            }
        }

        console.log('✅ Authentication connection test completed!');

    } catch (error) {
        console.error('❌ Authentication connection test failed:', error);
    }
}

testAuthConnection();
