"use client";

import { useState } from "react";
import { Sidebar } from "./Sidebar";
import { DashboardHeader } from "./DashboardHeader";
import { ClientList } from "./ClientList";
import { KanbanBoard } from "./KanbanBoard";
import { ChatPanel } from "./ChatPanel";
import { ClientOverviewPanel } from "@/components/clients/ClientOverviewPanel";
import { ClientPortalDashboard } from "@/components/clients/ClientPortalDashboard";
import { useClients } from "@/hooks/useClients";

interface DashboardLayoutProps {
  user: {
    id: string;
    email: string;
    name: string;
    role?: string;
    image?: string | null;
  };
}

export function DashboardLayout({ user }: DashboardLayoutProps) {
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isOverviewOpen, setIsOverviewOpen] = useState(true);

  // Fetch clients once at the parent level to avoid duplicate API calls
  const clientsQuery = useClients();

  // Determine user role for conditional rendering
  const isAdmin = user.role === "ADMIN";
  const isClient = user.role === "CLIENT";

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <Sidebar userRole={user.role || "CLIENT"} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <DashboardHeader
          userName={user.name || user.email}
          userEmail={user.email}
          isClient={isClient}
        />

        {/* Dashboard Content */}
        <div className="flex flex-1 overflow-hidden">
        {/* CLIENT VIEW: Client portal dashboard */}
        {isClient ? (
          <>
            <main className="dashboard__workspace flex-1 overflow-y-auto">
              <div className="dashboard__workspace-content p-4 sm:p-6">
                <ClientPortalDashboard userName={user.name || user.email} />
              </div>
            </main>
          </>
        ) : (
          /* ADMIN/CPA VIEW: Full Kanban board with client list */
          <>
            {/* Client List Panel */}
            <aside className="dashboard__sidebar dashboard__sidebar--clients w-80 border-r overflow-y-auto h-full" style={{
              background: 'var(--glass-bg)',
              borderColor: 'var(--glass-border)'
            }}>
              <ClientList
                selectedClientId={selectedClientId}
                onSelectClient={setSelectedClientId}
                clientsQuery={clientsQuery}
              />
            </aside>

            {/* Main Workspace */}
            <main className="dashboard__workspace flex-1 overflow-y-auto">
              <div className="dashboard__workspace-content p-4 sm:p-6">
                {isAdmin && (
                  <div className="dashboard__admin-badge glass-card mb-4 p-3">
                    <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                      🔑 Admin View - You can see all clients and system data
                    </p>
                  </div>
                )}
                <KanbanBoard
                  selectedClientId={selectedClientId}
                  onSelectClient={setSelectedClientId}
                  clientsQuery={clientsQuery}
                />
              </div>
            </main>

            {/* Right Panel - Client Overview and Chat */}
            {selectedClientId && (isOverviewOpen || isChatOpen) && (
              <aside className="dashboard__sidebar dashboard__sidebar--right w-96 border-l overflow-y-auto animate-fade-in-fast flex flex-col" style={{
                background: 'var(--glass-bg)',
                borderColor: 'var(--glass-border)'
              }}>
                {/* Panel Tabs */}
                <div className="flex border-b" style={{ borderColor: 'var(--glass-border)' }}>
                  <button
                    onClick={() => {
                      setIsOverviewOpen(true);
                      setIsChatOpen(false);
                    }}
                    className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                      isOverviewOpen && !isChatOpen
                        ? 'border-b-2 border-blue-600'
                        : ''
                    }`}
                    style={{
                      color: isOverviewOpen && !isChatOpen ? 'var(--text-primary)' : 'var(--text-secondary)',
                    }}
                  >
                    Overview
                  </button>
                  <button
                    onClick={() => {
                      setIsChatOpen(true);
                      setIsOverviewOpen(false);
                    }}
                    className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                      isChatOpen
                        ? 'border-b-2 border-blue-600'
                        : ''
                    }`}
                    style={{
                      color: isChatOpen ? 'var(--text-primary)' : 'var(--text-secondary)',
                    }}
                  >
                    Messages
                  </button>
                </div>

                {/* Panel Content */}
                <div className="flex-1 overflow-y-auto p-4">
                  {isOverviewOpen && !isChatOpen && (
                    <ClientOverviewPanel clientId={selectedClientId} />
                  )}
                  {isChatOpen && (
                    <ChatPanel
                      clientId={selectedClientId}
                      onClose={() => {
                        setIsChatOpen(false);
                        setIsOverviewOpen(true);
                      }}
                    />
                  )}
                </div>
              </aside>
            )}
          </>
        )}
      </div>

        {/* Floating Panel Toggle Button - Only for ADMIN/CPA */}
        {!isClient && !isOverviewOpen && !isChatOpen && selectedClientId && (
          <button
            onClick={() => setIsOverviewOpen(true)}
            className="dashboard__panel-button fixed bottom-6 right-6 p-4 rounded-full transition-all duration-300 hover:scale-110"
            style={{
              background: 'rgba(0, 0, 0, 0.9)',
              color: 'white',
              boxShadow: '0 4px 12px 0 rgba(0, 0, 0, 0.15)'
            }}
            aria-label="Open client details"
          >
            <svg
              className="dashboard__panel-icon w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
