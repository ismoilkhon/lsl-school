import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { Client, Account } from 'appwrite';

// Initialize Appwrite client for server-side operations
const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1')
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '');

const account = new Account(client);

// Define role-based access control
const roleRoutes = {
  admin: ['/admin', '/list'],
  teacher: ['/teacher', '/list/students', '/list/classes', '/list/lessons', '/list/exams', '/list/assignments', '/list/results', '/list/attendances'],
  student: ['/student', '/list/lessons', '/list/exams', '/list/assignments', '/list/results'],
  parent: ['/parent', '/list/students', '/list/results', '/list/attendances']
};

// Public routes that don't require authentication
const publicRoutes = ['/sign-in', '/sign-up', '/'];

// Get user role from session or user preferences
async function getUserRole(request: NextRequest): Promise<string | null> {
  try {
    // Get session cookie
    const sessionCookie = request.cookies.get('a_session_' + (process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || ''));
    
    if (!sessionCookie) {
      return null;
    }

    // Set session for server-side client
    client.setSession(sessionCookie.value);
    
    // Get current user
    const user = await account.get();
    
    // Return role from user preferences, default to 'student'
    return user.prefs?.role || 'student';
    
  } catch (error) {
    console.error('Error getting user role:', error);
    return null;
  }
}

// Check if user has access to the route based on their role
function hasAccess(userRole: string, pathname: string): boolean {
  // Admin has access to everything
  if (userRole === 'admin') {
    return true;
  }

  // Check if the route is allowed for the user's role
  const allowedRoutes = roleRoutes[userRole as keyof typeof roleRoutes] || [];
  
  return allowedRoutes.some(route => pathname.startsWith(route));
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public routes
  if (publicRoutes.includes(pathname) || pathname.startsWith('/_next') || pathname.startsWith('/api')) {
    return NextResponse.next();
  }

  try {
    // Get user role
    const userRole = await getUserRole(request);

    // If no user role (not authenticated), redirect to sign-in
    if (!userRole) {
      const signInUrl = new URL('/sign-in', request.url);
      signInUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(signInUrl);
    }

    // Check if user has access to the route
    if (!hasAccess(userRole, pathname)) {
      // Redirect to appropriate dashboard based on role
      const dashboardUrl = new URL(`/${userRole}`, request.url);
      return NextResponse.redirect(dashboardUrl);
    }

    // Add user role to headers for use in components
    const response = NextResponse.next();
    response.headers.set('x-user-role', userRole);
    
    return response;

  } catch (error) {
    console.error('Middleware error:', error);
    
    // On error, redirect to sign-in
    const signInUrl = new URL('/sign-in', request.url);
    signInUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(signInUrl);
  }
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
