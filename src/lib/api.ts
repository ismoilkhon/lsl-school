import { Client, Databases, Storage, ID, Query } from 'node-appwrite';

// Initialize Appwrite client
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
export const api = {
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
    list: () => api.list<Admin>('admins'),
    getById: (id: string) => api.getById<Admin>('admins', id),
    create: (data: Omit<Admin, '$id' | '$createdAt' | '$updatedAt' | '$permissions'>) => 
      api.create<Admin>('admins', data),
    update: (id: string, data: Partial<Admin>) => api.update<Admin>('admins', id, data),
    delete: (id: string) => api.delete('admins', id),
  },

  teachers: {
    list: () => api.list<Teacher>('teachers'),
    getById: (id: string) => api.getById<Teacher>('teachers', id),
    create: (data: Omit<Teacher, '$id' | '$createdAt' | '$updatedAt' | '$permissions'>) => 
      api.create<Teacher>('teachers', data),
    update: (id: string, data: Partial<Teacher>) => api.update<Teacher>('teachers', id, data),
    delete: (id: string) => api.delete('teachers', id),
    getByEmail: (email: string) => api.list<Teacher>('teachers', [Query.equal('email', email)]),
  },

  parents: {
    list: () => api.list<Parent>('parents'),
    getById: (id: string) => api.getById<Parent>('parents', id),
    create: (data: Omit<Parent, '$id' | '$createdAt' | '$updatedAt' | '$permissions'>) => 
      api.create<Parent>('parents', data),
    update: (id: string, data: Partial<Parent>) => api.update<Parent>('parents', id, data),
    delete: (id: string) => api.delete('parents', id),
    getByEmail: (email: string) => api.list<Parent>('parents', [Query.equal('email', email)]),
  },

  subjects: {
    list: () => api.list<Subject>('subjects'),
    getById: (id: string) => api.getById<Subject>('subjects', id),
    create: (data: Omit<Subject, '$id' | '$createdAt' | '$updatedAt' | '$permissions'>) => 
      api.create<Subject>('subjects', data),
    update: (id: string, data: Partial<Subject>) => api.update<Subject>('subjects', id, data),
    delete: (id: string) => api.delete('subjects', id),
  },

  classes: {
    list: () => api.list<Class>('classes'),
    getById: (id: string) => api.getById<Class>('classes', id),
    create: (data: Omit<Class, '$id' | '$createdAt' | '$updatedAt' | '$permissions'>) => 
      api.create<Class>('classes', data),
    update: (id: string, data: Partial<Class>) => api.update<Class>('classes', id, data),
    delete: (id: string) => api.delete('classes', id),
    getBySupervisor: (supervisorId: string) => api.list<Class>('classes', [Query.equal('supervisorId', supervisorId)]),
  },

  students: {
    list: () => api.list<Student>('students'),
    getById: (id: string) => api.getById<Student>('students', id),
    create: (data: Omit<Student, '$id' | '$createdAt' | '$updatedAt' | '$permissions'>) => 
      api.create<Student>('students', data),
    update: (id: string, data: Partial<Student>) => api.update<Student>('students', id, data),
    delete: (id: string) => api.delete('students', id),
    getByClass: (classId: string) => api.list<Student>('students', [Query.equal('classId', classId)]),
    getByParent: (parentId: string) => api.list<Student>('students', [Query.equal('parentId', parentId)]),
    getByEmail: (email: string) => api.list<Student>('students', [Query.equal('email', email)]),
  },

  lessons: {
    list: () => api.list<Lesson>('lessons'),
    getById: (id: string) => api.getById<Lesson>('lessons', id),
    create: (data: Omit<Lesson, '$id' | '$createdAt' | '$updatedAt' | '$permissions'>) => 
      api.create<Lesson>('lessons', data),
    update: (id: string, data: Partial<Lesson>) => api.update<Lesson>('lessons', id, data),
    delete: (id: string) => api.delete('lessons', id),
    getByClass: (classId: string) => api.list<Lesson>('lessons', [Query.equal('classId', classId)]),
    getByTeacher: (teacherId: string) => api.list<Lesson>('lessons', [Query.equal('teacherId', teacherId)]),
    getBySubject: (subjectId: string) => api.list<Lesson>('lessons', [Query.equal('subjectId', subjectId)]),
    getByDay: (day: string) => api.list<Lesson>('lessons', [Query.equal('day', day)]),
  },

  exams: {
    list: () => api.list<Exam>('exams'),
    getById: (id: string) => api.getById<Exam>('exams', id),
    create: (data: Omit<Exam, '$id' | '$createdAt' | '$updatedAt' | '$permissions'>) => 
      api.create<Exam>('exams', data),
    update: (id: string, data: Partial<Exam>) => api.update<Exam>('exams', id, data),
    delete: (id: string) => api.delete('exams', id),
    getByLesson: (lessonId: string) => api.list<Exam>('exams', [Query.equal('lessonId', lessonId)]),
  },

  assignments: {
    list: () => api.list<Assignment>('assignments'),
    getById: (id: string) => api.getById<Assignment>('assignments', id),
    create: (data: Omit<Assignment, '$id' | '$createdAt' | '$updatedAt' | '$permissions'>) => 
      api.create<Assignment>('assignments', data),
    update: (id: string, data: Partial<Assignment>) => api.update<Assignment>('assignments', id, data),
    delete: (id: string) => api.delete('assignments', id),
    getByLesson: (lessonId: string) => api.list<Assignment>('assignments', [Query.equal('lessonId', lessonId)]),
  },

  results: {
    list: () => api.list<Result>('results'),
    getById: (id: string) => api.getById<Result>('results', id),
    create: (data: Omit<Result, '$id' | '$createdAt' | '$updatedAt' | '$permissions'>) => 
      api.create<Result>('results', data),
    update: (id: string, data: Partial<Result>) => api.update<Result>('results', id, data),
    delete: (id: string) => api.delete('results', id),
    getByStudent: (studentId: string) => api.list<Result>('results', [Query.equal('studentId', studentId)]),
    getByExam: (examId: string) => api.list<Result>('results', [Query.equal('examId', examId)]),
    getByAssignment: (assignmentId: string) => api.list<Result>('results', [Query.equal('assignmentId', assignmentId)]),
  },

  attendances: {
    list: () => api.list<Attendance>('attendances'),
    getById: (id: string) => api.getById<Attendance>('attendances', id),
    create: (data: Omit<Attendance, '$id' | '$createdAt' | '$updatedAt' | '$permissions'>) => 
      api.create<Attendance>('attendances', data),
    update: (id: string, data: Partial<Attendance>) => api.update<Attendance>('attendances', id, data),
    delete: (id: string) => api.delete('attendances', id),
    getByStudent: (studentId: string) => api.list<Attendance>('attendances', [Query.equal('studentId', studentId)]),
    getByLesson: (lessonId: string) => api.list<Attendance>('attendances', [Query.equal('lessonId', lessonId)]),
    getByDate: (date: string) => api.list<Attendance>('attendances', [Query.equal('date', date)]),
  },

  events: {
    list: () => api.list<Event>('events'),
    getById: (id: string) => api.getById<Event>('events', id),
    create: (data: Omit<Event, '$id' | '$createdAt' | '$updatedAt' | '$permissions'>) => 
      api.create<Event>('events', data),
    update: (id: string, data: Partial<Event>) => api.update<Event>('events', id, data),
    delete: (id: string) => api.delete('events', id),
    getByClass: (classId: string) => api.list<Event>('events', [Query.equal('classId', classId)]),
  },

  announcements: {
    list: () => api.list<Announcement>('announcements'),
    getById: (id: string) => api.getById<Announcement>('announcements', id),
    create: (data: Omit<Announcement, '$id' | '$createdAt' | '$updatedAt' | '$permissions'>) => 
      api.create<Announcement>('announcements', data),
    update: (id: string, data: Partial<Announcement>) => api.update<Announcement>('announcements', id, data),
    delete: (id: string) => api.delete('announcements', id),
    getByClass: (classId: string) => api.list<Announcement>('announcements', [Query.equal('classId', classId)]),
    getByAuthor: (authorId: string) => api.list<Announcement>('announcements', [Query.equal('authorId', authorId)]),
  },
};

export default api;
