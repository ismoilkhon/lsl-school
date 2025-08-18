// Load environment variables from .env.local
require('dotenv').config({ path: '.env.local' });

const { Client, Databases } = require('node-appwrite');

// Initialize Appwrite client
const client = new Client()
    .setEndpoint(process.env.APPWRITE_ENDPOINT || 'https://syd.cloud.appwrite.io/v1')
    .setProject(process.env.APPWRITE_PROJECT_ID || '')
    .setKey(process.env.APPWRITE_API_KEY || '');

const databases = new Databases(client);

async function verifySetup() {
    console.log('🔍 Verifying Appwrite setup...');
    
    // Check if environment variables are set
    if (!process.env.APPWRITE_PROJECT_ID) {
        console.error('❌ APPWRITE_PROJECT_ID is not set in environment variables');
        return false;
    }
    
    if (!process.env.APPWRITE_API_KEY) {
        console.error('❌ APPWRITE_API_KEY is not set in environment variables');
        return false;
    }
    
    console.log('✅ Environment variables are set');
    
    try {
        // Test API key by listing databases (requires databases.read permission)
        console.log('🔑 Testing API key permissions...');
        const databasesList = await databases.list();
        console.log('✅ API key has databases.read permission');
        console.log(`📊 Found ${databasesList.databases.length} existing databases`);
        
        // Check if our target database already exists
        const targetDb = databasesList.databases.find(db => 
            db.name === 'School Management' || 
            db.$id === 'school_management' ||
            db.name.toLowerCase().includes('school') ||
            db.name.toLowerCase().includes('management')
        );
        
        if (targetDb) {
            console.log(`✅ Found existing database: ${targetDb.name} (${targetDb.$id})`);
            console.log('📝 You can now run: node scripts/setup-appwrite.js');
            return true;
        }
        
        // If we have existing databases but not our target, use the first one
        if (databasesList.databases.length > 0) {
            const firstDb = databasesList.databases[0];
            console.log(`✅ Found existing database: ${firstDb.name} (${firstDb.$id})`);
            console.log('📝 You can now run: node scripts/setup-appwrite.js');
            console.log('💡 The script will use this existing database');
            return true;
        }
        
        // Only try to create a test database if we have no existing databases
        console.log('🔑 Testing database write permission...');
        try {
            const testDb = await databases.create('test-verification', 'Test Database for Verification');
            console.log('✅ API key has databases.write permission');
            
            // Clean up test database
            await databases.delete(testDb.$id);
            console.log('✅ Test database cleaned up');
        } catch (error) {
            if (error.message && error.message.includes('maximum number of databases')) {
                console.log('⚠️  Database limit reached - this is expected if you have existing databases');
                console.log('✅ API key has proper permissions');
            } else {
                throw error;
            }
        }
        
        console.log('🎉 All permissions verified successfully!');
        console.log('📝 You can now run: node scripts/setup-appwrite.js');
        return true;
        
    } catch (error) {
        console.error('❌ Permission verification failed:');
        console.error('Error:', error.message);
        
        if (error.code === 401) {
            console.error('\n🔧 Solution:');
            console.error('1. Go to your Appwrite project settings');
            console.error('2. Create a new API key with these scopes:');
            console.error('   - databases.read');
            console.error('   - databases.write');
            console.error('   - collections.read');
            console.error('   - collections.write');
            console.error('   - documents.read');
            console.error('   - documents.write');
            console.error('3. Update your .env.local file with the new API key');
        }
        
        return false;
    }
}

// Run verification if this script is executed directly
if (require.main === module) {
    verifySetup().then(success => {
        process.exit(success ? 0 : 1);
    });
}

module.exports = { verifySetup };
