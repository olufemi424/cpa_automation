"use client";

import { useState } from "react";
import { UseQueryResult } from "@tanstack/react-query";
import { Client } from "@/hooks/useClients";
import { LoadingSpinner } from "@/components/ui/Loading";
import { ErrorState } from "@/components/ui/ErrorState";
import { TaskFormModal } from "../tasks/TaskFormModal";

interface ClientListProps {
  selectedClientId: string | null;
  onSelectClient: (clientId: string | null) => void;
  clientsQuery: UseQueryResult<Client[], Error>;
}

type ClientStatus = "INTAKE" | "PREPARATION" | "REVIEW" | "FILED" | "INVOICED" | "COMPLETED";

const statusStyles: Record<ClientStatus, { bg: string; border: string }> = {
  INTAKE: { bg: "rgba(0, 0, 0, 0.05)", border: "rgba(0, 0, 0, 0.1)" },
  PREPARATION: { bg: "rgba(250, 204, 21, 0.15)", border: "rgba(250, 204, 21, 0.3)" },
  REVIEW: { bg: "rgba(59, 130, 246, 0.15)", border: "rgba(59, 130, 246, 0.3)" },
  FILED: { bg: "rgba(34, 197, 94, 0.15)", border: "rgba(34, 197, 94, 0.3)" },
  INVOICED: { bg: "rgba(168, 85, 247, 0.15)", border: "rgba(168, 85, 247, 0.3)" },
  COMPLETED: { bg: "rgba(16, 185, 129, 0.15)", border: "rgba(16, 185, 129, 0.3)" },
};

export function ClientList({ selectedClientId, onSelectClient, clientsQuery }: ClientListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<ClientStatus | "ALL">("ALL");
  const [taskModalState, setTaskModalState] = useState<{ isOpen: boolean; clientId: string; clientName: string }>({
    isOpen: false,
    clientId: "",
    clientName: "",
  });

  const { data: clients, isLoading, error, refetch } = clientsQuery;

  // Ensure clients is an array
  const clientsArray = Array.isArray(clients) ? clients : [];

  const filteredClients = clientsArray.filter((client: Client) => {
    const matchesSearch = client.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || client.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="client-list flex flex-col h-full">
      {/* Search and Filter */}
      <div className="client-list__filters p-4 border-b space-y-3" style={{ borderColor: 'var(--glass-border)' }}>
        <input
          type="text"
          placeholder="Search clients..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="client-list__search w-full px-3 py-2 border rounded-lg transition-all duration-300 focus:outline-none text-sm"
          style={{
            background: 'rgba(255, 255, 255, 0.8)',
            borderColor: 'var(--glass-border)',
            color: 'var(--text-primary)'
          }}
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as ClientStatus | "ALL")}
          className="client-list__status-filter w-full px-3 py-2 border rounded-lg transition-all duration-300 focus:outline-none text-sm"
          style={{
            background: 'rgba(255, 255, 255, 0.8)',
            borderColor: 'var(--glass-border)',
            color: 'var(--text-primary)'
          }}
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
      <div className="client-list__content flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="client-list__loading p-4 text-center" style={{ color: 'var(--text-secondary)' }}>
            <LoadingSpinner /> Loading clients...
          </div>
        ) : error ? (
          <ErrorState message="Failed to load clients" retry={() => refetch()} />
        ) : filteredClients && filteredClients.length > 0 ? (
          <div className="client-list__items divide-y" style={{ borderColor: 'var(--glass-border)' }}>
            {filteredClients.map((client) => {
              const isSelected = selectedClientId === client.id;
              const statusStyle = statusStyles[client.status as ClientStatus];

              return (
                <div
                  key={client.id}
                  className="client-list__item-wrapper relative group"
                >
                  <button
                    onClick={() => onSelectClient(client.id)}
                    className="client-list__item w-full text-left p-4 transition-all duration-300 hover:scale-[1.01]"
                    style={{
                      background: isSelected ? 'var(--glass-bg-hover)' : 'transparent',
                      borderLeft: isSelected ? '4px solid rgba(0, 0, 0, 0.6)' : '4px solid transparent'
                    }}
                  >
                    <div className="client-list__item-header flex items-start justify-between mb-2">
                      <div className="client-list__item-info flex-1 min-w-0">
                        <h3 className="client-list__item-name font-bold text-sm truncate" style={{ color: 'var(--text-primary)' }}>
                          {client.name}
                        </h3>
                        <p className="client-list__item-email text-xs truncate" style={{ color: 'var(--text-secondary)' }}>
                          {client.email}
                        </p>
                      </div>
                    </div>
                  <div className="client-list__item-meta flex items-center justify-between mt-2">
                    <span
                      className="client-list__item-status inline-flex items-center rounded-full px-2 py-1 text-xs font-medium transition-all duration-300"
                      style={{
                        background: statusStyle?.bg || 'rgba(0, 0, 0, 0.05)',
                        border: `1px solid ${statusStyle?.border || 'rgba(0, 0, 0, 0.1)'}`,
                        color: 'var(--text-primary)'
                      }}
                    >
                      {client.status}
                    </span>
                    <span className="client-list__item-progress text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
                      {client.progressPercentage}%
                    </span>
                  </div>
                    {client.assignedTo && (
                      <p className="client-list__item-assigned text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
                        Assigned to: {client.assignedTo.name}
                      </p>
                    )}
                  </button>
                  
                  {/* Add Task button - appears on hover */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setTaskModalState({ isOpen: true, clientId: client.id, clientName: client.name });
                    }}
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded shadow-md"
                  >
                    + Task
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="client-list__empty p-4 text-center text-sm" style={{ color: 'var(--text-secondary)' }}>
            {searchQuery || statusFilter !== "ALL"
              ? "No clients match your filters"
              : "No clients found"}
          </div>
        )}
      </div>

      {/* Task Form Modal */}
      <TaskFormModal
        isOpen={taskModalState.isOpen}
        onClose={() => setTaskModalState({ isOpen: false, clientId: "", clientName: "" })}
        clientId={taskModalState.clientId}
        clientName={taskModalState.clientName}
      />
    </div>
  );
}
