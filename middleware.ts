import type { NextRequest } from 'next/server';

import { NextResponse } from 'next/server';

// URL redirects mapping (from -> to)
const redirects = new Map([
  ['/height-measurement', '/do-cao'],
  ['/height-measurement/results', '/do-cao/ket-qua'],
  ['/nutrition-check', '/kiem-tra-thoi-quen'],
  ['/coach-experts', '/doi-ngu-chuyen-mon'],
  ['/health-news', '/chuyen-trang-suc-khoe'],
  ['/contact', '/lien-he'],
  ['/store-locations', '/he-thong-cua-hang'],
  ['/health-news/article', '/chuyen-trang-suc-khoe/bai-viet'],
  ['/checkout', '/thanh-toan'],
  ['/cart', '/gio-hang'],
]);

// URL rewrites mapping (visible URL -> content URL)
const rewrites = new Map([
  ['/do-cao', '/height-measurement'],
  ['/do-cao/ket-qua', '/height-measurement/results'],
  ['/kiem-tra-thoi-quen', '/nutrition-check'],
  ['/doi-ngu-chuyen-mon', '/coach-experts'],
  ['/chuyen-trang-suc-khoe', '/health-news'],
  ['/lien-he', '/contact'],
  ['/he-thong-cua-hang', '/store-locations'],
  ['/chuyen-trang-suc-khoe/bai-viet', '/health-news/article'],
  ['/thanh-toan', '/checkout'],
  ['/gio-hang', '/cart'],
]);

export async function middleware(request: NextRequest) {
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

  // Check for dynamic do-cao experts path
  if (
    pathname.startsWith('/do-cao/ket-qua/') &&
    pathname !== '/do-cao/ket-qua'
  ) {
    const id = pathname.replace('/do-cao/ket-qua/', '');
    const newPath = `/height-measurement/results/${id}`;

    return NextResponse.rewrite(new URL(newPath, request.url));
  }

  // Check for dynamic height-measurement results path
  if (
    pathname.startsWith('/height-measurement/results/') &&
    pathname !== '/height-measurement/results'
  ) {
    const id = pathname.replace('/height-measurement/results/', '');
    const newPath = `/do-cao/ket-qua/${id}`;

    return NextResponse.redirect(new URL(newPath, request.url));
  }

  // Check for dynamic article path
  if (
    pathname.startsWith('/health-news/article/') &&
    pathname !== '/health-news/article'
  ) {
    const slug = pathname.replace('/health-news/article/', '');
    const newPath = `/chuyen-trang-suc-khoe/bai-viet/${slug}`;

    return NextResponse.redirect(new URL(newPath, request.url));
  }

  // Check for dynamic Vietnamese article path
  if (
    pathname.startsWith('/chuyen-trang-suc-khoe/bai-viet/') &&
    pathname !== '/chuyen-trang-suc-khoe/bai-viet'
  ) {
    const slug = pathname.replace('/chuyen-trang-suc-khoe/bai-viet/', '');
    const newPath = `/health-news/article/${slug}`;

    return NextResponse.rewrite(new URL(newPath, request.url));
  }

  // Check for dynamic product path
  if (pathname.startsWith('/product/') && pathname !== '/product') {
    const slug = pathname.replace('/product/', '');
    const newPath = `/san-pham/${slug}`;

    return NextResponse.redirect(new URL(newPath, request.url));
  }

  // Check for dynamic san-pham path
  if (pathname.startsWith('/san-pham/') && pathname !== '/san-pham') {
    const slug = pathname.replace('/san-pham/', '');
    const newPath = `/product/${slug}`;

    return NextResponse.rewrite(new URL(newPath, request.url));
  }

  // Check for dynamic he-thong-cua-hang path
  if (
    pathname.startsWith('/he-thong-cua-hang/') &&
    pathname !== '/he-thong-cua-hang'
  ) {
    const id = pathname.replace('/he-thong-cua-hang/', '');
    const newPath = `/store-locations/${id}`;

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
