import { create } from 'zustand';
import { getCurrentUser, signOut, AppwriteUser } from './appwrite-auth';

// Utility function to manage role cookie
const setRoleCookie = (role: string) => {
  if (typeof window !== 'undefined') {
    try {
      document.cookie = `role=${role}; path=/; max-age=${60 * 60 * 24 * 7}`;
      console.log('AuthStore: setRoleCookie: Set role cookie to:', role);
    } catch (error) {
      console.warn('AuthStore: setRoleCookie: Could not set role cookie:', error);
    }
  }
};

const clearRoleCookie = () => {
  if (typeof window !== 'undefined') {
    try {
      document.cookie = 'role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      console.log('AuthStore: clearRoleCookie: Cleared role cookie');
    } catch (error) {
      console.warn('AuthStore: clearRoleCookie: Could not clear role cookie:', error);
    }
  }
};

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
    
    // Set role cookie when user is set, clear it when user is null
    if (user) {
      const role = (user.prefs?.role || 'student').toLowerCase();
      setRoleCookie(role);
    } else {
      clearRoleCookie();
    }
    
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
      
      // Clear the role cookie on logout
      clearRoleCookie();
      
      set({ 
        user: null, 
        isAuthenticated: false,
        loading: false,
        error: null 
      });
      console.log('AuthStore: logout: Logout successful');
      
      // Redirect to home page to show welcome screen
      if (typeof window !== 'undefined') {
        // Get current locale from URL or default to 'en'
        const currentPath = window.location.pathname;
        const localeMatch = currentPath.match(/^\/([a-z]{2})/);
        const locale = localeMatch ? localeMatch[1] : 'en';
        window.location.href = `/${locale}`;
      }
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
    const role = (user?.prefs?.role || 'student').toLowerCase();
    
    // Sync the role cookie with the actual user role
    if (typeof window !== 'undefined') {
      try {
        const currentRoleCookie = document.cookie
          .split('; ')
          .find(row => row.startsWith('role='))
          ?.split('=')[1];
        
        if (currentRoleCookie !== role) {
          // Update the role cookie to match the actual user role
          setRoleCookie(role);
          console.log('AuthStore: getUserRole: Updated role cookie from', currentRoleCookie, 'to', role);
        }
      } catch (error) {
        console.warn('AuthStore: getUserRole: Could not sync role cookie:', error);
      }
    }
    
    console.log('AuthStore: getUserRole: Returning role:', role);
    return role;
  }
}));

