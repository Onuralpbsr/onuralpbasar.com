import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect admin panel routes
  if (pathname.startsWith("/adminpanel")) {
    // Allow access to login page
    if (pathname === "/adminpanel/login") {
      return NextResponse.next();
    }

    // Check for auth cookie
    const authCookie = request.cookies.get("admin_auth");
    
    if (!authCookie || authCookie.value !== "authenticated") {
      // Redirect to login if not authenticated
      return NextResponse.redirect(new URL("/adminpanel/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/adminpanel/:path*",
};

