"use client";

import { UseQueryResult, useMutation, useQueryClient } from "@tanstack/react-query";
import { Client } from "@/hooks/useClients";
import { LoadingSpinner } from "@/components/ui/Loading";
import { ErrorState } from "@/components/ui/ErrorState";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
  useDroppable,
} from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useState } from "react";

interface KanbanBoardProps {
  selectedClientId: string | null;
  onSelectClient: (clientId: string) => void;
  clientsQuery: UseQueryResult<Client[], Error>;
}

type ClientStatus = "INTAKE" | "PREPARATION" | "REVIEW" | "FILED" | "INVOICED" | "COMPLETED";

const columns: { status: ClientStatus; label: string; bgColor: string; borderColor: string }[] = [
  { status: "INTAKE", label: "Intake", bgColor: "rgba(0, 0, 0, 0.05)", borderColor: "rgba(0, 0, 0, 0.15)" },
  { status: "PREPARATION", label: "Preparation", bgColor: "rgba(250, 204, 21, 0.15)", borderColor: "rgba(250, 204, 21, 0.4)" },
  { status: "REVIEW", label: "Review", bgColor: "rgba(59, 130, 246, 0.15)", borderColor: "rgba(59, 130, 246, 0.4)" },
  { status: "FILED", label: "Filed", bgColor: "rgba(34, 197, 94, 0.15)", borderColor: "rgba(34, 197, 94, 0.4)" },
  { status: "INVOICED", label: "Invoiced", bgColor: "rgba(168, 85, 247, 0.15)", borderColor: "rgba(168, 85, 247, 0.4)" },
  { status: "COMPLETED", label: "Completed", bgColor: "rgba(16, 185, 129, 0.15)", borderColor: "rgba(16, 185, 129, 0.4)" },
];

// Draggable Client Card Component
function DraggableClientCard({
  client,
  isSelected,
  onSelectClient,
}: {
  client: Client;
  isSelected: boolean;
  onSelectClient: (clientId: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: client.id,
    data: {
      type: "client",
      client,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <button
        onClick={() => onSelectClient(client.id)}
        className="kanban-board__card w-full text-left p-3 rounded-lg transition-all duration-300 hover:scale-[1.02] cursor-grab active:cursor-grabbing"
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
    </div>
  );
}

// Droppable Column Component
function DroppableColumn({
  column,
  clients,
  selectedClientId,
  onSelectClient,
}: {
  column: typeof columns[0];
  clients: Client[];
  selectedClientId: string | null;
  onSelectClient: (clientId: string) => void;
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: column.status,
    data: {
      type: "column",
      status: column.status,
    },
  });

  return (
    <div className="kanban-board__column flex flex-col animate-fade-in-delay">
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
          {clients.length} {clients.length === 1 ? "client" : "clients"}
        </p>
      </div>

      <SortableContext
        id={column.status}
        items={clients.map((c) => c.id)}
        strategy={verticalListSortingStrategy}
      >
        <div
          ref={setNodeRef}
          className="kanban-board__column-content flex-1 rounded-b-lg p-2 space-y-2 overflow-y-auto"
          style={{
            background: isOver ? 'rgba(0, 0, 0, 0.08)' : 'var(--background-dark)',
            transition: 'background 0.2s ease',
          }}
        >
          {clients.map((client) => {
            const isSelected = selectedClientId === client.id;
            return (
              <DraggableClientCard
                key={client.id}
                client={client}
                isSelected={isSelected}
                onSelectClient={onSelectClient}
              />
            );
          })}

          {clients.length === 0 && (
            <div className="kanban-board__column-empty text-center py-8 text-xs sm:text-sm" style={{ color: 'rgba(0, 0, 0, 0.4)' }}>
              No clients in this stage
            </div>
          )}
        </div>
      </SortableContext>
    </div>
  );
}

export function KanbanBoard({ selectedClientId, onSelectClient, clientsQuery }: KanbanBoardProps) {
  const { data: clients, isLoading, error, refetch } = clientsQuery;
  const queryClient = useQueryClient();
  const [activeClient, setActiveClient] = useState<Client | null>(null);

  // Ensure clients is an array
  const clientsArray = Array.isArray(clients) ? clients : [];

  // Set up drag sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor)
  );

  // Mutation to update client status
  const updateClientStatus = useMutation({
    mutationFn: async ({ clientId, status }: { clientId: string; status: ClientStatus }) => {
      const response = await fetch(`/api/clients/${clientId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        throw new Error("Failed to update client status");
      }

      return response.json();
    },
    onMutate: async ({ clientId, status }) => {
      await queryClient.cancelQueries({ queryKey: ["clients"] });
      const previousClients = queryClient.getQueryData<Client[]>(["clients"]);

      queryClient.setQueryData<Client[]>(["clients"], (old) => {
        if (!old) return old;
        return old.map((client) =>
          client.id === clientId ? { ...client, status } : client
        );
      });

      return { previousClients };
    },
    onError: (err, variables, context) => {
      if (context?.previousClients) {
        queryClient.setQueryData(["clients"], context.previousClients);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
    },
  });

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const client = clientsArray.find((c) => c.id === active.id);
    if (client) {
      setActiveClient(client);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveClient(null);

    if (!over) return;

    const activeClient = clientsArray.find((c) => c.id === active.id);
    if (!activeClient) return;

    // Determine the target status
    // If dropped on a column, use the column status
    // If dropped on another client, use that client's status
    let targetStatus: ClientStatus | undefined;

    if (over.data.current?.type === "column") {
      targetStatus = over.data.current.status as ClientStatus;
    } else {
      // Dropped on another client card, find that client's status
      const overClient = clientsArray.find((c) => c.id === over.id);
      targetStatus = overClient?.status as ClientStatus | undefined;
    }

    if (targetStatus && activeClient.status !== targetStatus) {
      updateClientStatus.mutate({
        clientId: activeClient.id,
        status: targetStatus,
      });
    }
  };

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
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="kanban-board h-full animate-fade-in">
        <div className="kanban-board__header mb-6">
          <h2 className="kanban-board__title text-xl sm:text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
            Client Workflow
          </h2>
          <p className="kanban-board__subtitle text-sm sm:text-base mt-1" style={{ color: 'var(--text-secondary)' }}>
            Manage clients through the tax preparation process
          </p>
        </div>

        <div className="kanban-board__columns grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-4 h-[calc(100%-5rem)]">
          {columns.map((column) => {
            const columnClients = getClientsByStatus(column.status);
            return (
              <DroppableColumn
                key={column.status}
                column={column}
                clients={columnClients}
                selectedClientId={selectedClientId}
                onSelectClient={onSelectClient}
              />
            );
          })}
        </div>
      </div>

      {/* Drag Overlay */}
      <DragOverlay>
        {activeClient ? (
          <div
            className="kanban-board__card w-[280px] text-left p-3 rounded-lg"
            style={{
              background: 'var(--glass-bg)',
              border: '2px solid var(--glass-border)',
              boxShadow: '0 8px 24px 0 rgba(0, 0, 0, 0.15)',
              cursor: 'grabbing',
            }}
          >
            <h4 className="kanban-board__card-title font-bold text-sm mb-1" style={{ color: 'var(--text-primary)' }}>
              {activeClient.name}
            </h4>
            <p className="kanban-board__card-year text-xs mb-2" style={{ color: 'var(--text-secondary)' }}>
              Tax Year: {activeClient.taxYear}
            </p>
            <div className="kanban-board__card-progress-bg w-full rounded-full h-1.5 mb-2" style={{ background: 'rgba(0, 0, 0, 0.1)' }}>
              <div
                className="kanban-board__card-progress-fill h-1.5 rounded-full"
                style={{
                  width: `${activeClient.progressPercentage}%`,
                  background: 'rgba(0, 0, 0, 0.6)'
                }}
              />
            </div>
            {activeClient.assignedTo && (
              <p className="kanban-board__card-assigned text-xs" style={{ color: 'var(--text-secondary)' }}>
                👤 {activeClient.assignedTo.name}
              </p>
            )}
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
