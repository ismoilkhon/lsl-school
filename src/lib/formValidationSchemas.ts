import { z } from "zod";

export const subjectSchema = z.object({
  id: z.coerce.number().optional(),
  name: z.string().min(1, { message: "Subject name is required!" }),
  code: z.string().min(1, { message: "Subject code is required!" }),
  description: z.string().optional(),
  credits: z.coerce.number().min(1, { message: "Credits must be at least 1!" }).max(10, { message: "Credits cannot exceed 10!" }).optional(),
  teachers: z.array(z.string()), //teacher ids
});

export type SubjectSchema = z.infer<typeof subjectSchema>;

export const classSchema = z.object({
  id: z.coerce.number().optional(),
  name: z.string().min(1, { message: "Subject name is required!" }),
  capacity: z.coerce.number().min(1, { message: "Capacity name is required!" }),
  supervisorId: z.coerce.string().optional(),
});

export type ClassSchema = z.infer<typeof classSchema>;

export const teacherSchema = z.object({
  id: z.string().optional(),
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters long!" })
    .max(20, { message: "Username must be at most 20 characters long!" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters long!" }).optional(),
  name: z.string().min(1, { message: "First name is required!" }),
  surname: z.string().min(1, { message: "Last name is required!" }),
  email: z
    .string()
    .email({ message: "Invalid email address!" })
    .optional()
    .or(z.literal("")),
  phone: z.string().optional(),
  address: z.string(),
  img: z.string().optional(),
  bloodType: z.string().min(1, { message: "Blood Type is required!" }),
  birthday: z.coerce.date({ message: "Birthday is required!" }),
  sex: z.enum(["MALE", "FEMALE"], { message: "Sex is required!" }),
  subjects: z.array(z.string()).optional(), // subject ids
});

export type TeacherSchema = z.infer<typeof teacherSchema>;

export const studentSchema = z.object({
  id: z.string().optional(),
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters long!" })
    .max(20, { message: "Username must be at most 20 characters long!" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters long!" }).optional(),
  name: z.string().min(1, { message: "First name is required!" }),
  surname: z.string().min(1, { message: "Last name is required!" }),
  email: z
    .string()
    .email({ message: "Invalid email address!" })
    .optional()
    .or(z.literal("")),
  phone: z.string().optional(),
  address: z.string(),
  img: z.string().optional(),
  bloodType: z.string().min(1, { message: "Blood Type is required!" }),
  birthday: z.coerce.date({ message: "Birthday is required!" }),
  sex: z.enum(["MALE", "FEMALE"], { message: "Sex is required!" }),
  classId: z.string().min(1, { message: "Class is required!" }),
  parentId: z.string().min(1, { message: "Parent Id is required!" }),
});

export type StudentSchema = z.infer<typeof studentSchema>;

export const parentSchema = z.object({
  id: z.string().optional(),
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters long!" })
    .max(20, { message: "Username must be at most 20 characters long!" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters long!" }).optional(),
  name: z.string().min(1, { message: "First name is required!" }),
  surname: z.string().min(1, { message: "Last name is required!" }),
  email: z
    .string()
    .email({ message: "Invalid email address!" })
    .optional()
    .or(z.literal("")),
  phone: z.string().optional(),
  address: z.string(),
  img: z.string().optional(),
  bloodType: z.string().min(1, { message: "Blood Type is required!" }),
  birthday: z.coerce.date({ message: "Birthday is required!" }),
  sex: z.enum(["MALE", "FEMALE"], { message: "Sex is required!" }),
});

export type ParentSchema = z.infer<typeof parentSchema>;

export const examSchema = z.object({
  id: z.coerce.number().optional(),
  title: z.string().min(1, { message: "Title is required!" }),
  description: z.string().optional(),
  startTime: z.coerce.date({ message: "Start time is required!" }),
  endTime: z.coerce.date({ message: "End time is required!" }),
  lessonId: z.coerce.number({ message: "Lesson is required!" }),
  maxScore: z.coerce.number().min(0, { message: "Max score must be zero or greater!" }).optional(),
});

export type ExamSchema = z.infer<typeof examSchema>;

export const attendanceSchema = z.object({
  id: z.string().optional(),
  date: z.coerce.date({ message: "Date is required!" }),
  studentId: z.string().min(1, { message: "Student is required!" }),
  lessonId: z.string().min(1, { message: "Lesson is required!" }),
  present: z.coerce.boolean(),
  notes: z.string().max(500, { message: "Notes cannot exceed 500 characters!" }).optional().or(z.literal("")),
});

export type AttendanceSchema = z.infer<typeof attendanceSchema>;

const weekDays = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
] as const;

export const lessonSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, { message: "Lesson name is required!" }),
  day: z.enum(weekDays, { message: "Day is required!" }),
  startTime: z.string().min(1, { message: "Start time is required!" }),
  endTime: z.string().min(1, { message: "End time is required!" }),
  subjectId: z.string().min(1, { message: "Subject is required!" }),
  classId: z.string().min(1, { message: "Class is required!" }),
  teacherId: z.string().min(1, { message: "Teacher is required!" }),
  room: z.string().optional(),
});

export type LessonSchema = z.infer<typeof lessonSchema>;

export const assignmentSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, { message: "Assignment title is required!" }),
  description: z.string().optional(),
  startDate: z.string().min(1, { message: "Start date is required!" }),
  dueDate: z.string().min(1, { message: "Due date is required!" }),
  lessonId: z.string().min(1, { message: "Lesson is required!" }),
  maxScore: z.coerce.number().min(0, { message: "Max score must be zero or greater!" }),
  isActive: z.coerce.boolean().optional(),
});

export type AssignmentSchema = z.infer<typeof assignmentSchema>;

export const resultSchema = z
  .object({
    id: z.string().optional(),
    score: z.coerce.number().min(0, { message: "Score must be zero or greater!" }),
    examId: z.string().optional(),
    assignmentId: z.string().optional(),
    studentId: z.string().min(1, { message: "Student is required!" }),
    submittedAt: z.string().min(1, { message: "Submission date is required!" }),
    comments: z.string().max(500, { message: "Comments cannot exceed 500 characters!" }).optional().or(z.literal("")),
  })
  .refine(
    (data) => data.examId || data.assignmentId,
    { message: "Select an exam or assignment", path: ["examId"] }
  )
  .refine(
    (data) => !(data.examId && data.assignmentId),
    { message: "Choose either an exam or an assignment, not both", path: ["assignmentId"] }
  );

export type ResultSchema = z.infer<typeof resultSchema>;

export const eventSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, { message: "Event title is required!" }),
  description: z.string().min(1, { message: "Description is required!" }),
  date: z.string().min(1, { message: "Date is required!" }),
  time: z.string().min(1, { message: "Time is required!" }),
  classId: z.string().optional(),
  location: z.string().min(1, { message: "Location is required!" }),
  category: z.enum(["Academic", "Sports", "Meeting", "Arts"], { message: "Category is required!" }),
  attendees: z.coerce.number().min(1, { message: "Attendees must be at least 1!" }),
  organizer: z.string().min(1, { message: "Organizer is required!" }),
  requirements: z.array(z.string()).optional(),
  img: z.string().optional(),
});

export type EventSchema = z.infer<typeof eventSchema>;

// Helper functions for date/time formatting
export function formatDateForInput(date?: string | Date): string {
  if (!date) return "";
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    if (isNaN(dateObj.getTime())) return "";
    return dateObj.toISOString().split('T')[0];
  } catch {
    return "";
  }
}

export function formatTimeRange(startTime?: string | Date, endTime?: string | Date): string {
  if (!startTime || !endTime) return "";
  try {
    const start = typeof startTime === 'string' ? new Date(startTime) : startTime;
    const end = typeof endTime === 'string' ? new Date(endTime) : endTime;
    
    if (isNaN(start.getTime()) || isNaN(end.getTime())) return "";
    
    const formatTime = (date: Date) => {
      const hours = date.getHours();
      const minutes = date.getMinutes();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const displayHours = hours % 12 || 12;
      const displayMinutes = minutes.toString().padStart(2, '0');
      return `${displayHours}:${displayMinutes} ${ampm}`;
    };
    
    return `${formatTime(start)} - ${formatTime(end)}`;
  } catch {
    return "";
  }
}

export function parseTimeRange(date: string, timeRange: string): { startTime: string; endTime: string } {
  try {
    // Parse time range like "9:00 AM - 4:00 PM"
    const [startTimeStr, endTimeStr] = timeRange.split(' - ').map(s => s.trim());
    
    const parseTime = (timeStr: string): { hours: number; minutes: number } => {
      const [time, period] = timeStr.split(' ');
      const [hours, minutes] = time.split(':').map(Number);
      let hour24 = hours;
      if (period === 'PM' && hours !== 12) hour24 = hours + 12;
      if (period === 'AM' && hours === 12) hour24 = 0;
      return { hours: hour24, minutes: minutes || 0 };
    };
    
    const start = parseTime(startTimeStr);
    const end = parseTime(endTimeStr);
    
    const startDate = new Date(date);
    startDate.setHours(start.hours, start.minutes, 0, 0);
    
    const endDate = new Date(date);
    endDate.setHours(end.hours, end.minutes, 0, 0);
    
    return {
      startTime: startDate.toISOString(),
      endTime: endDate.toISOString(),
    };
  } catch (error) {
    // Fallback: create dates with default times
    const startDate = new Date(date);
    startDate.setHours(9, 0, 0, 0);
    const endDate = new Date(date);
    endDate.setHours(17, 0, 0, 0);
    return {
      startTime: startDate.toISOString(),
      endTime: endDate.toISOString(),
    };
  }
}
