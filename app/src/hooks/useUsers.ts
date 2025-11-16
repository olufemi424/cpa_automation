import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export interface User {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "CPA" | "CLIENT";
  createdAt: Date;
  updatedAt: Date;
  assignedClientsCount: number;
  hasAccount: boolean;
  accountProvider: string | null;
}

export interface CreateUserData {
  name: string;
  email: string;
  password: string;
  role: "ADMIN" | "CPA" | "CLIENT";
}

export interface UpdateUserData {
  name?: string;
  email?: string;
  role?: "ADMIN" | "CPA" | "CLIENT";
  password?: string;
}

/**
 * Fetch all users with optional filtering
 */
export function useUsers(filters?: { role?: string; search?: string }) {
  const params = new URLSearchParams();
  if (filters?.role) params.append("role", filters.role);
  if (filters?.search) params.append("search", filters.search);

  return useQuery({
    queryKey: ["admin", "users", filters],
    queryFn: async () => {
      const res = await fetch(`/api/admin/users?${params.toString()}`);
      if (!res.ok) {
        throw new Error("Failed to fetch users");
      }

      const result = await res.json();
      return (result.data || result) as User[];
    },
    staleTime: 30 * 1000, // 30 seconds
  });
}

/**
 * Create a new user
 */
export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateUserData) => {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error?.message || "Failed to create user");
      }

      const result = await res.json();
      return result.data || result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
    },
  });
}

/**
 * Update an existing user
 */
export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateUserData }) => {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error?.message || "Failed to update user");
      }

      const result = await res.json();
      return result.data || result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
    },
  });
}

/**
 * Delete a user
 */
export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error?.message || "Failed to delete user");
      }

      const result = await res.json();
      return result.data || result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
    },
  });
}
