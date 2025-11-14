import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";

export async function middleware(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  const isAuthPage = request.nextUrl.pathname.startsWith("/auth");
  const isDashboard = request.nextUrl.pathname.startsWith("/dashboard");

  // Redirect to dashboard if logged in and trying to access auth pages
  if (session && isAuthPage) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Redirect to login if not logged in and trying to access protected pages
  if (!session && isDashboard) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public directory)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|public).*)",
  ],
};
