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
        console.log('appwrite-auth: signUp started for:', { email, name, role });
        
        // Create the user account (allowed for guests)
        const createdUser = await account.create(
            ID.unique(),
            email,
            password
        );
        console.log('appwrite-auth: User account created:', createdUser.$id);

        // Create a session for the newly created user
        const session = await account.createEmailPasswordSession(email, password);
        console.log('appwrite-auth: Session created for new user');

        // After session exists, update preferences using the account service
        // Note: This might require the user to be authenticated first
        console.log('appwrite-auth: Updating user preferences...');
        try {
            await account.updatePrefs({
                role: role,
                name: name
            });
            console.log('appwrite-auth: User preferences updated successfully');
        } catch (prefsError: any) {
            console.warn('appwrite-auth: Could not update preferences immediately:', prefsError.message);
            console.log('appwrite-auth: Preferences will be updated on first sign-in');
        }

        // Fetch the authenticated user with updated prefs
        const authedUser = await account.get();
        console.log('appwrite-auth: Final user data retrieved:', authedUser);

        return { success: true, user: authedUser, session };
    } catch (error: any) {
        console.error('appwrite-auth: Sign up error:', error);
        return { success: false, error: error.message };
    }
};

export const signIn = async (email: string, password: string) => {
    try {
        console.log('appwrite-auth: signIn started for email:', email);
        
        // First check if there's already an active session
        try {
            const existingUser = await account.get();
            if (existingUser) {
                console.log('appwrite-auth: Existing session found, returning user:', existingUser);
                // Return success with existing user data
                return { success: true, user: existingUser, session: null };
            }
        } catch (sessionError) {
            console.log('appwrite-auth: No existing session found, proceeding with sign in');
            // No active session, proceed with sign in
        }

        // Clear any existing sessions to prevent conflicts
        try {
            await account.deleteSessions();
            console.log('appwrite-auth: Cleared existing sessions');
        } catch (clearError) {
            console.log('appwrite-auth: Error clearing sessions (ignored):', clearError);
            // Ignore errors when clearing sessions
        }

        // Create new session with email and password
        console.log('appwrite-auth: Creating new session...');
        const session = await account.createEmailPasswordSession(email, password);
        console.log('appwrite-auth: Session created successfully');
        
        // After successful session creation, get the user data
        console.log('appwrite-auth: Getting user data...');
        const user = await account.get();
        console.log('appwrite-auth: User data retrieved:', user);
        
        // Check if user has preferences set, if not, try to set them
        if (!user.prefs || !user.prefs.role) {
            console.log('appwrite-auth: User has no role set, attempting to set default role...');
            try {
                // Try to set a default role based on email
                let defaultRole = 'student';
                if (email.includes('admin')) defaultRole = 'admin';
                else if (email.includes('teacher')) defaultRole = 'teacher';
                else if (email.includes('parent')) defaultRole = 'parent';
                
                await account.updatePrefs({
                    role: defaultRole,
                    name: user.name || 'Unknown'
                });
                console.log('appwrite-auth: Default role set:', defaultRole);
                
                // Get updated user data
                const updatedUser = await account.get();
                return { success: true, session, user: updatedUser };
            } catch (prefsError: any) {
                console.warn('appwrite-auth: Could not set default role:', prefsError.message);
            }
        }
        
        return { success: true, session, user };
    } catch (error: any) {
        console.error('appwrite-auth: Sign in error:', error);
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
        console.log('appwrite-auth: getCurrentUser: Attempting to get current user...');
        
        // Add a shorter timeout to prevent hanging
        const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => reject(new Error('getCurrentUser timeout')), 2000);
        });
        
        const userPromise = account.get();
        const user = await Promise.race([userPromise, timeoutPromise]) as any;
        
        console.log('appwrite-auth: getCurrentUser: User retrieved successfully:', user);
        return user as AppwriteUser;
    } catch (error: any) {
        // Check if it's a "missing scope" error (no active session)
        if (error.message && error.message.includes('missing scope')) {
            console.log('appwrite-auth: getCurrentUser: No active session found, user is not authenticated');
            return null;
        }
        
        // Check if it's a timeout error
        if (error.message && error.message.includes('timeout')) {
            console.log('appwrite-auth: getCurrentUser: Timeout occurred, returning null');
            return null;
        }
        
        // Log other errors but still return null
        console.error('appwrite-auth: getCurrentUser: Error occurred:', error);
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
