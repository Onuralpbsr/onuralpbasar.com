import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { checkRateLimit, getClientIdentifier } from "@/lib/rateLimit";

export async function POST(request: Request) {
  try {
    // Rate limiting check
    const clientId = getClientIdentifier(request);
    const rateLimit = checkRateLimit(clientId);

    if (!rateLimit.allowed) {
      const resetTime = new Date(rateLimit.resetTime).toISOString();
      return NextResponse.json(
        {
          error: "Çok fazla giriş denemesi. Lütfen daha sonra tekrar deneyin.",
          resetTime,
        },
        {
          status: 429,
          headers: {
            "Retry-After": Math.ceil((rateLimit.resetTime - Date.now()) / 1000).toString(),
            "X-RateLimit-Limit": "5",
            "X-RateLimit-Remaining": "0",
            "X-RateLimit-Reset": rateLimit.resetTime.toString(),
          },
        }
      );
    }

    const { username, password } = await request.json();

    const adminUsername = process.env.ADMIN_USERNAME;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminUsername || !adminPassword) {
      return NextResponse.json(
        { error: "Admin credentials not configured" },
        { status: 500 }
      );
    }

    if (username === adminUsername && password === adminPassword) {
      const cookieStore = await cookies();
      const isProduction = process.env.NODE_ENV === "production";
      
      cookieStore.set("admin_auth", "authenticated", {
        httpOnly: true,
        secure: isProduction,
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: "/",
      });

      return NextResponse.json(
        { success: true },
        {
          headers: {
            "X-RateLimit-Limit": "5",
            "X-RateLimit-Remaining": rateLimit.remaining.toString(),
          },
        }
      );
    } else {
      return NextResponse.json(
        {
          error: "Kullanıcı adı veya şifre hatalı",
          remaining: rateLimit.remaining,
        },
        {
          status: 401,
          headers: {
            "X-RateLimit-Limit": "5",
            "X-RateLimit-Remaining": rateLimit.remaining.toString(),
          },
        }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { error: "Bir hata oluştu" },
      { status: 500 }
    );
  }
}

