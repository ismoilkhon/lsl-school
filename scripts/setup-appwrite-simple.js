// Load environment variables from .env.local
require('dotenv').config({ path: '.env.local' });

const { Client, Databases, ID } = require('node-appwrite');

// Initialize Appwrite client
const client = new Client()
    .setEndpoint(process.env.APPWRITE_ENDPOINT || 'https://syd.cloud.appwrite.io/v1')
    .setProject(process.env.APPWRITE_PROJECT_ID || '')
    .setKey(process.env.APPWRITE_API_KEY || '');

const databases = new Databases(client);
const DATABASE_ID = process.env.APPWRITE_DATABASE_ID || 'school_management';

// Collection configurations (without attributes for now)
const collections = [
    { id: 'students', name: 'Students' },
    { id: 'teachers', name: 'Teachers' },
    { id: 'parents', name: 'Parents' },
    { id: 'grades', name: 'Grades' },
    { id: 'classes', name: 'Classes' },
    { id: 'subjects', name: 'Subjects' },
    { id: 'lessons', name: 'Lessons' },
    { id: 'exams', name: 'Exams' },
    { id: 'assignments', name: 'Assignments' },
    { id: 'results', name: 'Results' },
    { id: 'attendances', name: 'Attendances' },
    { id: 'events', name: 'Events' },
    { id: 'announcements', name: 'Announcements' }
];

async function createDatabase() {
    try {
        // First, check if database already exists
        const databasesList = await databases.list();
        const existingDb = databasesList.databases.find(db => 
            db.name === 'School Management' || 
            db.$id === DATABASE_ID ||
            db.name.toLowerCase().includes('school') ||
            db.name.toLowerCase().includes('management')
        );
        
        if (existingDb) {
            console.log(`✅ Using existing database: ${existingDb.name} (${existingDb.$id})`);
            global.DATABASE_ID = existingDb.$id;
            return existingDb.$id;
        }
        
        // Try to create new database
        const newDb = await databases.create(DATABASE_ID, 'School Management');
        console.log('✅ Database created successfully');
        return newDb.$id;
    } catch (error) {
        if (error.code === 409) {
            console.log('✅ Database already exists');
            return DATABASE_ID;
        } else if (error.message && error.message.includes('maximum number of databases')) {
            console.log('⚠️  Database limit reached. Looking for existing databases to use...');
            
            // List all databases and suggest using an existing one
            const databasesList = await databases.list();
            console.log('📊 Available databases:');
            databasesList.databases.forEach((db, index) => {
                console.log(`  ${index + 1}. ${db.name} (${db.$id})`);
            });
            
            // Use the first available database
            if (databasesList.databases.length > 0) {
                const firstDb = databasesList.databases[0];
                console.log(`✅ Using existing database: ${firstDb.name} (${firstDb.$id})`);
                global.DATABASE_ID = firstDb.$id;
                return firstDb.$id;
            } else {
                throw new Error('No databases available and cannot create new one due to plan limits');
            }
        } else {
            console.error('❌ Error creating database:', error);
            throw error;
        }
    }
}

async function createCollections() {
    const dbId = global.DATABASE_ID || DATABASE_ID;
    console.log(`📝 Creating collections in database: ${dbId}`);
    
    for (const collection of collections) {
        try {
            // Create collection
            await databases.createCollection(
                dbId,
                collection.id,
                collection.name
            );
            console.log(`✅ Collection ${collection.name} created successfully`);
        } catch (error) {
            if (error.code === 409) {
                console.log(`✅ Collection ${collection.name} already exists`);
            } else {
                console.error(`❌ Error creating collection ${collection.name}:`, error);
            }
        }
    }
}

async function setupAppwrite() {
    console.log('Setting up Appwrite database and collections...');
    const dbId = await createDatabase();
    console.log(`📝 Using database ID: ${dbId}`);
    await createCollections();
    console.log('✅ Setup completed!');
    console.log(`📊 Database ID: ${dbId}`);
    console.log('💡 Collections created successfully!');
    console.log('📝 Next steps:');
    console.log('   1. Go to your Appwrite console');
    console.log('   2. Navigate to the database and collections');
    console.log('   3. Add attributes manually or use the Appwrite console');
    console.log('   4. Run: node scripts/migrate-data.js to import data');
}

setupAppwrite().catch(console.error);
