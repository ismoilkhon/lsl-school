// Load environment variables from .env.local
require('dotenv').config({ path: '.env.local' });

const { Client, Databases } = require('node-appwrite');

// Initialize Appwrite client
const client = new Client()
    .setEndpoint(process.env.APPWRITE_ENDPOINT || 'https://syd.cloud.appwrite.io/v1')
    .setProject(process.env.APPWRITE_PROJECT_ID || '')
    .setKey(process.env.APPWRITE_API_KEY || '');

const databases = new Databases(client);
const DATABASE_ID = process.env.APPWRITE_DATABASE_ID || 'lsl_school_db';

async function fixAttributes() {
    console.log('🔧 Fixing missing attributes...');

    try {
        // Fix Grades collection - add level attribute
        console.log('📝 Fixing Grades collection...');
        try {
            await databases.createIntegerAttribute(
                DATABASE_ID,
                'grades',
                'level',
                1, // min
                12, // max
                true // required
            );
            console.log('✅ Added level attribute to grades');
        } catch (error) {
            if (error.code === 409) {
                console.log('✅ level attribute already exists in grades');
            } else {
                console.log('❌ Error adding level to grades:', error.message);
            }
        }

        // Fix Subjects collection - add credits attribute
        console.log('📝 Fixing Subjects collection...');
        try {
            await databases.createIntegerAttribute(
                DATABASE_ID,
                'subjects',
                'credits',
                1, // min
                10, // max
                true // required
            );
            console.log('✅ Added credits attribute to subjects');
        } catch (error) {
            if (error.code === 409) {
                console.log('✅ credits attribute already exists in subjects');
            } else {
                console.log('❌ Error adding credits to subjects:', error.message);
            }
        }

        // Fix Classes collection - add capacity attribute
        console.log('📝 Fixing Classes collection...');
        try {
            await databases.createIntegerAttribute(
                DATABASE_ID,
                'classes',
                'capacity',
                1, // min
                50, // max
                true // required
            );
            console.log('✅ Added capacity attribute to classes');
        } catch (error) {
            if (error.code === 409) {
                console.log('✅ capacity attribute already exists in classes');
            } else {
                console.log('❌ Error adding capacity to classes:', error.message);
            }
        }

        // Fix Exams collection - add maxScore attribute
        console.log('📝 Fixing Exams collection...');
        try {
            await databases.createIntegerAttribute(
                DATABASE_ID,
                'exams',
                'maxScore',
                1, // min
                100, // max
                true // required
            );
            console.log('✅ Added maxScore attribute to exams');
        } catch (error) {
            if (error.code === 409) {
                console.log('✅ maxScore attribute already exists in exams');
            } else {
                console.log('❌ Error adding maxScore to exams:', error.message);
            }
        }

        console.log('✅ Attribute fixes completed!');

    } catch (error) {
        console.error('❌ Error fixing attributes:', error);
    }
}

fixAttributes();
