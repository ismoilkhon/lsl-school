'use client';

import { useStudents, useDeleteStudent } from '@/lib/hooks/useQueries';
import { useState } from 'react';
import { toast } from 'react-toastify';
import Image from 'next/image';

export default function StudentsList() {
  const { data: students, isLoading, error } = useStudents();
  const deleteStudentMutation = useDeleteStudent();
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);

  const handleDelete = async (studentId: string) => {
    try {
      await deleteStudentMutation.mutateAsync(studentId);
      toast.success('Student deleted successfully');
    } catch (error) {
      toast.error('Failed to delete student');
      console.error('Delete error:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2">Loading students...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-600">Error loading students: {error.message}</p>
      </div>
    );
  }

  if (!students || students.length === 0) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-500">No students found</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800">Students</h2>
        <p className="text-sm text-gray-600 mt-1">
          {students.length} student{students.length !== 1 ? 's' : ''} found
        </p>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Phone
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {students.map((student) => (
              <tr key={student.$id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <Image
                        className="h-10 w-10 rounded-full object-cover"
                        src={student.img || '/noAvatar.png'}
                        alt={`${student.name} ${student.surname}`}
                        width={40}
                        height={40}
                        style={{ width: 'auto', height: 'auto' }}
                      />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {student.name} {student.surname}
                      </div>
                      <div className="text-sm text-gray-500">
                        {student.username}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{student.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {student.phone || 'N/A'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    student.isActive
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {student.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setSelectedStudent(student.$id)}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      View
                    </button>
                    <button
                      onClick={() => setSelectedStudent(student.$id)}
                      className="text-yellow-600 hover:text-yellow-900"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(student.$id)}
                      disabled={deleteStudentMutation.isPending}
                      className="text-red-600 hover:text-red-900 disabled:opacity-50"
                    >
                      {deleteStudentMutation.isPending ? 'Deleting...' : 'Delete'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
