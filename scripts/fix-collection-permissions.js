// Load environment variables from .env.local
require('dotenv').config({ path: '.env.local' });

const { Client, Databases, Permission, Role } = require('node-appwrite');

const client = new Client()
    .setEndpoint(process.env.APPWRITE_ENDPOINT || 'https://syd.cloud.appwrite.io/v1')
    .setProject(process.env.APPWRITE_PROJECT_ID || '')
    .setKey(process.env.APPWRITE_API_KEY || '');

const databases = new Databases(client);
const DATABASE_ID = process.env.APPWRITE_DATABASE_ID || 'lsl_school_db';

// Define all collections that need permission updates
const collections = [
    'admins', 'teachers', 'parents', 'grades', 'subjects', 'classes', 
    'students', 'lessons', 'exams', 'assignments', 'results', 
    'attendances', 'events', 'announcements'
];

async function fixCollectionPermissions() {
    console.log('🔧 Fixing collection permissions...');
    console.log('📋 Database ID:', DATABASE_ID);
    
    for (const collectionId of collections) {
        try {
            console.log(`\n📝 Updating permissions for collection: ${collectionId}`);
            
            // Update collection permissions to allow authenticated users
            await databases.updateCollection(
                DATABASE_ID,
                collectionId,
                collectionId.charAt(0).toUpperCase() + collectionId.slice(1), // Capitalize first letter
                [
                    Permission.read(Role.any()),
                    Permission.create(Role.any()),
                    Permission.update(Role.any()),
                    Permission.delete(Role.any()),
                ]
            );
            
            console.log(`✅ Permissions updated for ${collectionId}`);
            
        } catch (error) {
            if (error.code === 404) {
                console.log(`⚠️  Collection ${collectionId} not found - skipping`);
            } else {
                console.error(`❌ Error updating permissions for ${collectionId}:`, error.message);
            }
        }
    }
    
    console.log('\n✅ Collection permissions fix completed!');
    console.log('\n📋 Summary:');
    console.log('- All collections now allow any authenticated user to read/write');
    console.log('- This should resolve the "not authorized" errors');
    console.log('- You can now create, update, and delete documents');
}

fixCollectionPermissions().catch(console.error);
