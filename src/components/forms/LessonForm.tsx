"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputField from "../InputField";
import { useFormState } from "react-dom";
import { createLesson, updateLesson } from "@/lib/actions";
import { Dispatch, SetStateAction, useEffect } from "react";
import { toast } from "react-toastify";
import { useAuthStore } from "@/lib/auth-store";

const lessonSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1),
  day: z.enum(["MONDAY","TUESDAY","WEDNESDAY","THURSDAY","FRIDAY"]),
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
  relatedData,
}: {
  type: "create" | "update";
  data?: any;
  setOpen: Dispatch<SetStateAction<boolean>>;
  relatedData?: any;
}) {
  const { getUserRole } = useAuthStore();
  const role = getUserRole();
  const isAdmin = role === "admin";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LessonSchema>({ resolver: zodResolver(lessonSchema) });

  const [state, formAction] = useFormState(
    type === "create" ? createLesson : updateLesson,
    { success: false, error: false } as any
  );

  const onSubmit = handleSubmit(async (form) => {
    if (!isAdmin) {
      toast.error("Only admin can add or edit lessons");
      return;
    }
    formAction(form as any);
  });

  useEffect(() => {
    if (state.success) {
      toast(`Lesson has been ${type === "create" ? "created" : "updated"}!`);
      setOpen(false);
    }
  }, [state, setOpen, type]);

  const { subjects = [], classes = [], teachers = [] } = relatedData || {};

  return (
    <form className="flex flex-col gap-6" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">
        {type === "create" ? "Create a new lesson" : "Update the lesson"}
      </h1>
      <div className="flex flex-wrap gap-4">
        <InputField label="Name" name="name" defaultValue={data?.name} register={register} error={errors.name} />
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Day</label>
          <select className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full" {...register("day")} defaultValue={data?.day}>
            <option value="MONDAY">Monday</option>
            <option value="TUESDAY">Tuesday</option>
            <option value="WEDNESDAY">Wednesday</option>
            <option value="THURSDAY">Thursday</option>
            <option value="FRIDAY">Friday</option>
          </select>
        </div>
        <InputField label="Start" name="startTime" type="datetime-local" defaultValue={data?.startTime} register={register} error={errors.startTime} />
        <InputField label="End" name="endTime" type="datetime-local" defaultValue={data?.endTime} register={register} error={errors.endTime} />
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Subject</label>
          <select className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full" {...register("subjectId")} defaultValue={data?.subjectId}>
            {subjects.map((s: any) => (
              <option key={s.$id || s.id} value={s.id || s.$id}>{s.name}</option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Class</label>
          <select className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full" {...register("classId")} defaultValue={data?.classId}>
            {classes.map((c: any) => (
              <option key={c.id || c.$id} value={c.id || c.$id}>{c.name}</option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Teacher</label>
          <select className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full" {...register("teacherId")} defaultValue={data?.teacherId}>
            {teachers.map((t: any) => (
              <option key={t.$id} value={t.$id}>{t.name} {t.surname}</option>
            ))}
          </select>
        </div>
        {data?.$id && (
          <InputField label="Id" name="id" defaultValue={data.$id} register={register} hidden error={undefined} />
        )}
      </div>
      {state.error && <span className="text-red-500">Something went wrong!</span>}
      <button className="bg-blue-600 text-white px-4 py-2 rounded-md disabled:opacity-50" disabled={!isAdmin}>
        {type === "create" ? "Create" : "Update"}
      </button>
      {!isAdmin && <p className="text-xs text-gray-500">Only admin can add or edit lessons. You have read-only access.</p>}
    </form>
  );
}


