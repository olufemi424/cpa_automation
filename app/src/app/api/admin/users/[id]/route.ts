import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db/prisma";
import { rateLimit } from "@/lib/api/rateLimit";
import { successResponse, handleApiError } from "@/lib/api/response";
import { requireAuth } from "@/lib/auth/authorization";
import bcrypt from "bcryptjs";

const limiter = rateLimit({ maxRequests: 50, windowMs: 60000 });

/**
 * PATCH /api/admin/users/[id]
 * Update a user (admin only)
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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
            message: "Only admins can update users",
            code: "FORBIDDEN",
          },
          timestamp: new Date().toISOString(),
        },
        { status: 403 }
      );
    }

    const { id: userId } = await params;

    // Check if user exists
    const existingUser = await prisma.users.findUnique({
      where: { id: userId },
    });

    if (!existingUser) {
      return NextResponse.json(
        {
          success: false,
          error: {
            message: "User not found",
            code: "NOT_FOUND",
          },
          timestamp: new Date().toISOString(),
        },
        { status: 404 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { name, email, role, password } = body;

    // If changing role from ADMIN, check if this is the last admin
    if (existingUser.role === "ADMIN" && role && role !== "ADMIN") {
      const adminCount = await prisma.users.count({
        where: { role: "ADMIN" },
      });

      if (adminCount <= 1) {
        return NextResponse.json(
          {
            success: false,
            error: {
              message: "Cannot change role of the last admin",
              code: "LAST_ADMIN",
            },
            timestamp: new Date().toISOString(),
          },
          { status: 400 }
        );
      }
    }

    // Build update data
    const updateData: Prisma.usersUpdateInput = {};

    if (name !== undefined) {
      if (name.length < 2) {
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
      updateData.name = name;
    }

    if (email !== undefined) {
      if (!email.includes("@")) {
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

      // Check if email is already taken by another user
      const emailTaken = await prisma.users.findFirst({
        where: {
          email,
          NOT: { id: userId },
        },
      });

      if (emailTaken) {
        return NextResponse.json(
          {
            success: false,
            error: {
              message: "Email is already taken",
              code: "DUPLICATE_EMAIL",
            },
            timestamp: new Date().toISOString(),
          },
          { status: 409 }
        );
      }

      updateData.email = email;
    }

    if (role !== undefined) {
      if (!["ADMIN", "CPA", "CLIENT"].includes(role)) {
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
      updateData.role = role;
    }

    // Update password if provided
    if (password !== undefined) {
      if (password.length < 8) {
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

      const passwordHash = await bcrypt.hash(password, 10);
      updateData.password_hash = passwordHash;

      // Also update the accounts table
      await prisma.accounts.updateMany({
        where: {
          userId: userId,
          providerId: "credentials",
        },
        data: {
          password: passwordHash,
        },
      });
    }

    // Update user
    const updatedUser = await prisma.users.update({
      where: { id: userId },
      data: updateData,
    });

    // Format response (exclude password)
    const formattedUser = {
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      createdAt: updatedUser.created_at,
      updatedAt: updatedUser.updated_at,
    };

    return successResponse(formattedUser);
  } catch (error) {
    console.error("Update user error:", error);
    return handleApiError(error);
  }
}

/**
 * DELETE /api/admin/users/[id]
 * Delete a user (admin only)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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
            message: "Only admins can delete users",
            code: "FORBIDDEN",
          },
          timestamp: new Date().toISOString(),
        },
        { status: 403 }
      );
    }

    const { id: userId } = await params;

    // Check if user exists
    const existingUser = await prisma.users.findUnique({
      where: { id: userId },
    });

    if (!existingUser) {
      return NextResponse.json(
        {
          success: false,
          error: {
            message: "User not found",
            code: "NOT_FOUND",
          },
          timestamp: new Date().toISOString(),
        },
        { status: 404 }
      );
    }

    // Prevent deletion of last admin
    if (existingUser.role === "ADMIN") {
      const adminCount = await prisma.users.count({
        where: { role: "ADMIN" },
      });

      if (adminCount <= 1) {
        return NextResponse.json(
          {
            success: false,
            error: {
              message: "Cannot delete the last admin",
              code: "LAST_ADMIN",
            },
            timestamp: new Date().toISOString(),
          },
          { status: 400 }
        );
      }
    }

    // Delete user (cascade will handle related records)
    await prisma.users.delete({
      where: { id: userId },
    });

    return NextResponse.json({
      success: true,
      data: { message: "User deleted successfully" },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Delete user error:", error);
    return handleApiError(error);
  }
}
