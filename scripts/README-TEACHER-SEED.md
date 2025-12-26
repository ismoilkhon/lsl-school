# Teacher Seeding Script

This script imports teacher data from your JSON file into both Appwrite Auth and the teachers database.

## 📋 What it does

1. **Creates user accounts** in Appwrite Auth for each teacher
2. **Creates teacher records** in the teachers database collection
3. **Handles existing data** - skips teachers that already exist
4. **Provides detailed progress** and error reporting
5. **Converts gender values** from lowercase to uppercase to match your schema

## 🚀 How to run

### Option 1: Using npm script (Recommended)
```bash
npm run seed:teachers
```

### Option 2: Direct execution
```bash
node scripts/seed-teachers-simple.js
```

### Option 3: Using the full-featured version
```bash
node scripts/seed-teachers.js
```

## 📊 Data Processing

The script processes **29 teachers** with the following information:
- **Personal Info**: Name, surname, email, phone, address
- **Authentication**: Username, password (12345678 for all)
- **Medical**: Blood type (O+ for all)
- **Demographics**: Gender (converted to MALE/FEMALE), birthday
- **Professional**: Subject, position, role
- **System**: Active status, creation date

## 🔧 Key Features

### ✅ **Smart Duplicate Handling**
- Checks if user already exists in Auth
- Checks if teacher document already exists in database
- Skips existing records to avoid conflicts

### ✅ **Data Validation & Conversion**
- Converts gender from `"male"/"female"` to `"MALE"/"FEMALE"`
- Validates email format
- Ensures required fields are present

### ✅ **Error Handling**
- Continues processing even if individual records fail
- Provides detailed error messages
- Shows progress for each teacher

### ✅ **Rate Limiting Protection**
- Adds 100ms delay between requests
- Prevents API rate limit issues

## 📈 Expected Output

```
🌱 Starting teacher seeding process...

[1/29] Processing Anvar Urunov (teacher001@lsl.edu)...
   ✅ Created user in Auth: 64f8a1b2c3d4e5f6g7h8i9j0
   ✅ Created teacher document: 64f8a1b2c3d4e5f6g7h8i9j1

[2/29] Processing Azamjon Mo'ydinov (teacher002@lsl.edu)...
   ✅ Created user in Auth: 64f8a1b2c3d4e5f6g7h8i9j2
   ✅ Created teacher document: 64f8a1b2c3d4e5f6g7h8i9j3

...

📊 Seeding Summary:
   ✅ Successfully processed: 29
   ⏭️  Skipped (already exists): 0
   ❌ Errors: 0
   📝 Total teachers: 29

🎉 All teachers seeded successfully!
```

## 🔍 Troubleshooting

### Common Issues

1. **Environment Variables Missing**
   ```
   Error: Project ID is required
   ```
   **Solution**: Make sure your `.env.local` file has the correct Appwrite configuration.

2. **Permission Denied**
   ```
   Error: Insufficient permissions
   ```
   **Solution**: Ensure your Appwrite API key has admin privileges.

3. **Duplicate Email**
   ```
   Error: User already exists
   ```
   **Solution**: This is normal - the script will skip existing users.

### Environment Variables Required

Make sure these are set in your `.env.local` file:
```env
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://syd.cloud.appwrite.io/v1
NEXT_PUBLIC_APPWRITE_PROJECT_ID=your_project_id
NEXT_PUBLIC_APPWRITE_DATABASE_ID=school_management
APPWRITE_API_KEY=your_admin_api_key
```

**Important**: The `APPWRITE_API_KEY` must be an **admin API key** with the following scopes:
- `users.read`
- `users.write`
- `databases.read`
- `databases.write`

### How to Get Your Admin API Key

1. Go to your Appwrite Console
2. Navigate to **Settings** → **API Keys**
3. Click **Create API Key**
4. Give it a name (e.g., "Teacher Seeding Script")
5. Select the following scopes:
   - ✅ `users.read`
   - ✅ `users.write`
   - ✅ `databases.read`
   - ✅ `databases.write`
6. Click **Create**
7. Copy the generated API key and add it to your `.env.local` file

## 📝 Teacher Data Summary

| Field | Count | Details |
|-------|-------|---------|
| **Total Teachers** | 29 | All from LSL School |
| **Male Teachers** | 20 | 69% of staff |
| **Female Teachers** | 9 | 31% of staff |
| **Subjects** | 12 | Various subjects including English, Math, IT, etc. |
| **Positions** | 6 | Director, Teachers, Tarbiyachi, etc. |
| **Location** | 1 | All from Namangan, Uzbekistan |

## 🎯 Subjects Covered

- **Ingliz tili** (English) - 6 teachers
- **Matematika** (Mathematics) - 4 teachers  
- **Boshlang'ich** (Primary) - 5 teachers
- **Informatika** (IT) - 3 teachers
- **Ona tili** (Mother Tongue) - 2 teachers
- **Tarix** (History) - 1 teacher
- **Tasviriy san'at** (Art) - 1 teacher
- **Rus tili** (Russian) - 1 teacher
- **Fizika** (Physics) - 1 teacher
- **Biologiya** (Biology) - 1 teacher
- **Geografiya** (Geography) - 1 teacher
- **Jis/tar** (Physical Education) - 1 teacher
- **Tarbiyachi** (Educator) - 2 teachers

## 🔄 Re-running the Script

The script is **safe to run multiple times**:
- ✅ Won't create duplicate users
- ✅ Won't create duplicate teacher records
- ✅ Will show "already exists" for existing data
- ✅ Will only process new teachers if any are added

## 📞 Support

If you encounter any issues:
1. Check the error messages in the console output
2. Verify your Appwrite configuration
3. Ensure you have admin permissions
4. Check your internet connection

The script provides detailed logging to help identify any issues quickly.
