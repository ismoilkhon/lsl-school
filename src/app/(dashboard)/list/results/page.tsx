import { getResults } from "@/lib/appwrite-data";

const ResultsListPage = async () => {
  const res = await getResults(1, 50, {});
  const data = res.data as any[];
  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      <h1 className="text-lg font-semibold mb-4">Results</h1>
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
