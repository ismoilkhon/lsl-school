import { Client, Account } from 'appwrite';
import { cookies } from 'next/headers';

// Initialize Appwrite client for server-side authentication
const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://syd.cloud.appwrite.io/v1')
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '');

const account = new Account(client);

export interface ServerUser {
  $id: string;
  email: string;
  name: string;
  prefs?: {
    role?: string;
    [key: string]: any;
  };
}

export async function getCurrentServerUser(): Promise<ServerUser | null> {
  try {
    // Get session cookie
    const sessionCookieName = 'a_session_' + (process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '');
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get(sessionCookieName);
    
    if (!sessionCookie) {
      return null;
    }

    // Set session for server-side client
    client.setSession(sessionCookie.value);
    
    // Get current user
    const user = await account.get();
    return user as ServerUser;
    
  } catch (error) {
    console.error('Error getting current server user:', error);
    return null;
  }
}

export async function getCurrentUserRole(): Promise<string> {
  try {
    const user = await getCurrentServerUser();
    return (user?.prefs?.role || 'student').toLowerCase();
  } catch (error) {
    console.error('Error getting current user role:', error);
    return 'student';
  }
}
