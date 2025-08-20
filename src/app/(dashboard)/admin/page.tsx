import Announcements from "@/components/Announcements";
import AttendanceChartContainer from "@/components/AttendanceChartContainer";
import CountChartContainer from "@/components/CountChartContainer";
import EventCalendarContainer from "@/components/EventCalendarContainer";
import FinanceChart from "@/components/FinanceChart";
import StatsCards from "@/components/StatsCards";
import { headers, cookies } from "next/headers";
import { redirect } from "next/navigation";

export default function AdminPage({
  searchParams,
}: {
  searchParams: { [keys: string]: string | undefined };
}) {
  // Enforce role-based access at page level (middleware skips auth for dashboards)
  const hdrs = headers();
  const roleHeader = hdrs.get('x-user-role');
  const roleCookie = cookies().get('role')?.value;
  const role = (roleHeader || roleCookie || 'student').toLowerCase();
  if (role !== 'admin') {
    redirect(`/${role}`);
  }
  return (
    <div className="p-4 flex gap-4 flex-col">
      {/* Welcome Message */}
      <div className="w-full">
        <div className="bg-white p-4 rounded-md shadow-sm">
          <h1 className="text-2xl font-bold text-gray-800">Welcome back!</h1>
          <p className="text-gray-600">Administrator Dashboard</p>
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
