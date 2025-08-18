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

  setUser: (user) => set({ 
    user, 
    isAuthenticated: !!user,
    error: null 
  }),

  setLoading: (loading) => set({ loading }),

  setError: (error) => set({ error }),

  checkAuth: async () => {
    console.log('checkAuth: Starting authentication check...');
    set({ loading: true, error: null });
    
    try {
      const user = await getCurrentUser();
      console.log('checkAuth: User retrieved:', user);
      
      if (user) {
        set({ 
          user, 
          isAuthenticated: true,
          loading: false,
          error: null 
        });
        console.log('checkAuth: User authenticated successfully');
      } else {
        set({ 
          user: null, 
          isAuthenticated: false,
          loading: false,
          error: null 
        });
        console.log('checkAuth: No user found, not authenticated');
      }
    } catch (error: any) {
      console.error('checkAuth: Error occurred:', error);
      set({ 
        user: null, 
        isAuthenticated: false,
        loading: false,
        error: error.message || 'Authentication check failed'
      });
    }
  },

  logout: async () => {
    set({ loading: true });
    
    try {
      await signOut();
      set({ 
        user: null, 
        isAuthenticated: false,
        loading: false,
        error: null 
      });
    } catch (error: any) {
      set({ 
        loading: false,
        error: error.message || 'Logout failed'
      });
    }
  },

  getUserRole: () => {
    const { user } = get();
    return user?.prefs?.role || 'student';
  }
}));

