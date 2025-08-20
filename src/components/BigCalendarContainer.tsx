import { getLessons } from "@/lib/appwrite-data";
import BigCalendar from "./BigCalender";
import { adjustScheduleToCurrentWeek } from "@/lib/utils";

const BigCalendarContainer = async ({
  type,
  id,
}: {
  type: "teacherId" | "classId";
  id: string | number;
}) => {
  let data: any[] = [];
  
  try {
    const { data: lessons } = await getLessons(1, 100, { [type]: id });

    data = lessons.map((lesson: any) => ({
      title: lesson.name,
      start: new Date(lesson.startTime),
      end: new Date(lesson.endTime),
    }));
  } catch (error) {
    console.warn('Failed to fetch lessons:', error);
    data = [];
  }

  const schedule = adjustScheduleToCurrentWeek(data);

  return (
    <div className="">
      <BigCalendar data={schedule} />
    </div>
  );
};

export default BigCalendarContainer;
