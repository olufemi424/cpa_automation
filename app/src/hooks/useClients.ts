import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export interface Client {
  id: string;
  name: string;
  email: string;
  phone?: string;
  entityType: string;
  taxYear: number;
  status: string;
  assignedToId?: string;
  assignedTo?: {
    id: string;
    name: string;
    email: string;
  };
  businessName?: string;
  progressPercentage: number;
  createdAt: Date;
  updatedAt: Date;
}

interface ClientFilters {
  status?: string;
  search?: string;
}

// Fetch all clients
export function useClients(filters?: ClientFilters) {
  return useQuery<Client[]>({
    queryKey: ["clients", filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters?.status) params.append("status", filters.status);
      if (filters?.search) params.append("search", filters.search);

      const response = await fetch(`/api/clients?${params}`);
      if (!response.ok) {
        throw new Error("Failed to fetch clients");
      }
      const result = await response.json();
      return result.data || result; // Handle both new and old response formats
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Fetch single client
export function useClient(clientId: string | null) {
  return useQuery<Client>({
    queryKey: ["clients", clientId],
    queryFn: async () => {
      if (!clientId) throw new Error("Client ID is required");
      const response = await fetch(`/api/clients/${clientId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch client");
      }
      return response.json();
    },
    enabled: !!clientId,
    staleTime: 5 * 60 * 1000,
  });
}

// Update client status
export function useUpdateClientStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const response = await fetch(`/api/clients/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        throw new Error("Failed to update client status");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
    },
  });
}

// Create client
export function useCreateClient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<Client>) => {
      const response = await fetch("/api/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to create client");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
    },
  });
}
