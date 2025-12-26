// Load environment variables from .env.local
require('dotenv').config({ path: '.env.local' });

const { Client, Databases } = require('node-appwrite');

const client = new Client()
    .setEndpoint(process.env.APPWRITE_ENDPOINT || 'https://syd.cloud.appwrite.io/v1')
    .setProject(process.env.APPWRITE_PROJECT_ID || '')
    .setKey(process.env.APPWRITE_API_KEY || '');

const databases = new Databases(client);
const DATABASE_ID = process.env.APPWRITE_DATABASE_ID || 'lsl_school_db';
const COLLECTION_ID = 'events';

async function addAttendeesAttribute() {
    console.log('🔧 Adding attendees attribute to events collection...');
    
    try {
        await databases.createIntegerAttribute(
            DATABASE_ID,
            COLLECTION_ID,
            'attendees',
            1, // min
            10000, // max
            false, // required
            100, // default
            false // array
        );
        console.log('✅ Added attendees attribute to events collection');
    } catch (error) {
        if (error.code === 409) {
            console.log('✅ attendees attribute already exists');
        } else {
            console.error('❌ Error adding attendees attribute:', error.message);
        }
    }
}

addAttendeesAttribute().catch(console.error);
