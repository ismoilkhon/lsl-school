"use client";
import { useAttendances } from "@/lib/hooks/useQueries";
import Image from "next/image";
import AttendanceChart from "./AttendanceChart";
import { useAuthStore } from "@/lib/auth-store";

const AttendanceChartContainer = () => {
  const { getUserRole } = useAuthStore();
  const { data: attendances = [], isLoading, error } = useAttendances();
  
  // Only fetch data for admin users
  const userRole = getUserRole();
  if (userRole !== 'admin') {
    return (
      <div className="bg-white rounded-lg p-4 h-full">
        <div className="flex justify-between items-center">
          <h1 className="text-lg font-semibold">Attendance</h1>
          <Image src="/moreDark.png" alt="" width={20} height={20} />
        </div>
        <div className="flex items-center justify-center h-32">
          <p className="text-gray-500 text-sm">Access denied. Admin privileges required.</p>
        </div>
      </div>
    );
  }

  // Transform attendance data for chart
  const transformAttendanceData = () => {
    if (!attendances || attendances.length === 0) {
      return [
        { name: "Mon", present: 0, absent: 0 },
        { name: "Tue", present: 0, absent: 0 },
        { name: "Wed", present: 0, absent: 0 },
        { name: "Thu", present: 0, absent: 0 },
        { name: "Fri", present: 0, absent: 0 },
        { name: "Sat", present: 0, absent: 0 },
      ];
    }

    // Group by day and calculate present/absent counts
    const dayMap = new Map();
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    
    days.forEach(day => {
      dayMap.set(day, { present: 0, absent: 0 });
    });

    attendances.forEach(attendance => {
      const date = new Date(attendance.date);
      const dayName = days[date.getDay() - 1] || 'monday';
      const current = dayMap.get(dayName);
      
      if (attendance.present) {
        current.present++;
      } else {
        current.absent++;
      }
    });

    return days.map(day => ({
      name: day.charAt(0).toUpperCase() + day.slice(1, 3),
      present: dayMap.get(day).present,
      absent: dayMap.get(day).absent,
    }));
  };

  const chartData = transformAttendanceData();

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg p-4 h-full">
        <div className="flex justify-between items-center">
          <h1 className="text-lg font-semibold">Attendance</h1>
          <Image src="/moreDark.png" alt="" width={20} height={20} />
        </div>
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg p-4 h-full">
        <div className="flex justify-between items-center">
          <h1 className="text-lg font-semibold">Attendance</h1>
          <Image src="/moreDark.png" alt="" width={20} height={20} />
        </div>
        <div className="flex items-center justify-center h-32">
          <p className="text-gray-500 text-sm">Failed to load attendance data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg p-4 h-full">
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-semibold">Attendance</h1>
        <Image src="/moreDark.png" alt="" width={20} height={20} />
      </div>
      <AttendanceChart data={chartData}/>
    </div>
  );
};

export default AttendanceChartContainer;