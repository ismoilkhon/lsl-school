"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputField from "../InputField";
import { Dispatch, SetStateAction } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/auth-store";
import { useClasses, useCreateAnnouncement, useUpdateAnnouncement } from "@/lib/hooks/useQueries";

const announcementSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  date: z.string().min(1, "Date is required"),
  classId: z.string().optional(),
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

  const { data: classes = [] } = useClasses();
  const createAnnouncementMutation = useCreateAnnouncement();
  const updateAnnouncementMutation = useUpdateAnnouncement();

  const router = useRouter();

  const onSubmit = handleSubmit(async (formData) => {
    if (!isAdmin) {
      toast.error('Only admin can add or edit announcements');
      return;
    }

    try {
      const announcementData = {
        title: formData.title,
        description: formData.description,
        date: formData.date,
        classId: formData.classId || '',
        authorId: 'admin', // This should come from auth context
        isActive: true
      };

      if (type === 'create') {
        await createAnnouncementMutation.mutateAsync(announcementData);
        toast.success("Announcement has been created!");
      } else {
        await updateAnnouncementMutation.mutateAsync({ id: data.$id, data: announcementData });
        toast.success("Announcement has been updated!");
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
          {type === 'create' ? 'Create a new announcement' : 'Update the announcement'}
        </h1>
        
        <div className="bg-gray-50 p-4 rounded-lg">
          <h2 className="text-base font-semibold mb-3 text-gray-700">Announcement Details</h2>
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

        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Class (optional)</label>
          <select
            {...register("classId")}
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Classes</option>
            {classes.map((classItem) => (
              <option key={classItem.$id} value={classItem.$id}>
                {classItem.name}
              </option>
            ))}
          </select>
        </div>

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
        </div>
        
        <div className="sticky bottom-0 bg-white py-4 border-t">
          <button 
            className="w-full bg-primary text-primary-foreground px-4 py-3 rounded-md disabled:opacity-50 font-medium" 
            disabled={!isAdmin || createAnnouncementMutation.isPending || updateAnnouncementMutation.isPending}
            type="submit"
          >
            {createAnnouncementMutation.isPending || updateAnnouncementMutation.isPending 
              ? "Processing..." 
              : type === 'create' ? 'Create' : 'Update'
            }
          </button>
          
          {!isAdmin && (
            <p className="text-xs text-gray-500 mt-2 text-center">
              Only admin can add or edit announcements. You have read-only access.
            </p>
          )}
          <p className="text-xs text-gray-500 mt-2 text-center">
            Note: Priority and Target Audience features may not be available in all environments.
          </p>
        </div>
      </form>
    </div>
  );
}
