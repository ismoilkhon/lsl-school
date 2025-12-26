const { Client, Databases } = require('node-appwrite');
require('dotenv').config({ path: '.env.local' });

const client = new Client()
    .setEndpoint(process.env.APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1')
    .setProject(process.env.APPWRITE_PROJECT_ID || '')
    .setKey(process.env.APPWRITE_API_KEY || '');

const databases = new Databases(client);
const DATABASE_ID = process.env.APPWRITE_DATABASE_ID || 'lsl_school_db';
const COLLECTION_ID = 'classes';

async function addCapacityAttribute() {
    try {
        console.log('🔧 Adding capacity attribute to classes collection...');

        // Try adding capacity attribute with minimal parameters
        try {
            await databases.createIntegerAttribute(
                DATABASE_ID,
                COLLECTION_ID,
                'capacity',
                1, // min
                100, // max
                false, // required
                30, // default
                false // array
            );
            console.log('✅ Added capacity attribute to classes collection');
        } catch (error) {
            console.error('❌ Error adding capacity attribute:', error.message);
            console.error('Full error:', error);
        }

    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

addCapacityAttribute();
