"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signUp } from "@/lib/appwrite-auth";
import { useAuthStore } from "@/lib/auth-store";
import { toast } from "react-toastify";

export default function SignUpPage() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "student"
    });
    const [loading, setLoading] = useState(false);
    const [checkingAuth, setCheckingAuth] = useState(false); // Start with false to show form immediately
    
    const router = useRouter();

    // Check if user is already authenticated
    useEffect(() => {
        // Skip authentication check for sign-up page to prevent hanging
        // Users should be able to access sign-up regardless of auth status
        console.log('SignUpPage: Skipping authentication check, showing form directly');
        setCheckingAuth(false);
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log('SignUpPage: Form submitted with data:', formData);
        
        // Validate form
        if (formData.password !== formData.confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        if (formData.password.length < 8) {
            toast.error("Password must be at least 8 characters long");
            return;
        }

        setLoading(true);
        console.log('SignUpPage: Starting account creation...');

        try {
            console.log('Attempting to create account with:', { email: formData.email, name: formData.name, role: formData.role });
            
            const result = await signUp(formData.email, formData.password, formData.name, formData.role);
            console.log('SignUpPage: Sign up result:', result);
            
            if (result.success && result.user) {
                toast.success("Account created successfully! You are now signed in.");
                
                // Update the auth store with the new user data
                useAuthStore.getState().setUser(result.user);

                // Redirect directly
                router.push(`/${formData.role}`);
            } else {
                toast.error(result.error || "Sign up failed");
                console.error('Sign up failed:', result.error);
            }
        } catch (error) {
            toast.error("An unexpected error occurred");
            console.error("Sign up error:", error);
        } finally {
            setLoading(false);
        }
    };

    const getRoleInfo = (role: string) => {
        const roleInfo = {
            admin: { icon: "⚙️", title: "Administrator", color: "bg-purple-600", description: "Complete system management" },
            teacher: { icon: "👨‍🏫", title: "Teacher", color: "bg-blue-600", description: "Class and lesson management" },
            student: { icon: "📚", title: "Student", color: "bg-green-600", description: "Academic portal access" },
            parent: { icon: "👨‍👩‍👧‍👦", title: "Parent", color: "bg-orange-600", description: "Child monitoring" }
        };
        return roleInfo[role as keyof typeof roleInfo] || roleInfo.student;
    };

    // Show loading while checking authentication
    if (checkingAuth) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Checking authentication...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div className="text-center">
                    {/* Logo */}
                    <div className="flex justify-center mb-6">
                        <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                            <span className="text-white font-bold text-2xl">L</span>
                        </div>
                    </div>
                    
                    <h2 className="text-3xl font-extrabold text-gray-900 mb-2">
                        Join LSL School
                    </h2>
                    <p className="text-sm text-gray-600">
                        Or{' '}
                        <button
                            onClick={() => router.push('/sign-in')}
                            className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
                        >
                            sign in to your existing account
                        </button>
                    </p>
                </div>
                
                <div className="bg-white rounded-xl shadow-lg p-8">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                    Full Name
                                </label>
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    autoComplete="name"
                                    required
                                    className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors"
                                    placeholder="Enter your full name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    disabled={loading}
                                />
                            </div>
                            
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                    Email Address
                                </label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors"
                                    placeholder="Enter your email address"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    disabled={loading}
                                />
                            </div>

                            <div>
                                <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
                                    Select Your Role
                                </label>
                                <select
                                    id="role"
                                    name="role"
                                    required
                                    className="appearance-none relative block w-full px-3 py-3 border border-gray-300 bg-white rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors"
                                    value={formData.role}
                                    onChange={handleInputChange}
                                    disabled={loading}
                                >
                                    <option value="student">📚 Student</option>
                                    <option value="teacher">👨‍🏫 Teacher</option>
                                    <option value="parent">👨‍👩‍👧‍👦 Parent</option>
                                    <option value="admin">⚙️ Administrator</option>
                                </select>
                                
                                {/* Role Description */}
                                <div className="mt-2 p-3 rounded-lg bg-gray-50 border border-gray-200">
                                    <div className="flex items-center space-x-2">
                                        <span className="text-lg">{getRoleInfo(formData.role).icon}</span>
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">{getRoleInfo(formData.role).title}</p>
                                            <p className="text-xs text-gray-600">{getRoleInfo(formData.role).description}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                    Password
                                </label>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="new-password"
                                    required
                                    className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors"
                                    placeholder="Enter your password (min. 8 characters)"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    disabled={loading}
                                />
                            </div>
                            
                            <div>
                                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                                    Confirm Password
                                </label>
                                <input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type="password"
                                    autoComplete="new-password"
                                    required
                                    className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors"
                                    placeholder="Confirm your password"
                                    value={formData.confirmPassword}
                                    onChange={handleInputChange}
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105"
                            >
                                {loading ? (
                                    <div className="flex items-center">
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                        Creating account...
                                    </div>
                                ) : (
                                    'Create Your Account'
                                )}
                            </button>
                        </div>
                    </form>
                </div>
                
                {/* Back to Welcome */}
                <div className="text-center">
                    <button
                        onClick={() => router.push('/')}
                        className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                    >
                        ← Back to Welcome Page
                    </button>
                </div>
            </div>
        </div>
    );
}
