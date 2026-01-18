import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const cookieDomain = process.env.COOKIE_DOMAIN;
  
  // Cookie'yi silmek için aynı ayarlarla (secure, path, sameSite) silmeliyiz
  const protocol = request.headers.get("x-forwarded-proto") || 
                  (request.url.startsWith("https://") ? "https" : "http");
  const isHttps = protocol === "https";
  const isCloudflare = !!request.headers.get("cf-connecting-ip");
  const isSecure = isHttps || isCloudflare;
  
  // Cookie'yi doğru ayarlarla sil
  cookieStore.set("admin_auth", "", {
    httpOnly: true,
    secure: isSecure,
    sameSite: "lax",
    maxAge: 0, // Expire immediately
    path: "/",
    ...(cookieDomain ? { domain: cookieDomain } : {}),
  });

  return NextResponse.json({ success: true });
}

