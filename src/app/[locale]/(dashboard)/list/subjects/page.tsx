import FormContainer from "@/components/FormContainer";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import { adminListDocuments } from "@/lib/appwrite-admin";
import { COLLECTIONS } from "@/lib/appwrite";
import { Query } from "node-appwrite";
import { ITEM_PER_PAGE } from "@/lib/settings";
import Image from "next/image";
import { headers } from "next/headers";

const SubjectListPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
  const role = headers().get('x-user-role') || 'student';

  const columns = [
    {
      header: "Subject Name",
      accessor: "name",
    },
    {
      header: "Teachers",
      accessor: "teachers",
      className: "hidden md:table-cell",
    },
    {
      header: "Actions",
      accessor: "action",
    },
  ];

  const renderRow = (item: any) => (
    <tr
      key={item.$id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-secondary"
    >
      <td className="flex items-center gap-4 p-4">{item.name}</td>
      <td className="hidden md:table-cell">
        {/* TODO: Implement teacher relationship fetching */}
        Teachers
      </td>
      <td>
        <div className="flex items-center gap-2">
          {role === "admin" && (
            <>
              <FormContainer table="subject" type="update" data={item} />
              <FormContainer table="subject" type="delete" id={item.$id} />
            </>
          )}
        </div>
      </td>
    </tr>
  );

  const { page, ...queryParams } = searchParams;
  const p = page ? parseInt(page) : 1;

  // Build Appwrite queries
  const queries: string[] = [];
  if (queryParams.search) {
    // TODO: Implement search in Appwrite
  }

  // Fetch data from Appwrite
  const offset = (p - 1) * ITEM_PER_PAGE;
  
  let data: any[] = [];
  let count = 0;

  try {
    const res = await adminListDocuments(COLLECTIONS.SUBJECTS, [Query.limit(ITEM_PER_PAGE), Query.offset(offset)]);
    data = res.documents as any[];
    count = res.total;
  } catch (error: any) {
    console.error('Error fetching subjects:', error);
    data = [];
    count = 0;
  }

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">All Subjects</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-300">
              <Image src="/filter.png" alt="" width={14} height={14} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-300">
              <Image src="/sort.png" alt="" width={14} height={14} />
            </button>
            {role === "admin" && (
              <FormContainer table="subject" type="create" />
            )}
          </div>
        </div>
      </div>
      {/* LIST */}
      {data.length > 0 ? (
        <>
          <Table columns={columns} renderRow={renderRow} data={data} />
          {/* PAGINATION */}
          <Pagination page={p} count={count} />
        </>
      ) : (
        <div className="flex items-center justify-center py-12">
          <p className="text-muted-foreground">No subjects found.</p>
        </div>
      )}
    </div>
  );
};

export default SubjectListPage;
export const dynamic = 'force-dynamic';
