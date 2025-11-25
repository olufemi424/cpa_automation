import type { ReactNode } from "react";

interface MetricCardProps {
  label: string;
  value: number | string;
  icon: ReactNode;
  iconBgColor: string;
  iconColor: string;
  valueColor?: string;
}

export function MetricCard({
  label,
  value,
  icon,
  iconBgColor,
  iconColor,
  valueColor = "text-gray-900"
}: MetricCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{label}</p>
          <p className={`text-3xl font-bold mt-2 ${valueColor}`}>{value}</p>
        </div>
        <div className={`h-12 w-12 ${iconBgColor} rounded-lg flex items-center justify-center`}>
          <div className={iconColor}>{icon}</div>
        </div>
      </div>
    </div>
  );
}
