import FormContainer from "@/components/FormContainer";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import { COLLECTIONS } from "@/lib/appwrite";
import { adminListDocuments } from "@/lib/appwrite-admin";
import { ITEM_PER_PAGE } from "@/lib/settings";
import Image from "next/image";
import { Query } from "node-appwrite";
import { headers } from "next/headers";

type AttendanceDocument = {
  $id: string;
  date: string;
  present: boolean;
  studentId: string;
  lessonId: string;
  notes?: string;
};

const formatDate = (value?: string) => {
  if (!value) return "-";
  try {
    return new Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(new Date(value));
  } catch {
    return value;
  }
};

const AttendanceListPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
  const headerList = headers();
  const role = headerList.get("x-user-role") || "student";
  const isPrivileged = role === "admin" || role === "teacher";

  const columns = [
    { header: "Student", accessor: "student" },
    { header: "Lesson", accessor: "lesson", className: "hidden md:table-cell" },
    { header: "Date", accessor: "date", className: "hidden md:table-cell" },
    { header: "Status", accessor: "status" },
    { header: "Notes", accessor: "notes", className: "hidden lg:table-cell" },
    ...(isPrivileged
      ? [
          {
            header: "Actions",
            accessor: "action",
          },
        ]
      : []),
  ];

  const renderStatusBadge = (present: boolean) => (
    <span
      className={`px-2 py-1 rounded-full text-xs font-medium ${
        present ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
      }`}
    >
      {present ? "Present" : "Absent"}
    </span>
  );

  const { page, ...restParams } = searchParams;
  const p = page ? Math.max(parseInt(page, 10) || 1, 1) : 1;
  const offset = (p - 1) * ITEM_PER_PAGE;

  const queries: string[] = [Query.orderDesc("date"), Query.limit(ITEM_PER_PAGE), Query.offset(offset)];

  if (restParams.search) {
    // TODO: Implement Appwrite search for attendance
  }

  let attendances: AttendanceDocument[] = [];
  let total = 0;
  let studentIds: string[] = [];
  let lessonIds: string[] = [];

  try {
  const attendanceResponse = await adminListDocuments(COLLECTIONS.ATTENDANCES, queries);
    attendances = (attendanceResponse.documents as unknown as AttendanceDocument[]) || [];
    total = attendanceResponse.total || 0;

    studentIds = Array.from(new Set(attendances.map((record) => record.studentId).filter(Boolean)));
    lessonIds = Array.from(new Set(attendances.map((record) => record.lessonId).filter(Boolean)));
  } catch (error: any) {
    console.error('Error fetching attendances:', error);
    attendances = [];
    total = 0;
  }

  let studentsResponse: { documents: any[] } = { documents: [] };
  let lessonsResponse: { documents: any[] } = { documents: [] };

  try {
    const [studentsResult, lessonsResult] = await Promise.all([
    studentIds.length
      ? adminListDocuments(COLLECTIONS.STUDENTS, [Query.equal("$id", studentIds)])
        : Promise.resolve({ documents: [] as any[] }),
    lessonIds.length
      ? adminListDocuments(COLLECTIONS.LESSONS, [Query.equal("$id", lessonIds)])
        : Promise.resolve({ documents: [] as any[] }),
  ]);
    studentsResponse = studentsResult as { documents: any[] };
    lessonsResponse = lessonsResult as { documents: any[] };
  } catch (error: any) {
    console.error('Error fetching related data for attendances:', error);
  }

  const studentMap = new Map<string, any>();
  (studentsResponse.documents || []).forEach((student: any) => {
    studentMap.set(student.$id, student);
  });

  const lessonMap = new Map<string, any>();
  (lessonsResponse.documents || []).forEach((lesson: any) => {
    lessonMap.set(lesson.$id, lesson);
  });

  const renderRow = (item: AttendanceDocument) => {
    const student = studentMap.get(item.studentId);
    const lesson = lessonMap.get(item.lessonId);
    const studentLabel =
      student?.name && student?.surname
        ? `${student.name} ${student.surname}`
        : student?.name || student?.username || item.studentId || "Unknown";
    const lessonLabel = lesson?.name || lesson?.title || item.lessonId || "Lesson";
    const notesPreview = item.notes?.trim() || "";
    const truncatedNotes = notesPreview.length > 60 ? `${notesPreview.slice(0, 57)}…` : notesPreview || "-";

    return (
      <tr
        key={item.$id}
        className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-secondary transition-colors"
      >
        <td className="p-4">
          <div className="flex flex-col">
            <span className="font-medium text-foreground">{studentLabel}</span>
            <span className="text-xs text-muted-foreground md:hidden">{formatDate(item.date)}</span>
            <span className="text-xs text-muted-foreground md:hidden">{lessonLabel}</span>
          </div>
        </td>
        <td className="hidden md:table-cell">{lessonLabel}</td>
        <td className="hidden md:table-cell">{formatDate(item.date)}</td>
        <td className="p-4">{renderStatusBadge(item.present)}</td>
        <td className="hidden lg:table-cell">{truncatedNotes}</td>
        {isPrivileged && (
          <td className="p-4">
            <div className="flex items-center gap-2">
              <FormContainer table="attendance" type="update" data={item} />
              <FormContainer table="attendance" type="delete" id={item.$id} />
            </div>
          </td>
        )}
      </tr>
    );
  };

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">Attendance Records ({total})</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-300">
              <Image src="/filter.png" alt="" width={14} height={14} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-300">
              <Image src="/sort.png" alt="" width={14} height={14} />
            </button>
            {isPrivileged && <FormContainer table="attendance" type="create" />}
          </div>
        </div>
      </div>

      {attendances.length > 0 ? (
        <Table columns={columns} renderRow={renderRow} data={attendances} />
      ) : (
        <div className="text-center py-10">
          <p className="text-muted-foreground text-sm">No attendance records found.</p>
          {isPrivileged && (
            <p className="text-xs text-muted-foreground mt-2">Start by recording attendance for your class.</p>
          )}
        </div>
      )}

      {total > ITEM_PER_PAGE && <Pagination page={p} count={total} />}
    </div>
  );
};

export default AttendanceListPage;
export const dynamic = "force-dynamic";

