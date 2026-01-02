/**
 * Simple in-memory rate limiter
 * For production, consider using Redis or a dedicated rate limiting service
 */

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes
const MAX_REQUESTS = 5; // Max 5 login attempts per 15 minutes

export function checkRateLimit(identifier: string): {
  allowed: boolean;
  remaining: number;
  resetTime: number;
} {
  const now = Date.now();
  const entry = rateLimitStore.get(identifier);

  // Clean up old entries
  if (entry && entry.resetTime < now) {
    rateLimitStore.delete(identifier);
  }

  const currentEntry = rateLimitStore.get(identifier);

  if (!currentEntry) {
    // First request, create new entry
    const resetTime = now + RATE_LIMIT_WINDOW;
    rateLimitStore.set(identifier, {
      count: 1,
      resetTime,
    });

    return {
      allowed: true,
      remaining: MAX_REQUESTS - 1,
      resetTime,
    };
  }

  if (currentEntry.count >= MAX_REQUESTS) {
    return {
      allowed: false,
      remaining: 0,
      resetTime: currentEntry.resetTime,
    };
  }

  // Increment count
  currentEntry.count++;

  return {
    allowed: true,
    remaining: MAX_REQUESTS - currentEntry.count,
    resetTime: currentEntry.resetTime,
  };
}

/**
 * Get client identifier for rate limiting
 * Uses IP address from request headers
 */
export function getClientIdentifier(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const realIp = request.headers.get("x-real-ip");
  const ip = forwarded?.split(",")[0] || realIp || "unknown";
  return `login:${ip}`;
}

