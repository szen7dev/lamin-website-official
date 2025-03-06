import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const forwardedHost = request.headers.get("x-forwarded-host")
  const isAuthenticated = request.cookies.has("accessToken")
  const isProtectedRoute = request.nextUrl.pathname.startsWith("/(protected)")
  const path = request.nextUrl.pathname

  if (isProtectedRoute && !isAuthenticated) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  if (
    (!forwardedHost || forwardedHost.split(".")[0] !== "admin") &&
    (path === "/dashboard" || path === "/login")
  ) {
    // Return 404 or redirect to main site
    return new NextResponse(null, { status: 404 })
  }

  if (forwardedHost && forwardedHost.split(".")[0] === "admin") {
    if (path === "/") {
      return NextResponse.redirect(new URL("/dashboard", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
}
