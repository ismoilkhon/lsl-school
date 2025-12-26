// Load environment variables from .env.local
require('dotenv').config({ path: '.env.local' });

const { Client, Databases } = require('node-appwrite');

const client = new Client()
    .setEndpoint(process.env.APPWRITE_ENDPOINT || 'https://syd.cloud.appwrite.io/v1')
    .setProject(process.env.APPWRITE_PROJECT_ID || '')
    .setKey(process.env.APPWRITE_API_KEY || '');

const databases = new Databases(client);
const DATABASE_ID = process.env.APPWRITE_DATABASE_ID || 'lsl_school_db';

async function addSubjectAttributes() {
    console.log('🔧 Adding missing attributes to subjects collection...');
    console.log('📋 Database ID:', DATABASE_ID);
    
    const attributes = [
        { key: 'code', type: 'string', size: 20 },
        { key: 'description', type: 'string', size: 500 },
        { key: 'credits', type: 'integer', min: 1, max: 10 }
    ];
    
    for (const attr of attributes) {
        try {
            console.log(`  ➕ Adding attribute: ${attr.key} (${attr.type})`);
            
            if (attr.type === 'string') {
                await databases.createStringAttribute(
                    DATABASE_ID,
                    'subjects',
                    attr.key,
                    attr.size,
                    false // required
                );
            } else if (attr.type === 'integer') {
                await databases.createIntegerAttribute(
                    DATABASE_ID,
                    'subjects',
                    attr.key,
                    attr.min,
                    attr.max
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
    
    console.log('\n✅ Subject attributes fix completed!');
    console.log('📋 You can now create subjects with code, description, and credits');
}

addSubjectAttributes().catch(console.error);
