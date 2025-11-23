"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "@/lib/auth/auth-client";

interface DashboardHeaderProps {
  userName: string;
  userEmail: string;
  isClient?: boolean;
}

// Breadcrumb generator
function getBreadcrumbs(pathname: string) {
  const paths = pathname.split("/").filter(Boolean);
  const breadcrumbs: { label: string; href: string }[] = [];

  let currentPath = "";
  paths.forEach((path, index) => {
    currentPath += `/${path}`;

    // Format label
    let label = path.charAt(0).toUpperCase() + path.slice(1);
    if (path === "dashboard") label = "Dashboard";
    if (path === "admin") label = "User Management";
    if (path === "clients") label = "Clients";

    // Don't add IDs to breadcrumbs, use "Profile" instead
    if (index === paths.length - 1 && path.match(/^[a-f0-9-]{36}$/i)) {
      label = "Profile";
    }

    breadcrumbs.push({ label, href: currentPath });
  });

  return breadcrumbs;
}

export function DashboardHeader({ userName, userEmail, isClient }: DashboardHeaderProps) {
  const pathname = usePathname();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const breadcrumbs = getBreadcrumbs(pathname);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      await signOut();
      window.location.href = "/auth/login";
    } catch (error) {
      console.error("Sign out error:", error);
      setIsSigningOut(false);
    }
  };

  return (
    <>
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                CPA Command Center
              </h1>
              {isClient && (
                <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700 border border-blue-200">
                  Client Portal
                </span>
              )}
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-sm font-medium text-gray-900">{userName}</span>
                <span className="text-xs text-gray-500">{userEmail}</span>
              </div>
              <button
                onClick={handleSignOut}
                disabled={isSigningOut}
                className="px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-colors bg-gray-100 hover:bg-gray-200 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSigningOut ? "Signing out..." : "Sign Out"}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Breadcrumbs */}
      {breadcrumbs.length > 1 && (
        <div className="bg-white border-b border-gray-100 px-4 sm:px-6 lg:px-8 py-2">
          <nav className="flex items-center space-x-2 text-sm">
            {breadcrumbs.map((crumb, index) => (
              <div key={crumb.href} className="flex items-center">
                {index > 0 && (
                  <svg
                    className="h-4 w-4 text-gray-400 mx-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                )}
                {index === breadcrumbs.length - 1 ? (
                  <span className="text-gray-900 font-medium">{crumb.label}</span>
                ) : (
                  <Link
                    href={crumb.href}
                    className="text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    {crumb.label}
                  </Link>
                )}
              </div>
            ))}
          </nav>
        </div>
      )}
    </>
  );
}
