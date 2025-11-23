"use client";

import { useSession } from "@/lib/auth/auth-client";
import { redirect } from "next/navigation";
import { Loading } from "@/components/ui/Loading";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { data: session, isPending } = useSession();

  if (isPending) {
    return <Loading message="Loading..." />;
  }

  if (!session) {
    redirect("/auth/login");
  }

  // Just handle auth and pass through children
  // Each route will have its own layout structure
  return <>{children}</>;
}
