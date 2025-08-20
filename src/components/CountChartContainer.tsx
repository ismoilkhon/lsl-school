import Image from "next/image";
import CountChart from "./CountChart";
import { adminListDocuments } from "@/lib/appwrite-admin";
import { COLLECTIONS } from "@/lib/appwrite";
import { Query } from "node-appwrite";

const CountChartContainer = async () => {
  const [boysRes, girlsRes] = await Promise.all([
    adminListDocuments(COLLECTIONS.STUDENTS, [Query.equal('sex', 'MALE'), Query.limit(1)]),
    adminListDocuments(COLLECTIONS.STUDENTS, [Query.equal('sex', 'FEMALE'), Query.limit(1)]),
  ]);
  const boys = boysRes.total || 0;
  const girls = girlsRes.total || 0;
  const total = boys + girls || 1;

  return (
    <div className="bg-white rounded-xl w-full h-full p-4">
      {/* TITLE */}
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-semibold">Students</h1>
        <Image src="/moreDark.png" alt="" width={20} height={20} />
      </div>
      {/* CHART */}
      <CountChart boys={boys} girls={girls} />
      {/* BOTTOM */}
      <div className="flex justify-center gap-16">
        <div className="flex flex-col gap-1">
          <div className="w-5 h-5 bg-lamaSky rounded-full" />
          <h1 className="font-bold">{boys}</h1>
          <h2 className="text-xs text-gray-300">
            Boys ({Math.round((boys / total) * 100)}%)
          </h2>
        </div>
        <div className="flex flex-col gap-1">
          <div className="w-5 h-5 bg-lamaYellow rounded-full" />
          <h1 className="font-bold">{girls}</h1>
          <h2 className="text-xs text-gray-300">
            Girls ({Math.round((girls / total) * 100)}%)
          </h2>
        </div>
      </div>
    </div>
  );
};

export default CountChartContainer;