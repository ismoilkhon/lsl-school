import Link from "next/link";
import Announcements from "@/components/Announcements";
import BigCalendarContainer from "@/components/BigCalendarContainer";
import EventCalendar from "@/components/EventCalendar";
import { getCurrentServerUser } from "@/lib/server-auth";
import { redirect } from "next/navigation";

export default async function StudentPage() {
  // Get current user
  const currentUser = await getCurrentServerUser();
  
  if (!currentUser) {
    redirect('/sign-in');
  }

  // Check if user has student role
  const userRole = (currentUser.prefs?.role || 'student').toLowerCase();
  if (userRole !== 'student') {
    redirect(`/${userRole}`);
  }

  // In a real app, fetch student's classId server-side
  const classId = 1;

  return (
    <div className="p-4 flex gap-4 flex-col">
      {/* Welcome Message */}
      <div className="w-full">
        <div className="bg-white p-4 rounded-md shadow-sm">
          <h1 className="text-2xl font-bold text-gray-800">Welcome back, {currentUser.name}!</h1>
          <p className="text-gray-600">Student Dashboard</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex gap-4 flex-col xl:flex-row">
        {/* LEFT */}
        <div className="w-full xl:w-2/3">
          <div className="h-full bg-white p-4 rounded-md">
            <h1 className="text-xl font-semibold">My Class Schedule</h1>
            <BigCalendarContainer type="classId" id={classId} />
          </div>
        </div>
        
        {/* RIGHT */}
        <div className="w-full xl:w-1/3 flex flex-col gap-8">
          {/* Quick Actions */}
          <div className="bg-white p-4 rounded-md shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
            <div className="space-y-2">
              <Link href="/list/lessons" className="block p-3 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors">📚 View Lessons</Link>
              <Link href="/list/assignments" className="block p-3 bg-green-50 hover:bg-green-100 rounded-md transition-colors">📝 My Assignments</Link>
              <Link href="/list/exams" className="block p-3 bg-yellow-50 hover:bg-yellow-100 rounded-md transition-colors">📊 Upcoming Exams</Link>
              <Link href="/list/results" className="block p-3 bg-purple-50 hover:bg-purple-100 rounded-md transition-colors">🏆 My Results</Link>
            </div>
          </div>

          <EventCalendar />
          <Announcements />
        </div>
      </div>
    </div>
  );
}
