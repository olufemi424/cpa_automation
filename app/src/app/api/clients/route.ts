import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { rateLimit } from "@/lib/api/rateLimit";

// Rate limit: 100 requests per minute
const limiter = rateLimit({ maxRequests: 100, windowMs: 60 * 1000 });

export async function GET(request: NextRequest) {
  try {
    // Apply rate limiting
    const rateLimitResult = limiter(request);
    if (rateLimitResult) return rateLimitResult;

    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get("status");
    const search = searchParams.get("search");

    // Build where clause
    const where: any = {};
    if (status && status !== "ALL") {
      where.status = status;
    }
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
      ];
    }

    const clients = await prisma.clients.findMany({
      where,
      include: {
        users_clients_assigned_to_idTousers: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        created_at: "desc",
      },
    });

    const formattedClients = clients.map((client: any) => ({
      id: client.id,
      name: client.name,
      email: client.email,
      phone: client.phone,
      entityType: client.entity_type,
      taxYear: client.tax_year,
      status: client.status,
      assignedToId: client.assigned_to_id,
      assignedTo: client.users_clients_assigned_to_idTousers
        ? {
            id: client.users_clients_assigned_to_idTousers.id,
            name: client.users_clients_assigned_to_idTousers.name,
            email: client.users_clients_assigned_to_idTousers.email,
          }
        : undefined,
      businessName: client.business_name,
      progressPercentage: client.progress_percentage,
      createdAt: client.created_at,
      updatedAt: client.updated_at,
    }));

    return NextResponse.json({
      success: true,
      data: formattedClients,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Failed to fetch clients:", error);
    return NextResponse.json(
      {
        success: false,
        error: {
          message: "Failed to fetch clients",
          code: "FETCH_ERROR",
        },
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
