"use client";

import { useSession } from "@/lib/auth/auth-client";
import { redirect } from "next/navigation";

export default function DashboardPage() {
  const { data: session, isPending } = useSession();

  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!session) {
    redirect("/auth/login");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white rounded-lg shadow p-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Welcome to CPA Command Center
            </h1>
            <p className="text-gray-600 mb-4">
              Logged in as: <span className="font-semibold">{session.user.email}</span>
            </p>
            <div className="mt-8 p-4 bg-blue-50 rounded-md">
              <p className="text-sm text-blue-800">
                ✅ Authentication is working! Next steps: Build the Kanban board and client management features.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
