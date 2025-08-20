'use client';

import FormContainer from "@/components/FormContainer";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import { ITEM_PER_PAGE } from "@/lib/settings";
import Image from "next/image";
import { useAuthStore } from "@/lib/auth-store";
import { adminListDocuments } from "@/lib/appwrite-admin";
import { COLLECTIONS } from "@/lib/appwrite";
import { Query } from "node-appwrite";
import { useEffect, useState } from "react";

type AnnouncementList = {
  $id: string;
  title: string;
  description: string;
  date: string;
  classId?: number;
  class?: { $id: string; name: string };
};

const AnnouncementListPage = () => {
  const { getUserRole } = useAuthStore();
  const [data, setData] = useState<AnnouncementList[]>([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [searchParams, setSearchParams] = useState<{ [key: string]: string | undefined }>({});

  const role = getUserRole();
  
  const columns = [
    {
      header: "Title",
      accessor: "title",
    },
    {
      header: "Class",
      accessor: "class",
    },
    {
      header: "Date",
      accessor: "date",
      className: "hidden md:table-cell",
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
      <td className="flex items-center gap-4 p-4">{item.title}</td>
      <td>{item.class?.name || "-"}</td>
      <td className="hidden md:table-cell">
        {new Intl.DateTimeFormat("en-US").format(new Date(item.date))}
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

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const offset = (page - 1) * ITEM_PER_PAGE;
        const queries: string[] = [Query.limit(ITEM_PER_PAGE), Query.offset(offset), Query.orderDesc('$createdAt')];
        const res = await adminListDocuments(COLLECTIONS.ANNOUNCEMENTS, queries);
        setData((res.documents as unknown as AnnouncementList[]) || []);
        setCount(res.total || 0);
      } catch (error) {
        console.error('Error fetching announcements:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [page, searchParams]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">
          All Announcements
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
      <Table columns={columns} renderRow={renderRow} data={data} />
      {/* PAGINATION */}
      <Pagination page={page} count={count} />
    </div>
  );
};

export default AnnouncementListPage;
