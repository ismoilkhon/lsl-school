const { Client, Databases } = require('node-appwrite');
require('dotenv').config({ path: '.env.local' });

const client = new Client()
    .setEndpoint(process.env.APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1')
    .setProject(process.env.APPWRITE_PROJECT_ID || '')
    .setKey(process.env.APPWRITE_API_KEY || '');

const databases = new Databases(client);
const DATABASE_ID = process.env.APPWRITE_DATABASE_ID || 'lsl_school_db';
const COLLECTION_ID = 'classes';

async function checkClassAttributes() {
    try {
        console.log('🔍 Checking classes collection attributes...');

        const collection = await databases.getCollection(DATABASE_ID, COLLECTION_ID);
        console.log('📋 Collection details:', {
            name: collection.name,
            attributes: collection.attributes.length
        });

        console.log('📝 Current attributes:');
        collection.attributes.forEach(attr => {
            console.log(`  - ${attr.key} (${attr.type}) - Required: ${attr.required}`);
        });

    } catch (error) {
        console.error('❌ Error checking class attributes:', error);
        process.exit(1);
    }
}

checkClassAttributes();
