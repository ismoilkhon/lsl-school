"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Announcements from "@/components/Announcements";
import BigCalendarContainer from "@/components/BigCalendarContainer";
import TimetableContainer from "@/components/TimetableContainer";
import { useAuthStore } from "@/lib/auth-store";
import { useLocale } from "@/lib/locale-context";
import { useTranslation } from "@/lib/translations";
import { type Locale } from "@/lib/translations";

export default function TeacherPage({
  params,
}: {
  params: { locale: Locale };
}) {
  const { user, loading, isAuthenticated, checkAuth, getUserRole } = useAuthStore();
  const router = useRouter();
  const { locale } = useLocale();
  const { t } = useTranslation(locale);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAuthentication = async () => {
      if (!loading) {
        if (!user || !isAuthenticated) {
          router.push(`/${locale}/sign-in`);
          return;
        }

        const userRole = getUserRole();
        if (userRole !== 'teacher') {
          router.push(`/${locale}/${userRole}`);
          return;
        }

        setIsChecking(false);
      }
    };

    checkAuthentication();
  }, [user, loading, isAuthenticated, router, locale, getUserRole]);

  // Show loading while checking authentication
  if (loading || isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // If you have server auth, fetch teacherId here; fallback to no data
  const teacherId: string | number = "";

  return (
    <div className="flex-1 p-4 flex gap-4 flex-col">
      {/* Welcome Message */}
      <div className="w-full">
        <div className="bg-white p-4 rounded-md shadow-sm">
          <h1 className="text-2xl font-bold text-gray-800">{t('dashboard.teacher.welcome', { name: user?.name || 'Teacher' })}</h1>
          <p className="text-gray-600">{t('dashboard.teacher.title')}</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex gap-4 flex-col xl:flex-row">
        {/* LEFT */}
        <div className="w-full xl:w-2/3 space-y-6">
          {/* Timetable */}
          <TimetableContainer 
            userType="teacher" 
            userId={user?.$id || ''} 
          />
          
          {/* Calendar */}
          <div className="bg-white p-4 rounded-md">
            <h1 className="text-xl font-semibold">{t('dashboard.teacher.mySchedule')}</h1>
            <BigCalendarContainer type="teacherId" id={teacherId} />
          </div>
        </div>
        
        {/* RIGHT */}
        <div className="w-full xl:w-1/3 flex flex-col gap-8">
          {/* Quick Actions */}
          <div className="bg-white p-4 rounded-md shadow-sm">
            <h2 className="text-lg font-semibold mb-4">{t('dashboard.teacher.quickActions')}</h2>
            <div className="space-y-2">
              <Link href="/list/students" className="block p-3 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors">{t('dashboard.teacher.viewMyStudents')}</Link>
              <Link href="/list/lessons" className="block p-3 bg-green-50 hover:bg-green-100 rounded-md transition-colors">{t('dashboard.teacher.manageLessons')}</Link>
              <Link href="/list/exams" className="block p-3 bg-yellow-50 hover:bg-yellow-100 rounded-md transition-colors">{t('dashboard.teacher.createExams')}</Link>
              <Link href="/list/assignments" className="block p-3 bg-purple-50 hover:bg-purple-100 rounded-md transition-colors">{t('dashboard.teacher.assignHomework')}</Link>
              <Link href="/list/attendances" className="block p-3 bg-red-50 hover:bg-red-100 rounded-md transition-colors">{t('dashboard.teacher.takeAttendance')}</Link>
            </div>
          </div>

          <Announcements />
        </div>
      </div>
    </div>
  );
}
