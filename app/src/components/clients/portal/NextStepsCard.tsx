"use client";

interface NextStepsCardProps {
  documentsRemaining: number;
  tasksCount: number;
}

export function NextStepsCard({ documentsRemaining, tasksCount }: NextStepsCardProps) {
  return (
    <div className="glass-card p-6">
      <h3 className="text-sm font-semibold mb-4 text-gray-700 uppercase tracking-wide">
        Next Steps
      </h3>
      <div className="space-y-3">
        {documentsRemaining > 0 && (
          <div className="flex items-start space-x-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
            <svg
              className="w-5 h-5 text-yellow-600 shrink-0 mt-0.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <div>
              <p className="text-xs font-medium text-yellow-900">Upload remaining documents</p>
              <p className="text-xs text-yellow-700 mt-1">
                {documentsRemaining} document(s) needed
              </p>
            </div>
          </div>
        )}

        {tasksCount > 0 && (
          <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <svg
              className="w-5 h-5 text-blue-600 shrink-0 mt-0.5"
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
            <div>
              <p className="text-xs font-medium text-blue-900">Complete assigned tasks</p>
              <p className="text-xs text-blue-700 mt-1">{tasksCount} task(s) pending</p>
            </div>
          </div>
        )}

        <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
          <svg
            className="w-5 h-5 text-gray-600 shrink-0 mt-0.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
            />
          </svg>
          <div>
            <p className="text-xs font-medium text-gray-900">Stay in touch</p>
            <p className="text-xs text-gray-600 mt-1">Message your CPA with any questions</p>
          </div>
        </div>
      </div>
    </div>
  );
}
