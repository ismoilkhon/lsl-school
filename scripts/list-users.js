// Load environment variables from .env.local
require('dotenv').config({ path: '.env.local' });

const { Client, Users } = require('node-appwrite');

// Initialize Appwrite client
const client = new Client()
    .setEndpoint(process.env.APPWRITE_ENDPOINT || 'https://syd.cloud.appwrite.io/v1')
    .setProject(process.env.APPWRITE_PROJECT_ID || '')
    .setKey(process.env.APPWRITE_API_KEY || '');

const users = new Users(client);

async function listUsers() {
    console.log('🔍 Listing existing users...');

    try {
        const userList = await users.list();
        console.log(`✅ Found ${userList.users.length} users:`);
        
        userList.users.forEach((user, index) => {
            console.log(`${index + 1}. ${user.email} (${user.$id})`);
            if (user.prefs && user.prefs.role) {
                console.log(`   Role: ${user.prefs.role}`);
            }
        });

        if (userList.users.length === 0) {
            console.log('📝 No users found. You may need to create a user manually in the Appwrite console.');
        }

    } catch (error) {
        console.error('❌ Error listing users:', error);
    }
}

listUsers();
