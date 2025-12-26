import Menu from "@/components/Menu";
import Navbar from "@/components/Navbar";
import Image from "next/image";
import Link from "next/link";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="h-screen flex">
      {/* LEFT */}
      <div className="w-[14%] md:w-[8%] lg:w-[16%] xl:w-[14%] p-4 bg-blue-50 dark:bg-blue-900">
        <Link
          href="/"
          className="flex items-center justify-center lg:justify-start gap-2"
        >
          <Image 
            src="/logo.png" 
            alt="logo" 
            width={40} 
            height={40}
            style={{ width: 'auto', height: 'auto' }}
          />
          <span className="hidden lg:block text-xl text-blue-600 dark:text-blue-300 font-bold">LSL SCHOOL</span>
        </Link>
        <Menu />
      </div>
      {/* RIGHT */}
      <div className="w-[86%] md:w-[92%] lg:w-[84%] xl:w-[86%] bg-blue-100 dark:bg-blue-800 overflow-scroll flex flex-col">
        <Navbar />
        {children}
      </div>
    </div>
  );
}
