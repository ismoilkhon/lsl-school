"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import InputField from "../InputField";
import { storage, BUCKET_ID } from "@/lib/appwrite";
import { Dispatch, SetStateAction } from "react";
import { toast } from "react-toastify";
import { useAuthStore } from "@/lib/auth-store";
import { useClasses, useCreateEvent, useUpdateEvent } from "@/lib/hooks/useQueries";
import { Permission, Role } from "appwrite";
import { X, Plus } from "lucide-react";
import { eventSchema, EventSchema, formatDateForInput, formatTimeRange, parseTimeRange } from "@/lib/formValidationSchemas";
import { revalidateDashboardPath } from "@/lib/appwrite-actions";

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
    watch,
    setValue,
  } = useForm<EventSchema>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      id: data?.$id,
      title: data?.title || "",
      description: data?.description || "",
      date: formatDateForInput(data?.startTime),
      time: formatTimeRange(data?.startTime, data?.endTime),
      classId: data?.classId ? String(data.classId) : "",
      location: data?.location || "",
      category: data?.category || "Academic",
      attendees: data?.attendees ?? 100,
      organizer: data?.organizer || "",
      requirements: data?.requirements || [],
      img: data?.img || undefined,
    },
  });

  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [newRequirement, setNewRequirement] = useState("");

  const { data: classes = [] } = useClasses();
  const createEventMutation = useCreateEvent();
  const updateEventMutation = useUpdateEvent();

  const watchedRequirements = watch("requirements") || [];

  const addRequirement = () => {
    if (newRequirement.trim()) {
      setValue("requirements", [...watchedRequirements, newRequirement.trim()]);
      setNewRequirement("");
    }
  };

  const removeRequirement = (index: number) => {
    setValue(
      "requirements",
      watchedRequirements.filter((_: string, i: number) => i !== index)
    );
  };

  const onSubmit = handleSubmit(async (formData) => {
    if (!isAdmin) {
      toast.error('Only admin can add or edit events');
      return;
    }

    try {
      let img: string | undefined = data?.img;
      
      if (file) {
        setUploading(true);
        const created = await storage.createFile(
          BUCKET_ID,
          "unique()",
          file,
          [Permission.read(Role.any())]
        );
        img = created.$id;
      }

      // Parse date and time to create startTime and endTime
      const { startTime, endTime } = parseTimeRange(formData.date, formData.time);

      const eventData = {
        title: formData.title,
        description: formData.description,
        startTime,
        endTime,
        classId: formData.classId ? String(formData.classId) : '',
        location: formData.location,
        isActive: true,
        img: img || '',
        category: formData.category,
        attendees: formData.attendees,
        organizer: formData.organizer,
        requirements: formData.requirements || [],
      };

      if (type === 'create') {
        await createEventMutation.mutateAsync(eventData);
        toast.success("Event has been created!");
      } else {
        await updateEventMutation.mutateAsync({ id: data.$id, data: eventData });
        toast.success("Event has been updated!");
      }
      
      await revalidateDashboardPath("/list/events");
      setOpen(false);
    } catch (error) {
      toast.error("Operation failed");
      console.error("Form submission error:", error);
    } finally {
      setUploading(false);
    }
  });

  useEffect(() => {
    if (data && type === "update") {
      setValue("date", formatDateForInput(data.startTime));
      setValue("time", formatTimeRange(data.startTime, data.endTime));
    }
  }, [data, type, setValue]);

  return (
    <div className="max-h-screen overflow-y-auto">
      <form className="flex flex-col gap-4 max-w-4xl mx-auto p-4" onSubmit={onSubmit}>
        <h1 className="text-xl font-semibold text-center text-foreground sticky top-0 bg-background py-2 border-b">
          {type === 'create' ? 'Create a New Event' : 'Update Event'}
        </h1>
      
        {/* Basic Information */}
        <div className="bg-muted p-4 rounded-lg">
          <h2 className="text-base font-semibold mb-3 text-foreground">Basic Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField 
            label="Event Title *" 
            name="title" 
            defaultValue={data?.title} 
            register={register} 
            error={errors.title} 
          />
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-foreground">Category *</label>
            <select
              className="ring-[1.5px] ring-border p-3 rounded-md text-sm w-full focus:ring-ring focus:border-ring"
              {...register("category")}
              defaultValue={data?.category || "Academic"}
            >
              <option value="Academic">Academic</option>
              <option value="Sports">Sports</option>
              <option value="Meeting">Meeting</option>
              <option value="Arts">Arts</option>
            </select>
            {errors.category && <span className="text-destructive text-xs">{errors.category.message}</span>}
          </div>
          </div>
          
          <div className="mt-3">
            <InputField 
              label="Description *" 
              name="description" 
              defaultValue={data?.description} 
              register={register} 
              error={errors.description}
              textarea
            />
          </div>
        </div>

        {/* Date, Time & Location */}
        <div className="bg-muted p-4 rounded-lg">
          <h2 className="text-base font-semibold mb-3 text-foreground">Date, Time & Location</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <InputField 
            label="Date *" 
            name="date" 
            type="date" 
            defaultValue={data?.date} 
            register={register} 
            error={errors.date} 
          />
          <InputField 
            label="Time *" 
            name="time" 
            placeholder="9:00 AM - 4:00 PM" 
            defaultValue={data?.time} 
            register={register} 
            error={errors.time} 
          />
          <InputField 
            label="Location *" 
            name="location" 
            defaultValue={data?.location} 
            register={register} 
            error={errors.location} 
          />
          </div>
        </div>

        {/* Event Details */}
        <div className="bg-muted p-4 rounded-lg">
          <h2 className="text-base font-semibold mb-3 text-foreground">Event Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-foreground">Expected Attendees *</label>
            <input
              type="number"
              min="1"
              className="ring-[1.5px] ring-border p-3 rounded-md text-sm w-full focus:ring-ring focus:border-ring"
              {...register("attendees", { valueAsNumber: true })}
              defaultValue={data?.attendees || 100}
            />
            {errors.attendees && <span className="text-destructive text-xs">{errors.attendees.message}</span>}
          </div>
          
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-foreground">Class (Optional)</label>
            <select
              className="ring-[1.5px] ring-border p-3 rounded-md text-sm w-full focus:ring-ring focus:border-ring"
              {...register("classId")}
              defaultValue={data?.classId}
            >
              <option value="">Select a class</option>
              {classes.map((classItem) => (
                <option key={classItem.$id} value={classItem.$id}>
                  {classItem.name}
                </option>
              ))}
            </select>
          </div>
          </div>
          
          <div className="mt-3">
            <InputField 
              label="Organizer *" 
              name="organizer" 
              defaultValue={data?.organizer} 
              register={register} 
              error={errors.organizer} 
            />
          </div>
        </div>

        {/* Requirements */}
        <div className="bg-muted p-4 rounded-lg">
          <h2 className="text-base font-semibold mb-3 text-foreground">Requirements (Optional)</h2>
        <div className="space-y-3">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Add a requirement..."
              className="flex-1 ring-[1.5px] ring-gray-300 p-3 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
              value={newRequirement}
              onChange={(e) => setNewRequirement(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addRequirement())}
            />
            <button
              type="button"
              onClick={addRequirement}
              className="px-4 py-3 bg-primary text-primary-foreground rounded-md hover:opacity-90 transition-colors"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
          
          {watchedRequirements.length > 0 && (
            <div className="space-y-2">
              {watchedRequirements.map((req: string, index: number) => (
                <div key={index} className="flex items-center gap-2 p-2 bg-background rounded border">
                  <span className="flex-1 text-sm">{req}</span>
                  <button
                    type="button"
                    onClick={() => removeRequirement(index)}
                    className="p-1 text-destructive hover:opacity-80"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
          </div>
        </div>

        {/* Image Upload */}
        <div className="bg-muted p-4 rounded-lg">
          <h2 className="text-base font-semibold mb-3 text-foreground">Event Image</h2>
        <div className="flex flex-col gap-2">
          <label className="text-sm text-muted-foreground">Upload Event Image</label>
          <input 
            type="file" 
            accept="image/*" 
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="ring-[1.5px] ring-border p-3 rounded-md text-sm w-full focus:ring-ring focus:border-ring"
          />
          {uploading && <p className="text-xs text-primary">Uploading...</p>}
          {data?.img && (
            <p className="text-xs text-muted-foreground">Current image: {data.img}</p>
          )}
          </div>
        </div>

        {/* Hidden ID field for updates */}
        {data?.$id && (
          <input type="hidden" {...register("id")} value={data.$id} />
        )}

        {/* Submit Button */}
        <div className="flex justify-end gap-4 pt-4 border-t bg-background sticky bottom-0">
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="px-6 py-3 border border-border text-foreground rounded-md hover:bg-muted transition-colors"
        >
          Cancel
        </button>
        <button 
          type="submit" 
          className="px-6 py-3 bg-primary text-primary-foreground rounded-md hover:opacity-90 disabled:opacity-50 transition-colors" 
          disabled={!isAdmin || createEventMutation.isPending || updateEventMutation.isPending || uploading}
        >
          {createEventMutation.isPending || updateEventMutation.isPending || uploading 
            ? "Processing..." 
            : type === 'create' ? 'Create Event' : 'Update Event'
          }
          </button>
        </div>
        
        {!isAdmin && (
          <p className="text-sm text-destructive text-center">
            Only administrators can create or edit events. You have read-only access.
          </p>
        )}
      </form>
    </div>
  );
}


