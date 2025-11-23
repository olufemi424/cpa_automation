"use client";

import { useSession } from "@/lib/auth/auth-client";
import { redirect } from "next/navigation";
import { Loading } from "@/components/ui/Loading";

// Better Auth doesn't automatically infer additionalFields on the client
type UserWithRole = {
  role?: string;
  id: string;
  email: string;
  name: string;
  image?: string | null;
};

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
