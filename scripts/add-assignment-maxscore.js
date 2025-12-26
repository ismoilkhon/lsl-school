// Load environment variables from .env.local
require('dotenv').config({ path: '.env.local' });

const { Client, Databases } = require('node-appwrite');

const client = new Client()
    .setEndpoint(process.env.APPWRITE_ENDPOINT || process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1')
    .setProject(process.env.APPWRITE_PROJECT_ID || process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '')
    .setKey(process.env.APPWRITE_API_KEY || '');

const databases = new Databases(client);
const DATABASE_ID = process.env.APPWRITE_DATABASE_ID || process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || 'school_management';
const COLLECTION_ID = 'assignments';

async function addMaxScoreAttribute() {
    try {
        console.log('🔧 Adding maxScore attribute to assignments collection...');
        console.log('📋 Database ID:', DATABASE_ID);
        console.log('📋 Collection ID:', COLLECTION_ID);

        // Add maxScore attribute
        try {
            await databases.createIntegerAttribute(
                DATABASE_ID,
                COLLECTION_ID,
                'maxScore',
                0, // min
                10000, // max (reasonable upper limit for scores)
                false, // required (make optional to support existing records)
                100, // default value
                false // array
            );
            console.log('✅ Added maxScore attribute to assignments collection');
        } catch (error) {
            if (error.code === 409) {
                console.log('ℹ️  maxScore attribute already exists');
            } else {
                console.error('❌ Error adding maxScore attribute:', error.message);
                throw error;
            }
        }

        console.log('\n🎉 Assignment maxScore attribute setup completed!');
        console.log('📋 You can now create assignments with maxScore field');

    } catch (error) {
        console.error('❌ Error setting up assignment maxScore attribute:', error);
        process.exit(1);
    }
}

addMaxScoreAttribute();

