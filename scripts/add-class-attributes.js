const { Client, Databases, Permission, Role } = require('node-appwrite');
require('dotenv').config({ path: '.env.local' });

const client = new Client()
    .setEndpoint(process.env.APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1')
    .setProject(process.env.APPWRITE_PROJECT_ID || '')
    .setKey(process.env.APPWRITE_API_KEY || '');

const databases = new Databases(client);
const DATABASE_ID = process.env.APPWRITE_DATABASE_ID || 'lsl_school_db';
const COLLECTION_ID = 'classes';

async function addClassAttributes() {
    try {
        console.log('🔧 Adding missing attributes to classes collection...');

        // Add capacity attribute
        try {
            await databases.createIntegerAttribute(
                DATABASE_ID,
                COLLECTION_ID,
                'capacity',
                1, // min
                100, // max
                false, // required (make optional)
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

        // Add supervisorId attribute (if missing)
        try {
            await databases.createStringAttribute(
                DATABASE_ID,
                COLLECTION_ID,
                'supervisorId',
                36, // size (UUID length)
                false, // required
                null, // default
                false // array
            );
            console.log('✅ Added supervisorId attribute to classes collection');
        } catch (error) {
            if (error.code === 409) {
                console.log('ℹ️  SupervisorId attribute already exists');
            } else {
                console.error('❌ Error adding supervisorId attribute:', error.message);
            }
        }

        // Add academicYear attribute (if missing)
        try {
            await databases.createStringAttribute(
                DATABASE_ID,
                COLLECTION_ID,
                'academicYear',
                20, // size
                false, // required
                '2024-2025', // default
                false // array
            );
            console.log('✅ Added academicYear attribute to classes collection');
        } catch (error) {
            if (error.code === 409) {
                console.log('ℹ️  AcademicYear attribute already exists');
            } else {
                console.error('❌ Error adding academicYear attribute:', error.message);
            }
        }

        // Add isActive attribute (if missing)
        try {
            await databases.createBooleanAttribute(
                DATABASE_ID,
                COLLECTION_ID,
                'isActive',
                false, // required
                true, // default
                false // array
            );
            console.log('✅ Added isActive attribute to classes collection');
        } catch (error) {
            if (error.code === 409) {
                console.log('ℹ️  IsActive attribute already exists');
            } else {
                console.error('❌ Error adding isActive attribute:', error.message);
            }
        }

        console.log('🎉 Class attributes setup completed!');

    } catch (error) {
        console.error('❌ Error setting up class attributes:', error);
        process.exit(1);
    }
}

addClassAttributes();
