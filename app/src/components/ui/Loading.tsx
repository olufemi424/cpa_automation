export function Loading({ message = "Loading..." }: { message?: string }) {
  return (
    <div className="loading min-h-screen flex items-center justify-center" style={{ background: 'var(--background)' }}>
      <div className="loading__content text-center animate-fade-in">
        <div
          className="loading__spinner inline-block animate-spin rounded-full h-12 w-12 mb-4"
          style={{
            border: '3px solid rgba(0, 0, 0, 0.1)',
            borderTopColor: 'rgba(0, 0, 0, 0.6)'
          }}
        ></div>
        <p className="loading__message text-sm sm:text-base" style={{ color: 'var(--text-secondary)' }}>{message}</p>
      </div>
    </div>
  );
}

export function LoadingSpinner({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  };

  const borderWidths = {
    sm: "2px",
    md: "3px",
    lg: "4px",
  };

  return (
    <div
      className={`loading-spinner inline-block animate-spin rounded-full ${sizeClasses[size]}`}
      style={{
        border: `${borderWidths[size]} solid rgba(0, 0, 0, 0.1)`,
        borderTopColor: 'rgba(0, 0, 0, 0.6)'
      }}
    ></div>
  );
}
