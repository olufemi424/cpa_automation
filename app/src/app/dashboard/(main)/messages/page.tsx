"use client";

import { authClient } from "@/lib/auth/auth-client";
import type { UserRole } from "@/types";

export default function MessagesPage() {
  const { data: session } = authClient.useSession();
  const userRole: UserRole = ((session?.user as { role?: UserRole })?.role) || "CLIENT";

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
          <p className="mt-2 text-sm text-gray-600">
            Communicate with your {userRole === "CLIENT" ? "CPA" : "clients and team"}
          </p>
        </div>

        {/* Coming Soon Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12">
          <div className="text-center">
            <div className="mx-auto h-24 w-24 text-gray-400 mb-6">
              <svg
                className="h-full w-full"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              Messaging Coming Soon
            </h2>
            <p className="text-gray-600 max-w-md mx-auto mb-8">
              {userRole === "ADMIN" || userRole === "CPA"
                ? "A comprehensive messaging platform is under development. Soon you'll be able to communicate with clients and team members in real-time."
                : "A messaging interface is under development. Soon you'll be able to chat with your assigned CPA and get quick responses to your questions."}
            </p>

            {/* Feature Preview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto text-left">
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center mb-3">
                  <svg
                    className="h-6 w-6 text-blue-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                    />
                  </svg>
                </div>
                <h3 className="font-medium text-gray-900 mb-1">Real-Time Chat</h3>
                <p className="text-sm text-gray-600">
                  Instant messaging with typing indicators and read receipts
                </p>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center mb-3">
                  <svg
                    className="h-6 w-6 text-green-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                    />
                  </svg>
                </div>
                <h3 className="font-medium text-gray-900 mb-1">File Sharing</h3>
                <p className="text-sm text-gray-600">
                  Share documents and files directly in conversations
                </p>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="h-10 w-10 bg-purple-100 rounded-lg flex items-center justify-center mb-3">
                  <svg
                    className="h-6 w-6 text-purple-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <h3 className="font-medium text-gray-900 mb-1">Search History</h3>
                <p className="text-sm text-gray-600">
                  Find past conversations and messages instantly
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Back to Dashboard */}
        <div className="mt-8 text-center">
          <a
            href="/dashboard"
            className="inline-flex items-center text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            <svg
              className="h-4 w-4 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Dashboard
          </a>
        </div>
      </div>
    </div>
  );
}
