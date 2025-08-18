// Load environment variables from .env.local
require('dotenv').config({ path: '.env.local' });

const { Client, Account, ID } = require('node-appwrite');

// Initialize Appwrite client
const client = new Client()
    .setEndpoint(process.env.APPWRITE_ENDPOINT || 'https://syd.cloud.appwrite.io/v1')
    .setProject(process.env.APPWRITE_PROJECT_ID || '')
    .setKey(process.env.APPWRITE_API_KEY || '');

const account = new Account(client);

async function createTestUser() {
    try {
        console.log('Creating test user...');
        
        // Create a test user
        const user = await account.create(
            ID.unique(),
            'admin@school.com',
            'password123',
            'Admin User'
        );
        
        console.log('✅ Test user created successfully!');
        console.log('User ID:', user.$id);
        console.log('Email: admin@school.com');
        console.log('Password: password123');
        
        // Set user preferences with admin role
        await account.updatePrefs({
            role: 'admin'
        });
        
        console.log('✅ User role set to admin');
        console.log('\n📝 You can now sign in with:');
        console.log('   Email: admin@school.com');
        console.log('   Password: password123');
        
    } catch (error) {
        if (error.code === 409) {
            console.log('✅ Test user already exists');
            console.log('📝 You can sign in with:');
            console.log('   Email: admin@school.com');
            console.log('   Password: password123');
        } else {
            console.error('❌ Error creating test user:', error.message);
        }
    }
}

createTestUser().catch(console.error);
