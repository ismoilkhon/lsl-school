"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import AttendanceChart from "./AttendanceChart";
import { useAuthStore } from "@/lib/auth-store";

const AttendanceChartContainer = () => {
  const { getUserRole } = useAuthStore();
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Only fetch data for admin users
        const userRole = getUserRole();
        if (userRole !== 'admin') {
          setError('Access denied. Admin privileges required.');
          setLoading(false);
          return;
        }

        // For now, use mock data since admin functions require server-side execution
        // In a real app, you would make an API call to a server endpoint
        const mockData = [
          { name: "Mon", present: 85, absent: 15 },
          { name: "Tue", present: 90, absent: 10 },
          { name: "Wed", present: 88, absent: 12 },
          { name: "Thu", present: 92, absent: 8 },
          { name: "Fri", present: 87, absent: 13 },
          { name: "Sat", present: 45, absent: 5 },
        ];
        
        setData(mockData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching attendance data:', err);
        setError('Failed to load attendance data');
        setLoading(false);
      }
    };

    fetchData();
  }, [getUserRole]);

  if (loading) {
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
          <p className="text-gray-500 text-sm">{error}</p>
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
      <AttendanceChart data={data}/>
    </div>
  );
};

export default AttendanceChartContainer;