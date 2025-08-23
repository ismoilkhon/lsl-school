"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Announcements from "@/components/Announcements";
import AttendanceChartContainer from "@/components/AttendanceChartContainer";
import CountChartContainer from "@/components/CountChartContainer";
import EventCalendarContainer from "@/components/EventCalendarContainer";
import FinanceChart from "@/components/FinanceChart";
import StatsCards from "@/components/StatsCards";
import { useAuthStore } from "@/lib/auth-store";
import { useLocale } from "@/lib/locale-context";
import { useTranslation } from "@/lib/translations";
import { type Locale } from "@/lib/translations";

export default function AdminPage({
  searchParams,
  params,
}: {
  searchParams: { [keys: string]: string | undefined };
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
        if (userRole !== 'admin') {
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

  return (
    <div className="p-4 flex gap-4 flex-col">
      {/* Welcome Message */}
      <div className="w-full">
        <div className="bg-blue-50 dark:bg-blue-800 p-4 rounded-md shadow-sm">
          <h1 className="text-2xl font-bold text-blue-800 dark:text-blue-100">{t('dashboard.welcome')}</h1>
          <p className="text-blue-600 dark:text-blue-300">{t('dashboard.admin.title')}</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex gap-4 flex-col md:flex-row">
        {/* LEFT */}
        <div className="w-full lg:w-2/3 flex flex-col gap-8">
          {/* USER CARDS */}
          <StatsCards />
          {/* MIDDLE CHARTS */}
          <div className="flex gap-4 flex-col lg:flex-row">
            {/* COUNT CHART */}
            <div className="w-full lg:w-1/3 h-[450px]">
              <CountChartContainer />
            </div>
            {/* ATTENDANCE CHART */}
            <div className="w-full lg:w-2/3 h-[450px]">
              <AttendanceChartContainer />
            </div>
          </div>
          {/* BOTTOM CHART */}
          <div className="w-full h-[500px]">
            <FinanceChart />
          </div>
        </div>
        {/* RIGHT */}
        <div className="w-full lg:w-1/3 flex flex-col gap-8">
          <EventCalendarContainer searchParams={searchParams} />
          <Announcements />
        </div>
      </div>
    </div>
  );
}

export const dynamic = 'force-dynamic';
