const { Client, Databases } = require('node-appwrite');
require('dotenv').config({ path: '.env.local' });

const client = new Client()
    .setEndpoint(process.env.APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1')
    .setProject(process.env.APPWRITE_PROJECT_ID || '')
    .setKey(process.env.APPWRITE_API_KEY || '');

const databases = new Databases(client);
const DATABASE_ID = process.env.APPWRITE_DATABASE_ID || 'lsl_school_db';

async function addUserIdAttributes() {
    console.log('🔧 Adding userId attributes to collections...');

    const collections = ['students', 'teachers', 'parents'];

    for (const collectionId of collections) {
        try {
            console.log(`\n📝 Processing ${collectionId} collection...`);
            
            // Add userId attribute
            try {
                await databases.createStringAttribute(
                    DATABASE_ID,
                    collectionId,
                    'userId',
                    36, // max length for Appwrite user ID
                    false, // required
                    null, // default
                    false // array
                );
                console.log(`✅ Added userId attribute to ${collectionId} collection`);
            } catch (error) {
                if (error.code === 409) {
                    console.log(`ℹ️  userId attribute already exists in ${collectionId} collection`);
                } else {
                    console.error(`❌ Error adding userId attribute to ${collectionId}:`, error.message);
                }
            }

        } catch (error) {
            console.error(`❌ Error processing ${collectionId} collection:`, error.message);
        }
    }

    console.log('\n🎉 Finished adding userId attributes!');
}

addUserIdAttributes().catch(console.error);
