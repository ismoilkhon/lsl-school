"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputField from "../InputField";
import { useFormState } from "react-dom";
import { createAnnouncement, updateAnnouncement } from "@/lib/actions";
import { Dispatch, SetStateAction, useEffect } from "react";
import { toast } from "react-toastify";
import { useAuthStore } from "@/lib/auth-store";

const announcementSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  date: z.string().min(1, "Date is required"),
  priority: z.enum(["low", "medium", "high"]).optional().default("medium"),
  targetAudience: z.enum(["all", "students", "teachers", "parents"]).optional().default("all"),
});

type AnnouncementSchema = z.infer<typeof announcementSchema>;

export default function AnnouncementForm({
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
  } = useForm<AnnouncementSchema>({ 
    resolver: zodResolver(announcementSchema),
    defaultValues: {
      title: data?.title || "",
      description: data?.description || "",
      date: data?.date ? new Date(data.date).toISOString().split('T')[0] : "",
      priority: data?.priority || "medium",
      targetAudience: data?.targetAudience || "all",
    }
  });

  const [state, formAction] = useFormState(
    type === 'create' ? createAnnouncement : updateAnnouncement,
    { success: false, error: false } as any
  );

  const onSubmit = handleSubmit(async (form) => {
    if (!isAdmin) {
      toast.error('Only admin can add or edit announcements');
      return;
    }
    // Add the user role to the form data for server-side validation
    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      formData.append(key, value as string);
    });
    formData.append('userRole', role);
    formAction(formData as any);
  });

  useEffect(() => {
    if (state.success) {
      toast(`Announcement has been ${type === 'create' ? 'created' : 'updated'}!`);
      setOpen(false);
    }
  }, [state, setOpen, type]);

  return (
    <form className="flex flex-col gap-6" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">
        {type === 'create' ? 'Create a new announcement' : 'Update the announcement'}
      </h1>
      
      <div className="flex flex-wrap gap-4">
        <InputField 
          label="Title" 
          name="title" 
          register={register} 
          error={errors.title} 
        />
        
        <div className="flex flex-col gap-2 w-full">
          <label className="text-xs text-gray-500">Description</label>
          <textarea
            {...register("description")}
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={4}
            placeholder="Enter announcement description..."
          />
          {errors.description && (
            <span className="text-red-500 text-xs">{errors.description.message}</span>
          )}
        </div>

        <InputField 
          label="Date" 
          name="date" 
          type="date"
          register={register} 
          error={errors.date} 
        />

        <div className="flex flex-col gap-2 w-full md:w-1/3">
          <label className="text-xs text-gray-500">Priority</label>
          <select
            {...register("priority")}
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="low">🟢 Low</option>
            <option value="medium">🟡 Medium</option>
            <option value="high">🔴 High</option>
          </select>
          {errors.priority && (
            <span className="text-red-500 text-xs">{errors.priority.message}</span>
          )}
        </div>

        <div className="flex flex-col gap-2 w-full md:w-1/3">
          <label className="text-xs text-gray-500">Target Audience</label>
          <select
            {...register("targetAudience")}
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Users</option>
            <option value="students">Students Only</option>
            <option value="teachers">Teachers Only</option>
            <option value="parents">Parents Only</option>
          </select>
          {errors.targetAudience && (
            <span className="text-red-500 text-xs">{errors.targetAudience.message}</span>
          )}
        </div>

        {data?.$id && (
          <InputField 
            label="Id" 
            name="id" 
            defaultValue={data.$id} 
            register={register} 
            hidden 
            error={undefined} 
          />
        )}
      </div>

      {state.error && <span className="text-red-500">Something went wrong!</span>}
      
      <button 
        className="bg-blue-600 text-white px-4 py-2 rounded-md disabled:opacity-50" 
        disabled={!isAdmin}
        type="submit"
      >
        {type === 'create' ? 'Create' : 'Update'}
      </button>
      
      {!isAdmin && (
        <p className="text-xs text-gray-500">
          Only admin can add or edit announcements. You have read-only access.
        </p>
      )}
      <p className="text-xs text-gray-500">
        Note: Priority and Target Audience features may not be available in all environments.
      </p>
    </form>
  );
}
