"use client";
import Navbar from "@/components/Navbar";
import { useRouter } from "next/navigation";

const WelcomePage = () => {
  const router = useRouter();


  return (
    <div className="p-4 flex gap-4 flex-col">
      <Navbar />
      {/* Welcome Message */}
      <div className="w-full">
        <div className="bg-white p-4 rounded-md shadow-sm">
          <h1 className="text-2xl font-bold text-gray-800">
            Welcome back, Admin!
          </h1>
          <p className="text-gray-600">Administrator Dashboard</p>
          <button onClick={() => router.push('/sign-in')}>Go to Admin Dashboard</button>
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;
