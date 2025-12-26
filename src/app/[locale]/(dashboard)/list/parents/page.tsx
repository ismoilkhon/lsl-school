"use client";

import { useState } from "react";
import Table from "@/components/Table";
import FormContainer from "@/components/FormContainer";
import { useParents, useDeleteParent } from "@/lib/hooks/useQueries";
import { toast } from "react-toastify";

const ParentsListPage = () => {
  const [open, setOpen] = useState(false);
  const [type, setType] = useState<"create" | "update" | "delete">("create");
  const [data, setData] = useState<any>(null);
  const [id, setId] = useState<string | number>("");

  const { data: parents = [], isLoading, error } = useParents();
  const deleteParentMutation = useDeleteParent();

  const handleCreate = () => {
    setType("create");
    setData(null);
    setId("");
    setOpen(true);
  };

  const handleUpdate = (row: any) => {
    setType("update");
    setData(row);
    setId(row.$id);
    setOpen(true);
  };

  const handleDelete = async (row: any) => {
    if (window.confirm("Are you sure you want to delete this parent?")) {
      try {
        await deleteParentMutation.mutateAsync(row.$id);
        toast.success("Parent deleted successfully!");
      } catch (error) {
        toast.error("Failed to delete parent");
        console.error("Delete error:", error);
      }
    }
  };

  const columns = [
    { key: "name", label: "Name" },
    { key: "surname", label: "Surname" },
    { key: "email", label: "Email" },
    { key: "phone", label: "Phone" },
    { key: "role", label: "Role" },
    { key: "isActive", label: "Status" },
  ];

  if (isLoading) {
    return (
      <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
        <div className="flex items-center justify-center p-8">
          <p className="text-red-500 text-sm">Error loading parents: {error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-lg font-semibold">Parents</h1>
        <button
          onClick={handleCreate}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
        >
          Add Parent
        </button>
      </div>

      <Table
        data={parents}
        columns={columns}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
      />

      {open && (
        <FormContainer
          table="parent"
          type={type}
          data={data}
          id={id}
        />
      )}
    </div>
  );
};

export default ParentsListPage;
