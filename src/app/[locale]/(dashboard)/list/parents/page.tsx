import { adminListDocuments } from "@/lib/appwrite-admin";
import { COLLECTIONS } from "@/lib/appwrite";
import { Query } from "node-appwrite";

const ParentsListPage = async () => {
  const res = await adminListDocuments(COLLECTIONS.PARENTS, [Query.limit(50), Query.offset(0)]);
  const data = (res.documents as any[]) || [];
  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      <h1 className="text-lg font-semibold mb-4">Parents</h1>
      {data.length === 0 ? (
        <p>No parents found.</p>
      ) : (
        <ul className="space-y-2">
          {data.map((p: any) => (
            <li key={p.$id} className="border rounded p-3">
              {p.name} {p.surname}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ParentsListPage;
