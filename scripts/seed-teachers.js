// Load environment variables from .env.local
require('dotenv').config({ path: '.env.local' });

const { Client, Databases, Users, ID, Query } = require('node-appwrite');
const fs = require('fs');
const path = require('path');

// Initialize Appwrite client
const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://syd.cloud.appwrite.io/v1')
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '')
  .setKey(process.env.APPWRITE_API_KEY || ''); // Add API key for admin operations

const databases = new Databases(client);
const users = new Users(client);

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || 'lsl_school_db';
const COLLECTION_ID = 'teachers';

// Teacher data from your JSON
const teachersData = [
    {
        "username": "teacher001",
        "password": "12345678",
        "name": "Anvar",
        "surname": "Urunov",
        "email": "teacher001@lsl.edu",
        "phone": "90-215-61-32",
        "address": "Namangan, Uzbekistan",
        "img": "",
        "bloodType": "O+",
        "sex": "MALE", // Convert to uppercase to match schema
        "birthday": "1980-05-17T00:00:00",
        "isActive": true,
        "role": "teacher",
        "subject": "Ingliz tili",
        "position": "Direktor",
        "createdAt": "2025-09-04T07:55:29.091575"
    },
    {
        "username": "teacher002",
        "password": "12345678",
        "name": "Azamjon",
        "surname": "Mo'ydinov",
        "email": "teacher002@lsl.edu",
        "phone": "90-641-34-41",
        "address": "Namangan, Uzbekistan",
        "img": "",
        "bloodType": "O+",
        "sex": "MALE",
        "birthday": "1978-10-30T00:00:00",
        "isActive": true,
        "role": "teacher",
        "subject": "Ingliz tili",
        "position": "O'IBDO'",
        "createdAt": "2025-09-04T07:55:29.091598"
    },
    {
        "username": "teacher003",
        "password": "12345678",
        "name": "Sirojiddin",
        "surname": "Ismailov",
        "email": "teacher003@lsl.edu",
        "phone": "91-181-93-94",
        "address": "Namangan, Uzbekistan",
        "img": "",
        "bloodType": "O+",
        "sex": "MALE",
        "birthday": "1972-06-18T00:00:00",
        "isActive": true,
        "role": "teacher",
        "subject": "Matematika",
        "position": "MMIBDO'",
        "createdAt": "2025-09-04T07:55:29.091615"
    },
    {
        "username": "teacher004",
        "password": "12345678",
        "name": "Akramjon",
        "surname": "Urinov",
        "email": "teacher004@lsl.edu",
        "phone": "91-186-16-06",
        "address": "Namangan, Uzbekistan",
        "img": "",
        "bloodType": "O+",
        "sex": "MALE",
        "birthday": "1974-08-03T00:00:00",
        "isActive": true,
        "role": "teacher",
        "subject": "Ona tili",
        "position": "Teacher",
        "createdAt": "2025-09-04T07:55:29.091636"
    },
    {
        "username": "teacher005",
        "password": "12345678",
        "name": "Diyora",
        "surname": "Sultonmamitova",
        "email": "teacher005@lsl.edu",
        "phone": "93-363-22-24",
        "address": "Namangan, Uzbekistan",
        "img": "",
        "bloodType": "O+",
        "sex": "FEMALE",
        "birthday": "2004-02-08T00:00:00",
        "isActive": true,
        "role": "teacher",
        "subject": "Ingliz tili",
        "position": "Teacher",
        "createdAt": "2025-09-04T07:55:29.091666"
    },
    {
        "username": "teacher006",
        "password": "12345678",
        "name": "Axadxon",
        "surname": "Isakdjanov",
        "email": "teacher006@lsl.edu",
        "phone": "93-407-77-04",
        "address": "Namangan, Uzbekistan",
        "img": "",
        "bloodType": "O+",
        "sex": "MALE",
        "birthday": "1971-02-28T00:00:00",
        "isActive": true,
        "role": "teacher",
        "subject": "Matematika",
        "position": "Teacher",
        "createdAt": "2025-09-04T07:55:29.091680"
    },
    {
        "username": "teacher007",
        "password": "12345678",
        "name": "Rasuljon",
        "surname": "Sharipov",
        "email": "teacher007@lsl.edu",
        "phone": "99-220-08-80",
        "address": "Namangan, Uzbekistan",
        "img": "",
        "bloodType": "O+",
        "sex": "MALE",
        "birthday": "1999-06-10T00:00:00",
        "isActive": true,
        "role": "teacher",
        "subject": "Informatika",
        "position": "Teacher",
        "createdAt": "2025-09-04T07:55:29.091694"
    },
    {
        "username": "teacher008",
        "password": "12345678",
        "name": "Ismoilxon",
        "surname": "Baxromov",
        "email": "teacher008@lsl.edu",
        "phone": "99-977-79-28",
        "address": "Namangan, Uzbekistan",
        "img": "",
        "bloodType": "O+",
        "sex": "MALE",
        "birthday": "1998-12-28T00:00:00",
        "isActive": true,
        "role": "teacher",
        "subject": "Informatika",
        "position": "Teacher",
        "createdAt": "2025-09-04T07:55:29.091711"
    },
    {
        "username": "teacher009",
        "password": "12345678",
        "name": "Yodgor",
        "surname": "Fazlitdinov",
        "email": "teacher009@lsl.edu",
        "phone": "95-857-03-10",
        "address": "Namangan, Uzbekistan",
        "img": "",
        "bloodType": "O+",
        "sex": "MALE",
        "birthday": "1980-12-20T00:00:00",
        "isActive": true,
        "role": "teacher",
        "subject": "Tarix",
        "position": "Teacher",
        "createdAt": "2025-09-04T07:55:29.091727"
    },
    {
        "username": "teacher010",
        "password": "12345678",
        "name": "Nodirabegim",
        "surname": "Mashrapova",
        "email": "teacher010@lsl.edu",
        "phone": "93-117-75-53",
        "address": "Namangan, Uzbekistan",
        "img": "",
        "bloodType": "O+",
        "sex": "FEMALE",
        "birthday": "1994-04-21T00:00:00",
        "isActive": true,
        "role": "teacher",
        "subject": "Boshlang'ich",
        "position": "Teacher",
        "createdAt": "2025-09-04T07:55:29.091824"
    },
    {
        "username": "teacher011",
        "password": "12345678",
        "name": "Azamjon",
        "surname": "Valiyev",
        "email": "teacher011@lsl.edu",
        "phone": "90-640-76-72",
        "address": "Namangan, Uzbekistan",
        "img": "",
        "bloodType": "O+",
        "sex": "MALE",
        "birthday": "1967-12-27T00:00:00",
        "isActive": true,
        "role": "teacher",
        "subject": "Tasviriy san'at",
        "position": "Teacher",
        "createdAt": "2025-09-04T07:55:29.091840"
    },
    {
        "username": "teacher012",
        "password": "12345678",
        "name": "Gulnoza",
        "surname": "Sadridinova",
        "email": "teacher012@lsl.edu",
        "phone": "93-062-81-02",
        "address": "Namangan, Uzbekistan",
        "img": "",
        "bloodType": "O+",
        "sex": "FEMALE",
        "birthday": "1981-11-02T00:00:00",
        "isActive": true,
        "role": "teacher",
        "subject": "Boshlang'ich",
        "position": "Teacher",
        "createdAt": "2025-09-04T07:55:29.091854"
    },
    {
        "username": "teacher013",
        "password": "12345678",
        "name": "Abdulaziz",
        "surname": "Jamoliddinov",
        "email": "teacher013@lsl.edu",
        "phone": "91-054-68-64",
        "address": "Namangan, Uzbekistan",
        "img": "",
        "bloodType": "O+",
        "sex": "MALE",
        "birthday": "1996-05-03T00:00:00",
        "isActive": true,
        "role": "teacher",
        "subject": "Informatika",
        "position": "Operator",
        "createdAt": "2025-09-04T07:55:29.091866"
    },
    {
        "username": "teacher014",
        "password": "12345678",
        "name": "Gulchexraxon",
        "surname": "Isoqjonova",
        "email": "teacher014@lsl.edu",
        "phone": "50-726-21-09",
        "address": "Namangan, Uzbekistan",
        "img": "",
        "bloodType": "O+",
        "sex": "FEMALE",
        "birthday": "2005-08-18T00:00:00",
        "isActive": true,
        "role": "teacher",
        "subject": "Boshlang'ich",
        "position": "Tarbiyachi",
        "createdAt": "2025-09-04T07:55:29.091879"
    },
    {
        "username": "teacher015",
        "password": "12345678",
        "name": "Madina",
        "surname": "G'ulomova",
        "email": "teacher015@lsl.edu",
        "phone": "90-000-00-01",
        "address": "Namangan, Uzbekistan",
        "img": "",
        "bloodType": "O+",
        "sex": "FEMALE",
        "birthday": "2005-06-03T00:00:00",
        "isActive": true,
        "role": "teacher",
        "subject": "Boshlang'ich",
        "position": "Tarbiyachi",
        "createdAt": "2025-09-04T07:55:29.091891"
    },
    {
        "username": "teacher016",
        "password": "12345678",
        "name": "Rayhona",
        "surname": "Turg'unova",
        "email": "teacher016@lsl.edu",
        "phone": "91-177-15-03",
        "address": "Namangan, Uzbekistan",
        "img": "",
        "bloodType": "O+",
        "sex": "FEMALE",
        "birthday": "2003-03-15T00:00:00",
        "isActive": true,
        "role": "teacher",
        "subject": "Rus tili",
        "position": "Teacher",
        "createdAt": "2025-09-04T07:55:29.091903"
    },
    {
        "username": "teacher017",
        "password": "12345678",
        "name": "Surayyoxon",
        "surname": "Qosimova",
        "email": "teacher017@lsl.edu",
        "phone": "94-970-14-08",
        "address": "Namangan, Uzbekistan",
        "img": "",
        "bloodType": "O+",
        "sex": "FEMALE",
        "birthday": "2002-07-11T00:00:00",
        "isActive": true,
        "role": "teacher",
        "subject": "Ingliz tili",
        "position": "Teacher",
        "createdAt": "2025-09-04T07:55:29.091915"
    },
    {
        "username": "teacher018",
        "password": "12345678",
        "name": "Murodilla",
        "surname": "Usmanov",
        "email": "teacher018@lsl.edu",
        "phone": "90-215-96-15",
        "address": "Namangan, Uzbekistan",
        "img": "",
        "bloodType": "O+",
        "sex": "MALE",
        "birthday": "1993-04-30T00:00:00",
        "isActive": true,
        "role": "teacher",
        "subject": "Matematika",
        "position": "Teacher",
        "createdAt": "2025-09-04T07:55:29.091955"
    },
    {
        "username": "teacher019",
        "password": "12345678",
        "name": "Boburshoh",
        "surname": "Ibrohimov",
        "email": "teacher019@lsl.edu",
        "phone": "90-000-00-02",
        "address": "Namangan, Uzbekistan",
        "img": "",
        "bloodType": "O+",
        "sex": "MALE",
        "birthday": "1990-01-01T00:00:00",
        "isActive": true,
        "role": "teacher",
        "subject": "Fizika",
        "position": "Teacher",
        "createdAt": "2025-09-04T07:55:29.091970"
    },
    {
        "username": "teacher020",
        "password": "12345678",
        "name": "Mirzaolimxon",
        "surname": "Murodullayev",
        "email": "teacher020@lsl.edu",
        "phone": "97-253-97-04",
        "address": "Namangan, Uzbekistan",
        "img": "",
        "bloodType": "O+",
        "sex": "MALE",
        "birthday": "1984-03-23T00:00:00",
        "isActive": true,
        "role": "teacher",
        "subject": "Biologiya",
        "position": "Teacher",
        "createdAt": "2025-09-04T07:55:29.091982"
    },
    {
        "username": "teacher021",
        "password": "12345678",
        "name": "Bahodirjon",
        "surname": "Osimov",
        "email": "teacher021@lsl.edu",
        "phone": "77-123-62-77",
        "address": "Namangan, Uzbekistan",
        "img": "",
        "bloodType": "O+",
        "sex": "MALE",
        "birthday": "1991-01-01T00:00:00",
        "isActive": true,
        "role": "teacher",
        "subject": "Geografiya",
        "position": "Teacher",
        "createdAt": "2025-09-04T07:55:29.091994"
    },
    {
        "username": "teacher022",
        "password": "12345678",
        "name": "Xilola",
        "surname": "Davlatova",
        "email": "teacher022@lsl.edu",
        "phone": "91-342-05-55",
        "address": "Namangan, Uzbekistan",
        "img": "",
        "bloodType": "O+",
        "sex": "FEMALE",
        "birthday": "1995-01-01T00:00:00",
        "isActive": true,
        "role": "teacher",
        "subject": "Ingliz tili",
        "position": "Teacher",
        "createdAt": "2025-09-04T07:55:29.092007"
    },
    {
        "username": "teacher023",
        "password": "12345678",
        "name": "Borillo",
        "surname": "Abdug'aniyev",
        "email": "teacher023@lsl.edu",
        "phone": "93-491-95-97",
        "address": "Namangan, Uzbekistan",
        "img": "",
        "bloodType": "O+",
        "sex": "MALE",
        "birthday": "1991-03-23T00:00:00",
        "isActive": true,
        "role": "teacher",
        "subject": "Jis/tar",
        "position": "Teacher",
        "createdAt": "2025-09-04T07:55:29.092027"
    },
    {
        "username": "teacher024",
        "password": "12345678",
        "name": "Boburmirzo",
        "surname": "Usmanov",
        "email": "teacher024@lsl.edu",
        "phone": "94-012-77-11",
        "address": "Namangan, Uzbekistan",
        "img": "",
        "bloodType": "O+",
        "sex": "MALE",
        "birthday": "1999-01-21T00:00:00",
        "isActive": true,
        "role": "teacher",
        "subject": "Tarbiyachi",
        "position": "Tarbiyachi",
        "createdAt": "2025-09-04T07:55:29.092048"
    },
    {
        "username": "teacher025",
        "password": "12345678",
        "name": "Yulduzxon",
        "surname": "Usmanova",
        "email": "teacher025@lsl.edu",
        "phone": "77-157-88-06",
        "address": "Namangan, Uzbekistan",
        "img": "",
        "bloodType": "O+",
        "sex": "FEMALE",
        "birthday": "1994-09-22T00:00:00",
        "isActive": true,
        "role": "teacher",
        "subject": "Boshlang'ich",
        "position": "Teacher",
        "createdAt": "2025-09-04T07:55:29.092061"
    },
    {
        "username": "teacher026",
        "password": "12345678",
        "name": "Bekzod",
        "surname": "Isakjanov",
        "email": "teacher026@lsl.edu",
        "phone": "50-706-47-77",
        "address": "Namangan, Uzbekistan",
        "img": "",
        "bloodType": "O+",
        "sex": "MALE",
        "birthday": "1997-07-01T00:00:00",
        "isActive": true,
        "role": "teacher",
        "subject": "Ingliz tili",
        "position": "Teacher",
        "createdAt": "2025-09-04T07:55:29.092081"
    },
    {
        "username": "teacher027",
        "password": "12345678",
        "name": "Gulnoza",
        "surname": "Saitkulova",
        "email": "teacher027@lsl.edu",
        "phone": "93-941-87-42",
        "address": "Namangan, Uzbekistan",
        "img": "",
        "bloodType": "O+",
        "sex": "FEMALE",
        "birthday": "1987-07-24T00:00:00",
        "isActive": true,
        "role": "teacher",
        "subject": "Ona tili",
        "position": "Teacher",
        "createdAt": "2025-09-04T07:55:29.092102"
    },
    {
        "username": "teacher028",
        "password": "12345678",
        "name": "Feruza",
        "surname": "Babanorova",
        "email": "teacher028@lsl.edu",
        "phone": "93-268-99-79",
        "address": "Namangan, Uzbekistan",
        "img": "",
        "bloodType": "O+",
        "sex": "FEMALE",
        "birthday": "1992-01-01T00:00:00",
        "isActive": true,
        "role": "teacher",
        "subject": "Boshlang'ich",
        "position": "Teacher",
        "createdAt": "2025-09-04T07:55:29.092121"
    },
    {
        "username": "teacher029",
        "password": "12345678",
        "name": "Husanboy",
        "surname": "Rosulov",
        "email": "teacher029@lsl.edu",
        "phone": "90-750-08-03",
        "address": "Namangan, Uzbekistan",
        "img": "",
        "bloodType": "O+",
        "sex": "MALE",
        "birthday": "1985-01-01T00:00:00",
        "isActive": true,
        "role": "teacher",
        "subject": "Matematika",
        "position": "Teacher",
        "createdAt": "2025-09-04T07:55:29.092142"
    }
];

// Helper function to check if user already exists
async function checkUserExists(email) {
    try {
        const usersList = await users.list([Query.equal('email', email)]);
        return usersList.users.length > 0;
    } catch (error) {
        console.log(`⚠️  Could not check if user exists for ${email}:`, error.message);
        return false;
    }
}

// Helper function to check if teacher document already exists
async function checkTeacherExists(email) {
    try {
        const documents = await databases.listDocuments(DATABASE_ID, COLLECTION_ID, [Query.equal('email', email)]);
        return documents.documents.length > 0;
    } catch (error) {
        console.log(`⚠️  Could not check if teacher document exists for ${email}:`, error.message);
        return false;
    }
}

// Main seed function
async function seedTeachers() {
    console.log('🌱 Starting teacher seeding process...\n');
    
    let successCount = 0;
    let skipCount = 0;
    let errorCount = 0;
    
    for (let i = 0; i < teachersData.length; i++) {
        const teacher = teachersData[i];
        const progress = `[${i + 1}/${teachersData.length}]`;
        
        try {
            console.log(`${progress} Processing ${teacher.name} ${teacher.surname} (${teacher.email})...`);
            
            // Check if user already exists in Auth
            const userExists = await checkUserExists(teacher.email);
            const teacherExists = await checkTeacherExists(teacher.email);
            
            if (userExists && teacherExists) {
                console.log(`   ⏭️  Skipping - User and teacher already exist`);
                skipCount++;
                continue;
            }
            
            let userId = null;
            
            // Create user in Appwrite Auth if not exists
            if (!userExists) {
                try {
                    const user = await users.create(ID.unique(), teacher.email, teacher.password, teacher.name);
                    userId = user.$id;
                    console.log(`   ✅ Created user in Auth: ${user.$id}`);
                } catch (error) {
                    console.log(`   ❌ Failed to create user in Auth: ${error.message}`);
                    errorCount++;
                    continue;
                }
            } else {
                // Get existing user ID
                try {
                    const usersList = await users.list([Query.equal('email', teacher.email)]);
                    userId = usersList.users[0].$id;
                    console.log(`   ℹ️  Using existing user: ${userId}`);
                } catch (error) {
                    console.log(`   ❌ Could not get existing user ID: ${error.message}`);
                    errorCount++;
                    continue;
                }
            }
            
            // Create teacher document if not exists
            if (!teacherExists) {
                try {
                    const teacherData = {
                        username: teacher.username,
                        name: teacher.name,
                        surname: teacher.surname,
                        email: teacher.email,
                        phone: teacher.phone,
                        address: teacher.address,
                        img: teacher.img,
                        bloodType: teacher.bloodType,
                        sex: teacher.sex,
                        birthday: teacher.birthday,
                        isActive: teacher.isActive,
                        role: teacher.role,
                        createdAt: new Date().toISOString()
                    };
                    
                    const document = await databases.createDocument(
                        DATABASE_ID,
                        COLLECTION_ID,
                        ID.unique(),
                        teacherData
                    );
                    
                    console.log(`   ✅ Created teacher document: ${document.$id}`);
                    successCount++;
                } catch (error) {
                    console.log(`   ❌ Failed to create teacher document: ${error.message}`);
                    errorCount++;
                }
            } else {
                console.log(`   ℹ️  Teacher document already exists`);
                skipCount++;
            }
            
        } catch (error) {
            console.log(`   ❌ Unexpected error: ${error.message}`);
            errorCount++;
        }
        
        // Add small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    console.log('\n📊 Seeding Summary:');
    console.log(`   ✅ Successfully processed: ${successCount}`);
    console.log(`   ⏭️  Skipped (already exists): ${skipCount}`);
    console.log(`   ❌ Errors: ${errorCount}`);
    console.log(`   📝 Total teachers: ${teachersData.length}`);
    
    if (errorCount === 0) {
        console.log('\n🎉 All teachers seeded successfully!');
    } else {
        console.log(`\n⚠️  Completed with ${errorCount} errors. Check the logs above for details.`);
    }
}

// Run the seed function
if (require.main === module) {
    seedTeachers().catch(console.error);
}

module.exports = { seedTeachers, teachersData };
