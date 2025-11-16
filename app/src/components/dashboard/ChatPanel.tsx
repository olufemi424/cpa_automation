"use client";

interface ChatPanelProps {
  clientId: string | null;
  onClose: () => void;
}

export function ChatPanel({ clientId, onClose }: ChatPanelProps) {
  if (!clientId) {
    return (
      <div className="chat-panel flex flex-col h-full">
        <div className="chat-panel__header p-4 border-b flex items-center justify-between" style={{ borderColor: 'var(--glass-border)' }}>
          <h3 className="chat-panel__title font-bold text-base" style={{ color: 'var(--text-primary)' }}>Messages</h3>
          <button
            onClick={onClose}
            className="chat-panel__close-button transition-all duration-300 hover:scale-110"
            style={{ color: 'var(--text-secondary)' }}
            aria-label="Close chat"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="chat-panel__empty flex-1 flex items-center justify-center text-sm" style={{ color: 'var(--text-secondary)' }}>
          Select a client to view messages
        </div>
      </div>
    );
  }

  return (
    <div className="chat-panel flex flex-col h-full animate-fade-in">
      {/* Chat Header */}
      <div className="chat-panel__header p-4 border-b flex items-center justify-between" style={{ borderColor: 'var(--glass-border)' }}>
        <h3 className="chat-panel__title font-bold text-base" style={{ color: 'var(--text-primary)' }}>Messages</h3>
        <button
          onClick={onClose}
          className="chat-panel__close-button transition-all duration-300 hover:scale-110"
          style={{ color: 'var(--text-secondary)' }}
          aria-label="Close chat"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Messages Area */}
      <div className="chat-panel__messages flex-1 overflow-y-auto p-4 space-y-4">
        <div className="chat-panel__placeholder text-center text-sm" style={{ color: 'var(--text-secondary)' }}>
          Chat feature coming soon...
        </div>
      </div>

      {/* Message Input */}
      <div className="chat-panel__input-area p-4 border-t" style={{ borderColor: 'var(--glass-border)' }}>
        <div className="chat-panel__input-wrapper flex gap-2">
          <input
            type="text"
            placeholder="Type a message..."
            className="chat-panel__input flex-1 px-3 py-2 border rounded-lg text-sm transition-all duration-300 focus:outline-none"
            style={{
              background: 'rgba(255, 255, 255, 0.8)',
              borderColor: 'var(--glass-border)',
              color: 'var(--text-primary)'
            }}
            disabled
          />
          <button
            className="chat-panel__send-button px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105"
            style={{
              background: 'rgba(0, 0, 0, 0.9)',
              color: 'white'
            }}
            disabled
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
