import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { Client, Account } from 'appwrite';

// Initialize Appwrite client for server-side operations
const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1')
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '');

const account = new Account(client);

// Define role-based access control (route prefixes)
const roleRoutes = {
  // Admin can access everything under /admin and /list
  admin: ['/admin', '/list'],
  // Teacher can see and manage classes, lessons, exams, assignments, results, attendance, plus events & announcements
  teacher: [
    '/teacher',
    '/list/students',
    '/list/classes',
    '/list/lessons',
    '/list/exams',
    '/list/assignments',
    '/list/results',
    '/list/attendance',
    '/list/events',
    '/list/announcements',
  ],
  // Student can see timetable, exams, assignments, own results, events & announcements
  student: [
    '/student',
    '/list/lessons',
    '/list/exams',
    '/list/assignments',
    '/list/results',
    '/list/events',
    '/list/announcements',
  ],
  // Parent can see child's results, timetable, attendance, events & announcements
  parent: [
    '/parent',
    '/list/lessons',
    '/list/results',
    '/list/attendance',
    '/list/events',
    '/list/announcements',
  ],
} as const;

// Public routes that don't require authentication
const publicRoutes = ['/sign-in', '/sign-up', '/'];

// Get user role from session or user preferences
async function getUserRole(request: NextRequest): Promise<string | null> {
  try {
    console.log('Middleware: getUserRole: Starting...');
    
    // Get session cookie
    const sessionCookieName = 'a_session_' + (process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '');
    const sessionCookie = request.cookies.get(sessionCookieName);
    
    console.log('Middleware: getUserRole: Session cookie name:', sessionCookieName);
    console.log('Middleware: getUserRole: Session cookie found:', !!sessionCookie);
    
    if (!sessionCookie) {
      console.log('Middleware: getUserRole: No session cookie found');
      return null;
    }

    // Set session for server-side client
    client.setSession(sessionCookie.value);
    console.log('Middleware: getUserRole: Session set for server-side client');
    
    // Get current user
    const user = await account.get();
    console.log('Middleware: getUserRole: User retrieved:', user ? 'yes' : 'no');
    
    if (user) {
      const role = user.prefs?.role || 'student';
      console.log('Middleware: getUserRole: User role:', role);
      return role;
    }
    
    console.log('Middleware: getUserRole: No user data found');
    return null;
    
  } catch (error) {
    console.error('Middleware: getUserRole: Error occurred:', error);
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

  // Allow public routes (match exact or subpaths)
  if (
    publicRoutes.some(route => pathname === route || pathname.startsWith(route + '/')) ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api')
  ) {
    return NextResponse.next();
  }

  // TEMP: Allow dashboard routes while we rely on client auth store to handle redirects
  if (
    pathname.startsWith('/admin') ||
    pathname.startsWith('/teacher') ||
    pathname.startsWith('/student') ||
    pathname.startsWith('/parent') ||
    pathname.startsWith('/list')
  ) {
    console.log('Middleware: Skipping auth for dashboard route:', pathname);
    return NextResponse.next();
  }

  try {
    console.log('Middleware: Processing request for path:', pathname);
    
    // Get user role
    const userRole = await getUserRole(request);
    console.log('Middleware: User role retrieved:', userRole);

    // If no user role (not authenticated), redirect to sign-in
    if (!userRole) {
      console.log('Middleware: No user role found, redirecting to sign-in');
      const signInUrl = new URL('/sign-in', request.url);
      if (pathname && pathname !== '/' && pathname !== '/sign-in') {
        signInUrl.searchParams.set('redirect', pathname);
      }
      return NextResponse.redirect(signInUrl);
    }

    // Check if user has access to the route
    if (!hasAccess(userRole, pathname)) {
      console.log('Middleware: User does not have access to route, redirecting to dashboard');
      // Redirect to appropriate dashboard based on role
      const dashboardUrl = new URL(`/${userRole}`, request.url);
      return NextResponse.redirect(dashboardUrl);
    }

    console.log('Middleware: User authorized, allowing access to:', pathname);
    
    // Add user role to headers for use in components
    const response = NextResponse.next();
    response.headers.set('x-user-role', userRole);
    
    return response;

  } catch (error) {
    console.error('Middleware error:', error);
    
    // On error, redirect to sign-in
    const signInUrl = new URL('/sign-in', request.url);
    if (pathname && pathname !== '/' && pathname !== '/sign-in') {
      signInUrl.searchParams.set('redirect', pathname);
    }
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
