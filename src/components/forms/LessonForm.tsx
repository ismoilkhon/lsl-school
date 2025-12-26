"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputField from "../InputField";
import { Dispatch, SetStateAction } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/auth-store";
import { useSubjects, useClasses, useTeachers, useCreateLesson, useUpdateLesson } from "@/lib/hooks/useQueries";

const lessonSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1),
  day: z.enum(["Monday","Tuesday","Wednesday","Thursday","Friday"]),
  startTime: z.string().min(1),
  endTime: z.string().min(1),
  subjectId: z.union([z.string(), z.number()]),
  classId: z.union([z.string(), z.number()]),
  teacherId: z.string().min(1),
});

type LessonSchema = z.infer<typeof lessonSchema>;

export default function LessonForm({
  type,
  data,
  setOpen,
}: {
  type: "create" | "update";
  data?: any;
  setOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const { getUserRole } = useAuthStore();
  const role = getUserRole();
  const isAdmin = role === "admin";

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LessonSchema>({ resolver: zodResolver(lessonSchema) });

  const { data: subjects = [] } = useSubjects();
  const { data: classes = [] } = useClasses();
  const { data: teachers = [] } = useTeachers();
  const createLessonMutation = useCreateLesson();
  const updateLessonMutation = useUpdateLesson();

  const router = useRouter();

  // Pre-fill form data for updates
  if (data && type === "update") {
    setValue("name", data.name || "");
    setValue("day", data.day || "Monday");
    setValue("startTime", data.startTime || "");
    setValue("endTime", data.endTime || "");
    setValue("subjectId", data.subjectId || "");
    setValue("classId", data.classId || "");
    setValue("teacherId", data.teacherId || "");
  }

  const onSubmit = handleSubmit(async (formData) => {
    if (!isAdmin) {
      toast.error("Only admin can add or edit lessons");
      return;
    }

    try {
      const lessonData = {
        name: formData.name,
        day: formData.day,
        startTime: formData.startTime,
        endTime: formData.endTime,
        subjectId: String(formData.subjectId || ''),
        classId: String(formData.classId || ''),
        teacherId: formData.teacherId,
        room: 'Room 101', // Default room
        isActive: true
      };

      if (type === "create") {
        await createLessonMutation.mutateAsync(lessonData);
        toast.success("Lesson has been created!");
      } else {
        await updateLessonMutation.mutateAsync({ id: data.$id, data: lessonData });
        toast.success("Lesson has been updated!");
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
        <h1 className="text-lg font-semibold text-center text-gray-800 sticky top-0 bg-white py-2 border-b">
          {type === "create" ? "Create a new lesson" : "Update the lesson"}
        </h1>
        
        <div className="bg-gray-50 p-4 rounded-lg">
          <h2 className="text-base font-semibold mb-3 text-gray-700">Lesson Information</h2>
          <div className="flex flex-wrap gap-4">
        <InputField label="Name" name="name" defaultValue={data?.name} register={register} error={errors.name} />
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Day</label>
          <select className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full" {...register("day")} defaultValue={data?.day}>
            <option value="Monday">Monday</option>
            <option value="Tuesday">Tuesday</option>
            <option value="Wednesday">Wednesday</option>
            <option value="Thursday">Thursday</option>
            <option value="Friday">Friday</option>
          </select>
        </div>
        <InputField label="Start" name="startTime" type="datetime-local" defaultValue={data?.startTime} register={register} error={errors.startTime} />
        <InputField label="End" name="endTime" type="datetime-local" defaultValue={data?.endTime} register={register} error={errors.endTime} />
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Subject</label>
          <select className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full" {...register("subjectId")} defaultValue={data?.subjectId}>
            {subjects.map((subject) => (
              <option key={subject.$id} value={subject.$id}>{subject.name}</option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Class</label>
          <select className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full" {...register("classId")} defaultValue={data?.classId}>
            {classes.map((classItem) => (
              <option key={classItem.$id} value={classItem.$id}>{classItem.name}</option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Teacher</label>
          <select className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full" {...register("teacherId")} defaultValue={data?.teacherId}>
            {teachers.map((teacher) => (
              <option key={teacher.$id} value={teacher.$id}>{teacher.name} {teacher.surname}</option>
            ))}
          </select>
        </div>
        {data?.$id && (
          <InputField label="Id" name="id" defaultValue={data.$id} register={register} hidden error={undefined} />
        )}
          </div>
        </div>

        <div className="sticky bottom-0 bg-white py-4 border-t">
          <button 
            type="submit" 
            className="w-full bg-primary text-primary-foreground px-4 py-3 rounded-md disabled:opacity-50 font-medium" 
            disabled={!isAdmin || createLessonMutation.isPending || updateLessonMutation.isPending}
          >
            {createLessonMutation.isPending || updateLessonMutation.isPending 
              ? "Processing..." 
              : type === "create" ? "Create" : "Update"
            }
          </button>
          {!isAdmin && <p className="text-xs text-gray-500 mt-2 text-center">Only admin can add or edit lessons. You have read-only access.</p>}
        </div>
      </form>
    </div>
  );
}


