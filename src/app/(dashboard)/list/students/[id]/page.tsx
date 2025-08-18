import { getDocument, COLLECTIONS } from "@/lib/appwrite";

const StudentDetailPage = async ({ params }: { params: { id: string } }) => {
  const student = await getDocument(COLLECTIONS.STUDENTS, params.id);

  if (!student) {
    return <div>Student not found</div>;
  }

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      <h1 className="text-lg font-semibold mb-4">Student Details</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p><strong>Name:</strong> {student.name} {student.surname}</p>
          <p><strong>Username:</strong> {student.username}</p>
          <p><strong>Email:</strong> {student.email || "Not provided"}</p>
          <p><strong>Phone:</strong> {student.phone || "Not provided"}</p>
        </div>
        <div>
          <p><strong>Address:</strong> {student.address}</p>
          <p><strong>Blood Type:</strong> {student.bloodType}</p>
          <p><strong>Sex:</strong> {student.sex}</p>
          {student.birthday && (
            <p><strong>Birthday:</strong> {new Date(student.birthday).toLocaleDateString()}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentDetailPage;
