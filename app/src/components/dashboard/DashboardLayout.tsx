"use client";

import { useState } from "react";
import { ClientList } from "./ClientList";
import { KanbanBoard } from "./KanbanBoard";
import { ChatPanel } from "./ChatPanel";

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
            <div className="dashboard__header-left flex items-center">
              <h1 className="dashboard__title text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                CPA Command Center
              </h1>
            </div>
            <div className="dashboard__header-right flex items-center gap-4">
              <span className="dashboard__user-name text-sm" style={{ color: 'var(--text-secondary)' }}>
                {user.name || user.email}
              </span>
              <span className="dashboard__user-role inline-flex items-center rounded-full px-3 py-1 text-xs font-medium transition-all duration-300" style={{
                background: 'rgba(0, 0, 0, 0.05)',
                color: 'var(--text-primary)',
                border: '1px solid rgba(0, 0, 0, 0.1)'
              }}>
                {user.role}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="dashboard__main flex h-[calc(100vh-4rem)]">
        {/* Client List Panel */}
        <aside className="dashboard__sidebar dashboard__sidebar--clients w-80 border-r overflow-y-auto" style={{
          background: 'var(--glass-bg)',
          borderColor: 'var(--glass-border)'
        }}>
          <ClientList
            selectedClientId={selectedClientId}
            onSelectClient={setSelectedClientId}
          />
        </aside>

        {/* Main Workspace */}
        <main className="dashboard__workspace flex-1 overflow-y-auto">
          <div className="dashboard__workspace-content p-4 sm:p-6">
            <KanbanBoard
              selectedClientId={selectedClientId}
              onSelectClient={setSelectedClientId}
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
      </div>

      {/* Floating Chat Button */}
      {!isChatOpen && selectedClientId && (
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
