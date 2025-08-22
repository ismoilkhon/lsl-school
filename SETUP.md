# School Management System - Setup Guide

## Prerequisites

1. Node.js (v18 or higher)
2. npm or yarn
3. Appwrite account and project

## Environment Configuration

The system requires Appwrite environment variables to function properly. Create a `.env.local` file in the root directory with the following variables:

```bash
# Appwrite Configuration
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
NEXT_PUBLIC_APPWRITE_PROJECT_ID=your_project_id_here
NEXT_PUBLIC_APPWRITE_DATABASE_ID=school_management
NEXT_PUBLIC_APPWRITE_BUCKET_ID=uploads

# Server-side Appwrite (for scripts and server actions)
APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
APPWRITE_PROJECT_ID=your_project_id_here
APPWRITE_API_KEY=your_api_key_here
APPWRITE_DATABASE_ID=school_management
APPWRITE_BUCKET_ID=uploads
```

## Appwrite Setup

### 1. Create Appwrite Project
1. Go to [Appwrite Console](https://console.appwrite.io/)
2. Create a new project
3. Note down your Project ID

### 2. Get API Key
1. In your Appwrite project, go to "Settings" → "API Keys"
2. Create a new API key with the following permissions:
   - `databases.read`
   - `databases.write`
   - `users.read`
   - `users.write`
   - `storage.read`
   - `storage.write`

### 3. Create Database and Collections
Run the setup script to create the database and collections:

```bash
npm run setup:appwrite
```

Or manually run:

```bash
node scripts/setup-appwrite-final.js
```

### 4. Migrate Sample Data
After setting up the collections, migrate sample data:

```bash
npm run migrate:data
```

Or manually run:

```bash
node scripts/migrate-data.js
```

## Installation

1. Install dependencies:
```bash
npm install
```

2. Create `.env.local` file with your Appwrite credentials (see above)

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Default Users

After running the migration script, you'll have these default users:

### Admin
- Email: `admin@lsl.edu`
- Password: `password123`

### Teacher
- Email: `teacher@lsl.edu`
- Password: `password123`

### Student
- Email: `student@lsl.edu`
- Password: `password123`

### Parent
- Email: `parent@lsl.edu`
- Password: `password123`

## Troubleshooting

### "No Appwrite project was specified" Error
This error occurs when the environment variables are not properly configured. Make sure:

1. Your `.env.local` file exists in the root directory
2. All required environment variables are set
3. The Project ID and API Key are correct
4. You've restarted the development server after adding the environment variables

### Database Connection Issues
1. Verify your Appwrite project is active
2. Check that your API key has the correct permissions
3. Ensure the database and collections were created successfully

### Authentication Issues
1. Make sure the users were created in the migration script
2. Verify the user credentials are correct
3. Check that the user roles are properly set in Appwrite

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run setup:appwrite` - Setup Appwrite database and collections
- `npm run migrate:data` - Migrate sample data
- `npm run verify:setup` - Verify the setup is correct

## Data Model

See `DATA_MODEL.md` for detailed information about the system's data structure and relationships.
