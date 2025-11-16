import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { successResponse, errorResponse, withErrorHandling } from "@/lib/api/response";
import { rateLimit } from "@/lib/api/rateLimit";
import { requireAuth, canAccessClient } from "@/lib/auth/authorization";

const limiter = rateLimit({ maxRequests: 100, windowMs: 60000 });

/**
 * GET /api/messages?clientId=xxx - Get messages for a client
 */
export async function GET(request: NextRequest) {
  // Rate limiting
  const rateLimitResult = limiter(request);
  if (rateLimitResult) return rateLimitResult;

  // Authentication
  const authResult = await requireAuth(request);
  if (authResult instanceof NextResponse) return authResult;

  const user = authResult;

  return withErrorHandling(async () => {
    const searchParams = request.nextUrl.searchParams;
    const clientId = searchParams.get("clientId");

    if (!clientId) {
      return errorResponse("clientId is required", 400, "VALIDATION_ERROR");
    }

    // Verify client exists and user has access
    const client = await prisma.clients.findUnique({
      where: { id: clientId },
      select: {
        user_id: true,
        assigned_to_id: true,
      },
    });

    if (!client) {
      return errorResponse("Client not found", 404);
    }

    // Check authorization
    const hasAccess = canAccessClient(
      user,
      client.user_id || "",
      client.assigned_to_id ?? undefined
    );
    if (!hasAccess) {
      return errorResponse(
        "You don't have permission to view messages for this client",
        403
      );
    }

    // Fetch messages
    const messages = await prisma.messages.findMany({
      where: { client_id: clientId },
      include: {
        users: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
      orderBy: {
        created_at: "asc",
      },
    });

    // Format response
    const formattedMessages = messages.map((message) => ({
      id: message.id,
      clientId: message.client_id,
      senderId: message.sender_id,
      senderType: message.sender_type,
      sender: message.users
        ? {
            id: message.users.id,
            name: message.users.name,
            email: message.users.email,
            role: message.users.role,
          }
        : undefined,
      content: message.content,
      isRead: message.is_read,
      readAt: message.read_at,
      parentMessageId: message.parent_message_id,
      createdAt: message.created_at,
    }));

    return successResponse(formattedMessages);
  });
}

/**
 * POST /api/messages - Create a new message
 */
export async function POST(request: NextRequest) {
  // Rate limiting
  const rateLimitResult = limiter(request);
  if (rateLimitResult) return rateLimitResult;

  // Authentication
  const authResult = await requireAuth(request);
  if (authResult instanceof NextResponse) return authResult;

  const user = authResult;

  return withErrorHandling(async () => {
    const body = await request.json();
    const { clientId, content, parentMessageId } = body;

    // Validate required fields
    if (!clientId || !content) {
      return errorResponse(
        "Missing required fields: clientId, content",
        400,
        "VALIDATION_ERROR"
      );
    }

    if (typeof content !== "string" || content.trim().length === 0) {
      return errorResponse("Content cannot be empty", 400, "VALIDATION_ERROR");
    }

    if (content.length > 5000) {
      return errorResponse(
        "Content cannot exceed 5000 characters",
        400,
        "VALIDATION_ERROR"
      );
    }

    // Verify client exists and user has access
    const client = await prisma.clients.findUnique({
      where: { id: clientId },
      select: {
        user_id: true,
        assigned_to_id: true,
      },
    });

    if (!client) {
      return errorResponse("Client not found", 404);
    }

    // Check authorization
    const hasAccess = canAccessClient(
      user,
      client.user_id || "",
      client.assigned_to_id ?? undefined
    );
    if (!hasAccess) {
      return errorResponse(
        "You don't have permission to send messages for this client",
        403
      );
    }

    // If replying to a message, verify parent exists
    if (parentMessageId) {
      const parentMessage = await prisma.messages.findUnique({
        where: { id: parentMessageId },
      });

      if (!parentMessage) {
        return errorResponse("Parent message not found", 404);
      }

      if (parentMessage.client_id !== clientId) {
        return errorResponse(
          "Parent message does not belong to this client",
          400,
          "VALIDATION_ERROR"
        );
      }
    }

    // Create message
    const message = await prisma.messages.create({
      data: {
        client_id: clientId,
        sender_id: user.id,
        sender_type: "USER",
        content: content.trim(),
        is_read: false,
        parent_message_id: parentMessageId || null,
      },
      include: {
        users: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
    });

    // Format response
    const formattedMessage = {
      id: message.id,
      clientId: message.client_id,
      senderId: message.sender_id,
      senderType: message.sender_type,
      sender: message.users
        ? {
            id: message.users.id,
            name: message.users.name,
            email: message.users.email,
            role: message.users.role,
          }
        : undefined,
      content: message.content,
      isRead: message.is_read,
      readAt: message.read_at,
      parentMessageId: message.parent_message_id,
      createdAt: message.created_at,
    };

    return successResponse(formattedMessage);
  });
}
