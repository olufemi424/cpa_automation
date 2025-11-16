"use client";

import { useClient } from "@/hooks/useClients";
import { LoadingSpinner } from "@/components/ui/Loading";
import { ErrorState } from "@/components/ui/ErrorState";

interface ClientOverviewPanelProps {
  clientId: string | null;
}

export function ClientOverviewPanel({ clientId }: ClientOverviewPanelProps) {
  const { data: client, isLoading, error } = useClient(clientId);

  if (!clientId) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">No client selected</h3>
        <p className="mt-1 text-sm text-gray-500">
          Select a client from the board to view details
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <ErrorState message="Failed to load client details" />
      </div>
    );
  }

  if (!client) {
    return null;
  }

  // Calculate document stats
  const totalDocuments = client.documents?.length || 0;
  const verifiedDocuments = client.documents?.filter((doc) => doc.isVerified).length || 0;
  const uploadProgress = totalDocuments > 0 ? (verifiedDocuments / totalDocuments) * 100 : 0;

  // Find next deadline
  const upcomingTasks = client.tasks
    ?.filter((task) => task.dueDate && task.status !== "COMPLETED")
    .sort((a, b) => {
      if (!a.dueDate || !b.dueDate) return 0;
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    });
  const nextDeadline = upcomingTasks?.[0];

  // Format date
  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Status color mapping
  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      INTAKE: "bg-gray-100 text-gray-700",
      PREPARATION: "bg-yellow-100 text-yellow-700",
      REVIEW: "bg-blue-100 text-blue-700",
      FILED: "bg-green-100 text-green-700",
      INVOICED: "bg-purple-100 text-purple-700",
      COMPLETED: "bg-green-200 text-green-800",
    };
    return colors[status] || "bg-gray-100 text-gray-700";
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{client.name}</h2>
            <p className="text-sm text-gray-500">{client.email}</p>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(client.status)}`}
          >
            {client.status}
          </span>
        </div>
      </div>

      {/* Client Details */}
      <div className="px-6 py-4 space-y-4">
        {/* Progress Bar */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Overall Progress</span>
            <span className="text-sm font-medium text-blue-600">
              {client.progressPercentage}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${client.progressPercentage}%` }}
            />
          </div>
        </div>

        {/* Client Info Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide">Entity Type</p>
            <p className="mt-1 text-sm font-medium text-gray-900">{client.entityType}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide">Tax Year</p>
            <p className="mt-1 text-sm font-medium text-gray-900">{client.taxYear}</p>
          </div>
          {client.businessName && (
            <div className="col-span-2">
              <p className="text-xs text-gray-500 uppercase tracking-wide">Business Name</p>
              <p className="mt-1 text-sm font-medium text-gray-900">{client.businessName}</p>
            </div>
          )}
          {client.phone && (
            <div className="col-span-2">
              <p className="text-xs text-gray-500 uppercase tracking-wide">Phone</p>
              <p className="mt-1 text-sm font-medium text-gray-900">{client.phone}</p>
            </div>
          )}
        </div>

        {/* Assigned CPA */}
        {client.assignedTo && (
          <div className="pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Assigned CPA</p>
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center">
                  <span className="text-sm font-medium text-white">
                    {client.assignedTo.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">{client.assignedTo.name}</p>
                <p className="text-xs text-gray-500">{client.assignedTo.email}</p>
              </div>
            </div>
          </div>
        )}

        {/* Document Checklist */}
        <div className="pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-gray-500 uppercase tracking-wide">Documents</p>
            <span className="text-xs text-gray-600">
              {verifiedDocuments} / {totalDocuments} verified
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5 mb-3">
            <div
              className="bg-green-600 h-1.5 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
          {totalDocuments === 0 ? (
            <p className="text-sm text-gray-500 italic">No documents uploaded yet</p>
          ) : (
            <div className="space-y-2">
              {client.documents?.slice(0, 5).map((doc) => (
                <div key={doc.id} className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2">
                    {doc.isVerified ? (
                      <svg
                        className="h-4 w-4 text-green-600"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="h-4 w-4 text-gray-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm0-2a6 6 0 100-12 6 6 0 000 12z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                    <span className="text-gray-700 truncate">{doc.fileName}</span>
                  </div>
                  <span className="text-xs text-gray-500">{doc.documentType}</span>
                </div>
              ))}
              {totalDocuments > 5 && (
                <p className="text-xs text-gray-500 pt-2">
                  +{totalDocuments - 5} more documents
                </p>
              )}
            </div>
          )}
        </div>

        {/* Next Deadline */}
        {nextDeadline && (
          <div className="pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Next Deadline</p>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
              <div className="flex items-start space-x-2">
                <svg
                  className="h-5 w-5 text-amber-600 mt-0.5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                    clipRule="evenodd"
                  />
                </svg>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{nextDeadline.title}</p>
                  {nextDeadline.dueDate && (
                    <p className="text-xs text-gray-600 mt-1">
                      Due {formatDate(nextDeadline.dueDate)}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="pt-4 border-t border-gray-200">
          <div className="grid grid-cols-2 gap-3">
            <button
              className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
              onClick={() => {
                window.location.href = `/dashboard/clients/${client.id}`;
              }}
            >
              View Full Profile
            </button>
            <button
              className="px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
              onClick={() => {
                // TODO: Implement add document
                alert("Add document functionality coming soon");
              }}
            >
              Add Document
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
