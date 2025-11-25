"use client";

import { TaskStatus } from "@/types";

interface TaskFiltersProps {
  status: TaskStatus | "ALL";
  search: string;
  onStatusChange: (status: TaskStatus | "ALL") => void;
  onSearchChange: (search: string) => void;
  onClearFilters: () => void;
  userRole: "ADMIN" | "CPA" | "CLIENT";
}

const TASK_STATUSES: Array<{ value: TaskStatus | "ALL"; label: string }> = [
  { value: "ALL", label: "All Tasks" },
  { value: "INTAKE", label: "Intake" },
  { value: "PREPARATION", label: "Preparation" },
  { value: "REVIEW", label: "Review" },
  { value: "FILED", label: "Filed" },
  { value: "INVOICED", label: "Invoiced" },
];

export function TaskFilters({
  status,
  search,
  onStatusChange,
  onSearchChange,
  onClearFilters,
}: TaskFiltersProps) {
  const hasActiveFilters = status !== "ALL" || search !== "";

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <div className="flex-1">
          <label htmlFor="search" className="sr-only">
            Search tasks
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                className="h-5 w-5 text-gray-400"
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
            <input
              type="text"
              id="search"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search tasks by title or description..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
        </div>

        {/* Status Filter */}
        <div className="sm:w-64">
          <label htmlFor="status-filter" className="sr-only">
            Filter by status
          </label>
          <select
            id="status-filter"
            value={status}
            onChange={(e) => onStatusChange(e.target.value as TaskStatus | "ALL")}
            className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            {TASK_STATUSES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
            Clear Filters
          </button>
        )}
      </div>
    </div>
  );
}
