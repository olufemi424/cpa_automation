"use client";

import { Task, TaskStatus } from "@/types";
import { formatDistanceToNow } from "date-fns";

interface TaskWithClient extends Task {
  client: {
    id: string;
    name: string;
    email: string;
    status: string;
  };
}

interface TaskCardProps {
  task: TaskWithClient;
  userRole: "ADMIN" | "CPA" | "CLIENT";
}

const STATUS_COLORS: Record<TaskStatus, string> = {
  INTAKE: "bg-gray-100 text-gray-800",
  PREPARATION: "bg-yellow-100 text-yellow-800",
  REVIEW: "bg-blue-100 text-blue-800",
  FILED: "bg-green-100 text-green-800",
  INVOICED: "bg-purple-100 text-purple-800",
};

export function TaskCard({ task, userRole }: TaskCardProps) {
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && !task.isCompleted;
  const dueDateColor = isOverdue ? "text-red-600" : "text-gray-600";

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="text-base font-semibold text-gray-900 mb-1">
            {task.title}
          </h3>
          {userRole !== "CLIENT" && (
            <a
              href={`/dashboard/clients/${task.client.id}`}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              {task.client.name}
            </a>
          )}
        </div>
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            STATUS_COLORS[task.status]
          }`}
        >
          {task.status}
        </span>
      </div>

      {/* Description */}
      {task.description && (
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {task.description}
        </p>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center space-x-4">
          {/* Due Date */}
          {task.dueDate && (
            <div className="flex items-center">
              <svg
                className={`h-4 w-4 mr-1.5 ${dueDateColor}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <span className={dueDateColor}>
                {isOverdue && "Overdue: "}
                {formatDistanceToNow(new Date(task.dueDate), { addSuffix: true })}
              </span>
            </div>
          )}

          {/* Assigned To */}
          {task.assignedTo && userRole !== "CPA" && (
            <div className="flex items-center">
              <svg
                className="h-4 w-4 mr-1.5 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              <span className="text-gray-600">{task.assignedTo.name}</span>
            </div>
          )}
        </div>

        {/* Completion Status */}
        {task.isCompleted ? (
          <div className="flex items-center text-green-600">
            <svg
              className="h-5 w-5 mr-1"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-sm font-medium">Completed</span>
          </div>
        ) : (
          <div className="flex items-center text-gray-500">
            <svg
              className="h-5 w-5 mr-1"
              fill="none"
              viewBox="0 0 20 20"
              stroke="currentColor"
            >
              <circle cx="10" cy="10" r="8" strokeWidth="1.5" />
            </svg>
            <span className="text-sm">In Progress</span>
          </div>
        )}
      </div>
    </div>
  );
}
