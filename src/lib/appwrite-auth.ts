import { Client, Account, ID } from 'appwrite';

// Initialize Appwrite client for authentication
const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1')
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '');

export const account = new Account(client);

// Authentication types
export interface AppwriteUser {
    $id: string;
    email: string;
    name: string;
    prefs: {
        role?: string;
        [key: string]: any;
    };
}

export interface AuthState {
    user: AppwriteUser | null;
    loading: boolean;
    error: string | null;
}

// Authentication functions
export const signUp = async (email: string, password: string, name: string, role: string = 'student') => {
    try {
        // Create the user account (allowed for guests)
        const createdUser = await account.create(
            ID.unique(),
            email,
            password
        );

        // Create a session for the newly created user
        const session = await account.createEmailPasswordSession(email, password);

        // After session exists, update preferences (requires auth scope)
        await account.updatePrefs({
            role: role,
            name: name
        });

        // Fetch the authenticated user with updated prefs
        const authedUser = await account.get();

        return { success: true, user: authedUser, session };
    } catch (error: any) {
        console.error('Sign up error:', error);
        return { success: false, error: error.message };
    }
};

export const signIn = async (email: string, password: string) => {
    try {
        // First check if there's already an active session
        try {
            const existingUser = await account.get();
            if (existingUser) {
                // Return success with existing user data
                return { success: true, user: existingUser, session: null };
            }
        } catch (sessionError) {
            // No active session, proceed with sign in
        }

        // Clear any existing sessions to prevent conflicts
        try {
            await account.deleteSessions();
        } catch (clearError) {
            // Ignore errors when clearing sessions
        }

        // Create new session with email and password
        const session = await account.createEmailPasswordSession(email, password);
        
        // After successful session creation, get the user data
        const user = await account.get();
        
        return { success: true, session, user };
    } catch (error: any) {
        console.error('Sign in error:', error);
        return { success: false, error: error.message };
    }
};

export const signOut = async () => {
    try {
        await account.deleteSessions();
        return { success: true };
    } catch (error: any) {
        console.error('Sign out error:', error);
        return { success: false, error: error.message };
    }
};

export const getCurrentUser = async (): Promise<AppwriteUser | null> => {
    try {
        console.log('getCurrentUser: Attempting to get current user...');
        
        // Add a timeout to prevent hanging
        const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => reject(new Error('getCurrentUser timeout')), 3000);
        });
        
        const userPromise = account.get();
        const user = await Promise.race([userPromise, timeoutPromise]) as any;
        
        console.log('getCurrentUser: User retrieved successfully:', user);
        return user as AppwriteUser;
    } catch (error: any) {
        // Check if it's a "missing scope" error (no active session)
        if (error.message && error.message.includes('missing scope')) {
            console.log('getCurrentUser: No active session found, user is not authenticated');
            return null;
        }
        
        // Check if it's a timeout error
        if (error.message && error.message.includes('timeout')) {
            console.log('getCurrentUser: Timeout occurred, returning null');
            return null;
        }
        
        // Log other errors but still return null
        console.error('getCurrentUser: Error occurred:', error);
        return null;
    }
};

export const isAuthenticated = async (): Promise<boolean> => {
    try {
        await account.get();
        return true;
    } catch (error: any) {
        // Check if it's a "missing scope" error (no active session)
        if (error.message && error.message.includes('missing scope')) {
            return false;
        }
        
        // For other errors, assume not authenticated
        console.error('Authentication check error:', error);
        return false;
    }
};

// Server-side authentication helper
export const getServerUser = async () => {
    try {
        const user = await account.get();
        return user as AppwriteUser;
    } catch (error) {
        return null;
    }
};
