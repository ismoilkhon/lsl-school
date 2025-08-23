"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/lib/auth-store";
import { signIn } from "@/lib/appwrite-auth";
import { toast } from "react-toastify";
import { useLocale } from "@/lib/locale-context";
import Image from "next/image";

export default function SignInPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [selectedRole, setSelectedRole] = useState<string | null>(null);
    
    const { user, loading: authLoading, isAuthenticated, checkAuth, getUserRole } = useAuthStore();
    const router = useRouter();
    const searchParams = useSearchParams();
    const { locale } = useLocale();
    const redirectTo = searchParams.get('redirect') || `/${locale}/admin`;

    // Get selected role from localStorage on component mount
    useEffect(() => {
        const role = localStorage.getItem('selectedRole');
        if (role) {
            setSelectedRole(role);
            // Clear the stored role after reading it
            localStorage.removeItem('selectedRole');
        }
    }, []);

    // Check if user is already authenticated
    useEffect(() => {
        console.log('SignInPage: useEffect triggered', { 
            user, 
            authLoading, 
            isAuthenticated: !!user,
            currentPath: window.location.pathname 
        });
        
        if (!authLoading && user && isAuthenticated) {
            // User is already authenticated, redirect to appropriate dashboard
            const role = getUserRole();
            console.log('SignInPage: User already authenticated, redirecting to role:', role);
            
            // Use a small delay to ensure the store is properly updated
            setTimeout(() => {
                router.push(`/${locale}/${role}`);
            }, 100);
        }
    }, [user, authLoading, isAuthenticated, router, getUserRole, locale]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        console.log('SignInPage: handleSubmit started');

        try {
            const result = await signIn(email, password);
            console.log('SignInPage: signIn result:', result);
            
            if (result.success) {
                toast.success("Sign in successful!");
                
                if (result.user) {
                    // User data is available, update store and redirect immediately
                    console.log('SignInPage: User data received:', result.user);
                    console.log('SignInPage: User preferences:', result.user.prefs);
                    
                    // Update the auth store with the user data
                    useAuthStore.getState().setUser(result.user);
                    
                    // Wait a moment for the store to update
                    await new Promise(resolve => setTimeout(resolve, 100));
                    
                    // Get the user role and determine redirect path
                    const role = (result.user.prefs?.role || 'student').toLowerCase();
                    const redirectPath = redirectTo !== `/${locale}/admin` ? redirectTo : `/${locale}/${role}`;
                    
                    console.log('SignInPage: About to redirect to:', redirectPath);
                    console.log('SignInPage: Current auth state:', useAuthStore.getState());
                    
                    // Hint middleware about role (Appwrite session cookie is not readable on our domain)
                    try {
                        document.cookie = `role=${role}; path=/; max-age=${60 * 60 * 24 * 7}`;
                    } catch {}

                    // Use router.push for navigation
                    router.push(redirectPath);
                    
                    // Add a fallback redirect after a short delay
                    setTimeout(() => {
                        if (window.location.pathname.includes('/sign-in')) {
                            console.log('SignInPage: Fallback redirect needed');
                            console.log('SignInPage: Current path:', window.location.pathname);
                            console.log('SignInPage: Redirecting to:', redirectPath);
                            window.location.href = redirectPath;
                        }
                    }, 1000);
                } else {
                    // No user data, need to get it via checkAuth
                    console.log('SignInPage: No user data, calling checkAuth...');
                    await checkAuth();
                    // The useEffect will handle the redirect
                }
            } else {
                toast.error(result.error || "Sign in failed");
            }
        } catch (error) {
            toast.error("An unexpected error occurred");
            console.error("SignInPage: Sign in error:", error);
        } finally {
            setLoading(false);
        }
    };

    const getRoleInfo = (role: string) => {
        const roleInfo = {
            admin: { icon: "⚙️", title: "Administrator", color: "bg-purple-600" },
            teacher: { icon: "👨‍🏫", title: "Teacher", color: "bg-blue-600" },
            student: { icon: "📚", title: "Student", color: "bg-green-600" },
            parent: { icon: "👨‍👩‍👧‍👦", title: "Parent", color: "bg-orange-600" }
        };
        return roleInfo[role as keyof typeof roleInfo] || roleInfo.student;
    };

    // Show loading while checking authentication
    if (authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Checking authentication...</p>
                </div>
            </div>
        );
    }

    // If user is already authenticated, show loading while redirecting
    if (user && isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Redirecting to dashboard...</p>
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
                        <div className="w-16 h-16 bg-slate-100 rounded-xl flex items-center justify-center">
                            <Image src="/logo.png" alt="logo" width={60} height={60} />
                        </div>
                    </div>
                    
                    <h2 className="text-3xl font-extrabold text-gray-900 mb-2">
                        Welcome Back
                    </h2>
                    
                    {/* Selected Role Display */}
                    {selectedRole && (
                        <div className="mb-6">
                            <div className={`inline-flex items-center px-4 py-2 rounded-full text-white ${getRoleInfo(selectedRole).color}`}>
                                <span className="text-lg mr-2">{getRoleInfo(selectedRole).icon}</span>
                                <span className="font-medium">{getRoleInfo(selectedRole).title}</span>
                            </div>
                            <p className="text-sm text-gray-600 mt-2">
                                Sign in to access your {getRoleInfo(selectedRole).title.toLowerCase()} dashboard
                            </p>
                        </div>
                    )}
                    
                    <p className="text-sm text-gray-600">
                        Or{' '}
                        <button
                            onClick={() => router.push(`/${locale}/sign-up`)}
                            className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
                        >
                            create a new account
                        </button>
                    </p>
                </div>
                
                <div className="bg-white rounded-xl shadow-lg p-8">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                Email address
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={loading}
                            />
                        </div>
                        
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={loading}
                            />
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
                                        Signing in...
                                    </div>
                                ) : (
                                    'Sign in to your account'
                                )}
                            </button>
                        </div>
                    </form>
                </div>
                
                {/* Back to Welcome */}
                <div className="text-center">
                    <button
                        onClick={() => router.push(`/${locale}`)}
                        className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                    >
                        ← Back to Welcome Page
                    </button>
                </div>
            </div>
        </div>
    );
}
