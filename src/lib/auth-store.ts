import { create } from 'zustand';
import { getCurrentUser, signOut, AppwriteUser } from './appwrite-auth';

interface AuthState {
  user: AppwriteUser | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  
  // Actions
  setUser: (user: AppwriteUser | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  checkAuth: () => Promise<void>;
  logout: () => Promise<void>;
  getUserRole: () => string;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  loading: true,
  error: null,
  isAuthenticated: false,

  setUser: (user) => {
    console.log('AuthStore: setUser called with:', user);
    set({ 
      user, 
      isAuthenticated: !!user,
      error: null,
      loading: false
    });
    console.log('AuthStore: State updated, isAuthenticated:', !!user);
  },

  setLoading: (loading) => {
    console.log('AuthStore: setLoading called with:', loading);
    set({ loading });
  },

  setError: (error) => {
    console.log('AuthStore: setError called with:', error);
    set({ error });
  },

  checkAuth: async () => {
    console.log('AuthStore: checkAuth: Starting authentication check...');
    set({ loading: true, error: null });
    
    try {
      const user = await getCurrentUser();
      console.log('AuthStore: checkAuth: User retrieved:', user);
      
      if (user) {
        set({ 
          user, 
          isAuthenticated: true,
          loading: false,
          error: null 
        });
        console.log('AuthStore: checkAuth: User authenticated successfully');
      } else {
        set({ 
          user: null, 
          isAuthenticated: false,
          loading: false,
          error: null 
        });
        console.log('AuthStore: checkAuth: No user found, not authenticated');
      }
    } catch (error: any) {
      console.error('AuthStore: checkAuth: Error occurred:', error);
      set({ 
        user: null, 
        isAuthenticated: false,
        loading: false,
        error: error.message || 'Authentication check failed'
      });
    }
  },

  logout: async () => {
    console.log('AuthStore: logout: Starting logout...');
    set({ loading: true });
    
    try {
      await signOut();
      set({ 
        user: null, 
        isAuthenticated: false,
        loading: false,
        error: null 
      });
      console.log('AuthStore: logout: Logout successful');
    } catch (error: any) {
      console.error('AuthStore: logout: Error occurred:', error);
      set({ 
        loading: false,
        error: error.message || 'Logout failed'
      });
    }
  },

  getUserRole: () => {
    const { user } = get();
    const role = user?.prefs?.role || 'student';
    console.log('AuthStore: getUserRole: Returning role:', role);
    return role;
  }
}));

