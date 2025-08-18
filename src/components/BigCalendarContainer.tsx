import { getDocuments, COLLECTIONS } from "@/lib/appwrite";
import BigCalendar from "./BigCalender";
import { adjustScheduleToCurrentWeek } from "@/lib/utils";
import { Query } from "appwrite";

const BigCalendarContainer = async ({
  type,
  id,
}: {
  type: "teacherId" | "classId";
  id: string | number;
}) => {
  let data: any[] = [];
  
  try {
    const dataRes = await getDocuments(COLLECTIONS.LESSONS, [
      Query.equal(type, id)
    ]);

    data = dataRes.documents.map((lesson) => ({
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
