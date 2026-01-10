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
    
    console.log("Middleware check - Path:", pathname);
    console.log("Middleware check - Cookie exists:", !!authCookie);
    console.log("Middleware check - Cookie value:", authCookie?.value);
    console.log("Middleware check - All cookies:", request.cookies.getAll());
    
    if (!authCookie || authCookie.value !== "authenticated") {
      // Redirect to login if not authenticated
      console.log("Middleware redirecting to login");
      return NextResponse.redirect(new URL("/adminpanel/login", request.url));
    }
    
    console.log("Middleware allowing access to:", pathname);
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/adminpanel/:path*",
};

