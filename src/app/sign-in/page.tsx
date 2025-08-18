"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/lib/auth-store";
import { signIn } from "@/lib/appwrite-auth";
import { toast } from "react-toastify";

export default function SignInPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    
    const { user, loading: authLoading, checkAuth, getUserRole } = useAuthStore();
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirectTo = searchParams.get('redirect') || '/admin';

    // Check if user is already authenticated
    useEffect(() => {
        console.log('SignInPage: useEffect triggered', { user, authLoading, isAuthenticated: !!user });
        
        if (!authLoading && user) {
            // User is already authenticated, redirect to appropriate dashboard
            const role = getUserRole();
            console.log('SignInPage: Redirecting authenticated user to:', role);
            router.push(`/${role}`);
        }
    }, [user, authLoading, router, getUserRole]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const result = await signIn(email, password);
            
            if (result.success) {
                toast.success("Sign in successful!");
                
                if (result.user) {
                    // User data is available, update store and redirect immediately
                    console.log('SignInPage: User data received:', result.user);
                    console.log('SignInPage: User preferences:', result.user.prefs);
                    
                    useAuthStore.getState().setUser(result.user);
                    const role = result.user.prefs?.role || 'student';
                    console.log('SignInPage: Redirecting to role:', role);
                    
                    // Try router.push first, fallback to window.location if it doesn't work
                    try {
                        router.push(`/${role}`);
                        console.log('SignInPage: Router push completed');
                        
                        // Add a fallback redirect after a short delay
                        setTimeout(() => {
                            if (window.location.pathname === '/sign-in') {
                                console.log('SignInPage: Fallback redirect needed');
                                const urlParams = new URLSearchParams(window.location.search);
                                const redirectTo = urlParams.get('redirect');
                                if (redirectTo) {
                                    console.log('SignInPage: Fallback redirecting to:', redirectTo);
                                    window.location.href = redirectTo;
                                } else {
                                    console.log('SignInPage: Fallback redirecting to role:', role);
                                    window.location.href = `/${role}`;
                                }
                            }
                        }, 1000);
                    } catch (routerError) {
                        console.error('Router push failed, using window.location:', routerError);
                        window.location.href = `/${role}`;
                    }
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

    // Show loading while checking authentication
    if (authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Checking authentication...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Sign in to your account
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Or{' '}
                        <button
                            onClick={() => router.push('/sign-up')}
                            className="font-medium text-blue-600 hover:text-blue-500"
                        >
                            create a new account
                        </button>
                    </p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div>
                            <label htmlFor="email" className="sr-only">
                                Email address
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                                placeholder="Email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={loading}
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="sr-only">
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={loading}
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <div className="flex items-center">
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                    Signing in...
                                </div>
                            ) : (
                                'Sign in'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
