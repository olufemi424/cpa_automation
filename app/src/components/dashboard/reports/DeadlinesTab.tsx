import type { DeadlineAnalytics } from "@/types";
import { MetricCard } from "./MetricCard";

interface DeadlinesTabProps {
  data: DeadlineAnalytics;
}

export function DeadlinesTab({ data }: DeadlinesTabProps) {
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard
          label="Overdue Tasks"
          value={data.overdueCount}
          iconBgColor="bg-red-100"
          iconColor="text-red-600"
          valueColor="text-red-600"
          icon={
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />

        <MetricCard
          label="Upcoming Tasks"
          value={data.upcomingTasks.length}
          iconBgColor="bg-blue-100"
          iconColor="text-blue-600"
          valueColor="text-blue-600"
          icon={
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          }
        />

        <MetricCard
          label="Completed (30 days)"
          value={data.completedLast30Days}
          iconBgColor="bg-green-100"
          iconColor="text-green-600"
          valueColor="text-green-600"
          icon={
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
      </div>

      {/* Overdue Tasks */}
      {data.overdueCount > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-red-200 p-6">
          <h3 className="text-lg font-semibold text-red-900 mb-4">⚠️ Overdue Tasks</h3>
          <div className="space-y-3">
            {data.overdueTasks.map((task) => (
              <div key={task.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{task.title}</p>
                  <p className="text-sm text-gray-600">Client: {task.clientName}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-red-600">Due: {formatDate(task.dueDate)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upcoming Tasks */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">📅 Upcoming Tasks</h3>
        {data.upcomingTasks.length === 0 ? (
          <p className="text-gray-600 text-center py-4">No upcoming tasks with due dates</p>
        ) : (
          <div className="space-y-3">
            {data.upcomingTasks.map((task) => (
              <div key={task.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{task.title}</p>
                  <p className="text-sm text-gray-600">Client: {task.clientName}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">Due: {formatDate(task.dueDate)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
