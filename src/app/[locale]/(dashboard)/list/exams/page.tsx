import { adminListDocuments } from "@/lib/appwrite-admin";
import { COLLECTIONS } from "@/lib/appwrite";
import { Query } from "node-appwrite";

const ExamsListPage = async () => {
  const res = await adminListDocuments(COLLECTIONS.EXAMS, [Query.limit(50), Query.offset(0)]);
  const data = (res.documents as any[]) || [];

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      <h1 className="text-lg font-semibold mb-4">Exams</h1>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b">
              <th className="text-left p-2">Title</th>
              <th className="text-left p-2">Start Time</th>
              <th className="text-left p-2">End Time</th>
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? (
              data.map((exam: any) => (
                <tr key={exam.$id} className="border-b hover:bg-gray-50">
                  <td className="p-2">{exam.title}</td>
                  <td className="p-2">
                    {exam.startTime ? new Date(exam.startTime).toLocaleString() : "TBD"}
                  </td>
                  <td className="p-2">
                    {exam.endTime ? new Date(exam.endTime).toLocaleString() : "TBD"}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="text-center p-4">
                  No exams found. Create your first exam!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ExamsListPage;
