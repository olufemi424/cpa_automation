import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db/prisma";
import { rateLimit } from "@/lib/api/rateLimit";
import { successResponse, handleApiError } from "@/lib/api/response";
import { requireAuth } from "@/lib/auth/authorization";
import bcrypt from "bcryptjs";

const limiter = rateLimit({ maxRequests: 50, windowMs: 60000 });

/**
 * GET /api/admin/users
 * Fetch all users (admin only)
 */
export async function GET(request: NextRequest) {
  try {
    // Rate limiting
    const rateLimitResult = limiter(request);
    if (rateLimitResult) return rateLimitResult;

    // Authentication check - admin only
    const user = await requireAuth(request);
    if (user instanceof NextResponse) return user;

    if (user.role !== "ADMIN") {
      return NextResponse.json(
        {
          success: false,
          error: {
            message: "Only admins can access user management",
            code: "FORBIDDEN",
          },
          timestamp: new Date().toISOString(),
        },
        { status: 403 }
      );
    }

    // Get query parameters for filtering
    const { searchParams } = new URL(request.url);
    const role = searchParams.get("role");
    const search = searchParams.get("search");

    // Build where clause
    const where: Prisma.usersWhereInput = {};

    if (role && role !== "ALL") {
      where.role = role as "ADMIN" | "CPA" | "CLIENT";
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
      ];
    }

    // Fetch users with their client counts
    const users = await prisma.users.findMany({
      where,
      include: {
        clients_clients_assigned_to_idTousers: {
          select: { id: true },
        },
        accounts: {
          select: {
            providerId: true,
            accountId: true,
          },
        },
      },
      orderBy: {
        created_at: "desc",
      },
    });

    // Format response
    const formattedUsers = users.map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role,
      createdAt: u.created_at,
      updatedAt: u.updated_at,
      assignedClientsCount: u.clients_clients_assigned_to_idTousers.length,
      hasAccount: u.accounts.length > 0,
      accountProvider: u.accounts[0]?.providerId || null,
    }));

    return successResponse(formattedUsers);
  } catch (error) {
    console.error("Fetch users error:", error);
    return handleApiError(error);
  }
}

/**
 * POST /api/admin/users
 * Create a new user (admin only)
 */
export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const rateLimitResult = limiter(request);
    if (rateLimitResult) return rateLimitResult;

    // Authentication check - admin only
    const user = await requireAuth(request);
    if (user instanceof NextResponse) return user;

    if (user.role !== "ADMIN") {
      return NextResponse.json(
        {
          success: false,
          error: {
            message: "Only admins can create users",
            code: "FORBIDDEN",
          },
          timestamp: new Date().toISOString(),
        },
        { status: 403 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { name, email, password, role } = body;

    // Validation
    if (!name || name.length < 2) {
      return NextResponse.json(
        {
          success: false,
          error: {
            message: "Name must be at least 2 characters",
            code: "VALIDATION_ERROR",
          },
          timestamp: new Date().toISOString(),
        },
        { status: 400 }
      );
    }

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        {
          success: false,
          error: {
            message: "Valid email is required",
            code: "VALIDATION_ERROR",
          },
          timestamp: new Date().toISOString(),
        },
        { status: 400 }
      );
    }

    if (!password || password.length < 8) {
      return NextResponse.json(
        {
          success: false,
          error: {
            message: "Password must be at least 8 characters",
            code: "VALIDATION_ERROR",
          },
          timestamp: new Date().toISOString(),
        },
        { status: 400 }
      );
    }

    if (!role || !["ADMIN", "CPA", "CLIENT"].includes(role)) {
      return NextResponse.json(
        {
          success: false,
          error: {
            message: "Valid role is required (ADMIN, CPA, or CLIENT)",
            code: "VALIDATION_ERROR",
          },
          timestamp: new Date().toISOString(),
        },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingUser = await prisma.users.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          error: {
            message: "A user with this email already exists",
            code: "DUPLICATE_EMAIL",
          },
          timestamp: new Date().toISOString(),
        },
        { status: 409 }
      );
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user
    const newUser = await prisma.users.create({
      data: {
        name,
        email,
        role,
        password_hash: passwordHash,
      },
    });

    // Create account record for credentials provider
    await prisma.accounts.create({
      data: {
        id: `${newUser.id}-credentials`,
        userId: newUser.id,
        accountId: newUser.id, // For credentials, accountId = userId
        providerId: "credentials",
        password: passwordHash,
      },
    });

    // Format response (exclude password)
    const formattedUser = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      createdAt: newUser.created_at,
      updatedAt: newUser.updated_at,
    };

    return NextResponse.json(
      {
        success: true,
        data: formattedUser,
        timestamp: new Date().toISOString(),
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create user error:", error);
    return handleApiError(error);
  }
}
