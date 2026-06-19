import { auth } from '@/libs/auth';
import { NextResponse } from 'next/server';

export default auth((req) => {
  if (!req.auth && req.nextUrl.pathname.startsWith('/quiz')) {
    return NextResponse.redirect(new URL('/login', req.url));
  }
  if (!req.auth && req.nextUrl.pathname.startsWith('/results')) {
    return NextResponse.redirect(new URL('/login', req.url));
  }
  return NextResponse.next();
});

export const config = {
  matcher: ['/quiz/:path*', '/results/:path*'],
};
