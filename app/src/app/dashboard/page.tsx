"use client";

import { useSession } from "@/lib/auth/auth-client";
import { redirect } from "next/navigation";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { Loading } from "@/components/ui/Loading";

export default function DashboardPage() {
  const { data: session, isPending } = useSession();

  if (isPending) {
    return <Loading message="Loading your dashboard..." />;
  }

  if (!session) {
    redirect("/auth/login");
  }

  return (
    <ErrorBoundary>
      <DashboardLayout user={session.user} />
    </ErrorBoundary>
  );
}
