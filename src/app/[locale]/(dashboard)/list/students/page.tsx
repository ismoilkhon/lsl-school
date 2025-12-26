import FormContainer from "@/components/FormContainer";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";

import { ITEM_PER_PAGE } from "@/lib/settings";
import Image from "next/image";
import { getAppwriteFilePreviewUrl } from "@/lib/utils";
import Link from "next/link";
import { headers } from "next/headers";

import { adminListDocuments } from "@/lib/appwrite-admin";
import { COLLECTIONS } from "@/lib/appwrite";
import { Query } from "node-appwrite";

type StudentList = {
  $id: string;
  username: string;
  name: string;
  surname: string;
  email?: string;
  phone?: string;
  address: string;
  img?: string;
  bloodType: string;
  sex: string;
  parentId: string;
  classId: string;
  birthday: string;
  createdAt: string;
  class?: { $id: string; name: string };
};

const StudentListPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
  const role = headers().get('x-user-role') || 'student';

  const columns = [
    {
      header: "Info",
      accessor: "info",
    },
    {
      header: "Student ID",
      accessor: "studentId",
      className: "hidden md:table-cell",
    },
    {
      header: "Grade",
      accessor: "grade",
      className: "hidden md:table-cell",
    },
    {
      header: "Phone",
      accessor: "phone",
      className: "hidden lg:table-cell",
    },
    {
      header: "Address",
      accessor: "address",
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

  const renderRow = (item: StudentList) => (
    <tr
      key={item.$id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-secondary"
    >
      <td className="flex items-center gap-4 p-4">
        <Image
          src={item.img ? getAppwriteFilePreviewUrl(item.img, 40, 40) : "/noAvatar.png"}
          alt=""
          width={40}
          height={40}
          className="md:hidden xl:block w-10 h-10 rounded-full object-cover"
          style={{ width: 'auto', height: 'auto' }}
        />
        <div className="flex flex-col">
          <h3 className="font-semibold">{item.name}</h3>
          <p className="text-xs text-gray-500">{item.class?.name || "Unknown Class"}</p>
        </div>
      </td>
      <td className="hidden md:table-cell">{item.username}</td>
      <td className="hidden md:table-cell">{item.class?.name?.[0] || "-"}</td>
      <td className="hidden md:table-cell">{item.phone || "-"}</td>
      <td className="hidden md:table-cell">{item.address}</td>
      <td>
        <div className="flex items-center gap-2">
          <Link href={`/list/students/${item.$id}`}>
            <button className="w-7 h-7 flex items-center justify-center rounded-full bg-blue-200">
              <Image src="/view.png" alt="" width={16} height={16} />
            </button>
          </Link>
          {role === "admin" && (
            <FormContainer table="student" type="delete" id={item.$id} />
          )}
        </div>
      </td>
    </tr>
  );

  const { page, ...queryParams } = searchParams;
  const p = page ? parseInt(page) : 1;
  const offset = (p - 1) * ITEM_PER_PAGE;
  const queries: string[] = [Query.limit(ITEM_PER_PAGE), Query.offset(offset)];
  
  let data: StudentList[] = [];
  let count = 0;

  try {
    const result = await adminListDocuments(COLLECTIONS.STUDENTS, queries);
    data = (result.documents as unknown as StudentList[]) || [];
    count = result.total || 0;
  } catch (error: any) {
    console.error('Error fetching students:', error);
    data = [];
    count = 0;
  }

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">All Students</h1>
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
              <FormContainer table="student" type="create" />
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
          <p className="text-muted-foreground">No students found.</p>
        </div>
      )}
    </div>
  );
};

export default StudentListPage;
export const dynamic = 'force-dynamic';
