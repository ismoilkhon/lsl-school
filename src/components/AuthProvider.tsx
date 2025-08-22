"use client";
import { useEffect } from 'react';
import { useAuthStore } from '@/lib/auth-store';

interface AuthProviderProps {
  children: React.ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
  useEffect(() => {
    console.log('AuthProvider: Starting authentication check...');
    
    const checkAuthWithTimeout = async () => {
      try {
        // Add a timeout to prevent hanging
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('Authentication check timeout')), 2000);
        });
        
        const authPromise = useAuthStore.getState().checkAuth();
        await Promise.race([authPromise, timeoutPromise]);
        console.log('AuthProvider: Authentication check completed');

        // After auth, propagate role via cookie for middleware fallback on next SSR request
        const state = useAuthStore.getState();
        const role = (state.user?.prefs?.role || 'student').toLowerCase();
        try {
          document.cookie = `role=${role}; path=/; max-age=${60 * 60 * 24 * 7}`;
        } catch {}
      } catch (error) {
        console.error('AuthProvider: Authentication check failed or timed out:', error);
        // Set loading to false and ensure user is null so pages can render
        const store = useAuthStore.getState();
        store.setLoading(false);
        store.setUser(null);
      }
    };
    
    checkAuthWithTimeout();
  }, []); // Empty dependency array to run only once

  return <>{children}</>;
}

