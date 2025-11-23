"use client";

import { Document } from "@/hooks/useClients";

interface DocumentChecklistProps {
  documents: Document[];
  onUploadClick: () => void;
}

const REQUIRED_DOCUMENTS = [
  { type: "W2", label: "W-2 Forms", description: "From all employers" },
  { type: "1099_MISC", label: "1099-MISC", description: "Miscellaneous income" },
  { type: "1099_INT", label: "1099-INT", description: "Interest income" },
  { type: "ID", label: "Photo ID", description: "Driver's license or passport" },
];

export function DocumentChecklist({ documents, onUploadClick }: DocumentChecklistProps) {
  const uploadedDocTypes = new Set(documents.map((doc) => doc.documentType));
  const uploadedCount = uploadedDocTypes.size;
  const totalRequired = REQUIRED_DOCUMENTS.length;

  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>
          Document Checklist
        </h3>
        <span className="text-sm font-medium text-gray-600">
          {uploadedCount} of {totalRequired} uploaded
        </span>
      </div>

      <div className="space-y-3">
        {REQUIRED_DOCUMENTS.map((doc) => {
          const isUploaded = uploadedDocTypes.has(doc.type);
          return (
            <div
              key={doc.type}
              className="flex items-center justify-between p-3 rounded-lg border border-gray-200"
            >
              <div className="flex items-center space-x-3">
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    isUploaded
                      ? "bg-green-600 border-green-600"
                      : "bg-white border-gray-300"
                  }`}
                >
                  {isUploaded && (
                    <svg
                      className="w-3 h-3 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{doc.label}</p>
                  <p className="text-xs text-gray-500">{doc.description}</p>
                </div>
              </div>
              {isUploaded ? (
                <span className="text-xs font-medium text-green-600">✓ Uploaded</span>
              ) : (
                <button
                  onClick={onUploadClick}
                  className="text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors"
                >
                  Upload
                </button>
              )}
            </div>
          );
        })}
      </div>

      <button
        onClick={onUploadClick}
        className="w-full mt-4 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
      >
        Upload Documents
      </button>
    </div>
  );
}
