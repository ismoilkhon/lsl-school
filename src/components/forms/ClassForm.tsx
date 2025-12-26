"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import InputField from "../InputField";
import { classSchema, ClassSchema } from "@/lib/formValidationSchemas";
import { useTeachers, useCreateClass, useUpdateClass } from "@/lib/hooks/useQueries";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useEffect } from "react";

const ClassForm = ({
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
    control,
    formState: { errors },
  } = useForm<ClassSchema>({
    resolver: zodResolver(classSchema),
    defaultValues: {
      name: data?.name || "",
      capacity: data?.capacity || 30,
      supervisorId: data?.supervisorId || "",
    },
  });

  const { data: teachers = [], isLoading: teachersLoading } = useTeachers();
  const createClassMutation = useCreateClass();
  const updateClassMutation = useUpdateClass();
  const router = useRouter();

  // Pre-fill form data for updates
  useEffect(() => {
    if (data && type === "update") {
      setValue("name", data.name || "");
      setValue("capacity", data.capacity || 30);
      // Set supervisorId after teachers are loaded to ensure it's in the list
      if (teachers.length > 0 && data.supervisorId) {
        const supervisorExists = teachers.some(teacher => teacher.$id === data.supervisorId);
        if (supervisorExists) {
          setValue("supervisorId", data.supervisorId);
        }
      } else if (data.supervisorId) {
        setValue("supervisorId", data.supervisorId);
      }
    }
  }, [data, type, setValue, teachers]);

  const onSubmit = handleSubmit(async (formData) => {
    try {
      // Get current academic year (e.g., "2024-2025")
      const currentYear = new Date().getFullYear();
      const nextYear = currentYear + 1;
      const academicYear = `${currentYear}-${nextYear}`;

      const classData = {
        name: formData.name || '',
        capacity: Number(formData.capacity) || 30,
        supervisorId: formData.supervisorId || '',
        isActive: data?.isActive ?? true,
        academicYear: data?.academicYear || academicYear,
      };

      if (type === "create") {
        await createClassMutation.mutateAsync(classData);
        toast.success("Class has been created!");
      } else {
        await updateClassMutation.mutateAsync({ id: data.$id, data: classData });
        toast.success("Class has been updated!");
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
          {type === "create" ? "Create a new class" : "Update the class"}
        </h1>

        <div className="bg-muted p-4 rounded-lg">
          <h2 className="text-base font-semibold mb-3 text-foreground">Class Information</h2>
          <div className="flex justify-between flex-wrap gap-4">
        <InputField
          label="Class name"
          name="name"
          defaultValue={data?.name}
          register={register}
          error={errors?.name}
        />
        <InputField
          label="Capacity"
          name="capacity"
          defaultValue={data?.capacity}
          register={register}
          error={errors?.capacity}
          type="number"
        />
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-muted-foreground">Supervisor (Teacher)</label>
          {teachersLoading ? (
            <div className="ring-[1.5px] ring-border p-2 rounded-md text-sm w-full text-muted-foreground">
              Loading teachers...
            </div>
          ) : (
            <Controller
              name="supervisorId"
              control={control}
              render={({ field }) => (
                <select
                  {...field}
                  className="ring-[1.5px] ring-border p-2 rounded-md text-sm w-full"
                >
                  <option value="">Select a teacher</option>
                  {teachers.length > 0 ? (
                    teachers.map((teacher) => (
                      <option value={teacher.$id} key={teacher.$id}>
                        {teacher.name + " " + teacher.surname}
                      </option>
                    ))
                  ) : (
                    <option value="" disabled>No teachers available</option>
                  )}
                </select>
              )}
            />
          )}
          {errors.supervisorId?.message && (
            <p className="text-xs text-destructive">
              {errors.supervisorId.message.toString()}
            </p>
          )}
        </div>
          </div>
        </div>

        <div className="sticky bottom-0 bg-background py-4 border-t">
          <button 
            type="submit" 
            className="w-full bg-primary text-primary-foreground p-3 rounded-md font-medium"
            disabled={createClassMutation.isPending || updateClassMutation.isPending}
          >
            {createClassMutation.isPending || updateClassMutation.isPending 
              ? "Processing..." 
              : type === "create" ? "Create" : "Update"
            }
          </button>
        </div>
      </form>
    </div>
  );
};

export default ClassForm;
