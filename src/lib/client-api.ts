'use client';

import { Client, Databases, Storage, ID, Query } from 'appwrite';

// Initialize Appwrite client for browser
const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://syd.cloud.appwrite.io/v1')
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '');

const databases = new Databases(client);
const storage = new Storage(client);

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || 'school_management';
const BUCKET_ID = process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID || 'uploads';

// Types
export interface Admin {
  $id: string;
  username: string;
  name: string;
  surname: string;
  email: string;
  phone: string;
  address: string;
  img: string;
  bloodType: string;
  sex: string;
  birthday: string;
  isActive: boolean;
  role: string;
  createdAt: string;
}

export interface Teacher {
  $id: string;
  username: string;
  name: string;
  surname: string;
  email: string;
  phone: string;
  address: string;
  img: string;
  bloodType: string;
  sex: string;
  birthday: string;
  isActive: boolean;
  role: string;
  createdAt: string;
}

export interface Parent {
  $id: string;
  username: string;
  name: string;
  surname: string;
  email: string;
  phone: string;
  address: string;
  img: string;
  bloodType: string;
  sex: string;
  birthday: string;
  isActive: boolean;
  role: string;
  createdAt: string;
}

export interface Subject {
  $id: string;
  name: string;
  code: string;
  description: string;
  credits: number;
}

export interface Class {
  $id: string;
  name: string;
  capacity: number;
  supervisorId: string;
  academicYear: string;
  isActive: boolean;
}

export interface Student {
  $id: string;
  username: string;
  name: string;
  surname: string;
  email: string;
  phone: string;
  address: string;
  img: string;
  bloodType: string;
  sex: string;
  parentId: string;
  classId: string;
  birthday: string;
  enrollmentDate: string;
  isActive: boolean;
  role: string;
  createdAt: string;
}

export interface Lesson {
  $id: string;
  name: string;
  day: string;
  startTime: string;
  endTime: string;
  subjectId: string;
  classId: string;
  teacherId: string;
  room: string;
  isActive: boolean;
}

export interface Exam {
  $id: string;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  lessonId: string;
  maxScore: number;
  isActive: boolean;
}

export interface Assignment {
  $id: string;
  title: string;
  description: string;
  startDate: string;
  dueDate: string;
  lessonId: string;
  maxScore: number;
  isActive: boolean;
}

export interface Result {
  $id: string;
  score: number;
  examId?: string;
  assignmentId?: string;
  studentId: string;
  submittedAt: string;
  comments: string;
}

export interface Attendance {
  $id: string;
  date: string;
  present: boolean;
  studentId: string;
  lessonId: string;
  notes: string;
}

export interface Event {
  $id: string;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  classId: string;
  location: string;
  img: string;
  isActive: boolean;
  category: string;
  attendees: number;
  organizer: string;
  requirements: string[];
}

export interface Announcement {
  $id: string;
  title: string;
  description: string;
  date: string;
  classId: string;
  authorId: string;
  isActive: boolean;
}

// Generic CRUD operations
export const clientApi = {
  // Generic list function
  list: async <T>(collectionId: string, queries: string[] = []): Promise<T[]> => {
    try {
      const response = await databases.listDocuments(DATABASE_ID, collectionId, queries);
      return response.documents as T[];
    } catch (error) {
      console.error(`Error fetching ${collectionId}:`, error);
      throw error;
    }
  },

  // Generic get by ID function
  getById: async <T>(collectionId: string, id: string): Promise<T> => {
    try {
      const response = await databases.getDocument(DATABASE_ID, collectionId, id);
      return response as T;
    } catch (error) {
      console.error(`Error fetching ${collectionId} with id ${id}:`, error);
      throw error;
    }
  },

  // Generic create function
  create: async <T>(collectionId: string, data: Omit<T, '$id' | '$createdAt' | '$updatedAt' | '$permissions'>): Promise<T> => {
    try {
      const response = await databases.createDocument(DATABASE_ID, collectionId, ID.unique(), data);
      return response as T;
    } catch (error) {
      console.error(`Error creating ${collectionId}:`, error);
      throw error;
    }
  },

  // Generic update function
  update: async <T>(collectionId: string, id: string, data: Partial<T>): Promise<T> => {
    try {
      const response = await databases.updateDocument(DATABASE_ID, collectionId, id, data);
      return response as T;
    } catch (error) {
      console.error(`Error updating ${collectionId} with id ${id}:`, error);
      throw error;
    }
  },

  // Generic delete function
  delete: async (collectionId: string, id: string): Promise<void> => {
    try {
      await databases.deleteDocument(DATABASE_ID, collectionId, id);
    } catch (error) {
      console.error(`Error deleting ${collectionId} with id ${id}:`, error);
      throw error;
    }
  },

  // Specific entity functions
  admins: {
    list: () => clientApi.list<Admin>('admins'),
    getById: (id: string) => clientApi.getById<Admin>('admins', id),
    create: (data: Omit<Admin, '$id' | '$createdAt' | '$updatedAt' | '$permissions'>) => 
      clientApi.create<Admin>('admins', data),
    update: (id: string, data: Partial<Admin>) => clientApi.update<Admin>('admins', id, data),
    delete: (id: string) => clientApi.delete('admins', id),
  },

  teachers: {
    list: () => clientApi.list<Teacher>('teachers'),
    getById: (id: string) => clientApi.getById<Teacher>('teachers', id),
    create: (data: Omit<Teacher, '$id' | '$createdAt' | '$updatedAt' | '$permissions'>) => 
      clientApi.create<Teacher>('teachers', data),
    update: (id: string, data: Partial<Teacher>) => clientApi.update<Teacher>('teachers', id, data),
    delete: (id: string) => clientApi.delete('teachers', id),
    getByEmail: (email: string) => clientApi.list<Teacher>('teachers', [Query.equal('email', email)]),
  },

  parents: {
    list: () => clientApi.list<Parent>('parents'),
    getById: (id: string) => clientApi.getById<Parent>('parents', id),
    create: (data: Omit<Parent, '$id' | '$createdAt' | '$updatedAt' | '$permissions'>) => 
      clientApi.create<Parent>('parents', data),
    update: (id: string, data: Partial<Parent>) => clientApi.update<Parent>('parents', id, data),
    delete: (id: string) => clientApi.delete('parents', id),
    getByEmail: (email: string) => clientApi.list<Parent>('parents', [Query.equal('email', email)]),
  },

  subjects: {
    list: () => clientApi.list<Subject>('subjects'),
    getById: (id: string) => clientApi.getById<Subject>('subjects', id),
    create: (data: Omit<Subject, '$id' | '$createdAt' | '$updatedAt' | '$permissions'>) => 
      clientApi.create<Subject>('subjects', data),
    update: (id: string, data: Partial<Subject>) => clientApi.update<Subject>('subjects', id, data),
    delete: (id: string) => clientApi.delete('subjects', id),
  },

  classes: {
    list: () => clientApi.list<Class>('classes'),
    getById: (id: string) => clientApi.getById<Class>('classes', id),
    create: (data: Omit<Class, '$id' | '$createdAt' | '$updatedAt' | '$permissions'>) => 
      clientApi.create<Class>('classes', data),
    update: (id: string, data: Partial<Class>) => clientApi.update<Class>('classes', id, data),
    delete: (id: string) => clientApi.delete('classes', id),
    getBySupervisor: (supervisorId: string) => clientApi.list<Class>('classes', [Query.equal('supervisorId', supervisorId)]),
  },

  students: {
    list: () => clientApi.list<Student>('students'),
    getById: (id: string) => clientApi.getById<Student>('students', id),
    create: (data: Omit<Student, '$id' | '$createdAt' | '$updatedAt' | '$permissions'>) => 
      clientApi.create<Student>('students', data),
    update: (id: string, data: Partial<Student>) => clientApi.update<Student>('students', id, data),
    delete: (id: string) => clientApi.delete('students', id),
    getByClass: (classId: string) => clientApi.list<Student>('students', [Query.equal('classId', classId)]),
    getByParent: (parentId: string) => clientApi.list<Student>('students', [Query.equal('parentId', parentId)]),
    getByEmail: (email: string) => clientApi.list<Student>('students', [Query.equal('email', email)]),
  },

  lessons: {
    list: () => clientApi.list<Lesson>('lessons'),
    getById: (id: string) => clientApi.getById<Lesson>('lessons', id),
    create: (data: Omit<Lesson, '$id' | '$createdAt' | '$updatedAt' | '$permissions'>) => 
      clientApi.create<Lesson>('lessons', data),
    update: (id: string, data: Partial<Lesson>) => clientApi.update<Lesson>('lessons', id, data),
    delete: (id: string) => clientApi.delete('lessons', id),
    getByClass: (classId: string) => clientApi.list<Lesson>('lessons', [Query.equal('classId', classId)]),
    getByTeacher: (teacherId: string) => clientApi.list<Lesson>('lessons', [Query.equal('teacherId', teacherId)]),
    getBySubject: (subjectId: string) => clientApi.list<Lesson>('lessons', [Query.equal('subjectId', subjectId)]),
    getByDay: (day: string) => clientApi.list<Lesson>('lessons', [Query.equal('day', day)]),
  },

  exams: {
    list: () => clientApi.list<Exam>('exams'),
    getById: (id: string) => clientApi.getById<Exam>('exams', id),
    create: (data: Omit<Exam, '$id' | '$createdAt' | '$updatedAt' | '$permissions'>) => 
      clientApi.create<Exam>('exams', data),
    update: (id: string, data: Partial<Exam>) => clientApi.update<Exam>('exams', id, data),
    delete: (id: string) => clientApi.delete('exams', id),
    getByLesson: (lessonId: string) => clientApi.list<Exam>('exams', [Query.equal('lessonId', lessonId)]),
  },

  assignments: {
    list: () => clientApi.list<Assignment>('assignments'),
    getById: (id: string) => clientApi.getById<Assignment>('assignments', id),
    create: (data: Omit<Assignment, '$id' | '$createdAt' | '$updatedAt' | '$permissions'>) => 
      clientApi.create<Assignment>('assignments', data),
    update: (id: string, data: Partial<Assignment>) => clientApi.update<Assignment>('assignments', id, data),
    delete: (id: string) => clientApi.delete('assignments', id),
    getByLesson: (lessonId: string) => clientApi.list<Assignment>('assignments', [Query.equal('lessonId', lessonId)]),
  },

  results: {
    list: () => clientApi.list<Result>('results'),
    getById: (id: string) => clientApi.getById<Result>('results', id),
    create: (data: Omit<Result, '$id' | '$createdAt' | '$updatedAt' | '$permissions'>) => 
      clientApi.create<Result>('results', data),
    update: (id: string, data: Partial<Result>) => clientApi.update<Result>('results', id, data),
    delete: (id: string) => clientApi.delete('results', id),
    getByStudent: (studentId: string) => clientApi.list<Result>('results', [Query.equal('studentId', studentId)]),
    getByExam: (examId: string) => clientApi.list<Result>('results', [Query.equal('examId', examId)]),
    getByAssignment: (assignmentId: string) => clientApi.list<Result>('results', [Query.equal('assignmentId', assignmentId)]),
  },

  attendances: {
    list: () => clientApi.list<Attendance>('attendances'),
    getById: (id: string) => clientApi.getById<Attendance>('attendances', id),
    create: (data: Omit<Attendance, '$id' | '$createdAt' | '$updatedAt' | '$permissions'>) => 
      clientApi.create<Attendance>('attendances', data),
    update: (id: string, data: Partial<Attendance>) => clientApi.update<Attendance>('attendances', id, data),
    delete: (id: string) => clientApi.delete('attendances', id),
    getByStudent: (studentId: string) => clientApi.list<Attendance>('attendances', [Query.equal('studentId', studentId)]),
    getByLesson: (lessonId: string) => clientApi.list<Attendance>('attendances', [Query.equal('lessonId', lessonId)]),
    getByDate: (date: string) => clientApi.list<Attendance>('attendances', [Query.equal('date', date)]),
  },

  events: {
    list: () => clientApi.list<Event>('events'),
    getById: (id: string) => clientApi.getById<Event>('events', id),
    create: (data: Omit<Event, '$id' | '$createdAt' | '$updatedAt' | '$permissions'>) => 
      clientApi.create<Event>('events', data),
    update: (id: string, data: Partial<Event>) => clientApi.update<Event>('events', id, data),
    delete: (id: string) => clientApi.delete('events', id),
    getByClass: (classId: string) => clientApi.list<Event>('events', [Query.equal('classId', classId)]),
  },

  announcements: {
    list: () => clientApi.list<Announcement>('announcements'),
    getById: (id: string) => clientApi.getById<Announcement>('announcements', id),
    create: (data: Omit<Announcement, '$id' | '$createdAt' | '$updatedAt' | '$permissions'>) => 
      clientApi.create<Announcement>('announcements', data),
    update: (id: string, data: Partial<Announcement>) => clientApi.update<Announcement>('announcements', id, data),
    delete: (id: string) => clientApi.delete('announcements', id),
    getByClass: (classId: string) => clientApi.list<Announcement>('announcements', [Query.equal('classId', classId)]),
    getByAuthor: (authorId: string) => clientApi.list<Announcement>('announcements', [Query.equal('authorId', authorId)]),
  },
};

export default clientApi;
