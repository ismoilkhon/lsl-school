const { Client, Databases } = require('node-appwrite');
require('dotenv').config({ path: '.env.local' });

const client = new Client()
    .setEndpoint(process.env.APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1')
    .setProject(process.env.APPWRITE_PROJECT_ID || '')
    .setKey(process.env.APPWRITE_API_KEY || '');

const databases = new Databases(client);
const DATABASE_ID = process.env.APPWRITE_DATABASE_ID || 'lsl_school_db';
const COLLECTION_ID = 'classes';

async function fixClassAttributes() {
    try {
        console.log('🔧 Fixing classes collection attributes...');

        // Add capacity attribute
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
            if (error.code === 409) {
                console.log('ℹ️  Capacity attribute already exists');
            } else {
                console.error('❌ Error adding capacity attribute:', error.message);
            }
        }

        // Remove gradeId attribute (if it exists)
        try {
            await databases.deleteAttribute(DATABASE_ID, COLLECTION_ID, 'gradeId');
            console.log('✅ Removed gradeId attribute from classes collection');
        } catch (error) {
            if (error.code === 404) {
                console.log('ℹ️  GradeId attribute does not exist');
            } else {
                console.error('❌ Error removing gradeId attribute:', error.message);
            }
        }

        console.log('🎉 Class attributes fix completed!');

    } catch (error) {
        console.error('❌ Error fixing class attributes:', error);
        process.exit(1);
    }
}

fixClassAttributes();
