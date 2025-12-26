"use client";

import { useTeacher, useClasses, useLessons } from "@/lib/hooks/useQueries";
import { COLLECTIONS } from "@/lib/appwrite";
import Image from "next/image";
import { getAppwriteFilePreviewUrl } from "@/lib/utils";
import FormContainer from "@/components/FormContainer";
import { useAuthStore } from "@/lib/auth-store";

const TeacherDetailPage = ({ params }: { params: { id: string } }) => {
  const { getUserRole } = useAuthStore();
  const { data: teacher, isLoading: teacherLoading, error: teacherError } = useTeacher(params.id);
  
  // Get related data using TanStack Query
  const { data: classes = [], isLoading: classesLoading } = useClasses();
  const { data: lessons = [], isLoading: lessonsLoading } = useLessons();
  
  // Filter related data
  const supervisedClasses = classes.filter(c => c.supervisorId === params.id);
  const teacherLessons = lessons.filter(l => l.teacherId === params.id);
  
  const role = getUserRole();
  const isLoading = teacherLoading || classesLoading || lessonsLoading;

  if (isLoading) {
    return (
      <div className="p-4 flex-1 m-4 mt-0">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (teacherError || !teacher) {
    return (
      <div className="p-4 flex-1 m-4 mt-0">
        <div className="text-center py-8">
          <p className="text-red-500">Failed to load teacher: {teacherError?.message || 'Teacher not found'}</p>
        </div>
      </div>
    );
  }

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
          {supervisedClasses.length === 0 ? (
            <p className="text-sm text-gray-500">No supervised classes.</p>
          ) : (
            <ul className="divide-y">
              {supervisedClasses.map((c: any) => (
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
          {teacherLessons.length === 0 ? (
            <p className="text-sm text-gray-500">No lessons assigned.</p>
          ) : (
            <ul className="divide-y">
              {teacherLessons.map((l: any) => (
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
