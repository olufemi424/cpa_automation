"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import { cn } from "@/lib/utils"; // Assuming a utils file exists for class merging, otherwise I'll use template literals

interface NavLinkProps {
  href: string;
  children: ReactNode;
  icon?: ReactNode;
  className?: string;
  activeClassName?: string;
  inactiveClassName?: string;
  isCollapsed?: boolean;
  title?: string;
}

export function NavLink({
  href,
  children,
  icon,
  className,
  activeClassName = "bg-blue-50 text-blue-600",
  inactiveClassName = "text-gray-700 hover:bg-gray-100 hover:text-gray-900",
  isCollapsed = false,
  title,
}: NavLinkProps) {
  const pathname = usePathname();

  // Strict match for root dashboard, prefix match for sub-routes
  const isActive =
    href === "/dashboard"
      ? pathname === "/dashboard"
      : pathname === href || pathname.startsWith(href + "/");

  return (
    <Link
      href={href}
      className={cn(
        "flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors",
        isActive ? activeClassName : inactiveClassName,
        className
      )}
      title={title}
    >
      {icon && (
        <span className={isActive ? "text-blue-600" : "text-gray-400"}>
          {icon}
        </span>
      )}
      {!isCollapsed && <span className="ml-3">{children}</span>}
    </Link>
  );
}
