"use client";

import { useSession } from "@/lib/auth/auth-client";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { Loading } from "@/components/ui/Loading";

// Better Auth doesn't automatically infer additionalFields on the client
type UserWithRole = {
  role?: string;
  id: string;
  email: string;
  name: string;
  image?: string | null;
};

export default function SubPagesLayout({ children }: { children: React.ReactNode }) {
  const { data: session, isPending } = useSession();

  if (isPending) {
    return <Loading message="Loading..." />;
  }

  if (!session) {
    redirect("/auth/login");
  }

  // Type assertion: Better Auth client doesn't auto-infer additionalFields
  const userRole = (session.user as UserWithRole).role;
  const isClient = userRole === "CLIENT";

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar userRole={userRole || "CLIENT"} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader
          userName={session.user.name || session.user.email}
          userEmail={session.user.email}
          isClient={isClient}
        />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
