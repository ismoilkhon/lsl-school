import { NextResponse } from "next/server";
import { adminListDocuments } from "@/lib/appwrite-admin";
import { COLLECTIONS } from "@/lib/appwrite";
import { Query } from "node-appwrite";

export async function GET() {
  try {
    const [students, teachers, parents] = await Promise.all([
      adminListDocuments(COLLECTIONS.STUDENTS, [Query.limit(1)]),
      adminListDocuments(COLLECTIONS.TEACHERS, [Query.limit(1)]),
      adminListDocuments(COLLECTIONS.PARENTS, [Query.limit(1)]),
    ]);

    return NextResponse.json({
      students: students.total || 0,
      teachers: teachers.total || 0,
      parents: parents.total || 0,
    });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Failed to fetch stats" }, { status: 500 });
  }
}


