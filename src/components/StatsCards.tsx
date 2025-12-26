"use client";

import { useTeachers, useStudents, useParents } from "@/lib/hooks/useQueries";
import UserCard from "@/components/UserCard";

export default function StatsCards() {
  const { data: teachers = [] } = useTeachers();
  const { data: students = [] } = useStudents();
  const { data: parents = [] } = useParents();

  const counts = {
    teachers: teachers.length,
    students: students.length,
    parents: parents.length
  };

  return (
    <div className="flex gap-4 justify-between flex-wrap">
      <UserCard type="teacher" count={counts.teachers} label="Teachers" />
      <UserCard type="student" count={counts.students} label="Students" />
      <UserCard type="parent" count={counts.parents} label="Parents" />
    </div>
  );
}


