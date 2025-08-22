import Link from "next/link";
import Announcements from "@/components/Announcements";
import BigCalendarContainer from "@/components/BigCalendarContainer";
import { getCurrentServerUser } from "@/lib/server-auth";
import { redirect } from "next/navigation";

export default async function TeacherPage() {
  // Get current user
  const currentUser = await getCurrentServerUser();
  
  if (!currentUser) {
    redirect('/sign-in');
  }

  // Check if user has teacher role
  const userRole = (currentUser.prefs?.role || 'student').toLowerCase();
  if (userRole !== 'teacher') {
    redirect(`/${userRole}`);
  }

  // If you have server auth, fetch teacherId here; fallback to no data
  const teacherId: string | number = "";

  return (
    <div className="flex-1 p-4 flex gap-4 flex-col">
      {/* Welcome Message */}
      <div className="w-full">
        <div className="bg-white p-4 rounded-md shadow-sm">
          <h1 className="text-2xl font-bold text-gray-800">Welcome back, {currentUser.name}!</h1>
          <p className="text-gray-600">Teacher Dashboard</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex gap-4 flex-col xl:flex-row">
        {/* LEFT */}
        <div className="w-full xl:w-2/3">
          <div className="h-full bg-white p-4 rounded-md">
            <h1 className="text-xl font-semibold">My Schedule</h1>
            <BigCalendarContainer type="teacherId" id={teacherId} />
          </div>
        </div>
        
        {/* RIGHT */}
        <div className="w-full xl:w-1/3 flex flex-col gap-8">
          {/* Quick Actions */}
          <div className="bg-white p-4 rounded-md shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
            <div className="space-y-2">
              <Link href="/list/students" className="block p-3 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors">📚 View My Students</Link>
              <Link href="/list/lessons" className="block p-3 bg-green-50 hover:bg-green-100 rounded-md transition-colors">📅 Manage Lessons</Link>
              <Link href="/list/exams" className="block p-3 bg-yellow-50 hover:bg-yellow-100 rounded-md transition-colors">📝 Create Exams</Link>
              <Link href="/list/assignments" className="block p-3 bg-purple-50 hover:bg-purple-100 rounded-md transition-colors">📋 Assign Homework</Link>
              <Link href="/list/attendances" className="block p-3 bg-red-50 hover:bg-red-100 rounded-md transition-colors">✅ Take Attendance</Link>
            </div>
          </div>

          <Announcements />
        </div>
      </div>
    </div>
  );
}
