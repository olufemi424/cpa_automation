"use client";

import {
  FileText,
  Settings,
  CheckCircle2,
  Send,
  CreditCard,
  Check
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ProgressTimelineProps {
  currentStatus: string;
}

const STATUS_STEPS = [
  {
    key: "INTAKE",
    label: "Intake",
    description: "Gathering info",
    icon: FileText
  },
  {
    key: "PREPARATION",
    label: "Preparation",
    description: "Processing return",
    icon: Settings
  },
  {
    key: "REVIEW",
    label: "Review",
    description: "Quality check",
    icon: CheckCircle2
  },
  {
    key: "FILED",
    label: "Filed",
    description: "Submitted to IRS",
    icon: Send
  },
  {
    key: "INVOICED",
    label: "Complete",
    description: "Ready for payment",
    icon: CreditCard
  },
];

export function ProgressTimeline({ currentStatus }: ProgressTimelineProps) {
  // Handle COMPLETED status by mapping it to the last step
  const isCompletedStatus = currentStatus === "COMPLETED";
  const foundIndex = STATUS_STEPS.findIndex((step) => step.key === currentStatus);
  const currentStatusIndex = isCompletedStatus ? STATUS_STEPS.length - 1 : foundIndex;

  const currentStep = STATUS_STEPS[currentStatusIndex];
  const statusLabel = isCompletedStatus ? "Completed" : (currentStep?.label || "In Progress");

  return (
    <div className="glass-card p-8 relative overflow-hidden group">
      {/* Background Decoration */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-xl font-bold text-gray-900">Your Progress</h3>
            <p className="text-sm text-gray-500 mt-1">Tax Year 2024 Return</p>
          </div>
          <div className="px-4 py-1.5 rounded-full bg-amber-50 border border-amber-100 text-amber-700 text-sm font-semibold shadow-sm">
            {statusLabel}
          </div>
        </div>

        {/* Timeline Stepper */}
        <div className="relative px-2">
          {/* Progress Line Background */}
          <div className="absolute top-6 left-0 w-full h-1 bg-gray-100 rounded-full" />

          {/* Active Progress Line (Gradient) */}
          <div className="absolute top-6 left-0 h-1 rounded-full bg-gradient-to-r from-gray-900 via-amber-500 to-amber-400 transition-all duration-1000 ease-out"
            style={{
              width: `${(currentStatusIndex / (STATUS_STEPS.length - 1)) * 100}%`,
            }}
          />

          {/* Steps */}
          <div className="relative flex justify-between">
            {STATUS_STEPS.map((step, index) => {
              const isCompleted = index < currentStatusIndex;
              const isCurrent = index === currentStatusIndex;
              const Icon = step.icon;

              return (
                <div key={step.key} className="flex flex-col items-center relative group/step" style={{ flex: 1 }}>
                  {/* Icon Circle */}
                  <div
                    className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center border-2 transition-all duration-500 shadow-sm z-10",
                      isCurrent
                        ? "bg-gray-900 border-gray-900 text-amber-400 shadow-amber-100 scale-110" // Active: Bold Black & Gold
                        : isCompleted
                        ? "bg-white border-gray-200 text-gray-900" // Completed: Subtle
                        : "bg-white border-gray-100 text-gray-300" // Future: Faded
                    )}
                  >
                    {isCompleted ? (
                      <Check className="w-6 h-6" />
                    ) : (
                      <Icon className={cn("w-5 h-5", isCurrent && "animate-pulse")} />
                    )}
                  </div>

                  {/* Label & Description */}
                  <div className="mt-4 text-center transition-all duration-300">
                    <p
                      className={cn(
                        "text-sm font-bold mb-0.5",
                        isCompleted || isCurrent ? "text-gray-900" : "text-gray-500"
                      )}
                    >
                      {step.label}
                    </p>
                    <p className="text-xs text-gray-400 font-medium hidden sm:block">
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
