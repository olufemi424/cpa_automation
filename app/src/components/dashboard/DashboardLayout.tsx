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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">
                CPA Command Center
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                {user.name || user.email}
              </span>
              <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800">
                {user.role}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex h-[calc(100vh-4rem)]">
        {/* Client List Panel */}
        <aside className="w-80 bg-white border-r border-gray-200 overflow-y-auto">
          <ClientList
            selectedClientId={selectedClientId}
            onSelectClient={setSelectedClientId}
          />
        </aside>

        {/* Main Workspace */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-6">
            <KanbanBoard
              selectedClientId={selectedClientId}
              onSelectClient={setSelectedClientId}
            />
          </div>
        </main>

        {/* Chat Panel (Collapsible) */}
        {isChatOpen && (
          <aside className="w-96 bg-white border-l border-gray-200 overflow-y-auto">
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
          className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
          aria-label="Open chat"
        >
          <svg
            className="w-6 h-6"
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
