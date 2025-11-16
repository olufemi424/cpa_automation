"use client";

import { useState } from "react";
import { ClientList } from "./ClientList";
import { KanbanBoard } from "./KanbanBoard";
import { ChatPanel } from "./ChatPanel";
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
  const isCPA = user.role === "CPA";
  const isClient = user.role === "CLIENT";

  return (
    <div className="dashboard min-h-screen" style={{ background: 'var(--background)' }}>
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
              <span className="dashboard__user-role inline-flex items-center rounded-full px-3 py-1 text-xs font-medium transition-all duration-300" style={{
                background: 'rgba(0, 0, 0, 0.05)',
                color: 'var(--text-primary)',
                border: '1px solid rgba(0, 0, 0, 0.1)'
              }}>
                {user.role}
              </span>
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

            {/* Chat Panel (Collapsible) */}
            {isChatOpen && (
              <aside className="dashboard__sidebar dashboard__sidebar--chat w-96 border-l overflow-y-auto animate-fade-in-fast" style={{
                background: 'var(--glass-bg)',
                borderColor: 'var(--glass-border)'
              }}>
                <ChatPanel
                  clientId={selectedClientId}
                  onClose={() => setIsChatOpen(false)}
                />
              </aside>
            )}
          </>
        )}
      </div>

      {/* Floating Chat Button - Only for ADMIN/CPA */}
      {!isClient && !isChatOpen && selectedClientId && (
        <button
          onClick={() => setIsChatOpen(true)}
          className="dashboard__chat-button fixed bottom-6 right-6 p-4 rounded-full transition-all duration-300 hover:scale-110"
          style={{
            background: 'rgba(0, 0, 0, 0.9)',
            color: 'white',
            boxShadow: '0 4px 12px 0 rgba(0, 0, 0, 0.15)'
          }}
          aria-label="Open chat"
        >
          <svg
            className="dashboard__chat-icon w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
        </button>
      )}
    </div>
  );
}
