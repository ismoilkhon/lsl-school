import { adminGetDocument, adminListDocuments } from "@/lib/appwrite-admin";
import { COLLECTIONS } from "@/lib/appwrite";
import { Query } from "node-appwrite";
import Image from "next/image";
import { getAppwriteFilePreviewUrl } from "@/lib/utils";
import FormContainer from "@/components/FormContainer";
import { headers } from "next/headers";

const TeacherDetailPage = async ({ params }: { params: { id: string } }) => {
  const teacher = await adminGetDocument(COLLECTIONS.TEACHERS, params.id);

  if (!teacher) {
    return <div>Teacher not found</div>;
  }

  // Related: classes supervised or lessons taught
  const [classesRes, lessonsRes] = await Promise.all([
    adminListDocuments(COLLECTIONS.CLASSES, [Query.equal('supervisorId', params.id), Query.limit(10)]),
    adminListDocuments(COLLECTIONS.LESSONS, [Query.equal('teacherId', params.id), Query.limit(10)]),
  ]);
  const classes = (classesRes?.documents as any[]) || [];
  const lessons = (lessonsRes?.documents as any[]) || [];
  const role = headers().get('x-user-role') || 'teacher';

  return (
    <div className="p-4 flex-1 m-4 mt-0">
      {/* Header */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 p-6 text-white">
        <div className="flex items-center gap-4">
          <Image
            src={teacher.img ? getAppwriteFilePreviewUrl(teacher.img, 96, 96) : "/noAvatar.png"}
            alt="avatar"
            width={64}
            height={64}
            className="w-16 h-16 rounded-full object-cover ring-2 ring-white/70"
          />
          <div className="flex-1">
            <h1 className="text-2xl font-semibold">{teacher.name} {teacher.surname}</h1>
            <div className="mt-1 flex flex-wrap items-center gap-2 text-xs">
              <span className="bg-white/20 px-2 py-1 rounded-full">Username: {teacher.username}</span>
            </div>
          </div>
          {role === 'admin' && (
            <div className="flex gap-2">
              <FormContainer table="teacher" type="update" data={teacher} />
              <FormContainer table="teacher" type="delete" id={teacher.$id} />
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
        {/* Profile */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <h2 className="text-sm font-semibold text-gray-700 mb-3">Profile</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-gray-500">Email</span><span>{teacher.email || '—'}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Phone</span><span>{teacher.phone || '—'}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Address</span><span className="text-right max-w-[60%]">{teacher.address}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Blood Type</span><span>{teacher.bloodType}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Sex</span><span>{teacher.sex}</span></div>
            {teacher.birthday && (
              <div className="flex justify-between"><span className="text-gray-500">Birthday</span><span>{new Date(teacher.birthday).toLocaleDateString()}</span></div>
            )}
          </div>
        </div>

        {/* Classes supervised */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <h2 className="text-sm font-semibold text-gray-700 mb-3">Supervised Classes</h2>
          {classes.length === 0 ? (
            <p className="text-sm text-gray-500">No supervised classes.</p>
          ) : (
            <ul className="divide-y">
              {classes.map((c: any) => (
                <li key={c.$id} className="py-2 text-sm flex items-center justify-between">
                  <span className="font-medium">{c.name}</span>
                  <span className="text-gray-500">Capacity {c.capacity}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Lessons taught */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <h2 className="text-sm font-semibold text-gray-700 mb-3">Lessons</h2>
          {lessons.length === 0 ? (
            <p className="text-sm text-gray-500">No lessons assigned.</p>
          ) : (
            <ul className="divide-y">
              {lessons.map((l: any) => (
                <li key={l.$id} className="py-2 text-sm flex items-center justify-between">
                  <span className="font-medium">{l.name}</span>
                  <span className="text-gray-500">{l.day} · {l.startTime ? new Date(l.startTime).toLocaleTimeString() : ''}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeacherDetailPage;
