"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import InputField from "../InputField";
import { assignmentSchema, AssignmentSchema } from "@/lib/formValidationSchemas";
import { Dispatch, SetStateAction } from "react";
import { toast } from "react-toastify";
import { useAuthStore } from "@/lib/auth-store";
import { useLessons, useCreateAssignment, useUpdateAssignment } from "@/lib/hooks/useQueries";
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

const AssignmentForm = ({
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

  const initialValues = useMemo(
    () => ({
      id: data?.$id || undefined,
      title: data?.title || "",
      description: data?.description || "",
      startDate: formatDateTimeLocal(data?.startDate),
      dueDate: formatDateTimeLocal(data?.dueDate),
      lessonId: data?.lessonId ? String(data.lessonId) : "",
      maxScore: data?.maxScore ?? 100,
      isActive: data?.isActive ?? true,
    }),
    [data]
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AssignmentSchema>({
    resolver: zodResolver(assignmentSchema),
    defaultValues: initialValues,
  });

  const { data: lessons = [], isLoading: lessonsLoading, error: lessonsError } = useLessons();
  const createAssignmentMutation = useCreateAssignment();
  const updateAssignmentMutation = useUpdateAssignment();
  const onSubmit = handleSubmit(async (formData) => {
    if (!isAuthorized) {
      toast.error("Only administrators or teachers can manage assignments.");
      return;
    }

    try {
      const payload: any = {
        title: formData.title,
        description: formData.description?.trim() || "",
        startDate: toISOStringOrThrow(formData.startDate),
        dueDate: toISOStringOrThrow(formData.dueDate),
        lessonId: String(formData.lessonId),
        // TODO: Add maxScore back after running: node scripts/add-assignment-maxscore.js
        // The maxScore attribute needs to be added to the Appwrite assignments collection first
        // maxScore: formData.maxScore ?? 100,
        isActive: formData.isActive ?? true,
      };

      if (type === "create") {
        await createAssignmentMutation.mutateAsync(payload);
        toast.success("Assignment has been created!");
      } else if (data?.$id) {
        await updateAssignmentMutation.mutateAsync({ id: data.$id, data: payload });
        toast.success("Assignment has been updated!");
      }

      await revalidateDashboardPath("/list/assignments");
      setOpen(false);
    } catch (error) {
      toast.error("Failed to save assignment. Please try again.");
      console.error("Assignment form submission error:", error);
    }
  });

  if (!isAuthorized) {
    return (
      <div className="flex items-center justify-center p-8 text-center">
        <p className="text-sm text-destructive">
          You do not have permission to manage assignments. Please contact an administrator.
        </p>
      </div>
    );
  }

  if (lessonsError) {
    return (
      <div className="flex items-center justify-center p-8 text-center">
        <p className="text-sm text-destructive">Failed to load lessons. Please refresh and try again.</p>
      </div>
    );
  }

  return (
    <div className="max-h-screen overflow-y-auto">
      <form className="flex flex-col gap-4 max-w-3xl mx-auto p-4" onSubmit={onSubmit}>
        <h1 className="text-lg font-semibold text-center text-foreground sticky top-0 bg-background py-2 border-b">
          {type === "create" ? "Create a new assignment" : "Update assignment"}
        </h1>

        <div className="bg-muted/40 p-4 rounded-lg space-y-4">
          <InputField
            label="Assignment title"
            name="title"
            defaultValue={initialValues.title}
            register={register}
            error={errors.title}
          />

          <InputField
            label="Description"
            name="description"
            defaultValue={initialValues.description}
            register={register}
            error={errors.description}
            textarea
            placeholder="Add details or instructions..."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              label="Start date"
              name="startDate"
              type="datetime-local"
              defaultValue={initialValues.startDate}
              register={register}
              error={errors.startDate}
            />
            <InputField
              label="Due date"
              name="dueDate"
              type="datetime-local"
              defaultValue={initialValues.dueDate}
              register={register}
              error={errors.dueDate}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-xs text-muted-foreground">Lesson</label>
              <select
                className="ring-[1.5px] ring-border p-3 rounded-md text-sm focus:ring-ring focus:border-ring"
                {...register("lessonId")}
                defaultValue={initialValues.lessonId}
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

            <InputField
              label="Max score"
              name="maxScore"
              type="number"
              defaultValue={String(initialValues.maxScore)}
              register={register}
              error={errors.maxScore}
              inputProps={{ min: 0 }}
            />
          </div>
        </div>

        <div className="sticky bottom-0 bg-background py-4 border-t flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <button
            type="submit"
            className="w-full md:w-auto bg-primary text-primary-foreground px-4 py-2 rounded-md font-medium disabled:opacity-60 disabled:cursor-not-allowed"
            disabled={
              lessonsLoading ||
              createAssignmentMutation.isPending ||
              updateAssignmentMutation.isPending ||
              isSubmitting
            }
          >
            {createAssignmentMutation.isPending || updateAssignmentMutation.isPending
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

export default AssignmentForm;

