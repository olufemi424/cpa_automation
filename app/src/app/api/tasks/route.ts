import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db/prisma";
import { successResponse, errorResponse, withErrorHandling } from "@/lib/api/response";
import { rateLimit } from "@/lib/api/rateLimit";
import { requireAuth, canAccessClient } from "@/lib/auth/authorization";
import { TaskStatus } from "@/types";

const limiter = rateLimit({ maxRequests: 100, windowMs: 60000 });

/**
 * GET /api/tasks - Fetch tasks with role-based filtering
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
    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get("status");
    const clientId = searchParams.get("clientId");
    const search = searchParams.get("search");
    const assignedToId = searchParams.get("assignedToId");

    // Build where clause based on user role
    const where: Prisma.tasksWhereInput = {};

    // Role-based filtering
    if (user.role === "CPA") {
      // CPAs only see tasks for clients assigned to them
      where.clients = {
        assigned_to_id: user.id,
      };
    } else if (user.role === "CLIENT") {
      // Clients only see tasks for their own case
      where.clients = {
        user_id: user.id,
      };
    }
    // ADMIN sees all tasks (no additional filter)

    // Apply filters
    if (status && status !== "ALL") {
      where.status = status as TaskStatus;
    }

    if (clientId) {
      where.client_id = clientId;
    }

    if (assignedToId) {
      where.assigned_to_id = assignedToId;
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    // Fetch tasks with related data
    const tasks = await prisma.tasks.findMany({
      where,
      include: {
        clients: {
          select: {
            id: true,
            name: true,
            email: true,
            status: true,
          },
        },
        users_tasks_assigned_to_idTousers: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
      orderBy: [
        { is_completed: "asc" }, // Incomplete tasks first
        { due_date: "asc" }, // Sort by due date
        { created_at: "desc" }, // Then by creation date
      ],
    });

    // Format response with camelCase
    const formattedTasks = tasks.map((task) => ({
      id: task.id,
      clientId: task.client_id,
      client: {
        id: task.clients.id,
        name: task.clients.name,
        email: task.clients.email,
        status: task.clients.status,
      },
      title: task.title,
      description: task.description,
      status: task.status,
      assignedToId: task.assigned_to_id,
      assignedTo: task.users_tasks_assigned_to_idTousers
        ? {
            id: task.users_tasks_assigned_to_idTousers.id,
            name: task.users_tasks_assigned_to_idTousers.name,
            email: task.users_tasks_assigned_to_idTousers.email,
            role: task.users_tasks_assigned_to_idTousers.role,
          }
        : undefined,
      dueDate: task.due_date,
      isCompleted: task.is_completed,
      completedAt: task.completed_at,
      createdAt: task.created_at,
      updatedAt: task.updated_at,
    }));

    return successResponse(formattedTasks);
  });
}

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
