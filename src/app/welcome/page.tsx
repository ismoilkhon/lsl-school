"use client";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useState } from "react";

const WelcomePage = () => {
  const router = useRouter();
  const [isHovered, setIsHovered] = useState<string | null>(null);

  const features = [
    {
      icon: "👨‍🏫",
      title: "Teacher Management",
      description: "Manage classes, create lessons, and track student progress"
    },
    {
      icon: "👨‍👩‍👧‍👦",
      title: "Parent Portal",
      description: "Monitor your children's academic progress and attendance"
    },
    {
      icon: "📚",
      title: "Student Dashboard",
      description: "Access your schedule, grades, and assignments"
    },
    {
      icon: "⚙️",
      title: "Admin Control",
      description: "Complete system management and user administration"
    }
  ];

  const roleButtons = [
    {
      role: "admin",
      title: "Administrator",
      description: "System Management",
      icon: "⚙️",
      color: "bg-purple-600 hover:bg-purple-700",
      textColor: "text-purple-600"
    },
    {
      role: "teacher",
      title: "Teacher",
      description: "Class Management",
      icon: "👨‍🏫",
      color: "bg-blue-600 hover:bg-blue-700",
      textColor: "text-blue-600"
    },
    {
      role: "student",
      title: "Student",
      description: "Academic Portal",
      icon: "📚",
      color: "bg-green-600 hover:bg-green-700",
      textColor: "text-green-600"
    },
    {
      role: "parent",
      title: "Parent",
      description: "Child Monitoring",
      icon: "👨‍👩‍👧‍👦",
      color: "bg-orange-600 hover:bg-orange-700",
      textColor: "text-orange-600"
    }
  ];

  const handleLogin = (role: string) => {
    // Store the selected role in localStorage for the sign-in page
    localStorage.setItem('selectedRole', role);
    router.push('/sign-in');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">L</span>
              </div>
              <span className="text-2xl font-bold text-gray-900">LSL SCHOOL</span>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => router.push('/sign-in')}
                className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                Sign In
              </button>
              <button
                onClick={() => router.push('/sign-up')}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Welcome to{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              LSL School
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
            Comprehensive school management system designed to connect administrators, teachers, students, and parents in one unified platform.
          </p>
          
          {/* Role Selection Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {roleButtons.map((button) => (
              <div
                key={button.role}
                className={`relative group cursor-pointer transition-all duration-300 transform hover:scale-105`}
                onMouseEnter={() => setIsHovered(button.role)}
                onMouseLeave={() => setIsHovered(null)}
                onClick={() => handleLogin(button.role)}
              >
                <div className={`${button.color} rounded-xl p-6 text-white shadow-lg transition-all duration-300 ${
                  isHovered === button.role ? 'shadow-2xl' : ''
                }`}>
                  <div className="text-4xl mb-4">{button.icon}</div>
                  <h3 className="text-lg font-semibold mb-2">{button.title}</h3>
                  <p className="text-sm opacity-90">{button.description}</p>
                </div>
                <div className={`absolute inset-0 ${button.color} rounded-xl opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
              </div>
            ))}
          </div>

          {/* Quick Login Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={() => router.push('/sign-in')}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Sign In to Your Account
            </button>
            <button
              onClick={() => router.push('/sign-up')}
              className="px-8 py-3 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-all duration-300 transform hover:scale-105"
            >
              Create New Account
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose LSL School?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our comprehensive platform provides everything you need for effective school management and communication.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="text-center p-6 rounded-xl bg-gradient-to-br from-gray-50 to-white border border-gray-100 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-2"
              >
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center text-white">
            <div>
              <div className="text-4xl font-bold mb-2">500+</div>
              <div className="text-lg opacity-90">Students</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">50+</div>
              <div className="text-lg opacity-90">Teachers</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">100%</div>
              <div className="text-lg opacity-90">Satisfaction</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">L</span>
                </div>
                <span className="text-xl font-bold">LSL SCHOOL</span>
              </div>
              <p className="text-gray-400">
                Empowering education through technology and innovation.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-gray-400">
                <li><button onClick={() => router.push('/sign-in')} className="hover:text-white transition-colors">Sign In</button></li>
                <li><button onClick={() => router.push('/sign-up')} className="hover:text-white transition-colors">Sign Up</button></li>
                <li><button onClick={() => router.push('/welcome')} className="hover:text-white transition-colors">About</button></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li><button className="hover:text-white transition-colors">Help Center</button></li>
                <li><button className="hover:text-white transition-colors">Contact Us</button></li>
                <li><button className="hover:text-white transition-colors">Privacy Policy</button></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Connect</h3>
              <div className="flex space-x-4">
                <button className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors">
                  📧
                </button>
                <button className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors">
                  📱
                </button>
                <button className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors">
                  💬
                </button>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 LSL School. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default WelcomePage;
