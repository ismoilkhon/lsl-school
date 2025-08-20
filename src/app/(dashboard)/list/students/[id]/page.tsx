import { adminGetDocument, adminListDocuments } from "@/lib/appwrite-admin";
import { COLLECTIONS } from "@/lib/appwrite";
import { Query } from "node-appwrite";
import Image from "next/image";
import { getAppwriteFilePreviewUrl } from "@/lib/utils";
import FormContainer from "@/components/FormContainer";
import { headers } from "next/headers";

const StudentDetailPage = async ({ params }: { params: { id: string } }) => {
  const student = await adminGetDocument(COLLECTIONS.STUDENTS, params.id);

  if (!student) {
    return <div>Student not found</div>;
  }

  // Related data
  const [resultsRes, attendanceRes, lessonsRes] = await Promise.all([
    adminListDocuments(COLLECTIONS.RESULTS, [
      Query.equal('studentId', params.id),
      Query.orderDesc('$createdAt'),
      Query.limit(5),
    ]),
    adminListDocuments(COLLECTIONS.ATTENDANCES, [
      Query.equal('studentId', params.id),
      Query.limit(200),
    ]),
    student.classId
      ? adminListDocuments(COLLECTIONS.LESSONS, [
          Query.equal('classId', Number(student.classId)),
          Query.limit(5),
        ])
      : Promise.resolve({ documents: [] as any[] }),
  ]);

  const results = (resultsRes?.documents as any[]) || [];
  const attendances = (attendanceRes?.documents as any[]) || [];
  const lessons = (lessonsRes?.documents as any[]) || [];

  const totalAttendance = attendances.length;
  const presentCount = attendances.filter((a: any) => a.present).length;
  const attendanceRate = totalAttendance > 0 ? Math.round((presentCount / totalAttendance) * 100) : 0;

  const role = headers().get('x-user-role') || 'student';

  return (
    <div className="p-4 flex-1 m-4 mt-0">
      {/* Header Card */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
        <div className="flex items-center gap-4">
          <Image
            src={student.img ? getAppwriteFilePreviewUrl(student.img, 96, 96) : "/noAvatar.png"}
            alt="avatar"
            width={64}
            height={64}
            className="w-16 h-16 rounded-full object-cover ring-2 ring-white/70"
          />
          <div className="flex-1">
            <h1 className="text-2xl font-semibold">{student.name} {student.surname}</h1>
            <div className="mt-1 flex flex-wrap items-center gap-2 text-xs">
              <span className="bg-white/20 px-2 py-1 rounded-full">Username: {student.username}</span>
              {student.classId && <span className="bg-white/20 px-2 py-1 rounded-full">Class #{student.classId}</span>}
              {student.gradeId && <span className="bg-white/20 px-2 py-1 rounded-full">Grade {student.gradeId}</span>}
            </div>
          </div>
          {role === 'admin' && (
            <div className="flex gap-2">
              <FormContainer table="student" type="update" data={student} />
              <FormContainer table="student" type="delete" id={student.$id} />
            </div>
          )}
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
        {/* Left: Profile Info */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <h2 className="text-sm font-semibold text-gray-700 mb-3">Profile</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-gray-500">Email</span><span>{student.email || '—'}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Phone</span><span>{student.phone || '—'}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Address</span><span className="text-right max-w-[60%]">{student.address}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Blood Type</span><span>{student.bloodType}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Sex</span><span>{student.sex}</span></div>
            {student.birthday && (
              <div className="flex justify-between"><span className="text-gray-500">Birthday</span><span>{new Date(student.birthday).toLocaleDateString()}</span></div>
            )}
            <div className="flex justify-between"><span className="text-gray-500">Joined</span><span>{student.createdAt ? new Date(student.createdAt).toLocaleDateString() : '—'}</span></div>
          </div>
        </div>

        {/* Middle: Attendance & Quick Stats */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <h2 className="text-sm font-semibold text-gray-700 mb-3">Attendance</h2>
          <div className="flex items-center gap-4">
            <div className="relative inline-flex items-center justify-center w-20 h-20">
              <svg className="w-20 h-20 -rotate-90" viewBox="0 0 36 36">
                <path className="text-gray-200" stroke="currentColor" strokeWidth="3" fill="none" d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831" />
                <path className="text-indigo-600" stroke="currentColor" strokeWidth="3" strokeDasharray={`${attendanceRate}, 100`} fill="none" d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831" />
              </svg>
              <span className="absolute text-sm font-semibold">{attendanceRate}%</span>
            </div>
            <div className="text-sm">
              <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-indigo-600"></span>Present: {presentCount}</div>
              <div className="flex items-center gap-2 mt-1"><span className="w-2 h-2 rounded-full bg-gray-300"></span>Total: {totalAttendance}</div>
            </div>
          </div>
        </div>

        {/* Right: Upcoming Lessons */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <h2 className="text-sm font-semibold text-gray-700 mb-3">Upcoming Lessons</h2>
          {lessons.length === 0 ? (
            <p className="text-sm text-gray-500">No lessons found.</p>
          ) : (
            <ul className="divide-y">
              {lessons.map((l: any) => (
                <li key={l.$id} className="py-2 flex items-center justify-between text-sm">
                  <span className="font-medium">{l.name}</span>
                  <span className="text-gray-500">{l.day} · {l.startTime ? new Date(l.startTime).toLocaleTimeString() : ''}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Recent Results */}
      <div className="bg-white rounded-xl p-4 shadow-sm mt-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-sm font-semibold text-gray-700">Recent Results</h2>
        </div>
        {results.length === 0 ? (
          <p className="text-sm text-gray-500">No results yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500">
                  <th className="py-2">Assessment</th>
                  <th className="py-2">Score</th>
                  <th className="py-2">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {results.map((r: any) => (
                  <tr key={r.$id}>
                    <td className="py-2">{r.title || r.name || r.$id}</td>
                    <td className="py-2 font-medium">{typeof r.score === 'number' ? `${r.score}%` : '—'}</td>
                    <td className="py-2">{r.$createdAt ? new Date(r.$createdAt).toLocaleDateString() : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDetailPage;
