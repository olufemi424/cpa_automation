"use client";

interface CPAContactCardProps {
  cpa: {
    id: string;
    name: string;
    email: string;
  };
  onMessageClick: () => void;
  onScheduleClick: () => void;
}

export function CPAContactCard({ cpa, onMessageClick, onScheduleClick }: CPAContactCardProps) {
  return (
    <div className="glass-card p-6">
      <h3 className="text-sm font-semibold mb-4 text-gray-700 uppercase tracking-wide">
        Your CPA
      </h3>
      <div className="text-center">
        <div className="mx-auto w-20 h-20 rounded-full bg-linear-to-br from-blue-500 to-blue-700 flex items-center justify-center mb-3">
          <span className="text-2xl font-bold text-white">
            {cpa.name.charAt(0).toUpperCase()}
          </span>
        </div>
        <h4 className="text-lg font-semibold text-gray-900">{cpa.name}</h4>
        <p className="text-sm text-gray-600 mb-4">{cpa.email}</p>

        <button
          onClick={onMessageClick}
          className="w-full px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors mb-2"
        >
          Send Message
        </button>
        <button
          onClick={onScheduleClick}
          className="w-full px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
        >
          Schedule Call
        </button>
      </div>
    </div>
  );
}
