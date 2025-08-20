import { getResults } from "@/lib/appwrite-data";
import FormContainer from "@/components/FormContainer";
import { headers } from "next/headers";

const ResultsListPage = async () => {
  const role = headers().get('x-user-role') || 'student';
  const res = await getResults(1, 50, {});
  const data = res.data as any[];
  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-lg font-semibold">Results</h1>
        {role === 'admin' && (
          <FormContainer table="result" type="create" />
        )}
      </div>
      {data.length === 0 ? (
        <p>No results found.</p>
      ) : (
        <ul className="space-y-2">
          {data.map((r: any) => (
            <li key={r.$id} className="border rounded p-3">
              {r.title || r.name || r.$id}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ResultsListPage;
