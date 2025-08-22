'use client';

import { useAuthStore } from '@/lib/auth-store';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { toast } from 'react-toastify';
import ThemeToggle from './ThemeToggle';

const Navbar = () => {
  const { user, loading, logout, getUserRole } = useAuthStore();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await logout();
      toast.success('Signed out successfully');
      // The logout function in auth-store will handle the redirect to home page
    } catch (error) {
      toast.error('Failed to sign out');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-between p-4">
        <div>Loading...</div>
      </div>
    );
  }

  const userRole = getUserRole();

  return (
    <header className="bg-blue-50 dark:bg-blue-900 shadow-sm border-b dark:border-blue-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          {/* Logo and School Name */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">L</span>
            </div>
            <span className="text-2xl font-bold text-gray-900">LSL SCHOOL</span>
          </div>
          
          {/* Right Side - Search, Notifications, User Info, and Actions */}
          <div className="flex items-center space-x-6">
            {/* SEARCH BAR */}
            <div className="hidden md:flex items-center gap-2 text-xs rounded-full ring-[1.5px] ring-blue-300 dark:ring-blue-600 px-2">
              <Image src="/search.png" alt="" width={14} height={14} />
              <input
                type="text"
                placeholder="Search..."
                className="w-[200px] p-2 bg-transparent outline-none dark:text-blue-100 dark:placeholder-blue-200"
              />
            </div>
            
            {/* ICONS AND USER */}
            <div className="flex items-center gap-4">
              <ThemeToggle size="sm" />
              <div className="bg-blue-100 dark:bg-blue-800 rounded-full w-7 h-7 flex items-center justify-center cursor-pointer">
                <Image src="/message.png" alt="" width={20} height={20} />
              </div>
              <div className="bg-blue-100 dark:bg-blue-800 rounded-full w-7 h-7 flex items-center justify-center cursor-pointer relative">
                <Image src="/announcement.png" alt="" width={20} height={20} />
                <div className="absolute -top-3 -right-3 w-5 h-5 flex items-center justify-center bg-blue-500 text-white rounded-full text-xs">
                  1
                </div>
              </div>
              
              {/* User Info */}
              <div className="flex flex-col">
                <span className="text-xs leading-3 font-medium dark:text-blue-100">
                  {user?.name || 'User'}
                </span>
                <span className="text-[10px] text-blue-700 dark:text-blue-200 text-right capitalize">
                  {userRole}
                </span>
              </div>
              
              {/* Action Button */}
              <button
                onClick={handleSignOut}
                className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 transition-colors"
              >
                {user ? 'Logout' : 'Sign In'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
