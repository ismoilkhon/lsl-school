"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/auth-store";
import Announcements from "@/components/Announcements";
import BigCalendarContainer from "@/components/BigCalendarContainer";
import { getDocuments, COLLECTIONS } from "@/lib/appwrite";
import { Query } from "appwrite";

const ParentPage = () => {
  const { user, loading, isAuthenticated, getUserRole } = useAuthStore();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [students, setStudents] = useState<any[]>([]);
  const [loadingStudents, setLoadingStudents] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const verifyAccess = async () => {
      if (!isAuthenticated && !loading) {
        router.push('/sign-in');
        return;
      }

      if (user) {
        const role = getUserRole();
        if (role !== 'parent') {
          // Redirect to appropriate dashboard
          router.push(`/${role}`);
          return;
        }
        setIsAuthorized(true);
        
        // Load parent's children
        await loadStudents();
      }
    };

    if (!loading) {
      verifyAccess();
    }
  }, [user, loading, isAuthenticated, getUserRole, router]);

  const loadStudents = async () => {
    if (!user) return;
    
    setLoadingStudents(true);
    try {
      const studentsRes = await getDocuments(COLLECTIONS.STUDENTS, [
        Query.equal('parentId', user.$id),
      ]);
      setStudents(studentsRes.documents);
    } catch (error) {
      console.warn('Failed to fetch students:', error);
      setStudents([]);
    } finally {
      setLoadingStudents(false);
    }
  };

  // Show loading while checking authentication
  if (loading || !isAuthorized) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 flex gap-4 flex-col">
      {/* Welcome Message */}
      <div className="w-full">
        <div className="bg-white p-4 rounded-md shadow-sm">
          <h1 className="text-2xl font-bold text-gray-800">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-gray-600">Parent Dashboard</p>
          {loadingStudents ? (
            <p className="text-sm text-gray-500 mt-2">Loading your children's information...</p>
          ) : (
            <p className="text-sm text-gray-500 mt-2">
              Monitoring {students.length} {students.length === 1 ? 'child' : 'children'}
            </p>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex gap-4 flex-col xl:flex-row">
        {/* LEFT - Children's Schedules */}
        <div className="w-full xl:w-2/3 space-y-6">
          {loadingStudents ? (
            <div className="bg-white p-8 rounded-md text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading children's schedules...</p>
            </div>
          ) : students.length > 0 ? (
            students.map((student) => (
              <div key={student.$id} className="bg-white p-4 rounded-md">
                <h2 className="text-xl font-semibold mb-4">
                  {student.name} {student.surname}'s Schedule
                </h2>
                <BigCalendarContainer type="classId" id={student.classId} />
              </div>
            ))
          ) : (
            <div className="bg-white p-8 rounded-md text-center">
              <p className="text-gray-600">No children found in your account.</p>
              <p className="text-sm text-gray-500 mt-2">
                Please contact the school administration to link your children to your account.
              </p>
            </div>
          )}
        </div>
        
        {/* RIGHT */}
        <div className="w-full xl:w-1/3 flex flex-col gap-8">
          {/* Quick Actions */}
          <div className="bg-white p-4 rounded-md shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
            <div className="space-y-2">
              <button 
                onClick={() => router.push('/list/students')}
                className="w-full text-left p-3 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors"
              >
                👨‍👩‍👧‍👦 View My Children
              </button>
              <button 
                onClick={() => router.push('/list/results')}
                className="w-full text-left p-3 bg-green-50 hover:bg-green-100 rounded-md transition-colors"
              >
                📊 Academic Results
              </button>
              <button 
                onClick={() => router.push('/list/attendances')}
                className="w-full text-left p-3 bg-yellow-50 hover:bg-yellow-100 rounded-md transition-colors"
              >
                📅 Attendance Records
              </button>
              <button 
                onClick={() => router.push('/list/events')}
                className="w-full text-left p-3 bg-purple-50 hover:bg-purple-100 rounded-md transition-colors"
              >
                🎉 School Events
              </button>
            </div>
          </div>

          <Announcements />
        </div>
      </div>
    </div>
  );
};

export default ParentPage;
