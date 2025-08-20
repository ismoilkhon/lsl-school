import { adminListDocuments } from "@/lib/appwrite-admin";
import { COLLECTIONS } from "@/lib/appwrite";
import { Query } from "node-appwrite";
import FormModal from "./FormModal";
import dynamic from "next/dynamic";

export type FormContainerProps = {
  table:
    | "teacher"
    | "student"
    | "parent"
    | "subject"
    | "class"
    | "lesson"
    | "exam"
    | "assignment"
    | "result"
    | "attendance"
    | "event"
    | "announcement";
  type: "create" | "update" | "delete";
  data?: any;
  id?: number | string;
};

const FormContainer = async ({ table, type, data, id }: FormContainerProps) => {
  let relatedData = {};

  // Role-based visibility can be refined per form if needed using middleware-enforced pages

  if (type !== "delete") {
    switch (table) {
      case "subject":
        const subjectTeachersRes = await adminListDocuments(COLLECTIONS.TEACHERS, [Query.limit(100)]);
        relatedData = { teachers: subjectTeachersRes.documents };
        break;
      case "class":
        const classGradesRes = await adminListDocuments(COLLECTIONS.GRADES, [Query.limit(100)]);
        const classTeachersRes = await adminListDocuments(COLLECTIONS.TEACHERS, [Query.limit(100)]);
        relatedData = { teachers: classTeachersRes.documents, grades: classGradesRes.documents };
        break;
      case "teacher":
        const teacherSubjectsRes = await adminListDocuments(COLLECTIONS.SUBJECTS, [Query.limit(100)]);
        relatedData = { subjects: teacherSubjectsRes.documents };
        break;
      case "student":
        const studentGradesRes = await adminListDocuments(COLLECTIONS.GRADES, [Query.limit(100)]);
        const studentClassesRes = await adminListDocuments(COLLECTIONS.CLASSES, [Query.limit(100)]);
        relatedData = { classes: studentClassesRes.documents, grades: studentGradesRes.documents };
        break;
      case "exam":
        const examLessonsRes = await adminListDocuments(COLLECTIONS.LESSONS, [Query.limit(100)]);
        relatedData = { lessons: examLessonsRes.documents };
        break;
      case "event":
        // could fetch classes to pick an audience
        const classesRes = await adminListDocuments(COLLECTIONS.CLASSES, [Query.limit(100)]);
        relatedData = { classes: classesRes.documents };
        break;

      default:
        break;
    }
  }

  return (
    <div className="">
      <FormModal
        table={table}
        type={type}
        data={data}
        id={id}
        relatedData={relatedData}
      />
    </div>
  );
};

export default FormContainer;
