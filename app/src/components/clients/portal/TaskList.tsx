"use client";

import { Task } from "@/hooks/useClients";

interface TaskListProps {
  tasks: Task[];
}

export function TaskList({ tasks }: TaskListProps) {
  if (!tasks || tasks.length === 0) {
    return (
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold mb-4" style={{ color: "var(--text-primary)" }}>
          Your Tasks
        </h3>
        <div className="text-center py-8">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
          <p className="mt-2 text-sm text-gray-600">No tasks assigned yet</p>
          <p className="text-xs text-gray-500">Your CPA will assign tasks as needed</p>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card p-6">
      <h3 className="text-lg font-semibold mb-4" style={{ color: "var(--text-primary)" }}>
        Your Tasks
      </h3>
      <div className="space-y-3">
        {tasks.slice(0, 3).map((task) => (
          <div
            key={task.id}
            className="p-3 rounded-lg border border-gray-200"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{task.title}</p>
                {task.description && (
                  <p className="text-xs text-gray-500 mt-1">{task.description}</p>
                )}
              </div>
              <span
                className={`text-xs px-2 py-1 rounded-full ${
                  task.status === "COMPLETED"
                    ? "bg-green-100 text-green-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {task.status}
              </span>
            </div>
            {task.dueDate && (
              <p className="text-xs text-gray-500 mt-2">
                Due: {new Date(task.dueDate).toLocaleDateString()}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
