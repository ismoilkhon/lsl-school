"use client";
import { useEffect, useState } from "react";
import FormModal from "./FormModal";
import { useAuthStore } from "@/lib/auth-store";
import { useTeachers } from "@/lib/hooks/useQueries";

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

const FormContainer = ({ table, type, data, id }: FormContainerProps) => {
  const { getUserRole } = useAuthStore();
  const [relatedData, setRelatedData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const allowedRolesByTable: Partial<Record<FormContainerProps['table'], string[]>> = {
    attendance: ["admin", "teacher"],
    assignment: ["admin", "teacher"],
    exam: ["admin", "teacher"],
    result: ["admin", "teacher"],
  };

  // Fetch teachers data for subject forms
  const { data: teachers = [] } = useTeachers();

  useEffect(() => {
    const fetchRelatedData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Only fetch data for admin users
        const userRole = getUserRole();
        const allowedRoles = allowedRolesByTable[table] || ["admin"];
        if (!userRole || !allowedRoles.includes(userRole)) {
          setError(
            allowedRoles.includes("admin") && !allowedRoles.includes("teacher")
              ? "Access denied. Admin privileges required."
              : "Access denied. You do not have permission to manage this resource."
          );
          setLoading(false);
          return;
        }

        // Set related data based on table type
        if (table === 'subject') {
          setRelatedData({ teachers });
        } else {
          setRelatedData({});
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching form data:', err);
        setError('Failed to load form data');
        setLoading(false);
      }
    };

    if (type !== "delete") {
      fetchRelatedData();
    } else {
      setLoading(false);
    }
  }, [table, type, getUserRole, teachers]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-gray-500 text-sm">{error}</p>
      </div>
    );
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
