# LSL School Management System

A comprehensive school management system built with Next.js 14, Appwrite, and TanStack Query. This system provides role-based access control for administrators, teachers, students, and parents.

## 🚀 Features

- **Role-Based Access Control**: Separate dashboards for Admin, Teacher, Student, and Parent roles
- **User Management**: Create and manage teachers, students, and parents (admin only)
- **Academic Management**: 
  - Subjects and Classes
  - Lessons and Timetables
  - Exams and Assignments
  - Results and Grades
  - Attendance Tracking
- **Event Management**: Calendar events and announcements
- **Internationalization**: Support for English, Uzbek, and Russian
- **Real-time Data**: TanStack Query for efficient data fetching and caching
- **Form Validation**: Zod schemas for type-safe form validation

## 📋 Prerequisites

- Node.js 18+ and npm/yarn
- Appwrite instance (cloud or self-hosted)
- Environment variables configured (see Setup section)

## 🛠️ Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
# Appwrite Configuration
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
NEXT_PUBLIC_APPWRITE_PROJECT_ID=your-project-id
NEXT_PUBLIC_APPWRITE_DATABASE_ID=your-database-id
NEXT_PUBLIC_APPWRITE_BUCKET_ID=your-bucket-id

# Appwrite Admin Credentials (for server-side operations)
APPWRITE_API_KEY=your-api-key
```

### 3. Initialize Appwrite Database

Run the setup script to create collections, attributes, and indexes:

```bash
npm run setup:appwrite
```

This script will:
- Create all required collections
- Add all necessary attributes
- Set up indexes for optimal performance
- Configure permissions

### 4. Seed Test Data (Optional)

To populate the database with sample data:

```bash
npm run seed:data
```

Or seed teachers specifically:

```bash
npm run seed:teachers
```

### 5. Verify Setup

Check that everything is configured correctly:

```bash
npm run verify:setup
```

### 6. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📜 Available Scripts

### Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Appwrite Setup

- `npm run setup:appwrite` - Initialize Appwrite database and collections
- `npm run verify:setup` - Verify Appwrite setup
- `npm run fix:permissions` - Fix collection permissions
- `npm run fix:attributes` - Add missing attributes
- `npm run fix:subjects` - Fix subject attributes
- `npm run fix:classes` - Fix class attributes
- `npm run add:userid` - Add userId attributes to collections

### Data Seeding

- `npm run seed:data` - Seed test data
- `npm run seed:teachers` - Seed teacher data

### Session Management

- `npm run refresh:session` - Refresh client session

## 🏗️ Project Structure

```
lsl-school/
├── src/
│   ├── app/                    # Next.js app router pages
│   │   └── [locale]/           # Internationalized routes
│   │       ├── (dashboard)/    # Dashboard pages
│   │       ├── sign-in/        # Authentication
│   │       └── ...
│   ├── components/             # React components
│   │   ├── forms/              # Form components
│   │   └── ...
│   ├── lib/                    # Utilities and configurations
│   │   ├── appwrite/          # Appwrite client setup
│   │   ├── hooks/              # TanStack Query hooks
│   │   ├── actions.ts          # Server actions
│   │   ├── routes.ts           # Route definitions
│   │   └── ...
│   └── ...
├── scripts/                    # Node.js scripts
│   ├── setup-appwrite-optimized.js
│   ├── seed-test-data.js
│   └── ...
└── ...
```

## 🔐 Authentication & Authorization

### User Roles

1. **Admin**: Full system access
   - Manage all users (teachers, students, parents)
   - Manage subjects, classes, lessons
   - View all data and reports

2. **Teacher**: Teaching-related access
   - Manage attendance, assignments, exams, results
   - View assigned classes and students
   - Create and grade assignments

3. **Student**: Student portal access
   - View own grades, attendance, assignments
   - View timetable and events
   - Submit assignments

4. **Parent**: Parent portal access
   - View children's grades and attendance
   - View events and announcements
   - Monitor academic progress

### Access Control

- Middleware enforces role-based route access
- Server actions validate permissions
- Client components check authorization before rendering

## 📚 Key Technologies

- **Next.js 14**: React framework with App Router
- **Appwrite**: Backend-as-a-Service for database and auth
- **TanStack Query**: Data fetching and caching
- **Zod**: Schema validation
- **React Hook Form**: Form management
- **TypeScript**: Type safety
- **Tailwind CSS**: Styling

## 🧩 Shared Components

### SelectField

A reusable select dropdown component with consistent styling:

```tsx
import SelectField from "@/components/SelectField";

<SelectField
  label="Select Option"
  name="option"
  register={register}
  options={[
    { value: "1", label: "Option 1" },
    { value: "2", label: "Option 2" },
  ]}
  error={errors.option}
/>
```

### StatusBadge

A reusable status badge component:

```tsx
import StatusBadge, { getStatusVariant } from "@/components/StatusBadge";

<StatusBadge 
  status="Active" 
  variant={getStatusVariant("active")} 
/>
```

### Date Utilities

Locale-aware date formatting utilities:

```tsx
import { formatDate, formatDateTime, formatRelativeTime } from "@/lib/date-utils";

formatDate(date, "en"); // "January 15, 2024"
formatDateTime(date, "en"); // "January 15, 2024, 10:30 AM"
formatRelativeTime(date, "en"); // "2 hours ago"
```

## 🌍 Internationalization

The application supports multiple locales:
- English (`en`)
- Uzbek (`uz`)
- Russian (`ru`)

Locale is determined from the URL path (`/[locale]/...`).

## 📝 Form Validation

All forms use Zod schemas for validation. Schemas are defined in `src/lib/formValidationSchemas.ts`:

- `attendanceSchema`
- `lessonSchema`
- `assignmentSchema`
- `resultSchema`
- `eventSchema`
- `examSchema`
- And more...

## 🔧 Troubleshooting

### Common Issues

1. **Appwrite Connection Errors**
   - Verify environment variables are set correctly
   - Check Appwrite project is active
   - Ensure API key has correct permissions

2. **Permission Denied Errors**
   - Run `npm run fix:permissions` to fix collection permissions
   - Verify user role is set correctly in Appwrite

3. **Missing Attributes**
   - Run `npm run fix:attributes` to add missing attributes
   - Check collection schema matches expected structure

4. **Session Issues**
   - Run `npm run refresh:session` to refresh client session
   - Clear browser cookies and re-login

## 📖 Additional Documentation

- [Optimized Setup Guide](./OPTIMIZED_SETUP_GUIDE.md) - Detailed Appwrite setup instructions
- [Data Model](./DATA_MODEL.md) - Database schema documentation
- [TanStack Query Refactor](./TANSTACK_QUERY_REFACTOR.md) - Data fetching architecture

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run linting: `npm run lint`
5. Submit a pull request

## 📄 License

This project is private and proprietary.

## 🆘 Support

For issues or questions:
1. Check the troubleshooting section
2. Review the documentation files
3. Check Appwrite logs for backend errors
4. Review browser console for client-side errors

---

Built with ❤️ for LSL School

