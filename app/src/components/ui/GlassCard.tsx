import { cn } from "@/lib/utils";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  animate?: boolean;
}

/**
 * Glass Card Component
 * A reusable card component with glass-morphism effect
 * Based on the portfolio application style guide
 */
export function GlassCard({ children, className, animate = false }: GlassCardProps) {
  return (
    <div
      className={cn(
        "glass-card",
        animate && "animate-fade-in",
        className
      )}
    >
      {children}
    </div>
  );
}
