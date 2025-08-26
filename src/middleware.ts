import { NextRequest, NextResponse } from 'next/server';

export default function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Public routes that don't require authentication
  const publicPaths = [
    '/',
    '/pricing',
    '/faq',
    '/blog',
    '/login',
    '/signup',
    '/api/auth',
  ];

  // Allow public paths
  if (publicPaths.some(p => path.startsWith(p))) {
    return NextResponse.next();
  }

  // Allow redirect routes
  if (path.startsWith('/r/')) {
    return NextResponse.next();
  }

  // Check for userId cookie for authentication
  const userId = request.cookies.get('userId')?.value;

  // If no userId cookie, redirect to login
  if (!userId) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|logo.svg|og-image.png).*)',
  ],
};