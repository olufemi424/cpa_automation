"use client";

import { useClients } from "@/hooks/useClients";
import { LoadingSpinner } from "@/components/ui/Loading";
import { ErrorState } from "@/components/ui/ErrorState";
import { ProgressTimeline } from "./portal/ProgressTimeline";
import { DocumentChecklist } from "./portal/DocumentChecklist";
import { TaskList } from "./portal/TaskList";
import { CPAContactCard } from "./portal/CPAContactCard";
import { CaseDetailsCard } from "./portal/CaseDetailsCard";
import { NextStepsCard } from "./portal/NextStepsCard";

interface ClientPortalDashboardProps {
  userName: string;
}

const REQUIRED_DOCUMENTS_COUNT = 4;

export function ClientPortalDashboard({ userName }: ClientPortalDashboardProps) {
  // For CLIENT role, the API automatically filters to return only their own record
  const { data: clients, isLoading, error } = useClients();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return <ErrorState message="Failed to load your information" />;
  }

  // Client users should only see their own record (first item in array)
  const clientData = clients?.[0];

  if (!clientData) {
    return (
      <div className="glass-card p-6">
        <p className="text-gray-600">No client record found. Please contact your CPA.</p>
      </div>
    );
  }

  const uploadedDocTypes = new Set(clientData.documents?.map((doc) => doc.documentType) || []);
  const uploadedCount = uploadedDocTypes.size;
  const documentsRemaining = REQUIRED_DOCUMENTS_COUNT - uploadedCount;

  const handleUploadClick = () => {
    // TODO: Implement document upload modal/page
    console.log("Upload clicked");
  };

  const handleMessageClick = () => {
    // TODO: Open messaging interface
    console.log("Message clicked");
  };

  const handleScheduleClick = () => {
    // TODO: Open scheduling interface
    console.log("Schedule clicked");
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="glass-card p-6">
        <h2 className="text-2xl font-bold mb-2" style={{ color: "var(--text-primary)" }}>
          Welcome back, {userName}!
        </h2>
        <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
          Track your tax preparation progress and stay in touch with your CPA
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Progress & Documents */}
        <div className="lg:col-span-2 space-y-6">
          <ProgressTimeline
            currentStatus={clientData.status}
            progressPercentage={clientData.progressPercentage}
          />

          <DocumentChecklist
            documents={clientData.documents || []}
            onUploadClick={handleUploadClick}
          />

          <TaskList tasks={clientData.tasks || []} />
        </div>

        {/* Right Column - CPA Contact & Next Steps */}
        <div className="space-y-6">
          {clientData.assignedTo && (
            <CPAContactCard
              cpa={clientData.assignedTo}
              onMessageClick={handleMessageClick}
              onScheduleClick={handleScheduleClick}
            />
          )}

          <CaseDetailsCard
            entityType={clientData.entityType}
            taxYear={clientData.taxYear}
            businessName={clientData.businessName}
            status={clientData.status}
          />

          <NextStepsCard
            documentsRemaining={documentsRemaining}
            tasksCount={clientData.tasks?.length || 0}
          />
        </div>
      </div>
    </div>
  );
}
