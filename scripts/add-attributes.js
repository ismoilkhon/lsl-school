// Load environment variables from .env.local
require('dotenv').config({ path: '.env.local' });

const { Client, Databases, ID } = require('node-appwrite');

// Initialize Appwrite client
const client = new Client()
    .setEndpoint(process.env.APPWRITE_ENDPOINT || 'https://syd.cloud.appwrite.io/v1')
    .setProject(process.env.APPWRITE_PROJECT_ID || '')
    .setKey(process.env.APPWRITE_API_KEY || '');

const databases = new Databases(client);
const DATABASE_ID = process.env.APPWRITE_DATABASE_ID || 'lsl_school_db';

// Collection configurations with attributes
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

async function addAttributes() {
    console.log('Adding attributes to existing collections...');
    console.log(`📝 Using database ID: ${DATABASE_ID}`);
    
    for (const collection of collections) {
        console.log(`\n📝 Processing collection: ${collection.name}`);
        
        // Create attributes for this collection
        for (const attr of collection.attributes) {
            try {
                if (attr.type === 'string') {
                    // createStringAttribute(databaseId, collectionId, key, size, required, default, array)
                    await databases.createStringAttribute(
                        DATABASE_ID,
                        collection.id,
                        attr.key,
                        attr.size,
                        attr.required,
                        '', // default value as empty string
                        attr.array
                    );
                } else if (attr.type === 'integer') {
                    // createIntegerAttribute(databaseId, collectionId, key, required, min, max, default, array)
                    await databases.createIntegerAttribute(
                        DATABASE_ID,
                        collection.id,
                        attr.key,
                        attr.required,
                        attr.min,
                        attr.max,
                        0, // default value as 0
                        attr.array
                    );
                } else if (attr.type === 'boolean') {
                    // createBooleanAttribute(databaseId, collectionId, key, required, default, array)
                    await databases.createBooleanAttribute(
                        DATABASE_ID,
                        collection.id,
                        attr.key,
                        attr.required,
                        false, // default value as false
                        attr.array
                    );
                } else if (attr.type === 'datetime') {
                    // createDatetimeAttribute(databaseId, collectionId, key, required, default, array)
                    await databases.createDatetimeAttribute(
                        DATABASE_ID,
                        collection.id,
                        attr.key,
                        attr.required,
                        '', // default value as empty string (no default)
                        attr.array
                    );
                }
                console.log(`  ✅ Attribute ${attr.key} created successfully`);
            } catch (error) {
                if (error.code === 409) {
                    console.log(`  ✅ Attribute ${attr.key} already exists`);
                } else {
                    console.error(`  ❌ Error creating attribute ${attr.key}:`, error.message);
                }
            }
        }
    }
    
    console.log('\n✅ Attributes setup completed!');
    console.log('📝 Next steps:');
    console.log('   1. Run: node scripts/migrate-data.js to import data');
    console.log('   2. Update your application code to use Appwrite');
}

addAttributes().catch(console.error);
