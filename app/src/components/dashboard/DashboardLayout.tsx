"use client";

import { useState } from "react";
import { Sidebar } from "./Sidebar";
import { ClientList } from "./ClientList";
import { KanbanBoard } from "./KanbanBoard";
import { ChatPanel } from "./ChatPanel";
import { ClientOverviewPanel } from "@/components/clients/ClientOverviewPanel";
import { signOut } from "@/lib/auth/auth-client";
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
  const [isSigningOut, setIsSigningOut] = useState(false);

  // Fetch clients once at the parent level to avoid duplicate API calls
  const clientsQuery = useClients();

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      await signOut();
      // Force navigation to login
      window.location.href = "/auth/login";
    } catch (error) {
      console.error("Sign out error:", error);
      setIsSigningOut(false);
    }
  };

  // Determine user role for conditional rendering
  const isAdmin = user.role === "ADMIN";
  const isClient = user.role === "CLIENT";

  return (
    <div className="dashboard min-h-screen flex" style={{ background: 'var(--background)' }}>
      {/* Sidebar Navigation */}
      <Sidebar userRole={user.role || "CLIENT"} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen">
      {/* Header */}
      <header className="dashboard__header sticky top-0 z-50 border-b" style={{
        background: 'var(--glass-bg)',
        borderColor: 'var(--glass-border)',
        boxShadow: '0 2px 8px 0 rgba(0, 0, 0, 0.08)'
      }}>
        <div className="dashboard__header-container px-4 sm:px-6 lg:px-8">
          <div className="dashboard__header-content flex items-center justify-between h-16">
            <div className="dashboard__header-left flex items-center gap-3">
              <h1 className="dashboard__title text-xl sm:text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                CPA Command Center
              </h1>
              {isClient && (
                <span className="dashboard__client-badge text-xs px-2 py-1 rounded-full" style={{
                  background: 'rgba(59, 130, 246, 0.15)',
                  border: '1px solid rgba(59, 130, 246, 0.3)',
                  color: 'var(--text-primary)'
                }}>
                  Client Portal
                </span>
              )}
            </div>
            <div className="dashboard__header-right flex items-center gap-3">
              <div className="dashboard__user-info hidden sm:flex flex-col items-end">
                <span className="dashboard__user-name text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                  {user.name || user.email}
                </span>
                <span className="dashboard__user-email text-xs" style={{ color: 'var(--text-secondary)' }}>
                  {user.email}
                </span>
              </div>
              <button
                onClick={handleSignOut}
                disabled={isSigningOut}
                className="dashboard__signout-button px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  background: 'rgba(0, 0, 0, 0.05)',
                  color: 'var(--text-primary)',
                  border: '1px solid rgba(0, 0, 0, 0.1)'
                }}
              >
                {isSigningOut ? "Signing out..." : "Sign Out"}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="dashboard__main flex h-[calc(100vh-4rem)]">
        {/* CLIENT VIEW: Simplified single-client view */}
        {isClient ? (
          <>
            <main className="dashboard__workspace flex-1 overflow-y-auto">
              <div className="dashboard__workspace-content p-4 sm:p-6">
                <div className="dashboard__client-view animate-fade-in">
                  <div className="glass-card mb-6">
                    <h2 className="text-xl sm:text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                      Welcome, {user.name}
                    </h2>
                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                      Track your tax preparation progress and communicate with your CPA
                    </p>
                  </div>
                  <div className="glass-card">
                    <h3 className="text-lg font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
                      Your Tax Preparation Status
                    </h3>
                    <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
                      Client portal features coming soon:
                    </p>
                    <ul className="space-y-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                      <li>• View your preparation progress</li>
                      <li>• Upload documents</li>
                      <li>• Message your assigned CPA</li>
                      <li>• Track tasks and deadlines</li>
                      <li>• View and pay invoices</li>
                    </ul>
                  </div>
                </div>
              </div>
            </main>
          </>
        ) : (
          /* ADMIN/CPA VIEW: Full Kanban board with client list */
          <>
            {/* Client List Panel */}
            <aside className="dashboard__sidebar dashboard__sidebar--clients w-80 border-r overflow-y-auto" style={{
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
            {(isOverviewOpen || isChatOpen) && (
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
