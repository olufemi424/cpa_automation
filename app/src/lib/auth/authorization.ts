import { NextRequest, NextResponse } from "next/server";
import { auth } from "./auth";

export type UserRole = "ADMIN" | "CPA" | "CLIENT";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

/**
 * Get the authenticated user from the request
 * Returns null if not authenticated
 */
export async function getAuthUser(request: NextRequest): Promise<AuthUser | null> {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user) {
      return null;
    }

    return {
      id: session.user.id,
      email: session.user.email,
      name: session.user.name,
      role: (session.user.role as UserRole) || "CLIENT",
    };
  } catch (error) {
    console.error("Error getting auth user:", error);
    return null;
  }
}

/**
 * Require authentication for an API route
 * Returns 401 if not authenticated
 */
export async function requireAuth(request: NextRequest): Promise<AuthUser | NextResponse> {
  const user = await getAuthUser(request);

  if (!user) {
    return NextResponse.json(
      { error: "Unauthorized - Please log in" },
      { status: 401 }
    );
  }

  return user;
}

/**
 * Require specific role(s) for an API route
 * Returns 401 if not authenticated, 403 if wrong role
 */
export async function requireRole(
  request: NextRequest,
  allowedRoles: UserRole[]
): Promise<AuthUser | NextResponse> {
  const user = await requireAuth(request);

  if (user instanceof NextResponse) {
    return user; // Return 401 response
  }

  if (!allowedRoles.includes(user.role)) {
    return NextResponse.json(
      { error: "Forbidden - Insufficient permissions" },
      { status: 403 }
    );
  }

  return user;
}

/**
 * Check if user has admin privileges
 */
export function isAdmin(user: AuthUser): boolean {
  return user.role === "ADMIN";
}

/**
 * Check if user is a CPA
 */
export function isCPA(user: AuthUser): boolean {
  return user.role === "CPA" || user.role === "ADMIN";
}

/**
 * Check if user is a client
 */
export function isClient(user: AuthUser): boolean {
  return user.role === "CLIENT";
}

/**
 * Check if user can access a specific client's data
 * - Admins can access all clients
 * - CPAs can access clients assigned to them
 * - Clients can only access their own data
 */
export function canAccessClient(user: AuthUser, clientUserId: string, assignedCPAId?: string): boolean {
  if (isAdmin(user)) {
    return true; // Admins can access all
  }

  if (user.role === "CPA" && assignedCPAId === user.id) {
    return true; // CPAs can access their assigned clients
  }

  if (user.role === "CLIENT" && clientUserId === user.id) {
    return true; // Clients can access their own data
  }

  return false;
}
