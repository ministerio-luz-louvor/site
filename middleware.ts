import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Protects routes under /settings and /dashboard by verifying a Supabase auth cookie
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allow next internals, public assets and the login page
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/static") ||
    pathname.startsWith("/public") ||
    pathname === "/login"
  ) {
    return NextResponse.next();
  }

  // Only run protection for settings and dashboard routes
  if (pathname.startsWith("/settings") || pathname.startsWith("/dashboard")) {
    // Look for Supabase auth cookie name pattern: sb-<project>-auth-token
    const cookies = req.cookies.getAll();
    const hasAuth = cookies.some((c) => /^sb-.*-auth-token$/.test(c.name));

    if (!hasAuth) {
      const loginUrl = new URL("/login", req.url);
      // preserve original path so we can redirect back after login
      loginUrl.searchParams.set("redirect", pathname + req.nextUrl.search);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/settings/:path*", "/dashboard/:path*"]
};
