"use client";
import Image from "next/image";
import Link from "next/link";
import { useAuthStore } from "@/lib/auth-store";
import { toast } from "react-toastify";
import { dashboardMenuSections, UserRole } from "@/lib/routes";

const Menu = () => {
  const { getUserRole, logout } = useAuthStore();
  const role = getUserRole();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
    } catch (error) {
      toast.error('Failed to log out');
    }
  };

  return (
    <div className="mt-4 text-sm">
      {dashboardMenuSections.map((section) => (
        <div className="flex flex-col gap-2" key={section.title}>
          <span className="hidden lg:block text-blue-700 dark:text-blue-200 font-light my-4">
            {section.title}
          </span>
          {section.items.map((item) => {
            if (item.roles.includes(role as UserRole)) {
              if (item.action === 'logout') {
                return (
                  <button
                    key={item.label}
                    onClick={handleLogout}
                    className="flex items-center justify-center lg:justify-start gap-4 text-blue-700 dark:text-blue-200 py-2 md:px-2 rounded-md hover:bg-blue-200 dark:hover:bg-blue-700 w-full text-left transition-colors"
                  >
                    <Image src={item.icon} alt="" width={20} height={20} />
                    <span className="hidden lg:block">{item.label}</span>
                  </button>
                );
              }
              return (
                <Link
                  href={item.href}
                  key={item.label}
                  className="flex items-center justify-center lg:justify-start gap-4 text-blue-700 dark:text-blue-200 py-2 md:px-2 rounded-md hover:bg-blue-200 dark:hover:bg-blue-700 transition-colors"
                >
                  <Image src={item.icon} alt="" width={20} height={20} />
                  <span className="hidden lg:block">{item.label}</span>
                </Link>
              );
            }
          })}
        </div>
      ))}
    </div>
  );
};

export default Menu;
