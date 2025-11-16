import { NextRequest, NextResponse } from "next/server";

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

interface RateLimitOptions {
  maxRequests: number;
  windowMs: number;
}

export function rateLimit(options: RateLimitOptions) {
  return function rateLimitMiddleware(request: NextRequest): NextResponse | null {
    const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown";
    const now = Date.now();
    const limit = rateLimitMap.get(ip);

    if (!limit || now > limit.resetAt) {
      rateLimitMap.set(ip, {
        count: 1,
        resetAt: now + options.windowMs,
      });
      return null;
    }

    if (limit.count >= options.maxRequests) {
      return NextResponse.json(
        {
          success: false,
          error: {
            message: "Too many requests. Please try again later.",
            code: "RATE_LIMIT_EXCEEDED",
          },
        },
        {
          status: 429,
          headers: {
            "Retry-After": Math.ceil((limit.resetAt - now) / 1000).toString(),
          },
        }
      );
    }

    limit.count++;
    return null;
  };
}

// Clean up old entries periodically
if (typeof window === "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [ip, limit] of rateLimitMap.entries()) {
      if (now > limit.resetAt) {
        rateLimitMap.delete(ip);
      }
    }
  }, 60000); // Clean up every minute
}
