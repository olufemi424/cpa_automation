import type { UserRole } from "@/types";

interface ReportHeaderProps {
  userRole: UserRole;
}

export function ReportHeader({ userRole }: ReportHeaderProps) {
  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
      <p className="mt-2 text-sm text-gray-600">
        {userRole === "ADMIN" 
          ? "System-wide insights and performance metrics" 
          : "Your productivity metrics and client insights"}
      </p>
    </div>
  );
}
