import { 
  getDocuments, 
  getDocument, 
  COLLECTIONS, 
  DATABASE_ID 
} from "./appwrite";
import { Query } from "appwrite";

// Helper function to build Appwrite queries
const buildQueries = (filters: Record<string, any> = {}) => {
  const queries: string[] = [];
  
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      if (typeof value === 'string' && value.includes('%')) {
        // Handle search queries - use contains instead of search for better compatibility
        const searchValue = value.replace(/%/g, '');
        if (searchValue) {
          queries.push(Query.contains(key, searchValue));
        }
      } else {
        queries.push(Query.equal(key, value));
      }
    }
  });
  
  return queries;
};

// Helper function to safely execute queries with fallback for build-time errors
const safeQuery = async <T>(queryFn: () => Promise<T>, fallback: T): Promise<T> => {
  try {
    return await queryFn();
  } catch (error: any) {
    // During build time or when not authenticated, return fallback
    if (error?.code === 401 || error?.code === 400 || process.env.NODE_ENV === 'production') {
      console.warn('Query failed (likely due to build-time execution), using fallback:', error.message);
      return fallback;
    }
    console.error('Unexpected query error:', error);
    return fallback;
  }
};

// Announcements
export const getAnnouncements = async (
  page: number = 1,
  limit: number = 10,
  filters: Record<string, any> = {}
) => {
  try {
    const queries = buildQueries(filters);
    queries.push(Query.limit(limit));
    queries.push(Query.offset((page - 1) * limit));
    queries.push(Query.orderDesc('$createdAt'));

    const response = await getDocuments(COLLECTIONS.ANNOUNCEMENTS, queries);
    
    // For role-based filtering, we'll need to handle this differently
    // since Appwrite doesn't have the same relational queries as Prisma
    return {
      data: response.documents,
      count: response.total,
    };
  } catch (error) {
    console.error('Error fetching announcements:', error);
    return { data: [], count: 0 };
  }
};

// Students
export const getStudents = async (
  page: number = 1,
  limit: number = 10,
  filters: Record<string, any> = {}
) => {
  try {
    const queries = buildQueries(filters);
    queries.push(Query.limit(limit));
    queries.push(Query.offset((page - 1) * limit));
    queries.push(Query.orderDesc('$createdAt'));

    const response = await getDocuments(COLLECTIONS.STUDENTS, queries);
    
    return {
      data: response.documents,
      count: response.total,
    };
  } catch (error) {
    console.error('Error fetching students:', error);
    return { data: [], count: 0 };
  }
};

export const getStudentById = async (id: string) => {
  try {
    return await getDocument(COLLECTIONS.STUDENTS, id);
  } catch (error) {
    console.error('Error fetching student:', error);
    return null;
  }
};

// Teachers
export const getTeachers = async (
  page: number = 1,
  limit: number = 10,
  filters: Record<string, any> = {}
) => {
  try {
    const queries = buildQueries(filters);
    queries.push(Query.limit(limit));
    queries.push(Query.offset((page - 1) * limit));
    queries.push(Query.orderDesc('$createdAt'));

    const response = await getDocuments(COLLECTIONS.TEACHERS, queries);
    
    return {
      data: response.documents,
      count: response.total,
    };
  } catch (error) {
    console.error('Error fetching teachers:', error);
    return { data: [], count: 0 };
  }
};

export const getTeacherById = async (id: string) => {
  try {
    return await getDocument(COLLECTIONS.TEACHERS, id);
  } catch (error) {
    console.error('Error fetching teacher:', error);
    return null;
  }
};

// Classes
export const getClasses = async (
  page: number = 1,
  limit: number = 10,
  filters: Record<string, any> = {}
) => {
  try {
    const queries = buildQueries(filters);
    queries.push(Query.limit(limit));
    queries.push(Query.offset((page - 1) * limit));
    queries.push(Query.orderDesc('$createdAt'));

    const response = await getDocuments(COLLECTIONS.CLASSES, queries);
    
    return {
      data: response.documents,
      count: response.total,
    };
  } catch (error) {
    console.error('Error fetching classes:', error);
    return { data: [], count: 0 };
  }
};

// Subjects
export const getSubjects = async (
  page: number = 1,
  limit: number = 10,
  filters: Record<string, any> = {}
) => {
  try {
    const queries = buildQueries(filters);
    queries.push(Query.limit(limit));
    queries.push(Query.offset((page - 1) * limit));
    queries.push(Query.orderDesc('$createdAt'));

    const response = await getDocuments(COLLECTIONS.SUBJECTS, queries);
    
    return {
      data: response.documents,
      count: response.total,
    };
  } catch (error) {
    console.error('Error fetching subjects:', error);
    return { data: [], count: 0 };
  }
};

// Lessons
export const getLessons = async (
  page: number = 1,
  limit: number = 10,
  filters: Record<string, any> = {}
) => {
  try {
    const queries = buildQueries(filters);
    queries.push(Query.limit(limit));
    queries.push(Query.offset((page - 1) * limit));
    queries.push(Query.orderDesc('$createdAt'));

    const response = await getDocuments(COLLECTIONS.LESSONS, queries);
    
    return {
      data: response.documents,
      count: response.total,
    };
  } catch (error) {
    console.error('Error fetching lessons:', error);
    return { data: [], count: 0 };
  }
};

// Exams
export const getExams = async (
  page: number = 1,
  limit: number = 10,
  filters: Record<string, any> = {}
) => {
  try {
    const queries = buildQueries(filters);
    queries.push(Query.limit(limit));
    queries.push(Query.offset((page - 1) * limit));
    queries.push(Query.orderDesc('$createdAt'));

    const response = await getDocuments(COLLECTIONS.EXAMS, queries);
    
    return {
      data: response.documents,
      count: response.total,
    };
  } catch (error) {
    console.error('Error fetching exams:', error);
    return { data: [], count: 0 };
  }
};

// Assignments
export const getAssignments = async (
  page: number = 1,
  limit: number = 10,
  filters: Record<string, any> = {}
) => {
  try {
    const queries = buildQueries(filters);
    queries.push(Query.limit(limit));
    queries.push(Query.offset((page - 1) * limit));
    queries.push(Query.orderDesc('$createdAt'));

    const response = await getDocuments(COLLECTIONS.ASSIGNMENTS, queries);
    
    return {
      data: response.documents,
      count: response.total,
    };
  } catch (error) {
    console.error('Error fetching assignments:', error);
    return { data: [], count: 0 };
  }
};

// Results
export const getResults = async (
  page: number = 1,
  limit: number = 10,
  filters: Record<string, any> = {}
) => {
  try {
    const queries = buildQueries(filters);
    queries.push(Query.limit(limit));
    queries.push(Query.offset((page - 1) * limit));
    queries.push(Query.orderDesc('$createdAt'));

    const response = await getDocuments(COLLECTIONS.RESULTS, queries);
    
    return {
      data: response.documents,
      count: response.total,
    };
  } catch (error) {
    console.error('Error fetching results:', error);
    return { data: [], count: 0 };
  }
};

// Events
export const getEvents = async (
  page: number = 1,
  limit: number = 10,
  filters: Record<string, any> = {}
) => {
  try {
    const queries = buildQueries(filters);
    queries.push(Query.limit(limit));
    queries.push(Query.offset((page - 1) * limit));
    queries.push(Query.orderDesc('$createdAt'));

    const response = await getDocuments(COLLECTIONS.EVENTS, queries);
    
    return {
      data: response.documents,
      count: response.total,
    };
  } catch (error) {
    console.error('Error fetching events:', error);
    return { data: [], count: 0 };
  }
};

// Parents
export const getParents = async (
  page: number = 1,
  limit: number = 10,
  filters: Record<string, any> = {}
) => {
  try {
    const queries = buildQueries(filters);
    queries.push(Query.limit(limit));
    queries.push(Query.offset((page - 1) * limit));
    queries.push(Query.orderDesc('$createdAt'));

    const response = await getDocuments(COLLECTIONS.PARENTS, queries);
    
    return {
      data: response.documents,
      count: response.total,
    };
  } catch (error) {
    console.error('Error fetching parents:', error);
    return { data: [], count: 0 };
  }
};

// Grades
export const getGrades = async (
  page: number = 1,
  limit: number = 10,
  filters: Record<string, any> = {}
) => {
  try {
    const queries = buildQueries(filters);
    queries.push(Query.limit(limit));
    queries.push(Query.offset((page - 1) * limit));
    queries.push(Query.orderDesc('$createdAt'));

    const response = await getDocuments(COLLECTIONS.GRADES, queries);
    
    return {
      data: response.documents,
      count: response.total,
    };
  } catch (error) {
    console.error('Error fetching grades:', error);
    return { data: [], count: 0 };
  }
};

// Attendances
export const getAttendances = async (
  page: number = 1,
  limit: number = 10,
  filters: Record<string, any> = {}
) => {
  try {
    const queries = buildQueries(filters);
    queries.push(Query.limit(limit));
    queries.push(Query.offset((page - 1) * limit));
    queries.push(Query.orderDesc('$createdAt'));

    const response = await getDocuments(COLLECTIONS.ATTENDANCES, queries);
    
    return {
      data: response.documents,
      count: response.total,
    };
  } catch (error) {
    console.error('Error fetching attendances:', error);
    return { data: [], count: 0 };
  }
};
