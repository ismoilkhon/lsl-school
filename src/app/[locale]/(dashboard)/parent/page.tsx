"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Announcements from "@/components/Announcements";
import BigCalendarContainer from "@/components/BigCalendarContainer";
import { useAuthStore } from "@/lib/auth-store";
import { useLocale } from "@/lib/locale-context";
import { useTranslation } from "@/lib/translations";
import { type Locale } from "@/lib/translations";

export default function ParentPage({
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
        if (userRole !== 'parent') {
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

  // For now, show a simplified parent dashboard
  // TODO: Add client-side data fetching for parent-specific data
  const children = [];
  const recentResults = [];
  const recentAttendance = [];
  const attendanceRate = 0;

  return (
    <div className="p-4 flex gap-4 flex-col">
      {/* Welcome Message */}
      <div className="w-full">
        <div className="bg-white p-4 rounded-md shadow-sm">
          <h1 className="text-2xl font-bold text-gray-800">{t('dashboard.parent.welcome', { name: user?.name || 'Parent' })}</h1>
          <p className="text-gray-600">{t('dashboard.parent.title')}</p>
          {children.length ? (
            <p className="text-sm text-gray-500 mt-2">{t('dashboard.parent.monitoringChildren', { count: children.length })}</p>
          ) : (
            <p className="text-sm text-gray-500 mt-2">{t('dashboard.parent.noChildrenFound')}</p>
          )}
        </div>
      </div>

      {/* Quick Stats */}
      {children.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-md shadow-sm">
            <h3 className="text-lg font-semibold text-gray-800">{t('dashboard.parent.quickStats.children')}</h3>
            <p className="text-3xl font-bold text-blue-600">{children.length}</p>
          </div>
          <div className="bg-white p-4 rounded-md shadow-sm">
            <h3 className="text-lg font-semibold text-gray-800">{t('dashboard.parent.quickStats.recentResults')}</h3>
            <p className="text-3xl font-bold text-green-600">{recentResults.length}</p>
          </div>
          <div className="bg-white p-4 rounded-md shadow-sm">
            <h3 className="text-lg font-semibold text-gray-800">{t('dashboard.parent.quickStats.attendanceRate')}</h3>
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
                <h2 className="text-xl font-semibold mb-4">{t('dashboard.parent.childrenSchedule', { name: `${student.name} ${student.surname}` })}</h2>
                <BigCalendarContainer type="classId" id={student.classId} />
              </div>
            ))
          ) : (
            <div className="bg-white p-8 rounded-md text-center shadow-sm">
              <p className="text-gray-600">{t('dashboard.parent.noChildrenFound')}</p>
              <p className="text-sm text-gray-500 mt-2">{t('dashboard.parent.noChildrenDescription')}</p>
            </div>
          )}
        </div>
        
        {/* RIGHT */}
        <div className="w-full xl:w-1/3 flex flex-col gap-8">
          {/* Quick Actions */}
          <div className="bg-white p-4 rounded-md shadow-sm">
            <h2 className="text-lg font-semibold mb-4">{t('dashboard.parent.quickActions')}</h2>
            <div className="space-y-2">
              <Link href="/list/students" className="block p-3 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors">{t('dashboard.parent.viewMyChildren')}</Link>
              <Link href="/list/results" className="block p-3 bg-green-50 hover:bg-green-100 rounded-md transition-colors">{t('dashboard.parent.academicResults')}</Link>
              <Link href="/list/attendance" className="block p-3 bg-yellow-50 hover:bg-yellow-100 rounded-md transition-colors">{t('dashboard.parent.attendanceRecords')}</Link>
              <Link href="/list/events" className="block p-3 bg-purple-50 hover:bg-purple-100 rounded-md transition-colors">{t('dashboard.parent.schoolEvents')}</Link>
            </div>
          </div>

          {/* Recent Results */}
          {recentResults.length > 0 && (
            <div className="bg-white p-4 rounded-md shadow-sm">
              <h2 className="text-lg font-semibold mb-4">{t('dashboard.parent.recentResults')}</h2>
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
                {t('dashboard.parent.viewAllResults')}
              </Link>
            </div>
          )}

          {/* Recent Attendance */}
          {recentAttendance.length > 0 && (
            <div className="bg-white p-4 rounded-md shadow-sm">
              <h2 className="text-lg font-semibold mb-4">{t('dashboard.parent.recentAttendance')}</h2>
              <div className="space-y-2">
                {recentAttendance.slice(0, 5).map((attendance: any) => (
                  <div key={attendance.$id} className="flex justify-between items-center text-sm">
                    <span>{attendance.studentName || 'Student'}</span>
                    <span className={`px-2 py-1 rounded text-xs ${
                      attendance.present 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {attendance.present ? t('dashboard.parent.present') : t('dashboard.parent.absent')}
                    </span>
                  </div>
                ))}
              </div>
              <Link href="/list/attendance" className="block text-center text-sm text-blue-600 hover:text-blue-800 mt-3">
                {t('dashboard.parent.viewAllAttendance')}
              </Link>
            </div>
          )}

          <Announcements />
        </div>
      </div>
    </div>
  );
}
