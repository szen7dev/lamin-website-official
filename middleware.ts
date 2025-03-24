import type { NextRequest } from 'next/server';

import { NextResponse } from 'next/server';

// URL redirects mapping (from -> to)
const redirects = new Map([
  ['/height-measurement', '/do-cao'],
  ['/nutrition-check', '/kiem-tra-thoi-quen'],
  ['/coach-experts', '/doi-ngu-chuyen-mon'],
  ['/health-news', '/goc-suc-khoe'],
  ['/contact', '/lien-he'],
]);

// URL rewrites mapping (visible URL -> content URL)
const rewrites = new Map([
  ['/do-cao', '/height-measurement'],
  ['/kiem-tra-thoi-quen', '/nutrition-check'],
  ['/doi-ngu-chuyen-mon', '/coach-experts'],
  ['/goc-suc-khoe', '/health-news'],
  ['/lien-he', '/contact'],
]);

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check for dynamic coach experts path
  if (pathname.startsWith('/coach-experts/') && pathname !== '/coach-experts') {
    const id = pathname.replace('/coach-experts/', '');
    const newPath = `/doi-ngu-chuyen-mon/${id}`;

    return NextResponse.redirect(new URL(newPath, request.url));
  }

  // Check for dynamic doi-ngu-chuyen-mon path
  if (
    pathname.startsWith('/doi-ngu-chuyen-mon/') &&
    pathname !== '/doi-ngu-chuyen-mon'
  ) {
    const id = pathname.replace('/doi-ngu-chuyen-mon/', '');
    const newPath = `/coach-experts/${id}`;

    return NextResponse.rewrite(new URL(newPath, request.url));
  }

  // Handle static redirects
  if (redirects.has(pathname)) {
    return NextResponse.redirect(
      new URL(redirects.get(pathname)!, request.url),
    );
  }

  // Handle static rewrites
  if (rewrites.has(pathname)) {
    return NextResponse.rewrite(new URL(rewrites.get(pathname)!, request.url));
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
