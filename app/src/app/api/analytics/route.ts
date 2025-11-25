import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import type { UserRole } from "@/types";

type AnalyticsData = Record<string, unknown>;

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const userRole = (session.user as { role: UserRole }).role;

    // Only ADMIN and CPA can access analytics
    if (userRole !== "ADMIN" && userRole !== "CPA") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get("type") || "overview";

    let analyticsData: AnalyticsData = {};

    switch (type) {
      case "overview":
        analyticsData = await getOverviewAnalytics(userId, userRole);
        break;
      case "productivity":
        analyticsData = await getProductivityAnalytics(userId, userRole);
        break;
      case "pipeline":
        analyticsData = await getPipelineAnalytics(userId, userRole);
        break;
      case "deadlines":
        analyticsData = await getDeadlineAnalytics(userId, userRole);
        break;
      default:
        analyticsData = await getOverviewAnalytics(userId, userRole);
    }

    return NextResponse.json({ data: analyticsData });
  } catch (error) {
    console.error("Analytics API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch analytics" },
      { status: 500 }
    );
  }
}

async function getOverviewAnalytics(userId: string, userRole: UserRole) {
  const isAdmin = userRole === "ADMIN";

  // Get client counts by status
  const clientsByStatus = await prisma.clients.groupBy({
    by: ["status"],
    where: isAdmin ? {} : { assigned_to_id: userId },
    _count: true,
  });

  // Get total clients
  const totalClients = await prisma.clients.count({
    where: isAdmin ? {} : { assigned_to_id: userId },
  });

  // Get tasks by status
  const tasksByStatus = await prisma.tasks.groupBy({
    by: ["status"],
    where: isAdmin
      ? {}
      : {
          clients: {
            assigned_to_id: userId,
          },
        },
    _count: true,
  });

  // Get completed tasks this month
  const firstDayOfMonth = new Date();
  firstDayOfMonth.setDate(1);
  firstDayOfMonth.setHours(0, 0, 0, 0);

  const completedThisMonth = await prisma.tasks.count({
    where: {
      is_completed: true,
      completed_at: {
        gte: firstDayOfMonth,
      },
      ...(isAdmin
        ? {}
        : {
            clients: {
              assigned_to_id: userId,
            },
          }),
    },
  });

  // Get unread messages count
  const unreadMessages = await prisma.messages.count({
    where: {
      is_read: false,
      ...(isAdmin
        ? {}
        : {
            clients: {
              assigned_to_id: userId,
            },
          }),
    },
  });

  return {
    totalClients,
    clientsByStatus: clientsByStatus.map((item) => ({
      status: item.status,
      count: item._count,
    })),
    tasksByStatus: tasksByStatus.map((item) => ({
      status: item.status,
      count: item._count,
    })),
    completedThisMonth,
    unreadMessages,
  };
}

async function getProductivityAnalytics(userId: string, userRole: UserRole) {
  const isAdmin = userRole === "ADMIN";

  // Get CPAs with their client counts
  const cpas = await prisma.users.findMany({
    where: { role: "CPA" },
    select: {
      id: true,
      name: true,
      email: true,
      clients_clients_assigned_to_idTousers: {
        select: {
          id: true,
          status: true,
        },
      },
      tasks_tasks_assigned_to_idTousers: {
        where: {
          is_completed: true,
        },
        select: {
          id: true,
        },
      },
    },
  });

  const cpaStats = cpas.map((cpa) => ({
    id: cpa.id,
    name: cpa.name,
    email: cpa.email,
    activeClients: cpa.clients_clients_assigned_to_idTousers.length,
    completedTasks: cpa.tasks_tasks_assigned_to_idTousers.length,
    clientsByStatus: cpa.clients_clients_assigned_to_idTousers.reduce<Record<string, number>>(
      (acc, client) => {
        acc[client.status] = (acc[client.status] || 0) + 1;
        return acc;
      },
      {}
    ),
  }));

  // If CPA, filter to show only their stats
  if (!isAdmin) {
    return {
      cpas: cpaStats.filter((cpa) => cpa.id === userId),
    };
  }

  return {
    cpas: cpaStats,
  };
}

async function getPipelineAnalytics(userId: string, userRole: UserRole) {
  const isAdmin = userRole === "ADMIN";

  // Get clients by status with details
  const clientsByStatus = await prisma.clients.findMany({
    where: isAdmin ? {} : { assigned_to_id: userId },
    select: {
      id: true,
      name: true,
      status: true,
      progress_percentage: true,
      created_at: true,
      updated_at: true,
    },
    orderBy: {
      updated_at: "desc",
    },
  });

  // Group by status
  const pipeline = {
    INTAKE: clientsByStatus.filter((c) => c.status === "INTAKE"),
    PREPARATION: clientsByStatus.filter((c) => c.status === "PREPARATION"),
    REVIEW: clientsByStatus.filter((c) => c.status === "REVIEW"),
    FILED: clientsByStatus.filter((c) => c.status === "FILED"),
    INVOICED: clientsByStatus.filter((c) => c.status === "INVOICED"),
    COMPLETED: clientsByStatus.filter((c) => c.status === "COMPLETED"),
  };

  // Calculate average time in each stage (mock data for now)
  const averageTimePerStage = {
    INTAKE: 3,
    PREPARATION: 7,
    REVIEW: 2,
    FILED: 1,
    INVOICED: 5,
    COMPLETED: 0,
  };

  return {
    pipeline: Object.entries(pipeline).map(([status, clients]) => ({
      status,
      count: clients.length,
      clients: clients.map((c) => ({
        id: c.id,
        name: c.name,
        progressPercentage: c.progress_percentage,
        createdAt: c.created_at,
        updatedAt: c.updated_at,
      })),
    })),
    averageTimePerStage,
  };
}

async function getDeadlineAnalytics(userId: string, userRole: UserRole) {
  const isAdmin = userRole === "ADMIN";
  const now = new Date();

  // Get upcoming tasks with due dates
  const upcomingTasks = await prisma.tasks.findMany({
    where: {
      is_completed: false,
      due_date: {
        gte: now,
      },
      ...(isAdmin
        ? {}
        : {
            clients: {
              assigned_to_id: userId,
            },
          }),
    },
    select: {
      id: true,
      title: true,
      due_date: true,
      clients: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    orderBy: {
      due_date: "asc",
    },
    take: 10,
  });

  // Get overdue tasks
  const overdueTasks = await prisma.tasks.findMany({
    where: {
      is_completed: false,
      due_date: {
        lt: now,
      },
      ...(isAdmin
        ? {}
        : {
            clients: {
              assigned_to_id: userId,
            },
          }),
    },
    select: {
      id: true,
      title: true,
      due_date: true,
      clients: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    orderBy: {
      due_date: "asc",
    },
  });

  // Get completed tasks count for last 30 days
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const completedLast30Days = await prisma.tasks.count({
    where: {
      is_completed: true,
      completed_at: {
        gte: thirtyDaysAgo,
      },
      ...(isAdmin
        ? {}
        : {
            clients: {
              assigned_to_id: userId,
            },
          }),
    },
  });

  return {
    upcomingTasks: upcomingTasks.map((task) => ({
      id: task.id,
      title: task.title,
      dueDate: task.due_date,
      clientId: task.clients.id,
      clientName: task.clients.name,
    })),
    overdueTasks: overdueTasks.map((task) => ({
      id: task.id,
      title: task.title,
      dueDate: task.due_date,
      clientId: task.clients.id,
      clientName: task.clients.name,
    })),
    overdueCount: overdueTasks.length,
    completedLast30Days,
  };
}
