"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputField from "../InputField";
import { subjectSchema, SubjectSchema } from "@/lib/formValidationSchemas";
import { createSubject, updateSubject } from "@/lib/actions";
import { useFormState } from "react-dom";
import { Dispatch, SetStateAction, useEffect } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const SubjectForm = ({
  type,
  data,
  setOpen,
  relatedData,
}: {
  type: "create" | "update";
  data?: any;
  setOpen: Dispatch<SetStateAction<boolean>>;
  relatedData?: any;
}) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<SubjectSchema>({
    resolver: zodResolver(subjectSchema),
  });

  // AFTER REACT 19 IT'LL BE USEACTIONSTATE

  const [state, formAction] = useFormState(
    type === "create" ? createSubject : updateSubject,
    {
      success: false,
      error: false,
    }
  );

  const onSubmit = handleSubmit((data) => {
    console.log(data);
    formAction(data);
  });

  const router = useRouter();

  useEffect(() => {
    if (state.success) {
      toast(`Subject has been ${type === "create" ? "created" : "updated"}!`);
      setOpen(false);
      router.refresh();
    }
  }, [state, router, type, setOpen]);

  const { teachers = [] } = relatedData || {};

  // Pre-fill form data for updates
  if (data && type === "update") {
    setValue("name", data.name || "");
    setValue("code", data.code || "");
    setValue("description", data.description || "");
    setValue("credits", data.credits || 1);
    setValue("teachers", data.teachers || []);
  }

  return (
    <div className="max-h-screen overflow-y-auto">
      <form className="flex flex-col gap-4 max-w-4xl mx-auto p-4" onSubmit={onSubmit}>
        <h1 className="text-lg font-semibold text-center text-gray-800 sticky top-0 bg-white py-2 border-b">
          {type === "create" ? "Create a new subject" : "Update the subject"}
        </h1>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h2 className="text-base font-semibold mb-3 text-gray-700">Subject Information</h2>
          <div className="flex justify-between flex-wrap gap-4">
        <InputField
          label="Subject name"
          name="name"
          defaultValue={data?.name}
          register={register}
          error={errors?.name}
        />
        <InputField
          label="Subject code"
          name="code"
          defaultValue={data?.code}
          register={register}
          error={errors?.code}
        />
        <InputField
          label="Description"
          name="description"
          defaultValue={data?.description}
          register={register}
          error={errors?.description}
        />
        <InputField
          label="Credits"
          name="credits"
          defaultValue={data?.credits || 1}
          register={register}
          error={errors?.credits}
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
          <label className="text-xs text-gray-500">Teachers</label>
          <select
            multiple
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register("teachers")}
            defaultValue={data?.teachers}
          >
            {teachers && teachers.length > 0 ? (
              teachers.map(
                (teacher: { id: string; name: string; surname: string }) => (
                  <option value={teacher.id} key={teacher.id}>
                    {teacher.name + " " + teacher.surname}
                  </option>
                )
              )
            ) : (
              <option value="" disabled>No teachers available</option>
            )}
          </select>
          {errors.teachers?.message && (
            <p className="text-xs text-red-400">
              {errors.teachers.message.toString()}
            </p>
          )}
        </div>
          </div>
        </div>

        {state.error && (
          <div className="bg-red-50 p-3 rounded-lg">
            <span className="text-red-500 text-sm">Something went wrong!</span>
          </div>
        )}

        <div className="sticky bottom-0 bg-white py-4 border-t">
          <button className="w-full bg-primary text-primary-foreground p-3 rounded-md font-medium">
            {type === "create" ? "Create" : "Update"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SubjectForm;
