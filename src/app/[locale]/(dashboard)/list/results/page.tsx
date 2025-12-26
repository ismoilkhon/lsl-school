"use client";

import { useResults } from "@/lib/hooks/useQueries";
import FormContainer from "@/components/FormContainer";
import { useAuthStore } from "@/lib/auth-store";

const ResultsListPage = () => {
  const { getUserRole } = useAuthStore();
  const { data: results = [], isLoading, error } = useResults();
  const role = getUserRole();

  if (isLoading) {
    return (
      <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-lg font-semibold">Results</h1>
          {role === 'admin' && (
            <FormContainer table="result" type="create" />
          )}
        </div>
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-lg font-semibold">Results</h1>
          {role === 'admin' && (
            <FormContainer table="result" type="create" />
          )}
        </div>
        <div className="text-center py-8">
          <p className="text-destructive">Failed to load results: {error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-lg font-semibold">Results</h1>
        {role === 'admin' && (
          <FormContainer table="result" type="create" />
        )}
      </div>
      {results.length === 0 ? (
        <p className="text-muted-foreground">No results found.</p>
      ) : (
        <ul className="space-y-2">
          {results.map((r: any) => (
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
