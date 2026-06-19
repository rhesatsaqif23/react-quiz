/**
 * @file middleware.ts
 * @description Next.js middleware for route protection
 *
 * Protects authenticated routes by checking for valid session:
 * - /quiz/* routes require authentication
 * - /results/* routes require authentication
 * - Unauthenticated users are redirected to /login
 *
 * Uses NextAuth's auth function to check session validity.
 *
 * Key exports:
 * - default: Middleware function for route protection
 * - config: Matcher configuration for protected routes
 */

import { auth } from '@/libs/auth';
import { NextResponse } from 'next/server';

// Protect routes by checking for valid session
export default auth((req) => {
  if (!req.auth && req.nextUrl.pathname.startsWith('/quiz')) {
    return NextResponse.redirect(new URL('/login', req.url));
  }
  if (!req.auth && req.nextUrl.pathname.startsWith('/results')) {
    return NextResponse.redirect(new URL('/login', req.url));
  }
  return NextResponse.next();
});

// Routes that require authentication
export const config = {
  matcher: ['/quiz/:path*', '/results/:path*'],
};
