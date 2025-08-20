import Link from "next/link";
import Announcements from "@/components/Announcements";
import BigCalendarContainer from "@/components/BigCalendarContainer";

export default async function ParentPage() {
  // In a real app, fetch children and their classIds here server-side
  const children: Array<{ id: string; name: string; surname: string; classId: number }> = [];

  return (
    <div className="p-4 flex gap-4 flex-col">
      {/* Welcome Message */}
      <div className="w-full">
        <div className="bg-white p-4 rounded-md shadow-sm">
          <h1 className="text-2xl font-bold text-gray-800">Welcome back!</h1>
          <p className="text-gray-600">Parent Dashboard</p>
          {children.length ? (
            <p className="text-sm text-gray-500 mt-2">Monitoring {children.length} {children.length === 1 ? 'child' : 'children'}</p>
          ) : (
            <p className="text-sm text-gray-500 mt-2">No children found in your account.</p>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex gap-4 flex-col xl:flex-row">
        {/* LEFT - Children's Schedules */}
        <div className="w-full xl:w-2/3 space-y-6">
          {children.length ? (
            children.map((student) => (
              <div key={student.id} className="bg-white p-4 rounded-md">
                <h2 className="text-xl font-semibold mb-4">{student.name} {student.surname}'s Schedule</h2>
                <BigCalendarContainer type="classId" id={student.classId} />
              </div>
            ))
          ) : (
            <div className="bg-white p-8 rounded-md text-center">
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
              <Link href="/list/attendances" className="block p-3 bg-yellow-50 hover:bg-yellow-100 rounded-md transition-colors">📅 Attendance Records</Link>
              <Link href="/list/events" className="block p-3 bg-purple-50 hover:bg-purple-100 rounded-md transition-colors">🎉 School Events</Link>
            </div>
          </div>

          <Announcements />
        </div>
      </div>
    </div>
  );
}
