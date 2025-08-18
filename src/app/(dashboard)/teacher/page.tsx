"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/auth-store";
import Announcements from "@/components/Announcements";
import BigCalendarContainer from "@/components/BigCalendarContainer";

const TeacherPage = () => {
  const { user, loading, isAuthenticated, getUserRole } = useAuthStore();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const verifyAccess = async () => {
      if (!isAuthenticated && !loading) {
        router.push('/sign-in');
        return;
      }

      if (user) {
        const role = getUserRole();
        if (role !== 'teacher') {
          // Redirect to appropriate dashboard
          router.push(`/${role}`);
          return;
        }
        setIsAuthorized(true);
      }
    };

    if (!loading) {
      verifyAccess();
    }
  }, [user, loading, isAuthenticated, getUserRole, router]);

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
    <div className="flex-1 p-4 flex gap-4 flex-col">
      {/* Welcome Message */}
      <div className="w-full">
        <div className="bg-white p-4 rounded-md shadow-sm">
          <h1 className="text-2xl font-bold text-gray-800">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-gray-600">Teacher Dashboard</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex gap-4 flex-col xl:flex-row">
        {/* LEFT */}
        <div className="w-full xl:w-2/3">
          <div className="h-full bg-white p-4 rounded-md">
            <h1 className="text-xl font-semibold">My Schedule</h1>
            <BigCalendarContainer type="teacherId" id={user?.$id || ""} />
          </div>
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
                📚 View My Students
              </button>
              <button 
                onClick={() => router.push('/list/lessons')}
                className="w-full text-left p-3 bg-green-50 hover:bg-green-100 rounded-md transition-colors"
              >
                📅 Manage Lessons
              </button>
              <button 
                onClick={() => router.push('/list/exams')}
                className="w-full text-left p-3 bg-yellow-50 hover:bg-yellow-100 rounded-md transition-colors"
              >
                📝 Create Exams
              </button>
              <button 
                onClick={() => router.push('/list/assignments')}
                className="w-full text-left p-3 bg-purple-50 hover:bg-purple-100 rounded-md transition-colors"
              >
                📋 Assign Homework
              </button>
              <button 
                onClick={() => router.push('/list/attendances')}
                className="w-full text-left p-3 bg-red-50 hover:bg-red-100 rounded-md transition-colors"
              >
                ✅ Take Attendance
              </button>
            </div>
          </div>

          <Announcements />
        </div>
      </div>
    </div>
  );
};

export default TeacherPage;
