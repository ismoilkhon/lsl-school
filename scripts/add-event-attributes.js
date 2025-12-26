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

async function addEventAttributes() {
    console.log('🔧 Adding missing attributes to events collection...');
    console.log('📋 Database ID:', DATABASE_ID);
    console.log('📋 Collection ID:', COLLECTION_ID);
    
    const attributes = [
        { key: 'category', type: 'string', size: 50, required: false, default: 'Academic' },
        { key: 'attendees', type: 'integer', min: 1, max: 10000, required: false, default: 100 },
        { key: 'organizer', type: 'string', size: 200, required: false, default: null },
        { key: 'requirements', type: 'string', size: 2000, required: false, default: null, array: true }
    ];
    
    for (const attr of attributes) {
        try {
            console.log(`  ➕ Adding attribute: ${attr.key} (${attr.type})`);
            
            if (attr.type === 'string') {
                await databases.createStringAttribute(
                    DATABASE_ID,
                    COLLECTION_ID,
                    attr.key,
                    attr.size,
                    attr.required,
                    attr.default,
                    attr.array || false
                );
            } else if (attr.type === 'integer') {
                await databases.createIntegerAttribute(
                    DATABASE_ID,
                    COLLECTION_ID,
                    attr.key,
                    attr.min,
                    attr.max,
                    attr.required,
                    attr.default,
                    false // array
                );
            }
            
            console.log(`  ✅ Added attribute: ${attr.key}`);
            
        } catch (error) {
            if (error.code === 409) {
                console.log(`  ✅ Attribute ${attr.key} already exists`);
            } else {
                console.error(`  ❌ Error adding attribute ${attr.key}:`, error.message);
            }
        }
    }
    
    console.log('\n✅ Event attributes setup completed!');
    console.log('📋 You can now create events with category, attendees, organizer, and requirements');
}

addEventAttributes().catch(console.error);
