import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

export async function GET() {
  try {
    const clients = await prisma.clients.findMany({
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

    return NextResponse.json(formattedClients);
  } catch (error) {
    console.error("Failed to fetch clients:", error);
    return NextResponse.json(
      { error: "Failed to fetch clients" },
      { status: 500 }
    );
  }
}
