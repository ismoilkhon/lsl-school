"use server";

import { revalidatePath } from "next/cache";
import {
  ClassSchema,
  ExamSchema,
  StudentSchema,
  SubjectSchema,
  TeacherSchema,
} from "./formValidationSchemas";
import { 
  createDocument, 
  updateDocument, 
  deleteDocument, 
  getDocuments,
  getDocument,
  COLLECTIONS,
  DATABASE_ID 
} from "./appwrite";
import { ID, Query } from "appwrite";

type CurrentState = { success: boolean; error: boolean };

// Helper function to handle Appwrite errors
const handleAppwriteError = (error: any) => {
  console.error('Appwrite error:', error);
  return { success: false, error: true };
};

export const createSubject = async (
  currentState: CurrentState,
  data: SubjectSchema
) => {
  try {
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
  try {
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
  try {
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
    // Create teacher document in Appwrite
    const teacherDoc = await createDocument(COLLECTIONS.TEACHERS, {
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

    // Note: In Appwrite, you'll need to handle user authentication separately
    // You might want to create an Appwrite user account here as well

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
  try {
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
  try {
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
    await createDocument(COLLECTIONS.EXAMS, {
      title: data.title,
      startTime: data.startTime,
      endTime: data.endTime,
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
    await updateDocument(COLLECTIONS.EXAMS, data.id.toString(), {
      title: data.title,
      startTime: data.startTime,
      endTime: data.endTime,
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
  try {
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
