import { adminListDocuments } from "@/lib/appwrite-admin";
import { COLLECTIONS } from "@/lib/appwrite";
import { Query } from "node-appwrite";

const LessonsListPage = async () => {
  const res = await adminListDocuments(COLLECTIONS.LESSONS, [Query.limit(50), Query.offset(0)]);
  const data = (res.documents as any[]) || [];

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      <h1 className="text-lg font-semibold mb-4">Lessons</h1>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b">
              <th className="text-left p-2">Name</th>
              <th className="text-left p-2">Day</th>
              <th className="text-left p-2">Start Time</th>
              <th className="text-left p-2">End Time</th>
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? (
              data.map((lesson: any) => (
                <tr key={lesson.$id} className="border-b hover:bg-gray-50">
                  <td className="p-2">{lesson.name}</td>
                  <td className="p-2">{lesson.day}</td>
                  <td className="p-2">
                    {lesson.startTime ? new Date(lesson.startTime).toLocaleTimeString() : "TBD"}
                  </td>
                  <td className="p-2">
                    {lesson.endTime ? new Date(lesson.endTime).toLocaleTimeString() : "TBD"}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="text-center p-4">
                  No lessons found. Create your first lesson!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LessonsListPage;
