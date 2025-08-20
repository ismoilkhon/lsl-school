"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputField from "../InputField";
import { storage, BUCKET_ID } from "@/lib/appwrite";
import { useFormState } from "react-dom";
import { createEvent, updateEvent } from "@/lib/actions";
import { Dispatch, SetStateAction, useEffect } from "react";
import { toast } from "react-toastify";
import { useAuthStore } from "@/lib/auth-store";

const eventSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1),
  description: z.string().min(1),
  startTime: z.string().min(1),
  endTime: z.string().min(1),
  classId: z.union([z.string(), z.number()]).optional().nullable(),
  img: z.string().optional().nullable(),
});

type EventSchema = z.infer<typeof eventSchema>;

export default function EventForm({
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
  const isAdmin = role === 'admin';

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EventSchema>({ resolver: zodResolver(eventSchema) });

  const [state, formAction] = useFormState(
    type === 'create' ? createEvent : updateEvent,
    { success: false, error: false } as any
  );

  const onSubmit = handleSubmit(async (form) => {
    if (!isAdmin) {
      toast.error('Only admin can add or edit events');
      return;
    }
    // handle file upload if provided via a "file" input name
    const fileInput = (document.querySelector('input[name="file"]') as HTMLInputElement) || null;
    if (fileInput && fileInput.files && fileInput.files[0]) {
      try {
        const created = await storage.createFile(BUCKET_ID, "unique()", fileInput.files[0]);
        (form as any).img = created.$id;
      } catch (e) {
        toast.error('Image upload failed');
      }
    }
    formAction(form as any);
  });

  useEffect(() => {
    if (state.success) {
      toast(`Event has been ${type === 'create' ? 'created' : 'updated'}!`);
      setOpen(false);
    }
  }, [state, setOpen, type]);

  return (
    <form className="flex flex-col gap-6" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">
        {type === 'create' ? 'Create a new event' : 'Update the event'}
      </h1>
      <div className="flex flex-wrap gap-4">
        <InputField label="Title" name="title" defaultValue={data?.title} register={register} error={errors.title} />
        <InputField label="Description" name="description" defaultValue={data?.description} register={register} error={errors.description} />
        <InputField label="Start" name="startTime" type="datetime-local" defaultValue={data?.startTime} register={register} error={errors.startTime} />
        <InputField label="End" name="endTime" type="datetime-local" defaultValue={data?.endTime} register={register} error={errors.endTime} />
        <InputField label="Class Id (optional)" name="classId" defaultValue={data?.classId} register={register} error={errors.classId as any} />
        <div className="flex flex-col gap-2 w-full md:w-1/3">
          <label className="text-xs text-gray-500">Image</label>
          <input type="file" name="file" accept="image/*" />
        </div>
        {data?.$id && (
          <InputField label="Id" name="id" defaultValue={data.$id} register={register} hidden error={undefined} />
        )}
      </div>
      {state.error && <span className="text-red-500">Something went wrong!</span>}
      <button className="bg-blue-600 text-white px-4 py-2 rounded-md disabled:opacity-50" disabled={!isAdmin}>
        {type === 'create' ? 'Create' : 'Update'}
      </button>
      {!isAdmin && <p className="text-xs text-gray-500">Only admin can add or edit events. You have read-only access.</p>}
    </form>
  );
}


