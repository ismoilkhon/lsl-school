"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputField from "../InputField";
import { examSchema, ExamSchema } from "@/lib/formValidationSchemas";
import { Dispatch, SetStateAction, useEffect } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useLessons, useCreateExam, useUpdateExam } from "@/lib/hooks/useQueries";

const ExamForm = ({
  type,
  data,
  setOpen,
}: {
  type: "create" | "update";
  data?: any;
  setOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ExamSchema>({
    resolver: zodResolver(examSchema),
  });

  const { data: lessons = [] } = useLessons();
  const createExamMutation = useCreateExam();
  const updateExamMutation = useUpdateExam();

  const router = useRouter();

  // Pre-fill form data for updates
  useEffect(() => {
  if (data && type === "update") {
    setValue("title", data.title || "");
    setValue("description", data.description || "");
      setValue("lessonId", data.lessonId ? Number(data.lessonId) : 0);
    setValue("maxScore", data.maxScore || 100);
      // Note: startTime and endTime are handled via defaultValue in InputField
      // The schema will coerce the string input to Date objects
  }
  }, [data, type, setValue]);

  const onSubmit = handleSubmit(async (formData) => {
    try {
      // Convert Date objects to ISO strings
      const startTime = formData.startTime instanceof Date 
        ? formData.startTime.toISOString() 
        : formData.startTime 
          ? new Date(formData.startTime).toISOString() 
          : new Date().toISOString();
      
      const endTime = formData.endTime instanceof Date 
        ? formData.endTime.toISOString() 
        : formData.endTime 
          ? new Date(formData.endTime).toISOString() 
          : new Date().toISOString();

      const examData = {
        title: formData.title,
        description: formData.description || '',
        startTime,
        endTime,
        lessonId: String(formData.lessonId || ''),
        maxScore: formData.maxScore || 100,
        isActive: true
      };

      if (type === "create") {
        await createExamMutation.mutateAsync(examData);
        toast.success("Exam has been created!");
      } else {
        await updateExamMutation.mutateAsync({ id: data.$id, data: examData });
        toast.success("Exam has been updated!");
      }
      
      setOpen(false);
      router.refresh();
    } catch (error) {
      toast.error("Operation failed");
      console.error("Form submission error:", error);
    }
  });

  return (
    <div className="max-h-screen overflow-y-auto">
      <form className="flex flex-col gap-4 max-w-4xl mx-auto p-4" onSubmit={onSubmit}>
        <h1 className="text-lg font-semibold text-center text-foreground sticky top-0 bg-background py-2 border-b">
          {type === "create" ? "Create a new exam" : "Update the exam"}
        </h1>

        <div className="bg-muted p-4 rounded-lg">
          <h2 className="text-base font-semibold mb-3 text-foreground">Exam Information</h2>
          <div className="flex justify-between flex-wrap gap-4">
        <InputField
          label="Exam title"
          name="title"
          defaultValue={data?.title}
          register={register}
          error={errors?.title}
        />
        <InputField
          label="Description"
          name="description"
          defaultValue={data?.description}
          register={register}
          error={errors?.description}
        />
        <InputField
          label="Start Date"
          name="startTime"
          defaultValue={data?.startTime 
            ? (typeof data.startTime === 'string' 
                ? new Date(data.startTime).toISOString().slice(0, 16)
                : data.startTime instanceof Date
                  ? data.startTime.toISOString().slice(0, 16)
                  : '')
            : ''}
          register={register}
          error={errors?.startTime}
          type="datetime-local"
        />
        <InputField
          label="End Date"
          name="endTime"
          defaultValue={data?.endTime 
            ? (typeof data.endTime === 'string' 
                ? new Date(data.endTime).toISOString().slice(0, 16)
                : data.endTime instanceof Date
                  ? data.endTime.toISOString().slice(0, 16)
                  : '')
            : ''}
          register={register}
          error={errors?.endTime}
          type="datetime-local"
        />
        <InputField
          label="Max Score"
          name="maxScore"
          defaultValue={data?.maxScore}
          register={register}
          error={errors?.maxScore}
          type="number"
        />
        {data && (
          <InputField
            label="Id"
            name="id"
            defaultValue={data?.id}
            register={register}
            error={errors?.id}
            hidden
          />
        )}
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-muted-foreground">Lesson</label>
          <select
            className="ring-[1.5px] ring-border p-2 rounded-md text-sm w-full"
            {...register("lessonId")}
            defaultValue={data?.lessonId}
          >
            <option value="">Select a lesson</option>
            {lessons.map((lesson) => (
              <option value={lesson.$id} key={lesson.$id}>
                {lesson.name}
              </option>
            ))}
          </select>
          {errors.lessonId?.message && (
            <p className="text-xs text-destructive">
              {errors.lessonId.message.toString()}
            </p>
          )}
        </div>
          </div>
        </div>

        <div className="sticky bottom-0 bg-background py-4 border-t">
          <button 
            type="submit" 
            className="w-full bg-primary text-primary-foreground p-3 rounded-md font-medium"
            disabled={createExamMutation.isPending || updateExamMutation.isPending}
          >
            {createExamMutation.isPending || updateExamMutation.isPending 
              ? "Processing..." 
              : type === "create" ? "Create" : "Update"
            }
          </button>
        </div>
      </form>
    </div>
  );
};

export default ExamForm;
