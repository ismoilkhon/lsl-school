"use client";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/lib/auth-store";

export default function DebugPage() {
  const [cookies, setCookies] = useState<string[]>([]);
  const { user, loading, isAuthenticated } = useAuthStore();

  useEffect(() => {
    // Get all cookies
    const allCookies = document.cookie.split(';').map(cookie => cookie.trim());
    setCookies(allCookies);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Authentication Debug Page</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Auth Store State */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Auth Store State</h2>
            <div className="space-y-2">
              <p><strong>Loading:</strong> {loading ? 'Yes' : 'No'}</p>
              <p><strong>Is Authenticated:</strong> {isAuthenticated ? 'Yes' : 'No'}</p>
              <p><strong>User:</strong> {user ? 'Present' : 'None'}</p>
              {user && (
                <div className="mt-4 p-3 bg-gray-50 rounded">
                  <p><strong>User ID:</strong> {user.$id}</p>
                  <p><strong>Email:</strong> {user.email}</p>
                  <p><strong>Name:</strong> {user.name}</p>
                  <p><strong>Role:</strong> {user.prefs?.role || 'student'}</p>
                </div>
              )}
            </div>
          </div>

          {/* Cookies */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Cookies</h2>
            <div className="space-y-2">
              <p><strong>Total Cookies:</strong> {cookies.length}</p>
              {cookies.map((cookie, index) => (
                <div key={index} className="p-2 bg-gray-50 rounded text-sm">
                  {cookie}
                </div>
              ))}
            </div>
          </div>

          {/* Session Cookie Check */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Session Cookie Check</h2>
            <div className="space-y-2">
              <p><strong>Project ID:</strong> {process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}</p>
              <p><strong>Session Cookie Name:</strong> a_session_{process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}</p>
              <p><strong>Session Cookie Value:</strong> {
                cookies.find(cookie => cookie.startsWith(`a_session_${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`))?.split('=')[1] || 'Not found'
              }</p>
            </div>
          </div>

          {/* Environment Variables */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Environment Variables</h2>
            <div className="space-y-2">
              <p><strong>Endpoint:</strong> {process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}</p>
              <p><strong>Project ID:</strong> {process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}</p>
              <p><strong>Database ID:</strong> {process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID}</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-8 bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Actions</h2>
          <div className="space-x-4">
            <button 
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Reload Page
            </button>
            <button 
              onClick={() => useAuthStore.getState().checkAuth()}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Check Auth
            </button>
            <button 
              onClick={() => useAuthStore.getState().logout()}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
