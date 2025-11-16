import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { successResponse, errorResponse, withErrorHandling } from "@/lib/api/response";
import { rateLimit } from "@/lib/api/rateLimit";
import { requireAuth, canAccessClient } from "@/lib/auth/authorization";

const limiter = rateLimit({ maxRequests: 100, windowMs: 60000 });

// Calculate progress percentage based on status
function calculateProgressPercentage(status: string): number {
  const statusProgress: Record<string, number> = {
    INTAKE: 20,
    PREPARATION: 40,
    REVIEW: 60,
    FILED: 80,
    INVOICED: 90,
    COMPLETED: 100,
  };
  return statusProgress[status] || 0;
}

/**
 * GET /api/clients/[id] - Get a single client by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Rate limiting
  const rateLimitResult = limiter(request);
  if (rateLimitResult) return rateLimitResult;

  // Authentication
  const user = await requireAuth(request);
  if (user instanceof NextResponse) return user;

  return withErrorHandling(async () => {

    const { id } = await params;

    // Fetch client to check access
    const clientAccess = await prisma.clients.findUnique({
      where: { id },
      select: {
        user_id: true,
        assigned_to_id: true,
      },
    });

    if (!clientAccess) {
      return errorResponse("Client not found", 404);
    }

    // Check if user can access this client
    const hasAccess = canAccessClient(
      user,
      clientAccess.user_id || "",
      clientAccess.assigned_to_id ?? undefined
    );
    if (!hasAccess) {
      return errorResponse("You don't have permission to access this client", 403);
    }

    const client = await prisma.clients.findUnique({
      where: { id },
      include: {
        users_clients_assigned_to_idTousers: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        documents: {
          select: {
            id: true,
            file_name: true,
            document_type: true,
            uploaded_at: true,
            is_verified: true,
          },
        },
        tasks: {
          select: {
            id: true,
            title: true,
            description: true,
            status: true,
            due_date: true,
          },
        },
      },
    });

    if (!client) {
      return errorResponse("Client not found", 404);
    }

    // Format response
    const formatted = {
      id: client.id,
      userId: client.user_id,
      name: client.name,
      email: client.email,
      phone: client.phone,
      entityType: client.entity_type,
      taxYear: client.tax_year,
      status: client.status,
      progressPercentage: client.progress_percentage,
      assignedToId: client.assigned_to_id,
      assignedTo: client.users_clients_assigned_to_idTousers
        ? {
            id: client.users_clients_assigned_to_idTousers.id,
            name: client.users_clients_assigned_to_idTousers.name || '',
            email: client.users_clients_assigned_to_idTousers.email || '',
          }
        : null,
      businessName: client.business_name,
      createdAt: client.created_at,
      updatedAt: client.updated_at,
      documents: client.documents.map((doc) => ({
        id: doc.id,
        fileName: doc.file_name || '',
        documentType: doc.document_type,
        uploadDate: doc.uploaded_at,
        isVerified: doc.is_verified,
      })),
      tasks: client.tasks.map((task) => ({
        id: task.id,
        title: task.title,
        description: task.description,
        status: task.status,
        dueDate: task.due_date,
      })),
    };

    return successResponse(formatted);
  });
}

/**
 * PATCH /api/clients/[id] - Update a client
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Rate limiting
  const rateLimitResult = limiter(request);
  if (rateLimitResult) return rateLimitResult;

  // Authentication
  const user = await requireAuth(request);
  if (user instanceof NextResponse) return user;

  return withErrorHandling(async () => {

    const { id } = await params;

    // Fetch client to check access
    const client = await prisma.clients.findUnique({
      where: { id },
      select: {
        user_id: true,
        assigned_to_id: true,
      },
    });

    if (!client) {
      return errorResponse("Client not found", 404);
    }

    // Check if user can access this client
    const hasAccess = canAccessClient(
      user,
      client.user_id || "",
      client.assigned_to_id ?? undefined
    );
    if (!hasAccess) {
      return errorResponse("You don't have permission to update this client", 403);
    }

    const body = await request.json();
    const { status, name, email, phone, businessName } = body;

    // Build update data
    const updateData: Record<string, string | number | Date> = {};

    if (status) {
      // Validate status
      const validStatuses = ["INTAKE", "PREPARATION", "REVIEW", "FILED", "INVOICED", "COMPLETED"];
      if (!validStatuses.includes(status)) {
        return errorResponse("Invalid status value", 400);
      }
      updateData.status = status;
      updateData.progress_percentage = calculateProgressPercentage(status);
    }

    if (name !== undefined) updateData.name = name;
    if (email !== undefined) updateData.email = email;
    if (phone !== undefined) updateData.phone = phone;
    if (businessName !== undefined) updateData.business_name = businessName;

    updateData.updated_at = new Date();

    // Update client
    const updatedClient = await prisma.clients.update({
      where: { id },
      data: updateData,
      include: {
        users_clients_assigned_to_idTousers: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    // Format response
    const formatted = {
      id: updatedClient.id,
      userId: updatedClient.user_id,
      name: updatedClient.name,
      email: updatedClient.email,
      phone: updatedClient.phone,
      entityType: updatedClient.entity_type,
      taxYear: updatedClient.tax_year,
      status: updatedClient.status,
      progressPercentage: updatedClient.progress_percentage,
      assignedToId: updatedClient.assigned_to_id,
      assignedTo: updatedClient.users_clients_assigned_to_idTousers
        ? {
            id: updatedClient.users_clients_assigned_to_idTousers.id,
            name: updatedClient.users_clients_assigned_to_idTousers.name || '',
            email: updatedClient.users_clients_assigned_to_idTousers.email || '',
          }
        : null,
      businessName: updatedClient.business_name,
      createdAt: updatedClient.created_at,
      updatedAt: updatedClient.updated_at,
    };

    return successResponse(formatted);
  });
}
