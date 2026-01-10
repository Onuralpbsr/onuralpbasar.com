import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { checkRateLimit, checkAndIncrementRateLimit, resetRateLimit, getClientIdentifier } from "@/lib/rateLimit";

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    const adminUsername = process.env.ADMIN_USERNAME;
    const adminPassword = process.env.ADMIN_PASSWORD;

    // Debug: Production'da hassas bilgileri loglamayın, sadece varlığını kontrol edin
    if (!adminUsername || !adminPassword) {
      console.error("Admin credentials missing:", {
        hasUsername: !!adminUsername,
        hasPassword: !!adminPassword,
        nodeEnv: process.env.NODE_ENV
      });
      return NextResponse.json(
        { 
          error: "Admin credentials not configured",
          message: "Lütfen cPanel'de ADMIN_USERNAME ve ADMIN_PASSWORD environment variable'larını ekleyin ve uygulamayı yeniden başlatın."
        },
        { status: 500 }
      );
    }

    const clientId = getClientIdentifier(request);

    // Check rate limit before processing (without incrementing)
    const rateLimitCheck = checkRateLimit(clientId);

    if (!rateLimitCheck.allowed) {
      const resetTime = new Date(rateLimitCheck.resetTime).toISOString();
      return NextResponse.json(
        {
          error: "Çok fazla giriş denemesi. Lütfen daha sonra tekrar deneyin.",
          resetTime,
        },
        {
          status: 429,
          headers: {
            "Retry-After": Math.ceil((rateLimitCheck.resetTime - Date.now()) / 1000).toString(),
            "X-RateLimit-Limit": "5",
            "X-RateLimit-Remaining": "0",
            "X-RateLimit-Reset": rateLimitCheck.resetTime.toString(),
          },
        }
      );
    }

    // Validate credentials
    if (username === adminUsername && password === adminPassword) {
      // Successful login - reset rate limit
      resetRateLimit(clientId);

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
            "X-RateLimit-Remaining": "5",
          },
        }
      );
    } else {
      // Failed login - increment rate limit
      const rateLimit = checkAndIncrementRateLimit(clientId);

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
            "X-RateLimit-Reset": rateLimit.resetTime.toString(),
          },
        }
      );
    }
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Bir hata oluştu" },
      { status: 500 }
    );
  }
}

