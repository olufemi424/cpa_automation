"use client";

import { useState, useRef, useEffect } from "react";
import { useMessages, useSendMessage } from "@/hooks/useMessages";
import { authClient } from "@/lib/auth/auth-client";
import { LoadingSpinner } from "../ui/Loading";

interface ChatPanelProps {
  clientId: string | null;
  onClose: () => void;
}

export function ChatPanel({ clientId, onClose }: ChatPanelProps) {
  // Move all hooks to the top - before any conditional returns
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { data: session } = authClient.useSession();
  const { data: messages = [], isLoading, error } = useMessages(clientId || "");
  const sendMessageMutation = useSendMessage();

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = () => {
    if (!clientId || !inputValue.trim() || sendMessageMutation.isPending) return;

    sendMessageMutation.mutate(
      {
        clientId,
        content: inputValue.trim(),
      },
      {
        onSuccess: () => {
          setInputValue("");
        },
      }
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const formatDate = (date: Date) => {
    const messageDate = new Date(date);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (messageDate.toDateString() === today.toDateString()) {
      return "Today";
    } else if (messageDate.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return messageDate.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    }
  };

  // NOW handle the conditional rendering after all hooks
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

  const characterCount = inputValue.length;
  const maxCharacters = 5000;
  const isOverLimit = characterCount > maxCharacters;

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
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <LoadingSpinner />
          </div>
        ) : error ? (
          <div className="text-center text-sm text-red-600">
            Failed to load messages. Please try again.
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center text-sm" style={{ color: 'var(--text-secondary)' }}>
            No messages yet. Start the conversation!
          </div>
        ) : (
          <>
            {messages.map((message, index) => {
              const isCurrentUser = message.senderId === session?.user?.id;
              const prevMessage = messages[index - 1];
              const showDateHeader =
                index === 0 ||
                (prevMessage && formatDate(prevMessage.createdAt) !== formatDate(message.createdAt));

              return (
                <div key={message.id}>
                  {showDateHeader && (
                    <div className="text-center text-xs text-gray-500 my-4">
                      {formatDate(message.createdAt)}
                    </div>
                  )}
                  <div
                    className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[70%] rounded-lg px-3 py-2 ${
                        isCurrentUser
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 text-gray-900"
                      }`}
                    >
                      {!isCurrentUser && message.sender && (
                        <div className="text-xs font-semibold mb-1">
                          {message.sender.name}
                        </div>
                      )}
                      <p className="text-sm whitespace-pre-wrap wrap-break-word">
                        {message.content}
                      </p>
                      <div
                        className={`text-xs mt-1 ${
                          isCurrentUser ? "text-blue-100" : "text-gray-500"
                        }`}
                      >
                        {formatTime(message.createdAt)}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Message Input */}
      <div className="chat-panel__input-area p-4 border-t" style={{ borderColor: 'var(--glass-border)' }}>
        {sendMessageMutation.isError && (
          <div className="text-xs text-red-600 mb-2">
            {sendMessageMutation.error instanceof Error
              ? sendMessageMutation.error.message
              : "Failed to send message"}
          </div>
        )}
        <div className="chat-panel__input-wrapper flex gap-2">
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message... (Shift+Enter for new line)"
            className="chat-panel__input flex-1 px-3 py-2 border rounded-lg text-sm transition-all duration-300 focus:outline-none resize-none"
            style={{
              background: 'rgba(255, 255, 255, 0.8)',
              borderColor: isOverLimit ? '#ef4444' : 'var(--glass-border)',
              color: 'var(--text-primary)',
              minHeight: '40px',
              maxHeight: '120px',
            }}
            rows={1}
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || sendMessageMutation.isPending || isOverLimit}
            className="chat-panel__send-button px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105"
            style={{
              background: 'rgba(0, 0, 0, 0.9)',
              color: 'white'
            }}
          >
            {sendMessageMutation.isPending ? "Sending..." : "Send"}
          </button>
        </div>
        <div className="flex justify-between items-center mt-1">
          <div className="text-xs text-gray-500">
            Press Enter to send, Shift+Enter for new line
          </div>
          <div className={`text-xs ${isOverLimit ? 'text-red-600' : 'text-gray-500'}`}>
            {characterCount}/{maxCharacters}
          </div>
        </div>
      </div>
    </div>
  );
}
