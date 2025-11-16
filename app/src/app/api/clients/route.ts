import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db/prisma";
import { rateLimit } from "@/lib/api/rateLimit";
import { requireAuth} from "@/lib/auth/authorization";
import { ClientStatus } from "@/types";
import bcrypt from "bcryptjs";

// Rate limit: 100 requests per minute
const limiter = rateLimit({ maxRequests: 100, windowMs: 60 * 1000 });

export async function GET(request: NextRequest) {
  try {
    // Apply rate limiting
    const rateLimitResult = limiter(request);
    if (rateLimitResult) return rateLimitResult;

    // Require authentication
    const user = await requireAuth(request);
    if (user instanceof NextResponse) return user;

    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get("status");
    const search = searchParams.get("search");

    // Build where clause based on user role
    const where: Prisma.clientsWhereInput = {};

    // Role-based filtering
    if (user.role === "CPA") {
      // CPAs only see clients assigned to them
      where.assigned_to_id = user.id;
    } else if (user.role === "CLIENT") {
      // Clients only see their own record
      where.user_id = user.id;
    }
    // ADMIN sees all clients (no additional filter)

    if (status && status !== "ALL") {
      where.status = status as ClientStatus;
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

    const formattedClients = clients.map((client) => ({
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

/**
 * POST /api/clients - Create a new client
 */
export async function POST(request: NextRequest) {
  try {
    // Apply rate limiting
    const rateLimitResult = limiter(request);
    if (rateLimitResult) return rateLimitResult;

    // Require authentication (only ADMIN and CPA can create clients)
    const user = await requireAuth(request);
    if (user instanceof NextResponse) return user;

    if (user.role !== "ADMIN" && user.role !== "CPA") {
      return NextResponse.json(
        {
          success: false,
          error: {
            message: "Only admins and CPAs can create clients",
            code: "FORBIDDEN",
          },
          timestamp: new Date().toISOString(),
        },
        { status: 403 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const { name, email, phone, entityType, taxYear, businessName } = body;

    // Validation
    if (!name || name.length < 2) {
      return NextResponse.json(
        {
          success: false,
          error: {
            message: "Name is required and must be at least 2 characters",
            code: "VALIDATION_ERROR",
          },
          timestamp: new Date().toISOString(),
        },
        { status: 400 }
      );
    }

    // Simple email format check TODO: Use a proper email validation library
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

    if (!entityType) {
      return NextResponse.json(
        {
          success: false,
          error: {
            message: "Entity type is required",
            code: "VALIDATION_ERROR",
          },
          timestamp: new Date().toISOString(),
        },
        { status: 400 }
      );
    }

    // Validate tax year (allow past 10 years through next year)
    const currentYear = new Date().getFullYear();
    const minYear = currentYear - 10; // Allow 10 years back for amended/late filings
    const maxYear = currentYear + 1; // Allow next year for early planning

    if (!taxYear || typeof taxYear !== 'number' || taxYear < minYear || taxYear > maxYear) {
      return NextResponse.json(
        {
          success: false,
          error: {
            message: `Tax year must be between ${minYear} and ${maxYear}`,
            code: "VALIDATION_ERROR",
          },
          timestamp: new Date().toISOString(),
        },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingClient = await prisma.clients.findFirst({
      where: { email },
    });

    if (existingClient) {
      return NextResponse.json(
        {
          success: false,
          error: {
            message: "A client with this email already exists",
            code: "DUPLICATE_EMAIL",
          },
          timestamp: new Date().toISOString(),
        },
        { status: 409 }
      );
    }

    // Auto-assign CPA based on availability (round-robin approach)
    let assignedCpaId: string | null = null;

    // Get all CPAs with their client count
    const cpas = await prisma.users.findMany({
      where: {
        role: "CPA",
      },
      include: {
        clients_clients_assigned_to_idTousers: {
          select: { id: true },
        },
      },
    });

    if (cpas.length > 0) {
      // Sort CPAs by number of assigned clients (ascending)
      const sortedCpas = cpas.sort(
        (a, b) =>
          a.clients_clients_assigned_to_idTousers.length -
          b.clients_clients_assigned_to_idTousers.length
      );

      // Assign to CPA with fewest clients
      const selectedCpa = sortedCpas[0];
      if (selectedCpa) {
        assignedCpaId = selectedCpa.id;
      }
    }

    // Create user account for the client
    // Generate a temporary password hash (client should reset on first login)
    const tempPassword = Math.random().toString(36).slice(-8);
    const passwordHash = await bcrypt.hash(tempPassword, 10);

    const clientUser = await prisma.users.create({
      data: {
        name,
        email,
        role: "CLIENT",
        password_hash: passwordHash,
      },
    });

    // Create client record
    const newClient = await prisma.clients.create({
      data: {
        user_id: clientUser.id,
        name,
        email,
        phone: phone || null,
        entity_type: entityType,
        tax_year: taxYear,
        business_name: businessName || null,
        status: "INTAKE",
        progress_percentage: 0,
        assigned_to_id: assignedCpaId,
        created_at: new Date(),
        updated_at: new Date(),
      },
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
    const formattedClient = {
      id: newClient.id,
      userId: newClient.user_id,
      name: newClient.name,
      email: newClient.email,
      phone: newClient.phone,
      entityType: newClient.entity_type,
      taxYear: newClient.tax_year,
      status: newClient.status,
      assignedToId: newClient.assigned_to_id,
      assignedTo: newClient.users_clients_assigned_to_idTousers
        ? {
            id: newClient.users_clients_assigned_to_idTousers.id,
            name: newClient.users_clients_assigned_to_idTousers.name,
            email: newClient.users_clients_assigned_to_idTousers.email,
          }
        : null,
      businessName: newClient.business_name,
      progressPercentage: newClient.progress_percentage,
      createdAt: newClient.created_at,
      updatedAt: newClient.updated_at,
    };

    return NextResponse.json(
      {
        success: true,
        data: formattedClient,
        timestamp: new Date().toISOString(),
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Failed to create client:", error);
    return NextResponse.json(
      {
        success: false,
        error: {
          message: "Failed to create client",
          code: "CREATE_ERROR",
        },
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
