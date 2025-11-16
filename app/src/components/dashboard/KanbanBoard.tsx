"use client";

import { useQuery } from "@tanstack/react-query";

interface KanbanBoardProps {
  selectedClientId: string | null;
  onSelectClient: (clientId: string) => void;
}

type ClientStatus = "INTAKE" | "PREPARATION" | "REVIEW" | "FILED" | "INVOICED";

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

const columns: { status: ClientStatus; label: string; color: string }[] = [
  { status: "INTAKE", label: "Intake", color: "bg-gray-100" },
  { status: "PREPARATION", label: "Preparation", color: "bg-yellow-100" },
  { status: "REVIEW", label: "Review", color: "bg-blue-100" },
  { status: "FILED", label: "Filed", color: "bg-green-100" },
  { status: "INVOICED", label: "Invoiced", color: "bg-purple-100" },
];

export function KanbanBoard({ selectedClientId, onSelectClient }: KanbanBoardProps) {
  const { data: clients, isLoading } = useQuery<Client[]>({
    queryKey: ["clients"],
    queryFn: async () => {
      const response = await fetch("/api/clients");
      if (!response.ok) throw new Error("Failed to fetch clients");
      return response.json();
    },
  });

  const getClientsByStatus = (status: ClientStatus) => {
    return clients?.filter((client) => client.status === status) || [];
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-lg text-gray-500">Loading board...</div>
      </div>
    );
  }

  return (
    <div className="h-full">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Client Workflow</h2>
        <p className="text-gray-600 mt-1">
          Manage clients through the tax preparation process
        </p>
      </div>

      <div className="grid grid-cols-5 gap-4 h-[calc(100%-5rem)]">
        {columns.map((column) => {
          const columnClients = getClientsByStatus(column.status);
          return (
            <div key={column.status} className="flex flex-col">
              {/* Column Header */}
              <div className={`${column.color} rounded-t-lg px-4 py-3 border-b-2 border-gray-300`}>
                <h3 className="font-semibold text-gray-900">
                  {column.label}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  {columnClients.length} {columnClients.length === 1 ? "client" : "clients"}
                </p>
              </div>

              {/* Column Content */}
              <div className="flex-1 bg-gray-50 rounded-b-lg p-2 space-y-2 overflow-y-auto">
                {columnClients.map((client) => (
                  <button
                    key={client.id}
                    onClick={() => onSelectClient(client.id)}
                    className={`w-full text-left p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border-2 ${
                      selectedClientId === client.id
                        ? "border-blue-500"
                        : "border-transparent"
                    }`}
                  >
                    <h4 className="font-medium text-gray-900 text-sm mb-1">
                      {client.name}
                    </h4>
                    <p className="text-xs text-gray-500 mb-2">
                      Tax Year: {client.taxYear}
                    </p>
                    
                    {/* Progress Bar */}
                    <div className="w-full bg-gray-200 rounded-full h-1.5 mb-2">
                      <div
                        className="bg-blue-600 h-1.5 rounded-full"
                        style={{ width: `${client.progressPercentage}%` }}
                      />
                    </div>
                    
                    {client.assignedTo && (
                      <p className="text-xs text-gray-600">
                        👤 {client.assignedTo.name}
                      </p>
                    )}
                  </button>
                ))}
                
                {columnClients.length === 0 && (
                  <div className="text-center py-8 text-gray-400 text-sm">
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
