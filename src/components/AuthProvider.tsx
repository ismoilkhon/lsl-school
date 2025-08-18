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
          setTimeout(() => reject(new Error('Authentication check timeout')), 5000);
        });
        
        const authPromise = useAuthStore.getState().checkAuth();
        await Promise.race([authPromise, timeoutPromise]);
        console.log('AuthProvider: Authentication check completed');
      } catch (error) {
        console.error('AuthProvider: Authentication check failed or timed out:', error);
        // Set loading to false so pages can render
        useAuthStore.getState().setLoading(false);
      }
    };
    
    checkAuthWithTimeout();
  }, []); // Empty dependency array to run only once

  return <>{children}</>;
}

