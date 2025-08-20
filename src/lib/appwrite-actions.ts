"use server";

import { revalidatePath } from "next/cache";
import { cookies, headers } from "next/headers";
import { Client as WebClient, Account as WebAccount } from "appwrite";
import {
  ClassSchema,
  ExamSchema,
  StudentSchema,
  SubjectSchema,
  TeacherSchema,
} from "./formValidationSchemas";
import { 
  COLLECTIONS,
} from "./appwrite";
import { ID, Query } from "appwrite";
import { 
  adminCreateDocument as createDocument,
  adminUpdateDocument as updateDocument,
  adminDeleteDocument as deleteDocument,
  adminListDocuments as getDocuments,
  adminGetDocument as getDocument,
} from "./appwrite-admin";

type CurrentState = { success: boolean; error: boolean };

// Helper function to handle Appwrite errors
const handleAppwriteError = (error: any) => {
  console.error('Appwrite error:', error);
  return { success: false, error: true };
};

// Resolve current user's role on the server using the session cookie
const getServerUserRole = async (): Promise<string | null> => {
  try {
    const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '';
    if (!projectId) return null;
    const cookieName = `a_session_${projectId}`;
    const cookieStore = cookies();
    const sessionCookie = cookieStore.get(cookieName);
    if (!sessionCookie) return null;

    const client = new WebClient()
      .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1')
      .setProject(projectId)
      .setSession(sessionCookie.value);
    const account = new WebAccount(client);
    const user = await account.get();
    const role = (user as any)?.prefs?.role || 'student';
    return role;
  } catch (err) {
    console.warn('getServerUserRole failed:', err);
    return null;
  }
};

const ensureRole = async (...allowed: string[]) => {
  // First try to get role from the x-user-role header (set by middleware)
  const headerList = headers();
  const headerRole = headerList.get('x-user-role');
  
  console.log('ensureRole: Header role:', headerRole, 'Allowed roles:', allowed);
  
  if (headerRole && allowed.includes(headerRole)) {
    console.log('ensureRole: Using header role:', headerRole);
    return headerRole;
  }
  
  // Fallback to Appwrite session cookie method
  const role = await getServerUserRole();
  console.log('ensureRole: Session role:', role, 'Allowed roles:', allowed);
  
  if (!role || !allowed.includes(role)) {
    console.log('ensureRole: Access denied. Role:', role, 'Allowed:', allowed);
    throw new Error('forbidden');
  }
  return role;
};

// New function to check role from form data
const ensureRoleFromForm = (formData: FormData, ...allowed: string[]) => {
  const role = formData.get('userRole') as string;
  console.log('ensureRoleFromForm: Form role:', role, 'Allowed roles:', allowed);
  
  if (!role || !allowed.includes(role)) {
    console.log('ensureRoleFromForm: Access denied. Role:', role, 'Allowed:', allowed);
    throw new Error('forbidden');
  }
  return role;
};

// Normalizes various datetime inputs (Date|string) into an ISO 8601 string accepted by Appwrite
const normalizeToISODateTime = (value: unknown): string => {
  if (value instanceof Date) {
    if (isNaN(value.getTime())) throw new Error('Invalid Date');
    return value.toISOString();
  }
  if (typeof value === 'string') {
    // Handles values from <input type="datetime-local"> like "2025-08-20T12:34"
    const date = new Date(value);
    if (isNaN(date.getTime())) throw new Error('Invalid datetime string');
    return date.toISOString();
  }
  throw new Error('Unsupported datetime value');
};

export const createSubject = async (
  currentState: CurrentState,
  data: SubjectSchema
) => {
  try {
    await ensureRole('admin');
    await createDocument(COLLECTIONS.SUBJECTS, {
      name: data.name,
      // Note: Teacher relationships will be handled separately in Appwrite
    });

    revalidatePath("/list/subjects");
    return { success: true, error: false };
  } catch (err) {
    return handleAppwriteError(err);
  }
};

export const updateSubject = async (
  currentState: CurrentState,
  data: SubjectSchema
) => {
  if (!data.id) {
    return { success: false, error: true };
  }
  try {
    await ensureRole('admin');
    await updateDocument(COLLECTIONS.SUBJECTS, data.id.toString(), {
      name: data.name,
    });

    revalidatePath("/list/subjects");
    return { success: true, error: false };
  } catch (err) {
    return handleAppwriteError(err);
  }
};

export const deleteSubject = async (
  currentState: CurrentState,
  data: FormData
) => {
  const id = data.get("id") as string;
  if (!id) {
    console.error('Delete subject: No ID provided');
    return { success: false, error: true };
  }
  try {
    ensureRoleFromForm(data, 'admin');
    await deleteDocument(COLLECTIONS.SUBJECTS, id);

    revalidatePath("/list/subjects");
    return { success: true, error: false };
  } catch (err) {
    return handleAppwriteError(err);
  }
};

export const createClass = async (
  currentState: CurrentState,
  data: ClassSchema
) => {
  try {
    await ensureRole('admin');
    await createDocument(COLLECTIONS.CLASSES, {
      name: data.name,
      capacity: data.capacity,
      supervisorId: data.supervisorId || null,
      gradeId: data.gradeId,
    });

    revalidatePath("/list/classes");
    return { success: true, error: false };
  } catch (err) {
    return handleAppwriteError(err);
  }
};

export const updateClass = async (
  currentState: CurrentState,
  data: ClassSchema
) => {
  if (!data.id) {
    return { success: false, error: true };
  }
  try {
    await ensureRole('admin');
    await updateDocument(COLLECTIONS.CLASSES, data.id.toString(), {
      name: data.name,
      capacity: data.capacity,
      supervisorId: data.supervisorId || null,
      gradeId: data.gradeId,
    });

    revalidatePath("/list/classes");
    return { success: true, error: false };
  } catch (err) {
    return handleAppwriteError(err);
  }
};

export const deleteClass = async (
  currentState: CurrentState,
  data: FormData
) => {
  const id = data.get("id") as string;
  if (!id) {
    console.error('Delete class: No ID provided');
    return { success: false, error: true };
  }
  try {
    ensureRoleFromForm(data, 'admin');
    await deleteDocument(COLLECTIONS.CLASSES, id);

    revalidatePath("/list/classes");
    return { success: true, error: false };
  } catch (err) {
    return handleAppwriteError(err);
  }
};

export const createTeacher = async (
  currentState: CurrentState,
  data: TeacherSchema
) => {
  try {
    await ensureRole('admin');
    // Create teacher document in Appwrite
    await createDocument(COLLECTIONS.TEACHERS, {
      username: data.username,
      name: data.name,
      surname: data.surname,
      email: data.email || null,
      phone: data.phone || null,
      address: data.address,
      img: data.img || null,
      bloodType: data.bloodType,
      sex: data.sex,
      birthday: data.birthday,
      createdAt: new Date().toISOString(),
    });

    revalidatePath("/list/teachers");
    return { success: true, error: false };
  } catch (err) {
    return handleAppwriteError(err);
  }
};

export const updateTeacher = async (
  currentState: CurrentState,
  data: TeacherSchema
) => {
  if (!data.id) {
    return { success: false, error: true };
  }
  try {
    await ensureRole('admin');
    await updateDocument(COLLECTIONS.TEACHERS, data.id, {
      username: data.username,
      name: data.name,
      surname: data.surname,
      email: data.email || null,
      phone: data.phone || null,
      address: data.address,
      img: data.img || null,
      bloodType: data.bloodType,
      sex: data.sex,
      birthday: data.birthday,
    });

    revalidatePath("/list/teachers");
    return { success: true, error: false };
  } catch (err) {
    return handleAppwriteError(err);
  }
};

export const deleteTeacher = async (
  currentState: CurrentState,
  data: FormData
) => {
  const id = data.get("id") as string;
  if (!id) {
    console.error('Delete teacher: No ID provided');
    return { success: false, error: true };
  }
  try {
    ensureRoleFromForm(data, 'admin');
    await deleteDocument(COLLECTIONS.TEACHERS, id);

    revalidatePath("/list/teachers");
    return { success: true, error: false };
  } catch (err) {
    return handleAppwriteError(err);
  }
};

export const createStudent = async (
  currentState: CurrentState,
  data: StudentSchema
) => {
  try {
    await ensureRole('admin');
    // Check class capacity
    const classDoc = await getDocument(COLLECTIONS.CLASSES, data.classId.toString());
    if (!classDoc) {
      return { success: false, error: true };
    }

    // Count students in class
    const studentsInClass = await getDocuments(COLLECTIONS.STUDENTS, [
      Query.equal('classId', data.classId)
    ]);

    if (studentsInClass.documents.length >= classDoc.capacity) {
      return { success: false, error: true };
    }

    await createDocument(COLLECTIONS.STUDENTS, {
      username: data.username,
      name: data.name,
      surname: data.surname,
      email: data.email || null,
      phone: data.phone || null,
      address: data.address,
      img: data.img || null,
      bloodType: data.bloodType,
      sex: data.sex,
      birthday: data.birthday,
      gradeId: data.gradeId,
      classId: data.classId,
      parentId: data.parentId,
      createdAt: new Date().toISOString(),
    });

    revalidatePath("/list/students");
    return { success: true, error: false };
  } catch (err) {
    return handleAppwriteError(err);
  }
};

export const updateStudent = async (
  currentState: CurrentState,
  data: StudentSchema
) => {
  if (!data.id) {
    return { success: false, error: true };
  }
  try {
    await ensureRole('admin');
    await updateDocument(COLLECTIONS.STUDENTS, data.id, {
      username: data.username,
      name: data.name,
      surname: data.surname,
      email: data.email || null,
      phone: data.phone || null,
      address: data.address,
      img: data.img || null,
      bloodType: data.bloodType,
      sex: data.sex,
      birthday: data.birthday,
      gradeId: data.gradeId,
      classId: data.classId,
      parentId: data.parentId,
    });

    revalidatePath("/list/students");
    return { success: true, error: false };
  } catch (err) {
    return handleAppwriteError(err);
  }
};

export const deleteStudent = async (
  currentState: CurrentState,
  data: FormData
) => {
  const id = data.get("id") as string;
  if (!id) {
    console.error('Delete student: No ID provided');
    return { success: false, error: true };
  }
  try {
    ensureRoleFromForm(data, 'admin');
    await deleteDocument(COLLECTIONS.STUDENTS, id);

    revalidatePath("/list/students");
    return { success: true, error: false };
  } catch (err) {
    return handleAppwriteError(err);
  }
};

export const createExam = async (
  currentState: CurrentState,
  data: ExamSchema
) => {
  try {
    await ensureRole('admin');
    const startISO = normalizeToISODateTime(data.startTime as unknown as string);
    const endISO = normalizeToISODateTime(data.endTime as unknown as string);
    await createDocument(COLLECTIONS.EXAMS, {
      title: data.title,
      startTime: startISO,
      endTime: endISO,
      lessonId: data.lessonId,
    });

    revalidatePath("/list/exams");
    return { success: true, error: false };
  } catch (err) {
    return handleAppwriteError(err);
  }
};

export const updateExam = async (
  currentState: CurrentState,
  data: ExamSchema
) => {
  if (!data.id) {
    return { success: false, error: true };
  }
  try {
    await ensureRole('admin');
    const startISO = normalizeToISODateTime(data.startTime as unknown as string);
    const endISO = normalizeToISODateTime(data.endTime as unknown as string);
    await updateDocument(COLLECTIONS.EXAMS, data.id.toString(), {
      title: data.title,
      startTime: startISO,
      endTime: endISO,
      lessonId: data.lessonId,
    });

    revalidatePath("/list/exams");
    return { success: true, error: false };
  } catch (err) {
    return handleAppwriteError(err);
  }
};

export const deleteExam = async (
  currentState: CurrentState,
  data: FormData
) => {
  const id = data.get("id") as string;
  if (!id) {
    console.error('Delete exam: No ID provided');
    return { success: false, error: true };
  }
  try {
    ensureRoleFromForm(data, 'admin');
    await deleteDocument(COLLECTIONS.EXAMS, id);

    revalidatePath("/list/exams");
    return { success: true, error: false };
  } catch (err) {
    return handleAppwriteError(err);
  }
};

// Additional helper functions for data fetching
export const getStudents = async (queries?: string[]) => {
  try {
    return await getDocuments(COLLECTIONS.STUDENTS, queries);
  } catch (err) {
    console.error('Error fetching students:', err);
    return { documents: [], total: 0 };
  }
};

export const getTeachers = async (queries?: string[]) => {
  try {
    return await getDocuments(COLLECTIONS.TEACHERS, queries);
  } catch (err) {
    console.error('Error fetching teachers:', err);
    return { documents: [], total: 0 };
  }
};

export const getClasses = async (queries?: string[]) => {
  try {
    return await getDocuments(COLLECTIONS.CLASSES, queries);
  } catch (err) {
    console.error('Error fetching classes:', err);
    return { documents: [], total: 0 };
  }
};

export const getSubjects = async (queries?: string[]) => {
  try {
    return await getDocuments(COLLECTIONS.SUBJECTS, queries);
  } catch (err) {
    console.error('Error fetching subjects:', err);
    return { documents: [], total: 0 };
  }
};

export const getExams = async (queries?: string[]) => {
  try {
    return await getDocuments(COLLECTIONS.EXAMS, queries);
  } catch (err) {
    console.error('Error fetching exams:', err);
    return { documents: [], total: 0 };
  }
};

// Events CRUD
export const createEvent = async (
  currentState: CurrentState,
  data: { title: string; description: string; startTime: string; endTime: string; classId?: number | string | null; img?: string | null }
) => {
  try {
    await ensureRole('admin');
    const startISO = normalizeToISODateTime(data.startTime);
    const endISO = normalizeToISODateTime(data.endTime);
    const basePayload: any = {
      title: data.title,
      description: data.description,
      startTime: startISO,
      endTime: endISO,
      classId: data.classId ? Number(data.classId) : null,
    };
    const withImg = data.img ? { ...basePayload, img: data.img } : basePayload;
    try {
      await createDocument(COLLECTIONS.EVENTS, withImg);
    } catch (err: any) {
      // If collection doesn't have an 'img' attribute yet, retry without it
      const msg = err?.message || err?.response || '';
      if (msg.includes('Unknown attribute') || msg.includes('document_invalid_structure')) {
        await createDocument(COLLECTIONS.EVENTS, basePayload);
      } else {
        throw err;
      }
    }
    revalidatePath('/list/events');
    return { success: true, error: false };
  } catch (err) {
    return handleAppwriteError(err);
  }
};

export const updateEvent = async (
  currentState: CurrentState,
  data: { id: string; title: string; description: string; startTime: string; endTime: string; classId?: number | string | null; img?: string | null }
) => {
  if (!data.id) return { success: false, error: true };
  try {
    await ensureRole('admin');
    const startISO = normalizeToISODateTime(data.startTime);
    const endISO = normalizeToISODateTime(data.endTime);
    const basePayload: any = {
      title: data.title,
      description: data.description,
      startTime: startISO,
      endTime: endISO,
      classId: data.classId ? Number(data.classId) : null,
    };
    const withImg = data.img ? { ...basePayload, img: data.img } : basePayload;
    try {
      await updateDocument(COLLECTIONS.EVENTS, data.id, withImg);
    } catch (err: any) {
      const msg = err?.message || err?.response || '';
      if (msg.includes('Unknown attribute') || msg.includes('document_invalid_structure')) {
        await updateDocument(COLLECTIONS.EVENTS, data.id, basePayload);
      } else {
        throw err;
      }
    }
    revalidatePath('/list/events');
    return { success: true, error: false };
  } catch (err) {
    return handleAppwriteError(err);
  }
};

export const deleteEvent = async (
  currentState: CurrentState,
  data: FormData
) => {
  const id = data.get('id') as string;
  if (!id) {
    console.error('Delete event: No ID provided');
    return { success: false, error: true };
  }
  try {
    ensureRoleFromForm(data, 'admin');
    await deleteDocument(COLLECTIONS.EVENTS, id);
    revalidatePath('/list/events');
    return { success: true, error: false };
  } catch (err) {
    return handleAppwriteError(err);
  }
};

// Additional delete functions for other entities
export const deleteAnnouncement = async (
  currentState: CurrentState,
  data: FormData
) => {
  const id = data.get('id') as string;
  if (!id) {
    console.error('Delete announcement: No ID provided');
    return { success: false, error: true };
  }
  try {
    ensureRoleFromForm(data, 'admin');
    await deleteDocument(COLLECTIONS.ANNOUNCEMENTS, id);
    revalidatePath('/list/announcements');
    return { success: true, error: false };
  } catch (err) {
    return handleAppwriteError(err);
  }
};

export const deleteLesson = async (
  currentState: CurrentState,
  data: FormData
) => {
  const id = data.get('id') as string;
  if (!id) {
    console.error('Delete lesson: No ID provided');
    return { success: false, error: true };
  }
  try {
    ensureRoleFromForm(data, 'admin');
    await deleteDocument(COLLECTIONS.LESSONS, id);
    revalidatePath('/list/lessons');
    return { success: true, error: false };
  } catch (err) {
    return handleAppwriteError(err);
  }
};

export const deleteAssignment = async (
  currentState: CurrentState,
  data: FormData
) => {
  const id = data.get('id') as string;
  if (!id) {
    console.error('Delete assignment: No ID provided');
    return { success: false, error: true };
  }
  try {
    ensureRoleFromForm(data, 'admin');
    await deleteDocument(COLLECTIONS.ASSIGNMENTS, id);
    revalidatePath('/list/assignments');
    return { success: true, error: false };
  } catch (err) {
    return handleAppwriteError(err);
  }
};

export const deleteResult = async (
  currentState: CurrentState,
  data: FormData
) => {
  const id = data.get('id') as string;
  if (!id) {
    console.error('Delete result: No ID provided');
    return { success: false, error: true };
  }
  try {
    ensureRoleFromForm(data, 'admin');
    await deleteDocument(COLLECTIONS.RESULTS, id);
    revalidatePath('/list/results');
    return { success: true, error: false };
  } catch (err) {
    return handleAppwriteError(err);
  }
};

export const deleteAttendance = async (
  currentState: CurrentState,
  data: FormData
) => {
  const id = data.get('id') as string;
  if (!id) {
    console.error('Delete attendance: No ID provided');
    return { success: false, error: true };
  }
  try {
    ensureRoleFromForm(data, 'admin');
    await deleteDocument(COLLECTIONS.ATTENDANCES, id);
    revalidatePath('/list/attendances');
    return { success: true, error: false };
  } catch (err) {
    return handleAppwriteError(err);
  }
};

// Announcements CRUD
export const createAnnouncement = async (
  currentState: CurrentState,
  data: FormData
) => {
  try {
    ensureRoleFromForm(data, 'admin');
    const basePayload = {
      title: data.get('title') as string,
      description: data.get('description') as string,
      date: new Date(data.get('date') as string).toISOString(),
    };
    
    const extendedPayload = {
      ...basePayload,
      priority: data.get('priority') as string,
      targetAudience: data.get('targetAudience') as string,
    };
    
    try {
      await createDocument(COLLECTIONS.ANNOUNCEMENTS, extendedPayload);
    } catch (err: any) {
      // If collection doesn't have priority/targetAudience attributes yet, retry without them
      const msg = err?.message || err?.response || '';
      if (msg.includes('Unknown attribute') || msg.includes('document_invalid_structure')) {
        console.log('Announcement: Retrying without extended attributes');
        await createDocument(COLLECTIONS.ANNOUNCEMENTS, basePayload);
      } else {
        throw err;
      }
    }
    revalidatePath('/list/announcements');
    return { success: true, error: false };
  } catch (err) {
    return handleAppwriteError(err);
  }
};

export const updateAnnouncement = async (
  currentState: CurrentState,
  data: FormData
) => {
  const id = data.get('id') as string;
  if (!id) return { success: false, error: true };
  try {
    ensureRoleFromForm(data, 'admin');
    const basePayload = {
      title: data.get('title') as string,
      description: data.get('description') as string,
      date: new Date(data.get('date') as string).toISOString(),
    };
    
    const extendedPayload = {
      ...basePayload,
      priority: data.get('priority') as string,
      targetAudience: data.get('targetAudience') as string,
    };
    
    try {
      await updateDocument(COLLECTIONS.ANNOUNCEMENTS, id, extendedPayload);
    } catch (err: any) {
      // If collection doesn't have priority/targetAudience attributes yet, retry without them
      const msg = err?.message || err?.response || '';
      if (msg.includes('Unknown attribute') || msg.includes('document_invalid_structure')) {
        console.log('Announcement: Retrying update without extended attributes');
        await updateDocument(COLLECTIONS.ANNOUNCEMENTS, id, basePayload);
      } else {
        throw err;
      }
    }
    revalidatePath('/list/announcements');
    return { success: true, error: false };
  } catch (err) {
    return handleAppwriteError(err);
  }
};
