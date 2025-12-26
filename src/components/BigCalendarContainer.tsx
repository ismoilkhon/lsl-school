"use client";
import { useLessonsByTeacher, useLessonsByClass } from "@/lib/hooks/useQueries";
import BigCalendar from "./BigCalender";
import { adjustScheduleToCurrentWeek } from "@/lib/utils";

const BigCalendarContainer = ({
  type,
  id,
}: {
  type: "teacherId" | "classId";
  id: string | number;
}) => {
  // Call both hooks unconditionally (React Hooks rules)
  const teacherLessonsResult = useLessonsByTeacher(type === "teacherId" ? id as string : "");
  const classLessonsResult = useLessonsByClass(type === "classId" ? id as string : "");
  
  // Use appropriate hook result based on type
  const { data: lessons = [], isLoading, error } = type === "teacherId" 
    ? teacherLessonsResult
    : classLessonsResult;

  // Transform lessons data for calendar
  const lessonData = lessons.map((lesson: any) => ({
    title: lesson.name,
    start: new Date(lesson.startTime),
    end: new Date(lesson.endTime),
  }));

  const schedule = adjustScheduleToCurrentWeek(lessonData);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-32">
        <p className="text-red-500 text-sm">Failed to load lessons</p>
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
