"use client";
import { useEffect, useState } from "react";
import { getLessons } from "@/lib/appwrite-data";
import BigCalendar from "./BigCalender";
import { adjustScheduleToCurrentWeek } from "@/lib/utils";

const BigCalendarContainer = ({
  type,
  id,
}: {
  type: "teacherId" | "classId";
  id: string | number;
}) => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const { data: lessons } = await getLessons(1, 100, { [type]: id });

        const lessonData = lessons.map((lesson: any) => ({
          title: lesson.name,
          start: new Date(lesson.startTime),
          end: new Date(lesson.endTime),
        }));
        
        setData(lessonData);
      } catch (error) {
        console.warn('Failed to fetch lessons:', error);
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLessons();
  }, [type, id]);

  const schedule = adjustScheduleToCurrentWeek(data);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="">
      <BigCalendar data={schedule} />
    </div>
  );
};

export default BigCalendarContainer;
