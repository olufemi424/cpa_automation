import type { OverviewAnalytics } from "@/types";
import { MetricCard } from "./MetricCard";

interface OverviewTabProps {
  data: OverviewAnalytics;
}

export function OverviewTab({ data }: OverviewTabProps) {
  const statusColors: Record<string, string> = {
    INTAKE: "bg-gray-100 text-gray-800",
    PREPARATION: "bg-yellow-100 text-yellow-800",
    REVIEW: "bg-blue-100 text-blue-800",
    FILED: "bg-green-100 text-green-800",
    INVOICED: "bg-purple-100 text-purple-800",
    COMPLETED: "bg-gray-100 text-gray-800",
  };

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          label="Total Clients"
          value={data.totalClients}
          iconBgColor="bg-blue-100"
          iconColor="text-blue-600"
          icon={
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          }
        />

        <MetricCard
          label="Completed This Month"
          value={data.completedThisMonth}
          iconBgColor="bg-green-100"
          iconColor="text-green-600"
          icon={
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />

        <MetricCard
          label="Unread Messages"
          value={data.unreadMessages}
          iconBgColor="bg-purple-100"
          iconColor="text-purple-600"
          icon={
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          }
        />

        <MetricCard
          label="Active Tasks"
          value={data.tasksByStatus.reduce((sum, item) => sum + item.count, 0)}
          iconBgColor="bg-yellow-100"
          iconColor="text-yellow-600"
          icon={
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          }
        />
      </div>

      {/* Clients by Status */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Clients by Status</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {data.clientsByStatus.map((item) => (
            <div key={item.status} className="text-center">
              <div className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${statusColors[item.status]}`}>
                {item.status}
              </div>
              <p className="text-2xl font-bold text-gray-900 mt-2">{item.count}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Tasks by Status */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Tasks by Status</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {data.tasksByStatus.map((item) => (
            <div key={item.status} className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">{item.status}</p>
              <p className="text-2xl font-bold text-gray-900">{item.count}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
