'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { AppwriteUser, AuthState, getCurrentUser } from '@/lib/appwrite-auth';

interface AuthContextType extends AuthState {
    refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AppwriteAuthProvider({ children }: { children: React.ReactNode }) {
    const [authState, setAuthState] = useState<AuthState>({
        user: null,
        loading: true,
        error: null,
    });

    const refreshUser = async () => {
        try {
            setAuthState(prev => ({ ...prev, loading: true, error: null }));
            const user = await getCurrentUser();
            setAuthState({
                user,
                loading: false,
                error: null,
            });
        } catch (error) {
            setAuthState({
                user: null,
                loading: false,
                error: 'Failed to get user',
            });
        }
    };

    useEffect(() => {
        refreshUser();
    }, []);

    return (
        <AuthContext.Provider value={{ ...authState, refreshUser }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AppwriteAuthProvider');
    }
    return context;
}
