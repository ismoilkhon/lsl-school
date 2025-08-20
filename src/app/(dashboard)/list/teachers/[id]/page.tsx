import { adminGetDocument } from "@/lib/appwrite-admin";
import { COLLECTIONS } from "@/lib/appwrite";

const TeacherDetailPage = async ({ params }: { params: { id: string } }) => {
  const teacher = await adminGetDocument(COLLECTIONS.TEACHERS, params.id);

  if (!teacher) {
    return <div>Teacher not found</div>;
  }

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      <h1 className="text-lg font-semibold mb-4">Teacher Details</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p><strong>Name:</strong> {teacher.name} {teacher.surname}</p>
          <p><strong>Username:</strong> {teacher.username}</p>
          <p><strong>Email:</strong> {teacher.email || "Not provided"}</p>
          <p><strong>Phone:</strong> {teacher.phone || "Not provided"}</p>
        </div>
        <div>
          <p><strong>Address:</strong> {teacher.address}</p>
          <p><strong>Blood Type:</strong> {teacher.bloodType}</p>
          <p><strong>Sex:</strong> {teacher.sex}</p>
          {teacher.birthday && (
            <p><strong>Birthday:</strong> {new Date(teacher.birthday).toLocaleDateString()}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeacherDetailPage;
