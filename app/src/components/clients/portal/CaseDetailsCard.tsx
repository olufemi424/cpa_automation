"use client";

interface CaseDetailsCardProps {
  entityType: string;
  taxYear: number;
  businessName?: string;
  status: string;
}

export function CaseDetailsCard({
  entityType,
  taxYear,
  businessName,
  status,
}: CaseDetailsCardProps) {
  return (
    <div className="glass-card p-6">
      <h3 className="text-sm font-semibold mb-4 text-gray-700 uppercase tracking-wide">
        Case Details
      </h3>
      <div className="space-y-3">
        <div>
          <p className="text-xs text-gray-500">Entity Type</p>
          <p className="text-sm font-medium text-gray-900">{entityType}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Tax Year</p>
          <p className="text-sm font-medium text-gray-900">{taxYear}</p>
        </div>
        {businessName && (
          <div>
            <p className="text-xs text-gray-500">Business Name</p>
            <p className="text-sm font-medium text-gray-900">{businessName}</p>
          </div>
        )}
        <div>
          <p className="text-xs text-gray-500">Status</p>
          <span className="inline-block mt-1 px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
            {status}
          </span>
        </div>
      </div>
    </div>
  );
}
