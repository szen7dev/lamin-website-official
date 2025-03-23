import type { NextRequest } from 'next/server';

import { NextResponse } from 'next/server';

// URL redirects mapping (from -> to)
const redirects = new Map([
  ['/height-measurement', '/do-cao'],
  ['/nutrition-check', '/kiem-tra-thoi-quen'],
]);

// URL rewrites mapping (visible URL -> content URL)
const rewrites = new Map([
  ['/do-cao', '/height-measurement'],
  ['/kiem-tra-thoi-quen', '/nutrition-check'],
]);

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check for URL redirects
  if (redirects.has(pathname)) {
    const newUrl = new URL(redirects.get(pathname) || '', request.url);

    return NextResponse.redirect(newUrl);
  }

  // Check for URL rewrites
  if (rewrites.has(pathname)) {
    const newUrl = new URL(request.url);

    newUrl.pathname = rewrites.get(pathname) || pathname;

    return NextResponse.rewrite(newUrl);
  }

  // Authentication middleware logic
  const isAuthenticated = request.cookies.has('auth-token');
  const isProtectedRoute = request.nextUrl.pathname.startsWith('/(protected)');

  if (isProtectedRoute && !isAuthenticated) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
