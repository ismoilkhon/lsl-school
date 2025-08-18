import { getDocuments, COLLECTIONS } from "@/lib/appwrite";
import FormModal from "./FormModal";

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

  // TODO: Replace with proper authentication
  const role = "admin"; // Hardcoded for now
  const currentUserId = "temp_user_id";

  if (type !== "delete") {
    switch (table) {
      case "subject":
        const subjectTeachersRes = await getDocuments(COLLECTIONS.TEACHERS);
        relatedData = { teachers: subjectTeachersRes.documents };
        break;
      case "class":
        const classGradesRes = await getDocuments(COLLECTIONS.GRADES);
        const classTeachersRes = await getDocuments(COLLECTIONS.TEACHERS);
        relatedData = { teachers: classTeachersRes.documents, grades: classGradesRes.documents };
        break;
      case "teacher":
        const teacherSubjectsRes = await getDocuments(COLLECTIONS.SUBJECTS);
        relatedData = { subjects: teacherSubjectsRes.documents };
        break;
      case "student":
        const studentGradesRes = await getDocuments(COLLECTIONS.GRADES);
        const studentClassesRes = await getDocuments(COLLECTIONS.CLASSES);
        relatedData = { classes: studentClassesRes.documents, grades: studentGradesRes.documents };
        break;
      case "exam":
        const examLessonsRes = await getDocuments(COLLECTIONS.LESSONS);
        relatedData = { lessons: examLessonsRes.documents };
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
