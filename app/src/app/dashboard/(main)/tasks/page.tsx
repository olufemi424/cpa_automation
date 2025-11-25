"use client";

import { authClient } from "@/lib/auth/auth-client";
import type { UserRole } from "@/types";

export default function TasksPage() {
  const { data: session } = authClient.useSession();
  const userRole: UserRole = ((session?.user as { role?: UserRole })?.role) || "CLIENT";

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Tasks</h1>
          <p className="mt-2 text-sm text-gray-600">
            Manage and track your tasks and assignments
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
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              Tasks Coming Soon
            </h2>
            <p className="text-gray-600 max-w-md mx-auto mb-8">
              {userRole === "ADMIN" || userRole === "CPA"
                ? "Task management features are under development. Soon you'll be able to create, assign, and track tasks for your clients."
                : "Task management features are under development. Soon you'll be able to view and complete tasks assigned to you by your CPA."}
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
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                </div>
                <h3 className="font-medium text-gray-900 mb-1">Create & Assign</h3>
                <p className="text-sm text-gray-600">
                  Create tasks and assign them to team members or clients
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
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="font-medium text-gray-900 mb-1">Track Progress</h3>
                <p className="text-sm text-gray-600">
                  Monitor task status and completion in real-time
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
                      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                    />
                  </svg>
                </div>
                <h3 className="font-medium text-gray-900 mb-1">Get Notified</h3>
                <p className="text-sm text-gray-600">
                  Receive reminders for due dates and updates
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
