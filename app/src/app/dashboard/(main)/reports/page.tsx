"use client";

import { authClient } from "@/lib/auth/auth-client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAnalytics } from "@/hooks/useAnalytics";
import { LoadingSpinner } from "@/components/ui/Loading";
import { ErrorState } from "@/components/ui/ErrorState";
import { ReportHeader } from "@/components/dashboard/reports/ReportHeader";
import { ReportTabs } from "@/components/dashboard/reports/ReportTabs";
import { OverviewTab } from "@/components/dashboard/reports/OverviewTab";
import { ProductivityTab } from "@/components/dashboard/reports/ProductivityTab";
import { PipelineTab } from "@/components/dashboard/reports/PipelineTab";
import { DeadlinesTab } from "@/components/dashboard/reports/DeadlinesTab";
import type {
  UserRole,
  OverviewAnalytics,
  ProductivityAnalytics,
  PipelineAnalytics,
  DeadlineAnalytics
} from "@/types";

export default function ReportsPage() {
  const { data: session } = authClient.useSession();
  const router = useRouter();
  const userRole: UserRole = ((session?.user as { role?: UserRole })?.role) || "CLIENT";
  const [activeTab, setActiveTab] = useState<"overview" | "productivity" | "pipeline" | "deadlines">("overview");

  const { data: analyticsData, isLoading, error } = useAnalytics(activeTab);

  // Redirect non-admin/non-CPA users
  useEffect(() => {
    if (userRole === "CLIENT") {
      router.push("/dashboard");
    }
  }, [userRole, router]);

  if (userRole === "CLIENT") {
    return null;
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ReportHeader userRole={userRole} />
        
        <ReportTabs activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Content */}
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <LoadingSpinner />
          </div>
        ) : error ? (
          <ErrorState message="Failed to load analytics data" />
        ) : analyticsData ? (
          <div className="space-y-6">
            {activeTab === "overview" && <OverviewTab data={analyticsData as OverviewAnalytics} />}
            {activeTab === "productivity" && <ProductivityTab data={analyticsData as ProductivityAnalytics} userRole={userRole} />}
            {activeTab === "pipeline" && <PipelineTab data={analyticsData as PipelineAnalytics} />}
            {activeTab === "deadlines" && <DeadlinesTab data={analyticsData as DeadlineAnalytics} />}
          </div>
        ) : null}
      </div>
    </div>
  );
}
