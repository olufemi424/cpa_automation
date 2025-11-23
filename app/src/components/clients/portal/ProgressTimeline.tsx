"use client";

interface ProgressTimelineProps {
  currentStatus: string;
  progressPercentage: number;
}

const STATUS_STEPS = [
  { key: "INTAKE", label: "Intake", description: "Gathering information" },
  { key: "PREPARATION", label: "Preparation", description: "Preparing your return" },
  { key: "REVIEW", label: "Review", description: "Quality check" },
  { key: "FILED", label: "Filed", description: "Return submitted" },
  { key: "INVOICED", label: "Complete", description: "Ready for payment" },
];

export function ProgressTimeline({ currentStatus, progressPercentage }: ProgressTimelineProps) {
  const currentStatusIndex = STATUS_STEPS.findIndex((step) => step.key === currentStatus);

  return (
    <div className="glass-card p-6">
      <h3 className="text-lg font-semibold mb-6" style={{ color: "var(--text-primary)" }}>
        Your Progress
      </h3>

      {/* Timeline Stepper */}
      <div className="relative">
        {/* Progress Line */}
        <div className="absolute top-5 left-0 w-full h-0.5 bg-gray-200">
          <div
            className="h-full bg-blue-600 transition-all duration-500"
            style={{
              width: `${(currentStatusIndex / (STATUS_STEPS.length - 1)) * 100}%`,
            }}
          />
        </div>

        {/* Steps */}
        <div className="relative flex justify-between">
          {STATUS_STEPS.map((step, index) => {
            const isCompleted = index < currentStatusIndex;
            const isCurrent = index === currentStatusIndex;
            const isLastStep = index === STATUS_STEPS.length - 1;

            // If on the last step, show it as completed with checkmark
            const showAsCompleted = isCompleted || (isCurrent && isLastStep);

            return (
              <div key={step.key} className="flex flex-col items-center" style={{ flex: 1 }}>
                {/* Circle */}
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                    showAsCompleted
                      ? "bg-blue-600 border-blue-600"
                      : isCurrent
                      ? "bg-white border-blue-600"
                      : "bg-white border-gray-300"
                  }`}
                >
                  {showAsCompleted ? (
                    <svg
                      className="w-5 h-5 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  ) : (
                    <div
                      className={`w-3 h-3 rounded-full ${
                        isCurrent ? "bg-blue-600" : "bg-gray-300"
                      }`}
                    />
                  )}
                </div>

                {/* Label */}
                <div className="mt-3 text-center">
                  <p
                    className={`text-xs font-medium ${
                      showAsCompleted || isCurrent ? "text-blue-600" : "text-gray-600"
                    }`}
                  >
                    {step.label}
                  </p>
                  <p className="text-xs text-gray-500 mt-1 hidden sm:block">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Overall Progress Bar */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Overall Progress</span>
          <span className="text-sm font-medium text-blue-600">{progressPercentage}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-blue-600 h-3 rounded-full transition-all duration-500"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>
    </div>
  );
}
