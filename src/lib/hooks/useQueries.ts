import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Admin, Teacher, Parent, Subject, Class, Student,
  Lesson, Exam, Assignment, Result, Attendance, Event, Announcement
} from '@/lib/client-api';
import { clientApi } from '@/lib/client-api';

export const queryKeys = {
  admins: ['admins'] as const,
  admin: (id: string) => ['admin', id] as const,
  teachers: ['teachers'] as const,
  teacher: (id: string) => ['teacher', id] as const,
  parents: ['parents'] as const,
  parent: (id: string) => ['parent', id] as const,
  subjects: ['subjects'] as const,
  subject: (id: string) => ['subject', id] as const,
  classes: ['classes'] as const,
  class: (id: string) => ['class', id] as const,
  students: ['students'] as const,
  student: (id: string) => ['student', id] as const,
  studentsByClass: (classId: string) => ['students', 'class', classId] as const,
  studentsByParent: (parentId: string) => ['students', 'parent', parentId] as const,
  lessons: ['lessons'] as const,
  lesson: (id: string) => ['lesson', id] as const,
  lessonsByClass: (classId: string) => ['lessons', 'class', classId] as const,
  lessonsByTeacher: (teacherId: string) => ['lessons', 'teacher', teacherId] as const,
  lessonsBySubject: (subjectId: string) => ['lessons', 'subject', subjectId] as const,
  exams: ['exams'] as const,
  exam: (id: string) => ['exam', id] as const,
  examsByLesson: (lessonId: string) => ['exams', 'lesson', lessonId] as const,
  assignments: ['assignments'] as const,
  assignment: (id: string) => ['assignment', id] as const,
  assignmentsByLesson: (lessonId: string) => ['assignments', 'lesson', lessonId] as const,
  results: ['results'] as const,
  result: (id: string) => ['result', id] as const,
  resultsByStudent: (studentId: string) => ['results', 'student', studentId] as const,
  resultsByExam: (examId: string) => ['results', 'exam', examId] as const,
  resultsByAssignment: (assignmentId: string) => ['results', 'assignment', assignmentId] as const,
  attendances: ['attendances'] as const,
  attendance: (id: string) => ['attendance', id] as const,
  attendancesByStudent: (studentId: string) => ['attendances', 'student', studentId] as const,
  attendancesByLesson: (lessonId: string) => ['attendances', 'lesson', lessonId] as const,
  events: ['events'] as const,
  event: (id: string) => ['event', id] as const,
  eventsByClass: (classId: string) => ['events', 'class', classId] as const,
  announcements: ['announcements'] as const,
  announcement: (id: string) => ['announcement', id] as const,
  announcementsByClass: (classId: string) => ['announcements', 'class', classId] as const,
  announcementsByAuthor: (authorId: string) => ['announcements', 'author', authorId] as const,
} as const;

// Admin Hooks
export const useAdmins = () => {
  return useQuery({
    queryKey: queryKeys.admins,
    queryFn: clientApi.admins.list,
  });
};

export const useAdmin = (id: string) => {
  return useQuery({
    queryKey: queryKeys.admin(id),
    queryFn: () => clientApi.admins.getById(id),
    enabled: !!id,
  });
};

export const useCreateAdmin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<Admin, '$id' | '$createdAt' | '$updatedAt' | '$permissions'>) =>
      clientApi.admins.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admins });
    },
  });
};

export const useUpdateAdmin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Admin> }) =>
      clientApi.admins.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admins });
      queryClient.invalidateQueries({ queryKey: queryKeys.admin(id) });
    },
  });
};

export const useDeleteAdmin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => clientApi.admins.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admins });
    },
  });
};

// Teacher Hooks
export const useTeachers = () => {
  return useQuery({
    queryKey: queryKeys.teachers,
    queryFn: clientApi.teachers.list,
  });
};

export const useTeacher = (id: string) => {
  return useQuery({
    queryKey: queryKeys.teacher(id),
    queryFn: () => clientApi.teachers.getById(id),
    enabled: !!id,
  });
};

export const useCreateTeacher = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<Teacher, '$id' | '$createdAt' | '$updatedAt' | '$permissions'>) =>
      clientApi.teachers.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.teachers });
    },
  });
};

export const useUpdateTeacher = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Teacher> }) =>
      clientApi.teachers.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.teachers });
      queryClient.invalidateQueries({ queryKey: queryKeys.teacher(id) });
    },
  });
};

export const useDeleteTeacher = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => clientApi.teachers.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.teachers });
    },
  });
};

// Parent Hooks
export const useParents = () => {
  return useQuery({
    queryKey: queryKeys.parents,
    queryFn: clientApi.parents.list,
  });
};

export const useParent = (id: string) => {
  return useQuery({
    queryKey: queryKeys.parent(id),
    queryFn: () => clientApi.parents.getById(id),
    enabled: !!id,
  });
};

export const useCreateParent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<Parent, '$id' | '$createdAt' | '$updatedAt' | '$permissions'>) =>
      clientApi.parents.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.parents });
    },
  });
};

export const useUpdateParent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Parent> }) =>
      clientApi.parents.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.parents });
      queryClient.invalidateQueries({ queryKey: queryKeys.parent(id) });
    },
  });
};

export const useDeleteParent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => clientApi.parents.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.parents });
    },
  });
};

// Subject Hooks
export const useSubjects = () => {
  return useQuery({
    queryKey: queryKeys.subjects,
    queryFn: clientApi.subjects.list,
  });
};

export const useSubject = (id: string) => {
  return useQuery({
    queryKey: queryKeys.subject(id),
    queryFn: () => clientApi.subjects.getById(id),
    enabled: !!id,
  });
};

export const useCreateSubject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<Subject, '$id' | '$createdAt' | '$updatedAt' | '$permissions'>) =>
      clientApi.subjects.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.subjects });
    },
  });
};

export const useUpdateSubject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Subject> }) =>
      clientApi.subjects.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.subjects });
      queryClient.invalidateQueries({ queryKey: queryKeys.subject(id) });
    },
  });
};

export const useDeleteSubject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => clientApi.subjects.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.subjects });
    },
  });
};

// Class Hooks
export const useClasses = () => {
  return useQuery({
    queryKey: queryKeys.classes,
    queryFn: clientApi.classes.list,
  });
};

export const useClass = (id: string) => {
  return useQuery({
    queryKey: queryKeys.class(id),
    queryFn: () => clientApi.classes.getById(id),
    enabled: !!id,
  });
};

export const useCreateClass = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<Class, '$id' | '$createdAt' | '$updatedAt' | '$permissions'>) =>
      clientApi.classes.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.classes });
    },
  });
};

export const useUpdateClass = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Class> }) =>
      clientApi.classes.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.classes });
      queryClient.invalidateQueries({ queryKey: queryKeys.class(id) });
    },
  });
};

export const useDeleteClass = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => clientApi.classes.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.classes });
    },
  });
};

// Student Hooks
export const useStudents = () => {
  return useQuery({
    queryKey: queryKeys.students,
    queryFn: clientApi.students.list,
  });
};

export const useStudent = (id: string) => {
  return useQuery({
    queryKey: queryKeys.student(id),
    queryFn: () => clientApi.students.getById(id),
    enabled: !!id,
  });
};

export const useCreateStudent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<Student, '$id' | '$createdAt' | '$updatedAt' | '$permissions'>) =>
      clientApi.students.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.students });
    },
  });
};

export const useUpdateStudent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Student> }) =>
      clientApi.students.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.students });
      queryClient.invalidateQueries({ queryKey: queryKeys.student(id) });
    },
  });
};

export const useDeleteStudent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => clientApi.students.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.students });
    },
  });
};

export const useStudentsByClass = (classId: string) => {
  return useQuery({
    queryKey: queryKeys.studentsByClass(classId),
    queryFn: () => clientApi.students.getByClass(classId),
    enabled: !!classId,
  });
};

export const useStudentsByParent = (parentId: string) => {
  return useQuery({
    queryKey: queryKeys.studentsByParent(parentId),
    queryFn: () => clientApi.students.getByParent(parentId),
    enabled: !!parentId,
  });
};

// Lesson Hooks
export const useLessons = () => {
  return useQuery({
    queryKey: queryKeys.lessons,
    queryFn: clientApi.lessons.list,
  });
};

export const useLesson = (id: string) => {
  return useQuery({
    queryKey: queryKeys.lesson(id),
    queryFn: () => clientApi.lessons.getById(id),
    enabled: !!id,
  });
};

export const useCreateLesson = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<Lesson, '$id' | '$createdAt' | '$updatedAt' | '$permissions'>) =>
      clientApi.lessons.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.lessons });
    },
  });
};

export const useUpdateLesson = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Lesson> }) =>
      clientApi.lessons.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.lessons });
      queryClient.invalidateQueries({ queryKey: queryKeys.lesson(id) });
    },
  });
};

export const useDeleteLesson = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => clientApi.lessons.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.lessons });
    },
  });
};

export const useLessonsByClass = (classId: string) => {
  return useQuery({
    queryKey: queryKeys.lessonsByClass(classId),
    queryFn: () => clientApi.lessons.getByClass(classId),
    enabled: !!classId,
  });
};

export const useLessonsByTeacher = (teacherId: string) => {
  return useQuery({
    queryKey: queryKeys.lessonsByTeacher(teacherId),
    queryFn: () => clientApi.lessons.getByTeacher(teacherId),
    enabled: !!teacherId,
  });
};

export const useLessonsBySubject = (subjectId: string) => {
  return useQuery({
    queryKey: queryKeys.lessonsBySubject(subjectId),
    queryFn: () => clientApi.lessons.getBySubject(subjectId),
    enabled: !!subjectId,
  });
};

// Exam Hooks
export const useExams = () => {
  return useQuery({
    queryKey: queryKeys.exams,
    queryFn: clientApi.exams.list,
  });
};

export const useExam = (id: string) => {
  return useQuery({
    queryKey: queryKeys.exam(id),
    queryFn: () => clientApi.exams.getById(id),
    enabled: !!id,
  });
};

export const useCreateExam = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<Exam, '$id' | '$createdAt' | '$updatedAt' | '$permissions'>) =>
      clientApi.exams.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.exams });
    },
  });
};

export const useUpdateExam = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Exam> }) =>
      clientApi.exams.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.exams });
      queryClient.invalidateQueries({ queryKey: queryKeys.exam(id) });
    },
  });
};

export const useDeleteExam = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => clientApi.exams.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.exams });
    },
  });
};

export const useExamsByLesson = (lessonId: string) => {
  return useQuery({
    queryKey: queryKeys.examsByLesson(lessonId),
    queryFn: () => clientApi.exams.getByLesson(lessonId),
    enabled: !!lessonId,
  });
};

// Assignment Hooks
export const useAssignments = () => {
  return useQuery({
    queryKey: queryKeys.assignments,
    queryFn: clientApi.assignments.list,
  });
};

export const useAssignment = (id: string) => {
  return useQuery({
    queryKey: queryKeys.assignment(id),
    queryFn: () => clientApi.assignments.getById(id),
    enabled: !!id,
  });
};

export const useCreateAssignment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<Assignment, '$id' | '$createdAt' | '$updatedAt' | '$permissions'>) =>
      clientApi.assignments.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.assignments });
    },
  });
};

export const useUpdateAssignment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Assignment> }) =>
      clientApi.assignments.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.assignments });
      queryClient.invalidateQueries({ queryKey: queryKeys.assignment(id) });
    },
  });
};

export const useDeleteAssignment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => clientApi.assignments.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.assignments });
    },
  });
};

export const useAssignmentsByLesson = (lessonId: string) => {
  return useQuery({
    queryKey: queryKeys.assignmentsByLesson(lessonId),
    queryFn: () => clientApi.assignments.getByLesson(lessonId),
    enabled: !!lessonId,
  });
};

// Result Hooks
export const useResults = () => {
  return useQuery({
    queryKey: queryKeys.results,
    queryFn: clientApi.results.list,
  });
};

export const useResult = (id: string) => {
  return useQuery({
    queryKey: queryKeys.result(id),
    queryFn: () => clientApi.results.getById(id),
    enabled: !!id,
  });
};

export const useCreateResult = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<Result, '$id' | '$createdAt' | '$updatedAt' | '$permissions'>) =>
      clientApi.results.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.results });
    },
  });
};

export const useUpdateResult = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Result> }) =>
      clientApi.results.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.results });
      queryClient.invalidateQueries({ queryKey: queryKeys.result(id) });
    },
  });
};

export const useDeleteResult = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => clientApi.results.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.results });
    },
  });
};

export const useResultsByStudent = (studentId: string) => {
  return useQuery({
    queryKey: queryKeys.resultsByStudent(studentId),
    queryFn: () => clientApi.results.getByStudent(studentId),
    enabled: !!studentId,
  });
};

export const useResultsByExam = (examId: string) => {
  return useQuery({
    queryKey: queryKeys.resultsByExam(examId),
    queryFn: () => clientApi.results.getByExam(examId),
    enabled: !!examId,
  });
};

export const useResultsByAssignment = (assignmentId: string) => {
  return useQuery({
    queryKey: queryKeys.resultsByAssignment(assignmentId),
    queryFn: () => clientApi.results.getByAssignment(assignmentId),
    enabled: !!assignmentId,
  });
};

// Attendance Hooks
export const useAttendances = () => {
  return useQuery({
    queryKey: queryKeys.attendances,
    queryFn: clientApi.attendances.list,
  });
};

export const useAttendance = (id: string) => {
  return useQuery({
    queryKey: queryKeys.attendance(id),
    queryFn: () => clientApi.attendances.getById(id),
    enabled: !!id,
  });
};

export const useCreateAttendance = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<Attendance, '$id' | '$createdAt' | '$updatedAt' | '$permissions'>) =>
      clientApi.attendances.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.attendances });
    },
  });
};

export const useUpdateAttendance = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Attendance> }) =>
      clientApi.attendances.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.attendances });
      queryClient.invalidateQueries({ queryKey: queryKeys.attendance(id) });
    },
  });
};

export const useDeleteAttendance = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => clientApi.attendances.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.attendances });
    },
  });
};

export const useAttendancesByStudent = (studentId: string) => {
  return useQuery({
    queryKey: queryKeys.attendancesByStudent(studentId),
    queryFn: () => clientApi.attendances.getByStudent(studentId),
    enabled: !!studentId,
  });
};

export const useAttendancesByLesson = (lessonId: string) => {
  return useQuery({
    queryKey: queryKeys.attendancesByLesson(lessonId),
    queryFn: () => clientApi.attendances.getByLesson(lessonId),
    enabled: !!lessonId,
  });
};

// Event Hooks
export const useEvents = () => {
  return useQuery({
    queryKey: queryKeys.events,
    queryFn: clientApi.events.list,
  });
};

export const useEvent = (id: string) => {
  return useQuery({
    queryKey: queryKeys.event(id),
    queryFn: () => clientApi.events.getById(id),
    enabled: !!id,
  });
};

export const useCreateEvent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<Event, '$id' | '$createdAt' | '$updatedAt' | '$permissions'>) =>
      clientApi.events.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.events });
    },
  });
};

export const useUpdateEvent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Event> }) =>
      clientApi.events.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.events });
      queryClient.invalidateQueries({ queryKey: queryKeys.event(id) });
    },
  });
};

export const useDeleteEvent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => clientApi.events.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.events });
    },
  });
};

export const useEventsByClass = (classId: string) => {
  return useQuery({
    queryKey: queryKeys.eventsByClass(classId),
    queryFn: () => clientApi.events.getByClass(classId),
    enabled: !!classId,
  });
};

// Announcement Hooks
export const useAnnouncements = () => {
  return useQuery({
    queryKey: queryKeys.announcements,
    queryFn: clientApi.announcements.list,
  });
};

export const useAnnouncement = (id: string) => {
  return useQuery({
    queryKey: queryKeys.announcement(id),
    queryFn: () => clientApi.announcements.getById(id),
    enabled: !!id,
  });
};

export const useCreateAnnouncement = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<Announcement, '$id' | '$createdAt' | '$updatedAt' | '$permissions'>) =>
      clientApi.announcements.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.announcements });
    },
  });
};

export const useUpdateAnnouncement = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Announcement> }) =>
      clientApi.announcements.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.announcements });
      queryClient.invalidateQueries({ queryKey: queryKeys.announcement(id) });
    },
  });
};

export const useDeleteAnnouncement = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => clientApi.announcements.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.announcements });
    },
  });
};

export const useAnnouncementsByClass = (classId: string) => {
  return useQuery({
    queryKey: queryKeys.announcementsByClass(classId),
    queryFn: () => clientApi.announcements.getByClass(classId),
    enabled: !!classId,
  });
};

export const useAnnouncementsByAuthor = (authorId: string) => {
  return useQuery({
    queryKey: queryKeys.announcementsByAuthor(authorId),
    queryFn: () => clientApi.announcements.getByAuthor(authorId),
    enabled: !!authorId,
  });
};
