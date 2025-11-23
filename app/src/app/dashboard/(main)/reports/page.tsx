"use client";

import { authClient } from "@/lib/auth/auth-client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

type UserWithRole = {
  role?: string;
  id: string;
  email: string;
  name: string;
  image?: string | null;
};

export default function ReportsPage() {
  const { data: session } = authClient.useSession();
  const router = useRouter();
  const userRole = (session?.user as UserWithRole)?.role || "CLIENT";

  // Redirect non-admin/non-CPA users
  useEffect(() => {
    if (userRole === "CLIENT") {
      router.push("/dashboard");
    }
  }, [userRole, router]);

  if (userRole === "CLIENT") {
    return null; // Will redirect
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="mt-2 text-sm text-gray-600">
            View business insights and performance metrics
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
                  d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              Reports Coming Soon
            </h2>
            <p className="text-gray-600 max-w-md mx-auto mb-8">
              {userRole === "ADMIN"
                ? "Comprehensive analytics and reporting features are under development. Soon you'll have access to business insights, productivity metrics, and client analytics."
                : "Reporting features are under development. Soon you'll be able to track your productivity, client progress, and generate detailed reports."}
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
                      d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
                    />
                  </svg>
                </div>
                <h3 className="font-medium text-gray-900 mb-1">Performance Metrics</h3>
                <p className="text-sm text-gray-600">
                  Track key performance indicators and team productivity
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
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="font-medium text-gray-900 mb-1">Revenue Analytics</h3>
                <p className="text-sm text-gray-600">
                  View revenue trends, client billing, and financial forecasts
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
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                </div>
                <h3 className="font-medium text-gray-900 mb-1">Client Insights</h3>
                <p className="text-sm text-gray-600">
                  Analyze client progress, satisfaction, and engagement
                </p>
              </div>
            </div>

            {/* Additional Features for Admin */}
            {userRole === "ADMIN" && (
              <div className="mt-8 pt-8 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Admin-Only Reports
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
                  <div className="p-3 bg-blue-50 rounded-lg text-left">
                    <div className="flex items-center">
                      <div className="h-8 w-8 bg-blue-600 rounded flex items-center justify-center mr-3">
                        <svg
                          className="h-4 w-4 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Team Performance</p>
                        <p className="text-xs text-gray-600">CPA workload & efficiency</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 bg-green-50 rounded-lg text-left">
                    <div className="flex items-center">
                      <div className="h-8 w-8 bg-green-600 rounded flex items-center justify-center mr-3">
                        <svg
                          className="h-4 w-4 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">System Usage</p>
                        <p className="text-xs text-gray-600">User activity & adoption</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
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
