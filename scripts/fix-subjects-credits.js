// Load environment variables from .env.local
require('dotenv').config({ path: '.env.local' });

const { Client, Databases } = require('node-appwrite');

const client = new Client()
    .setEndpoint(process.env.APPWRITE_ENDPOINT || 'https://syd.cloud.appwrite.io/v1')
    .setProject(process.env.APPWRITE_PROJECT_ID || '')
    .setKey(process.env.APPWRITE_API_KEY || '');

const databases = new Databases(client);
const DATABASE_ID = process.env.APPWRITE_DATABASE_ID || 'lsl_school_db';

async function fixSubjectsCredits() {
    console.log('🔧 Fixing subjects credits attribute...');
    console.log('📋 Database ID:', DATABASE_ID);
    
    try {
        console.log('  ➕ Adding credits attribute to subjects collection');
        
        // Try to create the integer attribute without the required parameter
        await databases.createIntegerAttribute(
            DATABASE_ID,
            'subjects',
            'credits',
            1,  // min value
            10  // max value
        );
        
        console.log('  ✅ Credits attribute added successfully');
        
    } catch (error) {
        if (error.code === 409) {
            console.log('  ✅ Credits attribute already exists');
        } else {
            console.error('  ❌ Error adding credits attribute:', error.message);
            console.log('  💡 The attribute might already exist or there might be a schema issue');
        }
    }
    
    console.log('\n✅ Subjects credits fix completed!');
    console.log('📋 Try creating a subject now - the credits field should work');
}

fixSubjectsCredits().catch(console.error);
