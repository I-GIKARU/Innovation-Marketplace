import { NextResponse } from 'next/server';

// Routes that require authentication
const protectedRoutes = ['/dashboard'];

// Routes that require specific roles
const roleBasedRoutes = {
  '/dashboard/admin': 'admin',
  '/dashboard/student': 'student'
};

export function middleware(request) {
  const { pathname } = request.nextUrl;
  
  // Check if route needs protection
  const isProtected = protectedRoutes.some(route => pathname.startsWith(route));
  
  if (isProtected) {
    // Get JWT token from cookies
    const token = request.cookies.get('access_token')?.value;
    
    if (!token) {
      // Redirect to home page with auth modal trigger
      const url = request.nextUrl.clone();
      url.pathname = '/';
      url.searchParams.set('auth', 'required');
      return NextResponse.redirect(url);
    }
    
    // For role-based routes, we'll need to verify the token server-side
    // This is a simplified version - in production, you'd verify the JWT
    const requiredRole = roleBasedRoutes[pathname];
    if (requiredRole) {
      // In a complete implementation, you would:
      // 1. Verify the JWT token
      // 2. Extract user role from token
      // 3. Check if role matches required role
      // For now, we'll let the client-side handle this
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
