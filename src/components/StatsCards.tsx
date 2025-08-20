"use client";

import { useEffect, useState } from "react";
import UserCard from "@/components/UserCard";

export default function StatsCards() {
  const [counts, setCounts] = useState({ students: 0, teachers: 0, parents: 0 });

  useEffect(() => {
    let isMounted = true;
    const fetchCounts = async () => {
      try {
        const res = await fetch('/api/stats', { cache: 'no-store' });
        const data = await res.json();
        if (!data.error && isMounted) setCounts(data);
      } catch (_) {}
    };
    fetchCounts();
    const id = setInterval(fetchCounts, 5000);
    return () => { isMounted = false; clearInterval(id); };
  }, []);

  return (
    <div className="flex gap-4 justify-between flex-wrap">
      <UserCard type="teacher" count={counts.teachers} label="Teachers" />
      <UserCard type="student" count={counts.students} label="Students" />
      <UserCard type="parent" count={counts.parents} label="Parents" />
    </div>
  );
}


