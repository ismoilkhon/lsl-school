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

// Basic attributes for each collection
const basicAttributes = {
    students: [
        { key: 'username', type: 'string', size: 255, required: true },
        { key: 'name', type: 'string', size: 255, required: true },
        { key: 'surname', type: 'string', size: 255, required: true },
        { key: 'email', type: 'string', size: 255, required: false },
        { key: 'phone', type: 'string', size: 20, required: false },
        { key: 'address', type: 'string', size: 500, required: true },
        { key: 'img', type: 'string', size: 1000, required: false },
        { key: 'bloodType', type: 'string', size: 10, required: true },
        { key: 'sex', type: 'string', size: 10, required: true },
        { key: 'parentId', type: 'string', size: 36, required: true },
        { key: 'classId', type: 'integer', min: 1, max: 999999, required: true },
        { key: 'gradeId', type: 'integer', min: 1, max: 999999, required: true },
        { key: 'birthday', type: 'datetime', required: true },
        { key: 'createdAt', type: 'datetime', required: true }
    ],
    teachers: [
        { key: 'username', type: 'string', size: 255, required: true },
        { key: 'name', type: 'string', size: 255, required: true },
        { key: 'surname', type: 'string', size: 255, required: true },
        { key: 'email', type: 'string', size: 255, required: false },
        { key: 'phone', type: 'string', size: 20, required: false },
        { key: 'address', type: 'string', size: 500, required: true },
        { key: 'img', type: 'string', size: 1000, required: false },
        { key: 'bloodType', type: 'string', size: 10, required: true },
        { key: 'sex', type: 'string', size: 10, required: true },
        { key: 'birthday', type: 'datetime', required: true },
        { key: 'createdAt', type: 'datetime', required: true }
    ],
    parents: [
        { key: 'username', type: 'string', size: 255, required: true },
        { key: 'name', type: 'string', size: 255, required: true },
        { key: 'surname', type: 'string', size: 255, required: true },
        { key: 'email', type: 'string', size: 255, required: false },
        { key: 'phone', type: 'string', size: 20, required: true },
        { key: 'address', type: 'string', size: 500, required: true },
        { key: 'createdAt', type: 'datetime', required: true }
    ],
    grades: [
        { key: 'level', type: 'integer', min: 1, max: 999999, required: true }
    ],
    classes: [
        { key: 'name', type: 'string', size: 255, required: true },
        { key: 'capacity', type: 'integer', min: 1, max: 999999, required: true },
        { key: 'supervisorId', type: 'string', size: 36, required: false },
        { key: 'gradeId', type: 'integer', min: 1, max: 999999, required: true }
    ],
    subjects: [
        { key: 'name', type: 'string', size: 255, required: true }
    ],
    lessons: [
        { key: 'name', type: 'string', size: 255, required: true },
        { key: 'day', type: 'string', size: 20, required: true },
        { key: 'startTime', type: 'datetime', required: true },
        { key: 'endTime', type: 'datetime', required: true },
        { key: 'subjectId', type: 'integer', min: 1, max: 999999, required: true },
        { key: 'classId', type: 'integer', min: 1, max: 999999, required: true },
        { key: 'teacherId', type: 'string', size: 36, required: true }
    ],
    exams: [
        { key: 'title', type: 'string', size: 255, required: true },
        { key: 'startTime', type: 'datetime', required: true },
        { key: 'endTime', type: 'datetime', required: true },
        { key: 'lessonId', type: 'integer', min: 1, max: 999999, required: true }
    ],
    assignments: [
        { key: 'title', type: 'string', size: 255, required: true },
        { key: 'startDate', type: 'datetime', required: true },
        { key: 'dueDate', type: 'datetime', required: true },
        { key: 'lessonId', type: 'integer', min: 1, max: 999999, required: true }
    ],
    results: [
        { key: 'score', type: 'integer', min: 0, max: 100, required: true },
        { key: 'examId', type: 'integer', min: 1, max: 999999, required: false },
        { key: 'assignmentId', type: 'integer', min: 1, max: 999999, required: false },
        { key: 'studentId', type: 'string', size: 36, required: true }
    ],
    attendances: [
        { key: 'date', type: 'datetime', required: true },
        { key: 'present', type: 'boolean', required: true },
        { key: 'studentId', type: 'string', size: 36, required: true },
        { key: 'lessonId', type: 'integer', min: 1, max: 999999, required: true }
    ],
    events: [
        { key: 'title', type: 'string', size: 255, required: true },
        { key: 'description', type: 'string', size: 1000, required: true },
        { key: 'startTime', type: 'datetime', required: true },
        { key: 'endTime', type: 'datetime', required: true },
        { key: 'classId', type: 'integer', min: 1, max: 999999, required: false }
    ],
    announcements: [
        { key: 'title', type: 'string', size: 255, required: true },
        { key: 'description', type: 'string', size: 1000, required: true },
        { key: 'date', type: 'datetime', required: true },
        { key: 'classId', type: 'integer', min: 1, max: 999999, required: false }
    ]
};

async function createBasicAttributes() {
    console.log('Creating basic attributes for collections...');
    console.log(`📝 Using database ID: ${DATABASE_ID}`);
    
    for (const [collectionId, attributes] of Object.entries(basicAttributes)) {
        console.log(`\n📝 Processing collection: ${collectionId}`);
        
        for (const attr of attributes) {
            try {
                if (attr.type === 'string') {
                    await databases.createStringAttribute(
                        DATABASE_ID,
                        collectionId,
                        attr.key,
                        attr.size,
                        attr.required
                    );
                } else if (attr.type === 'integer') {
                    await databases.createIntegerAttribute(
                        DATABASE_ID,
                        collectionId,
                        attr.key,
                        attr.required,
                        attr.min,
                        attr.max
                    );
                } else if (attr.type === 'boolean') {
                    await databases.createBooleanAttribute(
                        DATABASE_ID,
                        collectionId,
                        attr.key,
                        attr.required
                    );
                } else if (attr.type === 'datetime') {
                    await databases.createDatetimeAttribute(
                        DATABASE_ID,
                        collectionId,
                        attr.key,
                        attr.required
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
    
    console.log('\n✅ Basic attributes setup completed!');
    console.log('📝 Next steps:');
    console.log('   1. Run: node scripts/migrate-data.js to import data');
    console.log('   2. Update your application code to use Appwrite');
}

createBasicAttributes().catch(console.error);
