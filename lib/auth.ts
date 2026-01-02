import { cookies } from "next/headers";
import { NextResponse } from "next/server";

/**
 * Admin authentication helper
 * Checks if the request is authenticated as admin
 */
export async function checkAdminAuth(): Promise<boolean> {
  const cookieStore = await cookies();
  const authCookie = cookieStore.get("admin_auth");
  return authCookie?.value === "authenticated";
}

/**
 * Middleware wrapper for admin API routes
 * Returns null if authenticated, otherwise returns error response
 */
export async function requireAdminAuth(): Promise<NextResponse | null> {
  const isAuthenticated = await checkAdminAuth();
  
  if (!isAuthenticated) {
    return NextResponse.json(
      { error: "Yetkisiz erişim" },
      { status: 401 }
    );
  }
  
  return null;
}

