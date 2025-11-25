import { useQuery } from "@tanstack/react-query";
import { Task, TaskStatus } from "@/types";

interface TaskFilters {
  status?: TaskStatus | "ALL";
  clientId?: string;
  assignedToId?: string;
  search?: string;
}

interface TaskWithClient extends Task {
  client: {
    id: string;
    name: string;
    email: string;
    status: string;
  };
}

async function fetchTasks(filters?: TaskFilters): Promise<TaskWithClient[]> {
  const params = new URLSearchParams();
  
  if (filters?.status && filters.status !== "ALL") {
    params.append("status", filters.status);
  }
  if (filters?.clientId) {
    params.append("clientId", filters.clientId);
  }
  if (filters?.assignedToId) {
    params.append("assignedToId", filters.assignedToId);
  }
  if (filters?.search) {
    params.append("search", filters.search);
  }

  const queryString = params.toString();
  const url = `/api/tasks${queryString ? `?${queryString}` : ""}`;

  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error("Failed to fetch tasks");
  }

  const result = await response.json();
  return result.data;
}

export function useTasks(filters?: TaskFilters) {
  return useQuery<TaskWithClient[], Error>({
    queryKey: ["tasks", filters],
    queryFn: () => fetchTasks(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
