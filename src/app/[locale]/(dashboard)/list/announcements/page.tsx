import FormContainer from "@/components/FormContainer";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import { ITEM_PER_PAGE } from "@/lib/settings";
import Image from "next/image";
import { adminListDocuments } from "@/lib/appwrite-admin";
import { COLLECTIONS } from "@/lib/appwrite";
import { Query } from "node-appwrite";
import { headers } from "next/headers";

type AnnouncementList = {
  $id: string;
  title: string;
  description: string;
  date: string;
  priority?: string;
  targetAudience?: string;
};

export const dynamic = 'force-dynamic';

const AnnouncementListPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
  const headerList = headers();
  const role = headerList.get('x-user-role') || 'student';
  
  const columns = [
    {
      header: "Title",
      accessor: "title",
    },
    {
      header: "Description",
      accessor: "description",
      className: "hidden md:table-cell",
    },
    {
      header: "Date",
      accessor: "date",
      className: "hidden md:table-cell",
    },
    {
      header: "Priority",
      accessor: "priority",
      className: "hidden lg:table-cell",
    },
    ...(role === "admin"
      ? [
          {
            header: "Actions",
            accessor: "action",
          },
        ]
      : []),
  ];
  
  const renderRow = (item: AnnouncementList) => (
    <tr
      key={item.$id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight"
    >
      <td className="flex items-center gap-4 p-4">
        <div className="flex flex-col">
          <h3 className="font-semibold">{item.title}</h3>
          <p className="text-xs text-gray-500 md:hidden">{item.description?.substring(0, 50)}...</p>
        </div>
      </td>
      <td className="hidden md:table-cell">
        {item.description?.substring(0, 100)}...
      </td>
      <td className="hidden md:table-cell">
        {item.date ? new Intl.DateTimeFormat("en-US").format(new Date(item.date)) : "-"}
      </td>
      <td className="hidden lg:table-cell">
        {item.priority ? (
          <span className={`px-2 py-1 rounded-full text-xs ${
            item.priority === 'high' ? 'bg-red-100 text-red-800' :
            item.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
            'bg-green-100 text-green-800'
          }`}>
            {item.priority}
          </span>
        ) : "-"}
      </td>
      <td>
        <div className="flex items-center gap-2">
          {role === "admin" && (
            <>
              <FormContainer table="announcement" type="update" data={item} />
              <FormContainer table="announcement" type="delete" id={item.$id} />
            </>
          )}
        </div>
      </td>
    </tr>
  );

  // Fetch data server-side
  const { page, ...queryParams } = searchParams;
  const p = page ? parseInt(page) : 1;
  const offset = (p - 1) * ITEM_PER_PAGE;
  
  const queries: string[] = [
    Query.limit(ITEM_PER_PAGE),
    Query.offset(offset),
    Query.orderDesc('$createdAt')
  ];
  
  if (queryParams.search) {
    // TODO: Implement search in Appwrite
  }

  let data: AnnouncementList[] = [];
  let count = 0;

  try {
    console.log('Fetching announcements with queries:', queries);
    const result = await adminListDocuments(COLLECTIONS.ANNOUNCEMENTS, queries);
    console.log('Announcements response:', result);
    console.log('Announcements documents:', result.documents);
    data = (result.documents as unknown as AnnouncementList[]) || [];
    count = result.total || 0;
  } catch (error) {
    console.error('Error fetching announcements:', error);
    data = [];
    count = 0;
  }

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">
          All Announcements ({count})
        </h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <Image src="/filter.png" alt="" width={14} height={14} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <Image src="/sort.png" alt="" width={14} height={14} />
            </button>
            {role === "admin" && (
              <FormContainer table="announcement" type="create" />
            )}
          </div>
        </div>
      </div>
      
      {/* LIST */}
      {data.length > 0 ? (
        <Table columns={columns} renderRow={renderRow} data={data} />
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500">No announcements found.</p>
          {role === "admin" && (
            <p className="text-sm text-gray-400 mt-2">Create your first announcement!</p>
          )}
        </div>
      )}
      
      {/* PAGINATION */}
      {count > 0 && <Pagination page={p} count={count} />}
    </div>
  );
};

export default AnnouncementListPage;
