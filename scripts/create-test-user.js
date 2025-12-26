// Load environment variables from .env.local
require('dotenv').config({ path: '.env.local' });

const { Client, Users, ID } = require('node-appwrite');

// Initialize Appwrite client
const client = new Client()
    .setEndpoint(process.env.APPWRITE_ENDPOINT || 'https://syd.cloud.appwrite.io/v1')
    .setProject(process.env.APPWRITE_PROJECT_ID || '')
    .setKey(process.env.APPWRITE_API_KEY || '');

const users = new Users(client);

async function createTestUser() {
    console.log('🔧 Creating test user for authentication...');

    try {
        // Create a test admin user with correct parameter order
        const testUser = await users.create(
            ID.unique(),
            'admin@test.com',
            'password123',
            'Test Admin'
        );

        console.log('✅ Test user created successfully:', testUser.$id);

        // Update user preferences to set role
        await users.updatePrefs(testUser.$id, {
            role: 'admin',
            name: 'Test Admin'
        });

        console.log('✅ User preferences updated');

        console.log('📋 Test User Credentials:');
        console.log('Email: admin@test.com');
        console.log('Password: password123');
        console.log('Role: admin');

        return testUser;
    } catch (error) {
        if (error.code === 409) {
            console.log('✅ Test user already exists');
            console.log('📋 Test User Credentials:');
            console.log('Email: admin@test.com');
            console.log('Password: password123');
            console.log('Role: admin');
        } else {
            console.error('❌ Error creating test user:', error);
        }
    }
}

createTestUser();
