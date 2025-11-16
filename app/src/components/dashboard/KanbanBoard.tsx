"use client";

import { UseQueryResult } from "@tanstack/react-query";
import { Client } from "@/hooks/useClients";
import { LoadingSpinner } from "@/components/ui/Loading";
import { ErrorState } from "@/components/ui/ErrorState";

interface KanbanBoardProps {
  selectedClientId: string | null;
  onSelectClient: (clientId: string) => void;
  clientsQuery: UseQueryResult<Client[], Error>;
}

type ClientStatus = "INTAKE" | "PREPARATION" | "REVIEW" | "FILED" | "INVOICED";

const columns: { status: ClientStatus; label: string; bgColor: string; borderColor: string }[] = [
  { status: "INTAKE", label: "Intake", bgColor: "rgba(0, 0, 0, 0.05)", borderColor: "rgba(0, 0, 0, 0.15)" },
  { status: "PREPARATION", label: "Preparation", bgColor: "rgba(250, 204, 21, 0.15)", borderColor: "rgba(250, 204, 21, 0.4)" },
  { status: "REVIEW", label: "Review", bgColor: "rgba(59, 130, 246, 0.15)", borderColor: "rgba(59, 130, 246, 0.4)" },
  { status: "FILED", label: "Filed", bgColor: "rgba(34, 197, 94, 0.15)", borderColor: "rgba(34, 197, 94, 0.4)" },
  { status: "INVOICED", label: "Invoiced", bgColor: "rgba(168, 85, 247, 0.15)", borderColor: "rgba(168, 85, 247, 0.4)" },
];

export function KanbanBoard({ selectedClientId, onSelectClient, clientsQuery }: KanbanBoardProps) {
  const { data: clients, isLoading, error, refetch } = clientsQuery;

  // Ensure clients is an array
  const clientsArray = Array.isArray(clients) ? clients : [];

  const getClientsByStatus = (status: ClientStatus) => {
    return clientsArray.filter((client) => client.status === status);
  };

  if (isLoading) {
    return (
      <div className="kanban-board__loading flex items-center justify-center h-full">
        <LoadingSpinner size="lg" />
        <span className="ml-3 text-base sm:text-lg" style={{ color: 'var(--text-secondary)' }}>Loading board...</span>
      </div>
    );
  }

  if (error) {
    return <ErrorState message="Failed to load workflow board" retry={() => refetch()} />;
  }

  return (
    <div className="kanban-board h-full animate-fade-in">
      <div className="kanban-board__header mb-6">
        <h2 className="kanban-board__title text-xl sm:text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
          Client Workflow
        </h2>
        <p className="kanban-board__subtitle text-sm sm:text-base mt-1" style={{ color: 'var(--text-secondary)' }}>
          Manage clients through the tax preparation process
        </p>
      </div>

      <div className="kanban-board__columns grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 sm:gap-4 h-[calc(100%-5rem)]">
        {columns.map((column) => {
          const columnClients = getClientsByStatus(column.status);
          return (
            <div key={column.status} className="kanban-board__column flex flex-col animate-fade-in-delay">
              {/* Column Header */}
              <div
                className="kanban-board__column-header rounded-t-lg px-3 sm:px-4 py-3 border-b-2"
                style={{
                  background: column.bgColor,
                  borderColor: column.borderColor
                }}
              >
                <h3 className="kanban-board__column-title font-bold text-sm sm:text-base" style={{ color: 'var(--text-primary)' }}>
                  {column.label}
                </h3>
                <p className="kanban-board__column-count text-xs sm:text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
                  {columnClients.length} {columnClients.length === 1 ? "client" : "clients"}
                </p>
              </div>

              {/* Column Content */}
              <div
                className="kanban-board__column-content flex-1 rounded-b-lg p-2 space-y-2 overflow-y-auto"
                style={{ background: 'var(--background-dark)' }}
              >
                {columnClients.map((client) => {
                  const isSelected = selectedClientId === client.id;

                  return (
                    <button
                      key={client.id}
                      onClick={() => onSelectClient(client.id)}
                      className="kanban-board__card w-full text-left p-3 rounded-lg transition-all duration-300 hover:scale-[1.02]"
                      style={{
                        background: 'var(--glass-bg)',
                        border: `2px solid ${isSelected ? 'rgba(0, 0, 0, 0.6)' : 'var(--glass-border)'}`,
                        boxShadow: isSelected ? '0 4px 12px 0 rgba(0, 0, 0, 0.1)' : '0 2px 8px 0 rgba(0, 0, 0, 0.08)'
                      }}
                    >
                      <h4 className="kanban-board__card-title font-bold text-xs sm:text-sm mb-1" style={{ color: 'var(--text-primary)' }}>
                        {client.name}
                      </h4>
                      <p className="kanban-board__card-year text-xs mb-2" style={{ color: 'var(--text-secondary)' }}>
                        Tax Year: {client.taxYear}
                      </p>

                      {/* Progress Bar */}
                      <div className="kanban-board__card-progress-bg w-full rounded-full h-1.5 mb-2" style={{ background: 'rgba(0, 0, 0, 0.1)' }}>
                        <div
                          className="kanban-board__card-progress-fill h-1.5 rounded-full transition-all duration-500"
                          style={{
                            width: `${client.progressPercentage}%`,
                            background: 'rgba(0, 0, 0, 0.6)'
                          }}
                        />
                      </div>

                      {client.assignedTo && (
                        <p className="kanban-board__card-assigned text-xs" style={{ color: 'var(--text-secondary)' }}>
                          👤 {client.assignedTo.name}
                        </p>
                      )}
                    </button>
                  );
                })}

                {columnClients.length === 0 && (
                  <div className="kanban-board__column-empty text-center py-8 text-xs sm:text-sm" style={{ color: 'rgba(0, 0, 0, 0.4)' }}>
                    No clients in this stage
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
