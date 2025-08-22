"use client";

import {
  deleteClass,
  deleteExam,
  deleteStudent,
  deleteSubject,
  deleteTeacher,
  deleteEvent,
  deleteAnnouncement,
  deleteLesson,
  deleteAssignment,
  deleteResult,
  deleteAttendance,
} from "@/lib/actions";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useFormState } from "react-dom";
import { toast } from "react-toastify";
import { FormContainerProps } from "./FormContainer";
import { useAuthStore } from "@/lib/auth-store";

const deleteActionMap = {
  subject: deleteSubject,
  class: deleteClass,
  teacher: deleteTeacher,
  student: deleteStudent,
  exam: deleteExam,
  event: deleteEvent,
  announcement: deleteAnnouncement,
  lesson: deleteLesson,
  assignment: deleteAssignment,
  result: deleteResult,
  attendance: deleteAttendance,
// TODO: OTHER DELETE ACTIONS
  parent: deleteSubject,
};

// USE LAZY LOADING

// import TeacherForm from "./forms/TeacherForm";
// import StudentForm from "./forms/StudentForm";

const TeacherForm = dynamic(() => import("./forms/TeacherForm"), {
  loading: () => <h1>Loading...</h1>,
});
const StudentForm = dynamic(() => import("./forms/StudentForm"), {
  loading: () => <h1>Loading...</h1>,
});
const SubjectForm = dynamic(() => import("./forms/SubjectForm"), {
  loading: () => <h1>Loading...</h1>,
});
const ClassForm = dynamic(() => import("./forms/ClassForm"), {
  loading: () => <h1>Loading...</h1>,
});
const ExamForm = dynamic(() => import("./forms/ExamForm"), {
  loading: () => <h1>Loading...</h1>,
});
const EventForm = dynamic(() => import("./forms/EventForm"), {
  loading: () => <h1>Loading...</h1>,
});
const AnnouncementForm = dynamic(() => import("./forms/AnnouncementForm"), {
  loading: () => <h1>Loading...</h1>,
});
// TODO: OTHER FORMS

const forms: {
  [key: string]: (
    setOpen: Dispatch<SetStateAction<boolean>>,
    type: "create" | "update",
    data?: any,
    relatedData?: any
  ) => JSX.Element;
} = {
  subject: (setOpen, type, data, relatedData) => (
    <SubjectForm
      type={type}
      data={data}
      setOpen={setOpen}
      relatedData={relatedData}
    />
  ),
  class: (setOpen, type, data, relatedData) => (
    <ClassForm
      type={type}
      data={data}
      setOpen={setOpen}
      relatedData={relatedData}
    />
  ),
  teacher: (setOpen, type, data, relatedData) => (
    <TeacherForm
      type={type}
      data={data}
      setOpen={setOpen}
      relatedData={relatedData}
    />
  ),
  student: (setOpen, type, data, relatedData) => (
    <StudentForm
      type={type}
      data={data}
      setOpen={setOpen}
      relatedData={relatedData}
    />
  ),
  exam: (setOpen, type, data, relatedData) => (
    <ExamForm
      type={type}
      data={data}
      setOpen={setOpen}
      relatedData={relatedData}
    />
    // TODO OTHER LIST ITEMS
  ),
  event: (setOpen, type, data, relatedData) => (
    <EventForm
      type={type}
      data={data}
      setOpen={setOpen}
    />
  ),
  // Placeholder forms for unimplemented types
  parent: (setOpen, type, data, relatedData) => (
            <div className="p-4 text-center">
          <p className="text-blue-600 dark:text-blue-300">Parent form is not yet implemented.</p>
          <button 
            onClick={() => setOpen(false)}
            className="mt-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors"
          >
            Close
          </button>
        </div>
  ),
  lesson: (setOpen, type, data, relatedData) => (
    <div className="p-4 text-center">
      <p className="text-blue-600 dark:text-blue-300">Lesson form is not yet implemented.</p>
      <button 
        onClick={() => setOpen(false)}
        className="mt-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors"
      >
        Close
      </button>
    </div>
  ),
  assignment: (setOpen, type, data, relatedData) => (
    <div className="p-4 text-center">
      <p className="text-blue-600 dark:text-blue-300">Assignment form is not yet implemented.</p>
      <button 
        onClick={() => setOpen(false)}
        className="mt-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors"
      >
        Close
      </button>
    </div>
  ),
  result: (setOpen, type, data, relatedData) => (
    <div className="p-4 text-center">
      <p className="text-blue-600 dark:text-blue-300">Result form is not yet implemented.</p>
      <button 
        onClick={() => setOpen(false)}
        className="mt-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors"
      >
        Close
      </button>
    </div>
  ),
  attendance: (setOpen, type, data, relatedData) => (
    <div className="p-4 text-center">
      <p className="text-blue-600 dark:text-blue-300">Attendance form is not yet implemented.</p>
      <button 
        onClick={() => setOpen(false)}
        className="mt-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors"
      >
        Close
      </button>
    </div>
  ),
  announcement: (setOpen, type, data, relatedData) => (
    <AnnouncementForm
      type={type}
      data={data}
      setOpen={setOpen}
    />
  ),
};

const FormModal = ({
  table,
  type,
  data,
  id,
  relatedData,
}: FormContainerProps & { relatedData?: any }) => {
  const size = type === "create" ? "w-8 h-8" : "w-7 h-7";
  const bgColor =
    type === "create"
      ? "bg-blue-400 dark:bg-blue-500"
      : type === "update"
      ? "bg-blue-300 dark:bg-blue-600"
      : "bg-blue-500 dark:bg-blue-400";

  const [open, setOpen] = useState(false);

  const Form = () => {
    const { getUserRole, user, checkAuth } = useAuthStore();
    
    // Refresh auth store when component mounts to ensure we have latest user data
    useEffect(() => {
      if (!user) {
        checkAuth();
      }
    }, [user, checkAuth]);
    
    const userRole = getUserRole();
    
    // Fallback: try to get role from cookie if auth store doesn't have it
    const getRoleFromCookie = () => {
      if (typeof document !== 'undefined') {
        const cookies = document.cookie.split(';');
        const roleCookie = cookies.find(cookie => cookie.trim().startsWith('role='));
        if (roleCookie) {
          return roleCookie.split('=')[1];
        }
      }
      return null;
    };
    
    const finalRole = userRole || getRoleFromCookie() || 'student';
    
    console.log('FormModal: User from store:', user);
    console.log('FormModal: User role from store:', userRole);
    console.log('FormModal: User prefs:', user?.prefs);
    console.log('FormModal: Final role being used:', finalRole);
    
    const [state, formAction] = useFormState(deleteActionMap[table], {
      success: false,
      error: false,
    });

    const router = useRouter();

    useEffect(() => {
      if (state.success) {
        toast(`${table} has been deleted!`);
        setOpen(false);
        router.refresh();
      } else if (state.error) {
        toast.error(`Failed to delete ${table}. Please try again.`);
      }
    }, [state, router, table]);

    console.log('FormModal: Rendering form for table:', table, 'type:', type);
    console.log('FormModal: Available forms:', Object.keys(forms));
    
    return type === "delete" && id ? (
      <form action={formAction} className="p-4 flex flex-col gap-4">
        <input type="hidden" name="id" value={id} />
        <input type="hidden" name="userRole" value={finalRole} />
        <span className="text-center font-medium text-blue-800 dark:text-blue-100 text-lg">
          All data will be lost. Are you sure you want to delete this {table}?
        </span>
        <button className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md border-none w-max self-center transition-colors">
          Delete
        </button>
      </form>
    ) : type === "create" || type === "update" ? (
      forms[table] ? forms[table](setOpen, type, data, relatedData) : (
        <div className="p-4 text-center">
          <p className="text-blue-600 dark:text-blue-300">Form for {table} is not yet implemented.</p>
          <button 
            onClick={() => setOpen(false)}
            className="mt-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors"
          >
            Close
          </button>
        </div>
      )
    ) : (
      "Form not found!"
    );
  };

  return (
    <>
      <button
        className={`${size} flex items-center justify-center rounded-full ${bgColor}`}
        onClick={() => setOpen(true)}
      >
        <Image src={`/${type}.png`} alt="" width={16} height={16} />
      </button>
      {open && (
        <div className="w-screen h-screen absolute left-0 top-0 bg-black bg-opacity-60 z-50 flex items-center justify-center">
          <div className="bg-blue-50 dark:bg-blue-800 p-4 rounded-md relative w-[90%] md:w-[70%] lg:w-[60%] xl:w-[50%] 2xl:w-[40%]">
            <Form />
            <div
              className="absolute top-4 right-4 cursor-pointer"
              onClick={() => setOpen(false)}
            >
              <Image src="/close.png" alt="" width={14} height={14} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FormModal;
