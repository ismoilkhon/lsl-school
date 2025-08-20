import Image from "next/image";
import AttendanceChart from "./AttendanceChart";
import { adminListDocuments } from "@/lib/appwrite-admin";
import { COLLECTIONS } from "@/lib/appwrite";
import { Query } from "node-appwrite";

const AttendanceChartContainer = async () => {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const daysSinceMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

  const lastMonday = new Date(today);

  lastMonday.setDate(today.getDate() - daysSinceMonday);

  // Fetch attendances since last Monday
  // Note: Appwrite Query.greaterEqual for datetime expects ISO string
  const res = await adminListDocuments(COLLECTIONS.ATTENDANCES, [
    Query.greaterThanEqual('date', lastMonday.toISOString()),
    Query.limit(500),
  ]);
  const resData = res.documents as any[];

  // console.log(data)

  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const attendanceMap: { [key: string]: { present: number; absent: number } } =
    daysOfWeek.reduce((acc, d) => {
      acc[d] = { present: 0, absent: 0 };
      return acc;
    }, {} as { [key: string]: { present: number; absent: number } });

  resData.forEach((item) => {
    const itemDate = new Date(item.date);
    const dayOfWeek = itemDate.getDay();
    
    if (dayOfWeek >= 1 && dayOfWeek <= 6) {
      const dayName = daysOfWeek[dayOfWeek - 1];

      if (item.present) {
        attendanceMap[dayName].present += 1;
      } else {
        attendanceMap[dayName].absent += 1;
      }
    }
  });

  const data = daysOfWeek.map((day) => ({
    name: day,
    present: attendanceMap[day].present,
    absent: attendanceMap[day].absent,
  }));

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