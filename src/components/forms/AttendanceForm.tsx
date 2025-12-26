"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { Dispatch, SetStateAction, useMemo } from "react";
import { AttendanceSchema, attendanceSchema } from "@/lib/formValidationSchemas";
import {
  useStudents,
  useLessons,
  useCreateAttendance,
  useUpdateAttendance,
} from "@/lib/hooks/useQueries";
import { useAuthStore } from "@/lib/auth-store";
import { toast } from "react-toastify";
import InputField from "../InputField";
import { revalidateDashboardPath } from "@/lib/appwrite-actions";

type AttendanceFormProps = {
  type: "create" | "update";
  data?: any;
  setOpen: Dispatch<SetStateAction<boolean>>;
  relatedData?: any;
};

const formatDateForInput = (value?: Date | null) => {
  if (!value || Number.isNaN(value.getTime())) return "";
  const year = value.getFullYear();
  const month = `${value.getMonth() + 1}`.padStart(2, "0");
  const day = `${value.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const AttendanceForm = ({ type, data, setOpen }: AttendanceFormProps) => {
  const { getUserRole, checkAuth, user } = useAuthStore();
  const role = getUserRole();
  const isAuthorized = role === "admin" || role === "teacher";

  if (!role && typeof window !== "undefined" && !user) {
    checkAuth();
  }

  const initialDate = useMemo(() => {
    if (data?.date) {
      const parsed = new Date(data.date);
      if (!Number.isNaN(parsed.getTime())) {
        return parsed;
      }
    }
    return new Date();
  }, [data?.date]);

  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AttendanceSchema>({
    resolver: zodResolver(attendanceSchema),
    defaultValues: {
      id: data?.$id,
      date: initialDate,
      studentId: data?.studentId || "",
      lessonId: data?.lessonId || "",
      present: data?.present ?? true,
      notes: data?.notes || "",
    },
  });

  const { data: students = [], isLoading: studentsLoading, error: studentsError } = useStudents();
  const { data: lessons = [], isLoading: lessonsLoading, error: lessonsError } = useLessons();

  const createAttendanceMutation = useCreateAttendance();
  const updateAttendanceMutation = useUpdateAttendance();

  const pending =
    createAttendanceMutation.isPending ||
    updateAttendanceMutation.isPending ||
    isSubmitting;

  const onSubmit = handleSubmit(async (formData) => {
    if (!isAuthorized) {
      toast.error("Only administrators or teachers can manage attendance records.");
      return;
    }

    if (!formData.studentId || !formData.lessonId) {
      toast.error("Student and lesson are required.");
      return;
    }

    const payload = {
      date: formData.date.toISOString(),
      present: formData.present,
      studentId: formData.studentId,
      lessonId: formData.lessonId,
      notes: formData.notes?.trim() || "",
    };

    try {
      if (type === "create") {
        await createAttendanceMutation.mutateAsync(payload);
        toast.success("Attendance has been recorded.");
      } else if (data?.$id) {
        await updateAttendanceMutation.mutateAsync({
          id: data.$id,
          data: payload,
        });
        toast.success("Attendance has been updated.");
      }
      await revalidateDashboardPath("/list/attendances");
      setOpen(false);
    } catch (error) {
      toast.error("Failed to save attendance. Please try again.");
      console.error("Attendance form submission error:", error);
    }
  });

  if (!isAuthorized) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <p className="text-sm text-destructive">
          You do not have permission to manage attendance records. Please contact an administrator.
        </p>
      </div>
    );
  }

  if (studentsError || lessonsError) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <p className="text-sm text-destructive">
          Failed to load required data. Please refresh the page and try again.
        </p>
      </div>
    );
  }

  return (
    <div className="max-h-screen overflow-y-auto">
      <form className="flex flex-col gap-4 max-w-3xl mx-auto p-4" onSubmit={onSubmit}>
        <h1 className="text-lg font-semibold text-center text-foreground sticky top-0 bg-background py-2 border-b">
          {type === "create" ? "Record attendance" : "Update attendance"}
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-foreground">Student</label>
            <select
              {...register("studentId")}
              className="ring-[1.5px] ring-border p-3 rounded-md text-sm w-full focus:ring-ring focus:border-ring"
              defaultValue={data?.studentId || ""}
              disabled={studentsLoading}
            >
              <option value="">Select a student</option>
              {students.map((student: any) => (
                <option key={student.$id} value={student.$id}>
                  {`${student.name} ${student.surname}`.trim() || student.username || student.$id}
                </option>
              ))}
            </select>
            {errors.studentId && (
              <p className="text-xs text-destructive">{errors.studentId.message?.toString()}</p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-foreground">Lesson</label>
            <select
              {...register("lessonId")}
              className="ring-[1.5px] ring-border p-3 rounded-md text-sm w-full focus:ring-ring focus:border-ring"
              defaultValue={data?.lessonId || ""}
              disabled={lessonsLoading}
            >
              <option value="">Select a lesson</option>
              {lessons.map((lesson: any) => (
                <option key={lesson.$id} value={lesson.$id}>
                  {lesson.name || lesson.title || lesson.$id}
                </option>
              ))}
            </select>
            {errors.lessonId && (
              <p className="text-xs text-destructive">{errors.lessonId.message?.toString()}</p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-foreground">Date</label>
            <Controller
              control={control}
              name="date"
              render={({ field }) => (
                <input
                  type="date"
                  value={formatDateForInput(field.value)}
                  onChange={(event) => {
                    const value = event.target.value;
                    if (value) {
                      field.onChange(new Date(`${value}T00:00:00`));
                    } else {
                      field.onChange(new Date());
                    }
                  }}
                  className="ring-[1.5px] ring-border p-3 rounded-md text-sm w-full focus:ring-ring focus:border-ring"
                />
              )}
            />
            {errors.date && (
              <p className="text-xs text-destructive">{errors.date.message?.toString()}</p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-foreground">Status</label>
            <label className="inline-flex items-center gap-2 text-sm text-foreground">
              <input
                type="checkbox"
                {...register("present")}
                defaultChecked={data?.present ?? true}
                className="h-4 w-4 rounded border border-border text-primary focus:ring-primary"
              />
              Present
            </label>
            <p className="text-xs text-muted-foreground">
              Uncheck to mark as absent.
            </p>
            {errors.present && (
              <p className="text-xs text-destructive">{errors.present.message?.toString()}</p>
            )}
          </div>
        </div>

        <InputField
          label="Notes (optional)"
          name="notes"
          register={register}
          error={errors.notes as any}
          textarea
          placeholder="Add any relevant notes..."
        />

        <div className="sticky bottom-0 bg-background py-4 border-t flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <button
            type="submit"
            className="w-full md:w-auto bg-primary text-primary-foreground px-4 py-2 rounded-md font-medium disabled:opacity-60 disabled:cursor-not-allowed"
            disabled={pending || studentsLoading || lessonsLoading}
          >
            {pending ? "Saving..." : type === "create" ? "Create" : "Update"}
          </button>
          <button
            type="button"
            className="w-full md:w-auto px-4 py-2 rounded-md border border-border text-foreground hover:bg-muted transition-colors"
            onClick={() => setOpen(false)}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AttendanceForm;

