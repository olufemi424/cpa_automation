import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { successResponse, errorResponse, withErrorHandling } from "@/lib/api/response";
import { rateLimit } from "@/lib/api/rateLimit";
import { requireAuth, canAccessClient } from "@/lib/auth/authorization";

const limiter = rateLimit({ maxRequests: 100, windowMs: 60000 });

/**
 * POST /api/tasks - Create a new task
 */
export async function POST(request: NextRequest) {
  // Rate limiting
  const rateLimitResult = limiter(request);
  if (rateLimitResult) return rateLimitResult;

  // Authentication
  const authResult = await requireAuth(request);
  if (authResult instanceof NextResponse) return authResult;

  const user = authResult; // Now TypeScript knows this is AuthUser

  return withErrorHandling(async () => {
    const body = await request.json();
    const { clientId, title, description, assignedToId, dueDate } = body;

    // Validate required fields
    if (!clientId || !title || !description || !assignedToId || !dueDate) {
      return errorResponse(
        "Missing required fields: clientId, title, description, assignedToId, dueDate",
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

    // Check authorization - only ADMIN and assigned CPA can create tasks
    const hasAccess = canAccessClient(
      user,
      client.user_id || "",
      client.assigned_to_id ?? undefined
    );
    if (!hasAccess) {
      return errorResponse(
        "You don't have permission to create tasks for this client",
        403
      );
    }

    // Verify assignee exists and is a CPA or ADMIN
    const assignee = await prisma.users.findUnique({
      where: { id: assignedToId },
      select: { id: true, role: true },
    });

    if (!assignee) {
      return errorResponse("Assigned user not found", 404);
    }

    if (assignee.role !== "CPA" && assignee.role !== "ADMIN") {
      return errorResponse(
        "Tasks can only be assigned to CPA or ADMIN users",
        400,
        "VALIDATION_ERROR"
      );
    }

    // Parse and validate due date
    const parsedDueDate = new Date(dueDate);
    if (isNaN(parsedDueDate.getTime())) {
      return errorResponse("Invalid due date format", 400, "VALIDATION_ERROR");
    }

    // Create task
    const task = await prisma.tasks.create({
      data: {
        client_id: clientId,
        assigned_to_id: assignedToId,
        title,
        description,
        status: "INTAKE", // Default status
        due_date: parsedDueDate,
      },
      include: {
        users_tasks_assigned_to_idTousers: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    // Format response
    const formattedTask = {
      id: task.id,
      clientId: task.client_id,
      assignedToId: task.assigned_to_id,
      assignedTo: task.users_tasks_assigned_to_idTousers
        ? {
            id: task.users_tasks_assigned_to_idTousers.id,
            name: task.users_tasks_assigned_to_idTousers.name,
            email: task.users_tasks_assigned_to_idTousers.email,
          }
        : undefined,
      title: task.title,
      description: task.description,
      status: task.status,
      dueDate: task.due_date,
      createdAt: task.created_at,
      updatedAt: task.updated_at,
    };

    return successResponse(formattedTask);
  });
}
