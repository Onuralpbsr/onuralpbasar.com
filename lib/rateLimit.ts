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
const MAX_REQUESTS = 5; // Max 5 failed login attempts per 15 minutes

/**
 * Check and increment rate limit for failed login attempts
 * Should only be called for failed login attempts
 */
export function checkAndIncrementRateLimit(identifier: string): {
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
    // First failed attempt, create new entry
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

  // Increment count for failed attempt
  currentEntry.count++;

  return {
    allowed: true,
    remaining: MAX_REQUESTS - currentEntry.count,
    resetTime: currentEntry.resetTime,
  };
}

/**
 * Check rate limit without incrementing
 * Used to check if user can attempt login
 */
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
    return {
      allowed: true,
      remaining: MAX_REQUESTS,
      resetTime: now + RATE_LIMIT_WINDOW,
    };
  }

  const currentEntry = rateLimitStore.get(identifier);

  if (!currentEntry) {
    return {
      allowed: true,
      remaining: MAX_REQUESTS,
      resetTime: now + RATE_LIMIT_WINDOW,
    };
  }

  if (currentEntry.count >= MAX_REQUESTS) {
    return {
      allowed: false,
      remaining: 0,
      resetTime: currentEntry.resetTime,
    };
  }

  return {
    allowed: true,
    remaining: MAX_REQUESTS - currentEntry.count,
    resetTime: currentEntry.resetTime,
  };
}

/**
 * Reset rate limit for an identifier
 * Should be called on successful login
 */
export function resetRateLimit(identifier: string): void {
  rateLimitStore.delete(identifier);
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

