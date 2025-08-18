// Load environment variables from .env.local
require('dotenv').config({ path: '.env.local' });

const { Client, Databases, ID } = require('node-appwrite');

// Initialize Appwrite client
const client = new Client()
    .setEndpoint(process.env.APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1')
    .setProject(process.env.APPWRITE_PROJECT_ID || '')
    .setKey(process.env.APPWRITE_API_KEY || ''); // You'll need an API key with appropriate permissions

const databases = new Databases(client);
const DATABASE_ID = process.env.APPWRITE_DATABASE_ID || 'school_management';

// Collection configurations
const collections = [
    {
        id: 'students',
        name: 'Students',
        attributes: [
            { key: 'username', type: 'string', required: true, array: false, size: 255 },
            { key: 'name', type: 'string', required: true, array: false, size: 255 },
            { key: 'surname', type: 'string', required: true, array: false, size: 255 },
            { key: 'email', type: 'string', required: false, array: false, size: 255 },
            { key: 'phone', type: 'string', required: false, array: false, size: 20 },
            { key: 'address', type: 'string', required: true, array: false, size: 500 },
            { key: 'img', type: 'string', required: false, array: false, size: 1000 },
            { key: 'bloodType', type: 'string', required: true, array: false, size: 10 },
            { key: 'sex', type: 'string', required: true, array: false, size: 10 },
            { key: 'parentId', type: 'string', required: true, array: false, size: 36 },
            { key: 'classId', type: 'integer', required: true, array: false, min: 1, max: 999999 },
            { key: 'gradeId', type: 'integer', required: true, array: false, min: 1, max: 999999 },
            { key: 'birthday', type: 'datetime', required: true, array: false },
            { key: 'createdAt', type: 'datetime', required: true, array: false }
        ]
    },
    {
        id: 'teachers',
        name: 'Teachers',
        attributes: [
            { key: 'username', type: 'string', required: true, array: false, size: 255 },
            { key: 'name', type: 'string', required: true, array: false, size: 255 },
            { key: 'surname', type: 'string', required: true, array: false, size: 255 },
            { key: 'email', type: 'string', required: false, array: false, size: 255 },
            { key: 'phone', type: 'string', required: false, array: false, size: 20 },
            { key: 'address', type: 'string', required: true, array: false, size: 500 },
            { key: 'img', type: 'string', required: false, array: false, size: 1000 },
            { key: 'bloodType', type: 'string', required: true, array: false, size: 10 },
            { key: 'sex', type: 'string', required: true, array: false, size: 10 },
            { key: 'birthday', type: 'datetime', required: true, array: false },
            { key: 'createdAt', type: 'datetime', required: true, array: false }
        ]
    },
    {
        id: 'parents',
        name: 'Parents',
        attributes: [
            { key: 'username', type: 'string', required: true, array: false, size: 255 },
            { key: 'name', type: 'string', required: true, array: false, size: 255 },
            { key: 'surname', type: 'string', required: true, array: false, size: 255 },
            { key: 'email', type: 'string', required: false, array: false, size: 255 },
            { key: 'phone', type: 'string', required: true, array: false, size: 20 },
            { key: 'address', type: 'string', required: true, array: false, size: 500 },
            { key: 'createdAt', type: 'datetime', required: true, array: false }
        ]
    },
    {
        id: 'grades',
        name: 'Grades',
        attributes: [
            { key: 'level', type: 'integer', required: true, array: false, min: 1, max: 999999 }
        ]
    },
    {
        id: 'classes',
        name: 'Classes',
        attributes: [
            { key: 'name', type: 'string', required: true, array: false, size: 255 },
            { key: 'capacity', type: 'integer', required: true, array: false, min: 1, max: 999999 },
            { key: 'supervisorId', type: 'string', required: false, array: false, size: 36 },
            { key: 'gradeId', type: 'integer', required: true, array: false, min: 1, max: 999999 }
        ]
    },
    {
        id: 'subjects',
        name: 'Subjects',
        attributes: [
            { key: 'name', type: 'string', required: true, array: false, size: 255 }
        ]
    },
    {
        id: 'lessons',
        name: 'Lessons',
        attributes: [
            { key: 'name', type: 'string', required: true, array: false, size: 255 },
            { key: 'day', type: 'string', required: true, array: false, size: 20 },
            { key: 'startTime', type: 'datetime', required: true, array: false },
            { key: 'endTime', type: 'datetime', required: true, array: false },
            { key: 'subjectId', type: 'integer', required: true, array: false, min: 1, max: 999999 },
            { key: 'classId', type: 'integer', required: true, array: false, min: 1, max: 999999 },
            { key: 'teacherId', type: 'string', required: true, array: false, size: 36 }
        ]
    },
    {
        id: 'exams',
        name: 'Exams',
        attributes: [
            { key: 'title', type: 'string', required: true, array: false, size: 255 },
            { key: 'startTime', type: 'datetime', required: true, array: false },
            { key: 'endTime', type: 'datetime', required: true, array: false },
            { key: 'lessonId', type: 'integer', required: true, array: false, min: 1, max: 999999 }
        ]
    },
    {
        id: 'assignments',
        name: 'Assignments',
        attributes: [
            { key: 'title', type: 'string', required: true, array: false, size: 255 },
            { key: 'startDate', type: 'datetime', required: true, array: false },
            { key: 'dueDate', type: 'datetime', required: true, array: false },
            { key: 'lessonId', type: 'integer', required: true, array: false, min: 1, max: 999999 }
        ]
    },
    {
        id: 'results',
        name: 'Results',
        attributes: [
            { key: 'score', type: 'integer', required: true, array: false, min: 0, max: 100 },
            { key: 'examId', type: 'integer', required: false, array: false, min: 1, max: 999999 },
            { key: 'assignmentId', type: 'integer', required: false, array: false, min: 1, max: 999999 },
            { key: 'studentId', type: 'string', required: true, array: false, size: 36 }
        ]
    },
    {
        id: 'attendances',
        name: 'Attendances',
        attributes: [
            { key: 'date', type: 'datetime', required: true, array: false },
            { key: 'present', type: 'boolean', required: true, array: false },
            { key: 'studentId', type: 'string', required: true, array: false, size: 36 },
            { key: 'lessonId', type: 'integer', required: true, array: false, min: 1, max: 999999 }
        ]
    },
    {
        id: 'events',
        name: 'Events',
        attributes: [
            { key: 'title', type: 'string', required: true, array: false, size: 255 },
            { key: 'description', type: 'string', required: true, array: false, size: 1000 },
            { key: 'startTime', type: 'datetime', required: true, array: false },
            { key: 'endTime', type: 'datetime', required: true, array: false },
            { key: 'classId', type: 'integer', required: false, array: false, min: 1, max: 999999 }
        ]
    },
    {
        id: 'announcements',
        name: 'Announcements',
        attributes: [
            { key: 'title', type: 'string', required: true, array: false, size: 255 },
            { key: 'description', type: 'string', required: true, array: false, size: 1000 },
            { key: 'date', type: 'datetime', required: true, array: false },
            { key: 'classId', type: 'integer', required: false, array: false, min: 1, max: 999999 }
        ]
    }
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
            // Update the DATABASE_ID to use the existing database
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

            // Create attributes
            for (const attr of collection.attributes) {
                try {
                    const dbId = global.DATABASE_ID || DATABASE_ID;
                    if (attr.type === 'string') {
                        await databases.createStringAttribute(
                            dbId,
                            collection.id,
                            attr.key,
                            attr.size,
                            attr.required,
                            attr.array
                        );
                    } else if (attr.type === 'integer') {
                        await databases.createIntegerAttribute(
                            dbId,
                            collection.id,
                            attr.key,
                            attr.required,
                            attr.min,
                            attr.max,
                            attr.array
                        );
                    } else if (attr.type === 'boolean') {
                        await databases.createBooleanAttribute(
                            dbId,
                            collection.id,
                            attr.key,
                            attr.required,
                            attr.array
                        );
                    } else if (attr.type === 'datetime') {
                        await databases.createDatetimeAttribute(
                            dbId,
                            collection.id,
                            attr.key,
                            attr.required,
                            attr.array
                        );
                    }
                    console.log(`✅ Attribute ${attr.key} created in ${collection.name}`);
                } catch (error) {
                    if (error.code === 409) {
                        console.log(`✅ Attribute ${attr.key} already exists in ${collection.name}`);
                    } else {
                        console.error(`❌ Error creating attribute ${attr.key}:`, error);
                    }
                }
            }
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
    console.log('💡 Update your .env.local file with this database ID if needed');
}

setupAppwrite().catch(console.error);
