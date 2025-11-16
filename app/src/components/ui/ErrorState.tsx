import { GlassCard } from "./GlassCard";

interface ErrorStateProps {
  message?: string;
  retry?: () => void;
}

export function ErrorState({ message, retry }: ErrorStateProps) {
  return (
    <div className="error-state min-h-[400px] flex items-center justify-center p-4">
      <GlassCard className="error-state__card text-center max-w-md animate-fade-in">
        <svg
          className="error-state__icon mx-auto h-12 w-12 mb-4"
          style={{ color: 'rgba(0, 0, 0, 0.6)' }}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
        <h3 className="error-state__title text-lg font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
          Something went wrong
        </h3>
        <p className="error-state__message text-sm sm:text-base mb-4" style={{ color: 'var(--text-secondary)' }}>
          {message || "An error occurred while loading data."}
        </p>
        {retry && (
          <button
            onClick={retry}
            className="error-state__retry-button px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:scale-105"
            style={{
              background: 'rgba(0, 0, 0, 0.05)',
              color: 'var(--text-primary)',
              border: '1px solid rgba(0, 0, 0, 0.15)'
            }}
          >
            Try Again
          </button>
        )}
      </GlassCard>
    </div>
  );
}
