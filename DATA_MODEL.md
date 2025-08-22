# School Management System - Data Model

## Overview
This document describes the data model for the School Management System with 4 user roles: Admin, Teacher, Student, and Parent.

## User Roles & Permissions

### 1. Admin
- **Controls all data**: Can add, edit, or delete teachers, students, parents, classes, subjects, etc.
- **Full system access**: Can manage all aspects of the school system
- **Data management**: Can view and modify all records

### 2. Teacher
- **Multiple subjects**: Can teach multiple subjects
- **Multiple lessons**: Can have multiple lessons across different classes
- **Multiple classes**: Can supervise multiple classes
- **Student management**: Can view and manage students in their classes
- **Assessment creation**: Can create exams and assignments
- **Results management**: Can grade and manage results
- **Attendance tracking**: Can mark and view attendance

### 3. Student
- **Single parent**: Has one parent
- **Single grade**: Belongs to one grade
- **Single class**: Belongs to one class
- **Multiple results**: Has results for multiple exams and assignments
- **Attendance records**: Has attendance records for lessons
- **Limited access**: Can only view their own data and general information

### 4. Parent
- **Multiple children**: Can have multiple children (students)
- **Child monitoring**: Can view children's academic progress, attendance, and schedules
- **Limited access**: Can only view data related to their children

## Data Model Relationships

### Core Entities

#### 1. Grades
- **Purpose**: Academic levels (Grade 1, Grade 2, etc.)
- **Relationships**:
  - Has multiple students
  - Has multiple classes

#### 2. Classes
- **Purpose**: Groups of students within a grade
- **Relationships**:
  - Belongs to one grade (`gradeId`)
  - Has one supervisor teacher (`supervisorId`)
  - Has multiple students
  - Has multiple lessons

#### 3. Subjects
- **Purpose**: Academic subjects (Math, Science, etc.)
- **Relationships**:
  - Has multiple lessons
  - Can be taught by multiple teachers

#### 4. Teachers
- **Purpose**: School staff who teach subjects
- **Relationships**:
  - Can teach multiple subjects
  - Can have multiple lessons
  - Can supervise multiple classes
  - Can create multiple exams and assignments

#### 5. Students
- **Purpose**: School attendees
- **Relationships**:
  - Has one parent (`parentId`)
  - Belongs to one grade (`gradeId`)
  - Belongs to one class (`classId`)
  - Has multiple results (exams and assignments)
  - Has multiple attendance records

#### 6. Parents
- **Purpose**: Guardians of students
- **Relationships**:
  - Has multiple children (students)
  - Can view children's academic data

#### 7. Lessons
- **Purpose**: Scheduled class sessions
- **Relationships**:
  - Belongs to one class (`classId`)
  - Belongs to one subject (`subjectId`)
  - Has one teacher (`teacherId`)
  - Has multiple exams
  - Has multiple assignments
  - Has multiple attendance records

#### 8. Exams
- **Purpose**: Formal assessments
- **Relationships**:
  - Belongs to one lesson (`lessonId`)
  - Has multiple results (one per student)

#### 9. Assignments
- **Purpose**: Homework and projects
- **Relationships**:
  - Belongs to one lesson (`lessonId`)
  - Has multiple results (one per student)

#### 10. Results
- **Purpose**: Student performance records
- **Relationships**:
  - Belongs to one student (`studentId`)
  - Belongs to one exam (`examId`) OR one assignment (`assignmentId`)

#### 11. Attendance
- **Purpose**: Student presence records
- **Relationships**:
  - Belongs to one student (`studentId`)
  - Belongs to one lesson (`lessonId`)
  - Records present/absent status

#### 12. Events
- **Purpose**: School events and activities
- **Relationships**:
  - Accessible to all roles

#### 13. Announcements
- **Purpose**: School-wide communications
- **Relationships**:
  - Accessible to all roles

## Database Collections

The system uses the following Appwrite collections:

```typescript
export const COLLECTIONS = {
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
} as const;
```

## Key Features by Role

### Admin Dashboard
- Complete system overview
- User management (teachers, students, parents)
- Academic structure management (grades, classes, subjects)
- Data analytics and reporting

### Teacher Dashboard
- Class management
- Lesson planning and scheduling
- Exam and assignment creation
- Grade management
- Attendance tracking
- Student progress monitoring

### Student Dashboard
- Personal schedule and timetable
- Exam and assignment information
- Personal results and grades
- Attendance records
- School events and announcements

### Parent Dashboard
- Children's academic progress
- Children's attendance records
- Children's schedules and timetables
- School events and announcements
- Communication with teachers (future feature)

## Data Flow Examples

### 1. Creating a New Class
1. Admin creates a grade
2. Admin creates a class within that grade
3. Admin assigns a teacher as supervisor
4. Admin assigns students to the class
5. Teacher creates lessons for the class

### 2. Assessment Process
1. Teacher creates an exam or assignment for a lesson
2. Students take the exam or complete the assignment
3. Teacher grades the submissions
4. Results are recorded in the system
5. Parents can view their children's results

### 3. Attendance Tracking
1. Teacher marks attendance for each lesson
2. System records present/absent status for each student
3. Parents can view their children's attendance records
4. System calculates attendance rates

## Security and Access Control

- **Role-based access**: Each user can only access data appropriate to their role
- **Data isolation**: Parents can only see their children's data
- **Authentication**: All users must authenticate through Appwrite
- **Authorization**: Middleware enforces role-based route access

## Future Enhancements

- **Communication system**: Direct messaging between parents and teachers
- **Notifications**: Real-time alerts for grades, attendance, and events
- **File uploads**: Support for assignment submissions and document sharing
- **Calendar integration**: Sync with external calendar applications
- **Mobile app**: Native mobile application for better accessibility
