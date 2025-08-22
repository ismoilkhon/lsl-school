import Link from "next/link";
import Announcements from "@/components/Announcements";
import BigCalendarContainer from "@/components/BigCalendarContainer";
import { getCurrentServerUser } from "@/lib/server-auth";
import { getParentByUserId, getChildrenForParent, getResultsForParent, getAttendanceForParent } from "@/lib/appwrite-data";
import { redirect } from "next/navigation";

export default async function ParentPage() {
  // Get current user
  const currentUser = await getCurrentServerUser();
  
  if (!currentUser) {
    redirect('/sign-in');
  }

  // Get parent information for the current user
  const parent = await getParentByUserId(currentUser.$id);
  
  if (!parent) {
    // Instead of redirecting to welcome (which causes infinite loops), show a setup message
    return (
      <div className="p-4 flex gap-4 flex-col">
        <div className="w-full">
          <div className="bg-white p-8 rounded-md shadow-sm text-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Welcome, {currentUser.name || 'Parent'}!</h1>
            <p className="text-gray-600 mb-6">Your parent account is not yet fully set up.</p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
              <h2 className="text-lg font-semibold text-blue-800 mb-2">Account Setup Required</h2>
              <p className="text-blue-700 mb-4">
                To access your children&apos;s information and monitor their progress, your parent account needs to be linked to your children&apos;s records.
              </p>
              <p className="text-blue-600 text-sm">
                Please contact the school administrator to complete your account setup.
              </p>
            </div>
            <div className="space-y-4">
              <p className="text-sm text-gray-500">
                You can still view general school information below.
              </p>
              <Link 
                href="/list/events" 
                className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                View School Events
              </Link>
            </div>
          </div>
        </div>
        
        {/* Show announcements even without parent setup */}
        <div className="w-full xl:w-1/3">
          <Announcements />
        </div>
      </div>
    );
  }

  // Get children for this parent
  const childrenResponse = await getChildrenForParent(parent.$id);
  const children = childrenResponse.data || [];

  // Get recent results for children
  const resultsResponse = await getResultsForParent(parent.$id, 1, 5);
  const recentResults = resultsResponse.data || [];

  // Get recent attendance for children
  const attendanceResponse = await getAttendanceForParent(parent.$id, 1, 10);
  const recentAttendance = attendanceResponse.data || [];

  // Calculate attendance statistics
  const totalAttendance = recentAttendance.length;
  const presentCount = recentAttendance.filter((a: any) => a.present).length;
  const attendanceRate = totalAttendance > 0 ? Math.round((presentCount / totalAttendance) * 100) : 0;

  return (
    <div className="p-4 flex gap-4 flex-col">
      {/* Welcome Message */}
      <div className="w-full">
        <div className="bg-white p-4 rounded-md shadow-sm">
          <h1 className="text-2xl font-bold text-gray-800">Welcome back, {parent.name}!</h1>
          <p className="text-gray-600">Parent Dashboard</p>
          {children.length ? (
            <p className="text-sm text-gray-500 mt-2">Monitoring {children.length} {children.length === 1 ? 'child' : 'children'}</p>
          ) : (
            <p className="text-sm text-gray-500 mt-2">No children found in your account.</p>
          )}
        </div>
      </div>

      {/* Quick Stats */}
      {children.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-md shadow-sm">
            <h3 className="text-lg font-semibold text-gray-800">Children</h3>
            <p className="text-3xl font-bold text-blue-600">{children.length}</p>
          </div>
          <div className="bg-white p-4 rounded-md shadow-sm">
            <h3 className="text-lg font-semibold text-gray-800">Recent Results</h3>
            <p className="text-3xl font-bold text-green-600">{recentResults.length}</p>
          </div>
          <div className="bg-white p-4 rounded-md shadow-sm">
            <h3 className="text-lg font-semibold text-gray-800">Attendance Rate</h3>
            <p className="text-3xl font-bold text-yellow-600">{attendanceRate}%</p>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex gap-4 flex-col xl:flex-row">
        {/* LEFT - Children's Schedules */}
        <div className="w-full xl:w-2/3 space-y-6">
          {children.length ? (
            children.map((student: any) => (
              <div key={student.$id} className="bg-white p-4 rounded-md shadow-sm">
                <h2 className="text-xl font-semibold mb-4">{student.name} {student.surname}&apos;s Schedule</h2>
                <BigCalendarContainer type="classId" id={student.classId} />
              </div>
            ))
          ) : (
            <div className="bg-white p-8 rounded-md text-center shadow-sm">
              <p className="text-gray-600">No children found in your account.</p>
              <p className="text-sm text-gray-500 mt-2">Please contact the school administration to link your children to your account.</p>
            </div>
          )}
        </div>
        
        {/* RIGHT */}
        <div className="w-full xl:w-1/3 flex flex-col gap-8">
          {/* Quick Actions */}
          <div className="bg-white p-4 rounded-md shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
            <div className="space-y-2">
              <Link href="/list/students" className="block p-3 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors">👨‍👩‍👧‍👦 View My Children</Link>
              <Link href="/list/results" className="block p-3 bg-green-50 hover:bg-green-100 rounded-md transition-colors">📊 Academic Results</Link>
              <Link href="/list/attendance" className="block p-3 bg-yellow-50 hover:bg-yellow-100 rounded-md transition-colors">📅 Attendance Records</Link>
              <Link href="/list/events" className="block p-3 bg-purple-50 hover:bg-purple-100 rounded-md transition-colors">🎉 School Events</Link>
            </div>
          </div>

          {/* Recent Results */}
          {recentResults.length > 0 && (
            <div className="bg-white p-4 rounded-md shadow-sm">
              <h2 className="text-lg font-semibold mb-4">Recent Results</h2>
              <div className="space-y-3">
                {recentResults.slice(0, 3).map((result: any) => (
                  <div key={result.$id} className="border-l-4 border-green-500 pl-3">
                    <p className="font-medium text-sm">{result.studentName || 'Student'}</p>
                    <p className="text-xs text-gray-600">{result.examTitle || result.assignmentTitle || 'Assessment'}</p>
                    <p className="text-sm font-semibold text-green-600">{result.score || 'N/A'}</p>
                  </div>
                ))}
              </div>
              <Link href="/list/results" className="block text-center text-sm text-blue-600 hover:text-blue-800 mt-3">
                View All Results →
              </Link>
            </div>
          )}

          {/* Recent Attendance */}
          {recentAttendance.length > 0 && (
            <div className="bg-white p-4 rounded-md shadow-sm">
              <h2 className="text-lg font-semibold mb-4">Recent Attendance</h2>
              <div className="space-y-2">
                {recentAttendance.slice(0, 5).map((attendance: any) => (
                  <div key={attendance.$id} className="flex justify-between items-center text-sm">
                    <span>{attendance.studentName || 'Student'}</span>
                    <span className={`px-2 py-1 rounded text-xs ${
                      attendance.present 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {attendance.present ? 'Present' : 'Absent'}
                    </span>
                  </div>
                ))}
              </div>
              <Link href="/list/attendance" className="block text-center text-sm text-blue-600 hover:text-blue-800 mt-3">
                View All Attendance →
              </Link>
            </div>
          )}

          <Announcements />
        </div>
      </div>
    </div>
  );
}
