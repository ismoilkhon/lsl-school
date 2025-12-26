"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import InputField from "../InputField";
import { resultSchema, ResultSchema } from "@/lib/formValidationSchemas";
import { Dispatch, SetStateAction } from "react";
import { toast } from "react-toastify";
import { useAuthStore } from "@/lib/auth-store";
import {
  useStudents,
  useExams,
  useAssignments,
  useCreateResult,
  useUpdateResult,
} from "@/lib/hooks/useQueries";
import { revalidateDashboardPath } from "@/lib/appwrite-actions";

const formatDateTimeLocal = (value?: string | null) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const tzOffset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - tzOffset).toISOString().slice(0, 16);
};

const toISOStringOrThrow = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    throw new Error("Invalid date value");
  }
  return date.toISOString();
};

type ResultSource = "exam" | "assignment";

const ResultForm = ({
  type,
  data,
  setOpen,
}: {
  type: "create" | "update";
  data?: any;
  setOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const { getUserRole } = useAuthStore();
  const role = getUserRole();
  const isAuthorized = role === "admin" || role === "teacher";

  const initialSource: ResultSource = useMemo(() => {
    if (data?.assignmentId) return "assignment";
    return "exam";
  }, [data]);

  const initialValues = useMemo(
    () => ({
      id: data?.$id || undefined,
      score: data?.score ?? 0,
      examId: data?.examId ? String(data.examId) : "",
      assignmentId: data?.assignmentId ? String(data.assignmentId) : "",
      studentId: data?.studentId ? String(data.studentId) : "",
      submittedAt: formatDateTimeLocal(data?.submittedAt),
      comments: data?.comments || "",
    }),
    [data]
  );

  const [source, setSource] = useState<ResultSource>(initialSource);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm<ResultSchema>({
    resolver: zodResolver(resultSchema),
    defaultValues: initialValues,
  });

  useEffect(() => {
    setSource(initialSource);
  }, [initialSource]);

  const { data: students = [], isLoading: studentsLoading, error: studentsError } = useStudents();
  const { data: exams = [], isLoading: examsLoading, error: examsError } = useExams();
  const { data: assignments = [], isLoading: assignmentsLoading, error: assignmentsError } = useAssignments();

  const createResultMutation = useCreateResult();
  const updateResultMutation = useUpdateResult();

  const handleSourceChange = (nextSource: ResultSource) => {
    setSource(nextSource);
    if (nextSource === "exam") {
      setValue("assignmentId", "");
    } else {
      setValue("examId", "");
    }
  };

  const onSubmit = handleSubmit(async (formData) => {
    if (!isAuthorized) {
      toast.error("Only administrators or teachers can manage results.");
      return;
    }

    try {
      const payload = {
        score: formData.score,
        examId: source === "exam" ? (formData.examId || undefined) : undefined,
        assignmentId: source === "assignment" ? (formData.assignmentId || undefined) : undefined,
        studentId: formData.studentId,
        submittedAt: toISOStringOrThrow(formData.submittedAt),
        comments: formData.comments?.trim() || "",
      };

      if (type === "create") {
        await createResultMutation.mutateAsync(payload);
        toast.success("Result has been recorded!");
      } else if (data?.$id) {
        await updateResultMutation.mutateAsync({ id: data.$id, data: payload });
        toast.success("Result has been updated!");
      }

      await revalidateDashboardPath("/list/results");
      setOpen(false);
    } catch (error) {
      toast.error("Failed to save result. Please try again.");
      console.error("Result form submission error:", error);
    }
  });

  if (!isAuthorized) {
    return (
      <div className="flex items-center justify-center p-8 text-center">
        <p className="text-sm text-destructive">
          You do not have permission to manage results. Please contact an administrator.
        </p>
      </div>
    );
  }

  if (studentsError || examsError || assignmentsError) {
    return (
      <div className="flex items-center justify-center p-8 text-center">
        <p className="text-sm text-destructive">
          Failed to load required data. Please refresh and try again.
        </p>
      </div>
    );
  }

  return (
    <div className="max-h-screen overflow-y-auto">
      <form className="flex flex-col gap-4 max-w-3xl mx-auto p-4" onSubmit={onSubmit}>
        <h1 className="text-lg font-semibold text-center text-foreground sticky top-0 bg-background py-2 border-b">
          {type === "create" ? "Record a result" : "Update result"}
        </h1>

        <div className="bg-muted/40 p-4 rounded-lg space-y-4">
          <div>
            <span className="text-xs uppercase font-semibold text-muted-foreground">Result type</span>
            <div className="mt-2 flex gap-2">
              <button
                type="button"
                onClick={() => handleSourceChange("exam")}
                className={`px-3 py-2 rounded-md border text-sm ${
                  source === "exam" ? "border-primary text-primary bg-primary/10" : "border-border hover:bg-muted"
                }`}
              >
                Exam
              </button>
              <button
                type="button"
                onClick={() => handleSourceChange("assignment")}
                className={`px-3 py-2 rounded-md border text-sm ${
                  source === "assignment"
                    ? "border-primary text-primary bg-primary/10"
                    : "border-border hover:bg-muted"
                }`}
              >
                Assignment
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              label="Score"
              name="score"
              type="number"
              defaultValue={String(initialValues.score)}
              register={register}
              error={errors.score}
              inputProps={{ min: 0 }}
            />

            <div className="flex flex-col gap-2">
              <label className="text-xs text-muted-foreground">Student</label>
              <select
                className="ring-[1.5px] ring-border p-3 rounded-md text-sm focus:ring-ring focus:border-ring"
                {...register("studentId")}
                defaultValue={initialValues.studentId}
                disabled={studentsLoading}
              >
                <option value="">Select a student</option>
                {students.map((student: any) => (
                  <option key={student.$id} value={student.$id}>
                    {`${student.name ?? ""} ${student.surname ?? ""}`.trim() || student.username || student.$id}
                  </option>
                ))}
              </select>
              {errors.studentId && (
                <p className="text-xs text-destructive">{errors.studentId.message?.toString()}</p>
              )}
            </div>
          </div>

          {source === "exam" ? (
            <div className="flex flex-col gap-2">
              <label className="text-xs text-muted-foreground">Exam</label>
              <select
                className="ring-[1.5px] ring-border p-3 rounded-md text-sm focus:ring-ring focus:border-ring"
                {...register("examId")}
                defaultValue={initialValues.examId}
                disabled={examsLoading}
              >
                <option value="">Select an exam</option>
                {exams.map((exam: any) => (
                  <option key={exam.$id} value={exam.$id}>
                    {exam.title || exam.name || exam.$id}
                  </option>
                ))}
              </select>
              {(errors.examId || errors.assignmentId) && (
                <p className="text-xs text-destructive">
                  {(errors.examId || errors.assignmentId)?.message?.toString()}
                </p>
              )}
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <label className="text-xs text-muted-foreground">Assignment</label>
              <select
                className="ring-[1.5px] ring-border p-3 rounded-md text-sm focus:ring-ring focus:border-ring"
                {...register("assignmentId")}
                defaultValue={initialValues.assignmentId}
                disabled={assignmentsLoading}
              >
                <option value="">Select an assignment</option>
                {assignments.map((assignment: any) => (
                  <option key={assignment.$id} value={assignment.$id}>
                    {assignment.title || assignment.name || assignment.$id}
                  </option>
                ))}
              </select>
              {(errors.examId || errors.assignmentId) && (
                <p className="text-xs text-destructive">
                  {(errors.assignmentId || errors.examId)?.message?.toString()}
                </p>
              )}
            </div>
          )}

          <InputField
            label="Submitted at"
            name="submittedAt"
            type="datetime-local"
            defaultValue={initialValues.submittedAt}
            register={register}
            error={errors.submittedAt}
          />

          <InputField
            label="Comments (optional)"
            name="comments"
            defaultValue={initialValues.comments}
            register={register}
            error={errors.comments}
            textarea
            placeholder="Add feedback or notes (optional)"
          />
        </div>

        <div className="sticky bottom-0 bg-background py-4 border-t flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <button
            type="submit"
            className="w-full md:w-auto bg-primary text-primary-foreground px-4 py-2 rounded-md font-medium disabled:opacity-60 disabled:cursor-not-allowed"
            disabled={
              studentsLoading ||
              examsLoading ||
              assignmentsLoading ||
              createResultMutation.isPending ||
              updateResultMutation.isPending ||
              isSubmitting
            }
          >
            {createResultMutation.isPending || updateResultMutation.isPending
              ? "Saving..."
              : type === "create"
              ? "Create"
              : "Update"}
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

export default ResultForm;

