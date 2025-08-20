// Load environment variables from .env.local
require('dotenv').config({ path: '.env.local' });

const { Client, Databases, Storage, ID, Permission, Role } = require('node-appwrite');

// Initialize Appwrite client
const client = new Client()
    .setEndpoint(process.env.APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1')
    .setProject(process.env.APPWRITE_PROJECT_ID || '')
    .setKey(process.env.APPWRITE_API_KEY || '');

const databases = new Databases(client);
const storage = new Storage(client);
const BUCKET_ID = process.env.APPWRITE_BUCKET_ID || 'uploads';
const DATABASE_ID = process.env.APPWRITE_DATABASE_ID || 'school_management';

// Collection IDs
const COLLECTIONS = {
    STUDENTS: 'students',
    TEACHERS: 'teachers',
    PARENTS: 'parents',
    GRADES: 'grades',
    CLASSES: 'classes',
    SUBJECTS: 'subjects',
    LESSONS: 'lessons',
    EXAMS: 'exams',
    ASSIGNMENTS: 'assignments',
    RESULTS: 'results',
    ATTENDANCES: 'attendances',
    EVENTS: 'events',
    ANNOUNCEMENTS: 'announcements',
};

// Sample data to migrate (more specific mock data)
const sampleData = {
    grades: [
        { level: 1, name: 'Grade 1' },
        { level: 2, name: 'Grade 2' },
        { level: 3, name: 'Grade 3' },
        { level: 4, name: 'Grade 4' },
        { level: 5, name: 'Grade 5' },
        { level: 6, name: 'Grade 6' },
        { level: 7, name: 'Grade 7' },
        { level: 8, name: 'Grade 8' },
    ],
    parents: [
        {
            username: 'parent1',
            name: 'John',
            surname: 'Doe',
            email: 'john@doe.com',
            phone: '1234567890',
            address: '123 Main St, Anytown, USA',
            createdAt: new Date().toISOString(),
        },
        // Add more parents as needed
    ],
    teachers: Array.from({ length: 5 }).map((_, i) => ({
        username: `teacher${i+1}`,
        name: ['Jane','Emily','Liam','Noah','Olivia'][i%5],
        surname: ['Smith','Johnson','Williams','Brown','Jones'][i%5],
        email: `teacher${i+1}@lsl.edu`,
        phone: `12345678${i}${i}`,
        address: `${100+i} Oak St, Anytown, USA`,
        img: null,
        bloodType: ['A+','B+','O+','AB+','A-'][i%5],
        sex: i%2===0 ? 'FEMALE' : 'MALE',
        birthday: new Date(`198${i}-0${(i%9)+1}-01`).toISOString(),
        createdAt: new Date().toISOString(),
    })),
    classes: [
        {
            name: '1A',
            capacity: 20,
            supervisorId: null, // Will be set after teachers are created
            gradeId: 1,
        },
        {
            name: '2B',
            capacity: 22,
            supervisorId: null,
            gradeId: 2,
        },
        // Add more classes as needed
    ],
    subjects: [
        { name: 'Math' },
        { name: 'English' },
        { name: 'Science' },
        { name: 'History' },
        { name: 'Geography' },
        { name: 'Art' },
        { name: 'Music' },
        { name: 'Physical Education' },
    ],
    students: Array.from({ length: 10 }).map((_, i) => ({
        username: `student${i+1}`,
        name: ['Alice','Bob','Carol','David','Eva','Finn','Grace','Henry','Ivy','Jack'][i],
        surname: ['Johnson','Miller','Davis','Garcia','Martinez','Hernandez','Lopez','Gonzalez','Wilson','Anderson'][i],
        email: `student${i+1}@lsl.edu`,
        phone: `55500000${i}`,
        address: `${200+i} Pine St, Anytown, USA`,
        img: null,
        bloodType: ['O+','A-','B+','AB-','O-'][i%5],
        sex: i%2===0 ? 'FEMALE' : 'MALE',
        birthday: new Date(`201${i%9}-0${(i%9)+1}-15`).toISOString(),
        parentId: null,
        classId: (i%2)+1,
        gradeId: (i%4)+1,
        createdAt: new Date().toISOString(),
    })),
    lessons: Array.from({ length: 6 }).map((_, i) => {
        const dayStr = String((i % 28) + 1).padStart(2, '0');
        return {
            name: `Lesson ${i+1}`,
            day: ['MONDAY','TUESDAY','WEDNESDAY','THURSDAY','FRIDAY','MONDAY'][i],
            startTime: new Date(`2024-01-${dayStr}T08:00:00Z`).toISOString(),
            endTime: new Date(`2024-01-${dayStr}T08:45:00Z`).toISOString(),
            subjectId: (i%4)+1,
            classId: (i%2)+1,
            teacherId: null,
        };
    }),
    exams: [
        {
            title: 'Math Midterm',
            startTime: new Date('2024-01-15T09:00:00Z').toISOString(),
            endTime: new Date('2024-01-15T10:00:00Z').toISOString(),
            lessonId: 1,
        },
        // Add more exams as needed
    ],
    assignments: [
        {
            title: 'Math Homework 1',
            startDate: new Date('2024-01-01T00:00:00Z').toISOString(),
            dueDate: new Date('2024-01-08T23:59:59Z').toISOString(),
            lessonId: 1,
        },
        // Add more assignments as needed
    ],
    results: [
        {
            score: 85,
            examId: 1,
            assignmentId: null,
            studentId: null, // Will be set after students are created
        },
        // Add more results as needed
    ],
    attendances: [
        {
            date: new Date('2024-01-01T08:00:00Z').toISOString(),
            present: true,
            studentId: null, // Will be set after students are created
            lessonId: 1,
        },
        // Add more attendances as needed
    ],
    events: [
        {
            title: 'School Assembly',
            description: 'Monthly school assembly',
            startTime: new Date('2024-01-15T10:00:00Z').toISOString(),
            endTime: new Date('2024-01-15T11:00:00Z').toISOString(),
            classId: null,
        },
        // Add more events as needed
    ],
    announcements: [
        {
            title: 'Welcome Back',
            description: 'Welcome back to school!',
            date: new Date('2024-01-01T00:00:00Z').toISOString(),
            classId: null,
        },
        // Add more announcements as needed
    ],
};

async function createDocument(collectionId, data) {
    try {
        const document = await databases.createDocument(
            DATABASE_ID,
            collectionId,
            ID.unique(),
            data,
            [
                Permission.read(Role.any()),
                Permission.update(Role.team('admins')), // optional: restrict writes
                Permission.delete(Role.team('admins')),
                Permission.create(Role.team('admins')),
            ]
        );
        console.log(`Created document in ${collectionId}:`, document.$id);
        return document;
    } catch (error) {
        console.error(`Error creating document in ${collectionId}:`, error);
        throw error;
    }
}

async function migrateData() {
    console.log('Starting data migration...');

    try {
        // Step 1: Create grades (no dependencies)
        console.log('Creating grades...');
        const gradeIds = {};
        for (const grade of sampleData.grades) {
            const doc = await createDocument(COLLECTIONS.GRADES, grade);
            gradeIds[grade.level] = doc.$id;
        }

        // Step 2: Create parents (no dependencies)
        console.log('Creating parents...');
        const parentIds = {};
        for (const parent of sampleData.parents) {
            const doc = await createDocument(COLLECTIONS.PARENTS, parent);
            parentIds[parent.username] = doc.$id;
        }

        // Step 3: Create teachers (no dependencies)
        console.log('Creating teachers...');
        const teacherIds = {};
        for (const teacher of sampleData.teachers) {
            const doc = await createDocument(COLLECTIONS.TEACHERS, teacher);
            teacherIds[teacher.username] = doc.$id;
        }

        // Step 4: Create classes (depends on grades)
        console.log('Creating classes...');
        const classIds = {};
        for (const classItem of sampleData.classes) {
            const doc = await createDocument(COLLECTIONS.CLASSES, {
                ...classItem,
                gradeId: parseInt(classItem.gradeId),
            });
            classIds[classItem.name] = doc.$id;
        }

        // Step 5: Create subjects (no dependencies)
        console.log('Creating subjects...');
        const subjectIds = {};
        for (const subject of sampleData.subjects) {
            const doc = await createDocument(COLLECTIONS.SUBJECTS, subject);
            subjectIds[subject.name] = doc.$id;
        }

        // Step 6: Create students (depends on parents, classes, grades)
        console.log('Creating students...');
        const studentIds = {};
        for (const [i, student] of sampleData.students.entries()) {
            const parentValues = Object.values(parentIds);
            const parentId = parentValues.length > 0 ? parentValues[i % parentValues.length] : null;
            const doc = await createDocument(COLLECTIONS.STUDENTS, {
                ...student,
                parentId: parentId,
                classId: parseInt(student.classId),
                gradeId: parseInt(student.gradeId),
            });
            studentIds[student.username] = doc.$id;
        }

        // Step 7: Create lessons (depends on subjects, classes, teachers)
        console.log('Creating lessons...');
        const lessonIds = {};
        for (const [i, lesson] of sampleData.lessons.entries()) {
            const doc = await createDocument(COLLECTIONS.LESSONS, {
                ...lesson,
                subjectId: parseInt(lesson.subjectId),
                classId: parseInt(lesson.classId),
                teacherId: Object.values(teacherIds)[i % Object.values(teacherIds).length] || null,
            });
            lessonIds[lesson.name] = doc.$id;
        }

        // Step 8: Create exams (depends on lessons)
        console.log('Creating exams...');
        const examIds = {};
        for (const exam of sampleData.exams) {
            const doc = await createDocument(COLLECTIONS.EXAMS, {
                ...exam,
                lessonId: parseInt(exam.lessonId),
            });
            examIds[exam.title] = doc.$id;
        }

        // Step 9: Create assignments (depends on lessons)
        console.log('Creating assignments...');
        const assignmentIds = {};
        for (const assignment of sampleData.assignments) {
            const doc = await createDocument(COLLECTIONS.ASSIGNMENTS, {
                ...assignment,
                lessonId: parseInt(assignment.lessonId),
            });
            assignmentIds[assignment.title] = doc.$id;
        }

        // Step 10: Create results (depends on exams, assignments, students)
        console.log('Creating results...');
        const studentValues = Object.values(studentIds);
        for (const [i, result] of sampleData.results.entries()) {
            const sid = studentValues.length > 0 ? studentValues[i % studentValues.length] : null;
            await createDocument(COLLECTIONS.RESULTS, {
                ...result,
                examId: result.examId ? parseInt(result.examId) : null,
                assignmentId: result.assignmentId ? parseInt(result.assignmentId) : null,
                studentId: sid,
            });
        }

        // Step 11: Create attendances (depends on students, lessons)
        console.log('Creating attendances...');
        for (const [i, attendance] of sampleData.attendances.entries()) {
            const sid = studentValues.length > 0 ? studentValues[i % studentValues.length] : null;
            await createDocument(COLLECTIONS.ATTENDANCES, {
                ...attendance,
                studentId: sid,
                lessonId: parseInt(attendance.lessonId),
            });
        }

        // Step 12: Create events (depends on classes)
        console.log('Creating events...');
        for (const event of sampleData.events) {
            await createDocument(COLLECTIONS.EVENTS, {
                ...event,
                classId: event.classId ? parseInt(event.classId) : null,
            });
        }

        // Step 13: Create announcements (depends on classes)
        console.log('Creating announcements...');
        for (const announcement of sampleData.announcements) {
            await createDocument(COLLECTIONS.ANNOUNCEMENTS, {
                ...announcement,
                classId: announcement.classId ? parseInt(announcement.classId) : null,
            });
        }

        console.log('Data migration completed successfully!');
        console.log('Created IDs:', {
            grades: gradeIds,
            parents: parentIds,
            teachers: teacherIds,
            classes: classIds,
            subjects: subjectIds,
            students: studentIds,
            lessons: lessonIds,
            exams: examIds,
            assignments: assignmentIds,
        });

    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
}

// Run migration if this script is executed directly
if (require.main === module) {
    migrateData();
}

module.exports = { migrateData };
