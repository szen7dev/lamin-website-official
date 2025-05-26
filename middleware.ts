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
  ['/bai-viet', '/chuyen-trang-suc-khoe'],
  ['/checkout', '/thanh-toan'],
  ['/cart', '/gio-hang'],
  ['/about', '/ve-lamin'],
  ['/account/info', '/tai-khoan/thong-tin-ca-nhan'],
  ['/account/orders', '/tai-khoan/don-hang'],
  ['/account/location', '/tai-khoan/dia-chi'],
  ['/account/height-measure-history', '/tai-khoan/lich-su-do-cao'],
  ['/vng-event', '/quy-vietnam-grow'],
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
  ['/bai-viet', '/article'],
  ['/thanh-toan', '/checkout'],
  ['/gio-hang', '/cart'],
  ['/ve-lamin', '/about'],
  ['/tai-khoan/thong-tin-ca-nhan', '/account/info'],
  ['/tai-khoan/don-hang', '/account/orders'],
  ['/tai-khoan/dia-chi', '/account/location'],
  ['/tai-khoan/lich-su-do-cao', '/account/height-measure-history'],
  ['/quy-vietnam-grow', '/vng-event'],
]);

export async function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

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
  if (pathname.startsWith('/article/') && pathname !== '/article') {
    const slug = pathname.replace('/article/', '');
    const newPath = `/bai-viet/${slug}`;

    return NextResponse.redirect(new URL(newPath, request.url));
  }

  // Check for dynamic article path
  if (pathname.startsWith('/article-tags/') && pathname !== '/article-tags') {
    const slug = pathname.replace('/article-tags/', '');
    const newPath = `/chu-de/${slug}`;

    return NextResponse.redirect(new URL(newPath, request.url));
  }

  // Check for dynamic article path
  if (pathname.startsWith('/chu-de/') && pathname !== '/chu-de') {
    const slug = pathname.replace('/chu-de/', '');
    const newPath = `/article-tags/${slug}`;

    return NextResponse.rewrite(new URL(newPath, request.url));
  }

  // Check for dynamic Vietnamese article path
  if (pathname.startsWith('/bai-viet/') && pathname !== '/bai-viet') {
    const slug = pathname.replace('/bai-viet/', '');
    const newPath = `/article/${slug}`;

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

  // Check for dynamic category path
  if (pathname.startsWith('/category/') && pathname !== '/category') {
    const slug = pathname.replace('/category/', '');
    const newPath = `/danh-muc/${slug}`;

    return NextResponse.redirect(new URL(newPath, request.url));
  }

  // Check for dynamic danh-muc path
  if (pathname.startsWith('/danh-muc/') && pathname !== '/danh-muc') {
    const slug = pathname.replace('/danh-muc/', '');
    const newPath = `/category/${slug}`;

    return NextResponse.rewrite(new URL(newPath, request.url));
  }

  // Check for dynamic search path
  if (pathname.startsWith('/search')) {
    const newPath = `/tim-kiem${search}`;

    return NextResponse.redirect(new URL(newPath, request.url));
  }

  // Check for dynamic tim-kiem path
  if (pathname.startsWith('/tim-kiem')) {
    const newPath = `/search${search}`;

    return NextResponse.rewrite(new URL(newPath, request.url));
  }

  // Check for dynamic height-measure-history path
  if (
    pathname.startsWith('/account/height-measure-history/') &&
    pathname !== '/account/height-measure-history'
  ) {
    const id = pathname.replace('/account/height-measure-history/', '');
    const newPath = `/tai-khoan/lich-su-do-cao/${id}${search}`;

    return NextResponse.redirect(new URL(newPath, request.url));
  }

  // Check for dynamic lich-su-do-cao path
  if (
    pathname.startsWith('/tai-khoan/lich-su-do-cao/') &&
    pathname !== '/tai-khoan/lich-su-do-cao'
  ) {
    const id = pathname.replace('/tai-khoan/lich-su-do-cao/', '');
    const newPath = `/account/height-measure-history/${id}${search}`;

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
  const isAccountRoute = request.nextUrl.pathname.startsWith('/account');

  if ((isProtectedRoute || isAccountRoute) && !isAuthenticated) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
