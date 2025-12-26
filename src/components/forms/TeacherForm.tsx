"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputField from "../InputField";
import { Dispatch, SetStateAction, useState, useEffect } from "react";
import { teacherSchema, TeacherSchema } from "@/lib/formValidationSchemas";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useSubjects, useCreateTeacher, useUpdateTeacher } from "@/lib/hooks/useQueries";
import { Teacher } from "@/lib/client-api";
import { storage, BUCKET_ID } from "@/lib/appwrite";
import { Permission, Role } from "appwrite";
import { useAuthStore } from "@/lib/auth-store";

const TeacherForm = ({
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
  } = useForm<TeacherSchema>({
    resolver: zodResolver(teacherSchema),
  });

  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const { data: subjects = [] } = useSubjects();
  const createTeacherMutation = useCreateTeacher();
  const updateTeacherMutation = useUpdateTeacher();
  const { getUserRole } = useAuthStore();

  const router = useRouter();

  // Pre-fill form data for updates
  useEffect(() => {
    if (data && type === "update") {
      setValue("username", data.username || "");
      setValue("name", data.name || "");
      setValue("surname", data.surname || "");
      setValue("email", data.email || "");
      setValue("phone", data.phone || "");
      setValue("address", data.address || "");
      setValue("bloodType", data.bloodType || "");
      setValue("sex", data.sex || "");
      setValue("subjects", data.subjects || []);
      // Handle birthday - convert to Date object for the form (schema expects Date)
      if (data.birthday) {
        let birthdayDate: Date;
        if (typeof data.birthday === 'string') {
          birthdayDate = new Date(data.birthday);
        } else if (data.birthday instanceof Date) {
          birthdayDate = data.birthday;
        } else {
          birthdayDate = new Date(String(data.birthday));
        }
        if (!isNaN(birthdayDate.getTime())) {
          setValue("birthday", birthdayDate);
        } else {
          setValue("birthday", new Date());
        }
      }
    }
  }, [data, type, setValue]);

  // Check if user is admin - must be after all hooks
  const userRole = getUserRole();
  if (userRole !== 'admin') {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-destructive text-sm">Access denied. Only administrators can manage teachers.</p>
      </div>
    );
  }

  const onSubmit = handleSubmit(async (formData) => {
    let img: string | undefined = data?.img;
    
    try {
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

      if (type === "create") {
        // For create, we need to include password but not createdAt (API handles createdAt)
        // subjects is not in Teacher interface but is used in the form
        const teacherData = {
          username: formData.username,
          name: formData.name,
          surname: formData.surname,
          email: formData.email || '',
          phone: formData.phone || '',
          address: formData.address,
          img: img || data?.img || '',
          bloodType: formData.bloodType,
          sex: formData.sex,
          subjects: formData.subjects || [],
          birthday: formData.birthday instanceof Date 
            ? formData.birthday.toISOString() 
            : formData.birthday 
              ? new Date(formData.birthday).toISOString() 
              : new Date().toISOString(),
          isActive: true,
          role: 'teacher',
          password: formData.password,
        } as Omit<Teacher, '$id' | '$createdAt' | '$updatedAt' | '$permissions'> & { password?: string; subjects?: string[] };
        await createTeacherMutation.mutateAsync(teacherData);
        toast.success("Teacher has been created!");
      } else {
        const teacherData = {
          username: formData.username,
          name: formData.name,
          surname: formData.surname,
          email: formData.email || '',
          phone: formData.phone || '',
          address: formData.address,
          img: img || data?.img || '',
          bloodType: formData.bloodType,
          sex: formData.sex,
          subjects: formData.subjects || [],
          birthday: formData.birthday instanceof Date 
            ? formData.birthday.toISOString() 
            : formData.birthday 
              ? new Date(formData.birthday).toISOString() 
              : new Date().toISOString(),
          isActive: true,
          role: 'teacher',
        } as Partial<Teacher> & { subjects?: string[] };
        await updateTeacherMutation.mutateAsync({ id: data.$id, data: teacherData });
        toast.success("Teacher has been updated!");
      }
      
      setOpen(false);
      router.refresh();
    } catch (error) {
      toast.error("Operation failed");
      console.error("Form submission error:", error);
    } finally {
      setUploading(false);
    }
  });

  return (
    <div className="max-h-screen overflow-y-auto">
      <form className="flex flex-col gap-4 max-w-4xl mx-auto p-4" onSubmit={onSubmit}>
        <h1 className="text-lg font-semibold text-center text-foreground sticky top-0 bg-background py-2 border-b">
          {type === "create" ? "Create a new teacher" : "Update the teacher"}
        </h1>
        
        <div className="bg-muted p-4 rounded-lg">
          <h2 className="text-base font-semibold mb-3 text-foreground">Authentication Information</h2>
          <div className="flex justify-between flex-wrap gap-4">
        <InputField
          label="Username"
          name="username"
          defaultValue={data?.username}
          register={register}
          error={errors?.username}
        />
        <InputField
          label="Email"
          name="email"
          defaultValue={data?.email}
          register={register}
          error={errors?.email}
        />
        {type === "create" && (
          <InputField
            label="Password"
            name="password"
            type="password"
            defaultValue=""
            register={register}
            error={errors?.password}
          />
        )}
          </div>
        </div>

        <div className="bg-muted p-4 rounded-lg">
          <h2 className="text-base font-semibold mb-3 text-foreground">Personal Information</h2>
          <div className="flex justify-between flex-wrap gap-4">
        <InputField
          label="First Name"
          name="name"
          defaultValue={data?.name}
          register={register}
          error={errors.name}
        />
        <InputField
          label="Last Name"
          name="surname"
          defaultValue={data?.surname}
          register={register}
          error={errors.surname}
        />
        <InputField
          label="Phone"
          name="phone"
          defaultValue={data?.phone}
          register={register}
          error={errors.phone}
        />
        <InputField
          label="Address"
          name="address"
          defaultValue={data?.address}
          register={register}
          error={errors.address}
        />
        <InputField
          label="Blood Type"
          name="bloodType"
          defaultValue={data?.bloodType}
          register={register}
          error={errors.bloodType}
        />
        <InputField
          label="Birthday"
          name="birthday"
          defaultValue={data?.birthday ? new Date(data.birthday).toISOString().split("T")[0] : ""}
          register={register}
          error={errors.birthday}
          type="date"
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
          <label className="text-xs text-muted-foreground">Gender</label>
          <select
            className="ring-[1.5px] ring-border p-2 rounded-md text-sm w-full"
            {...register("sex")}
            defaultValue={data?.sex}
          >
            <option value="">Select gender</option>
            <option value="MALE">Male</option>
            <option value="FEMALE">Female</option>
          </select>
          {errors.sex?.message && (
            <p className="text-xs text-destructive">
              {errors.sex.message.toString()}
            </p>
          )}
        </div>
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-muted-foreground">Subjects</label>
          <select
            multiple
            className="ring-[1.5px] ring-border p-2 rounded-md text-sm w-full"
            {...register("subjects")}
            defaultValue={data?.subjects}
          >
            {subjects.map((subject) => (
              <option value={subject.$id} key={subject.$id}>
                {subject.name}
              </option>
            ))}
          </select>
          {errors.subjects?.message && (
            <p className="text-xs text-destructive">
              {errors.subjects.message.toString()}
            </p>
          )}
        </div>
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-muted-foreground">Photo</label>
          <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} />
          {uploading && <p className="text-xs text-muted-foreground">Uploading...</p>}
        </div>
          </div>
        </div>

        <div className="sticky bottom-0 bg-background py-4 border-t">
          <button 
            type="submit" 
            className="w-full bg-primary text-primary-foreground p-3 rounded-md font-medium"
            disabled={createTeacherMutation.isPending || updateTeacherMutation.isPending || uploading}
          >
            {createTeacherMutation.isPending || updateTeacherMutation.isPending || uploading 
              ? "Processing..." 
              : type === "create" ? "Create" : "Update"
            }
          </button>
        </div>
      </form>
    </div>
  );
};

export default TeacherForm;
