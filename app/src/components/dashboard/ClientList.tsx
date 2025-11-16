"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

interface ClientListProps {
  selectedClientId: string | null;
  onSelectClient: (clientId: string | null) => void;
}

type ClientStatus = "INTAKE" | "PREPARATION" | "REVIEW" | "FILED" | "INVOICED" | "COMPLETED";

interface Client {
  id: string;
  name: string;
  email: string;
  status: ClientStatus;
  taxYear: number;
  progressPercentage: number;
  assignedTo?: {
    name: string;
  };
}

const statusColors: Record<ClientStatus, string> = {
  INTAKE: "bg-gray-100 text-gray-800",
  PREPARATION: "bg-yellow-100 text-yellow-800",
  REVIEW: "bg-blue-100 text-blue-800",
  FILED: "bg-green-100 text-green-800",
  INVOICED: "bg-purple-100 text-purple-800",
  COMPLETED: "bg-emerald-100 text-emerald-800",
};

export function ClientList({ selectedClientId, onSelectClient }: ClientListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<ClientStatus | "ALL">("ALL");

  const { data: clients, isLoading } = useQuery<Client[]>({
    queryKey: ["clients"],
    queryFn: async () => {
      const response = await fetch("/api/clients");
      if (!response.ok) throw new Error("Failed to fetch clients");
      return response.json();
    },
  });

  const filteredClients = clients?.filter((client) => {
    const matchesSearch = client.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || client.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="flex flex-col h-full">
      {/* Search and Filter */}
      <div className="p-4 border-b border-gray-200 space-y-3">
        <input
          type="text"
          placeholder="Search clients..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as ClientStatus | "ALL")}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="ALL">All Statuses</option>
          <option value="INTAKE">Intake</option>
          <option value="PREPARATION">Preparation</option>
          <option value="REVIEW">Review</option>
          <option value="FILED">Filed</option>
          <option value="INVOICED">Invoiced</option>
          <option value="COMPLETED">Completed</option>
        </select>
      </div>

      {/* Client List */}
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="p-4 text-center text-gray-500">Loading clients...</div>
        ) : filteredClients && filteredClients.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {filteredClients.map((client) => (
              <button
                key={client.id}
                onClick={() => onSelectClient(client.id)}
                className={`w-full text-left p-4 hover:bg-gray-50 transition-colors ${
                  selectedClientId === client.id ? "bg-blue-50 border-l-4 border-blue-600" : ""
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate">
                      {client.name}
                    </h3>
                    <p className="text-sm text-gray-500 truncate">
                      {client.email}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                      statusColors[client.status]
                    }`}
                  >
                    {client.status}
                  </span>
                  <span className="text-xs text-gray-500">
                    {client.progressPercentage}%
                  </span>
                </div>
                {client.assignedTo && (
                  <p className="text-xs text-gray-500 mt-1">
                    Assigned to: {client.assignedTo.name}
                  </p>
                )}
              </button>
            ))}
          </div>
        ) : (
          <div className="p-4 text-center text-gray-500">
            {searchQuery || statusFilter !== "ALL"
              ? "No clients match your filters"
              : "No clients found"}
          </div>
        )}
      </div>
    </div>
  );
}
