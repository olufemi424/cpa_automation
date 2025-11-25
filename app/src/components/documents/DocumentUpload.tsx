"use client";

import { useState, useRef, DragEvent, ChangeEvent } from "react";
import { LoadingSpinner } from "@/components/ui/Loading";
import { useDocuments } from "@/hooks/useDocuments";

interface UploadingDocument {
  tempId: string;
  fileName: string;
  fileSize: number;
  status: "uploading" | "success" | "error";
  errorMessage?: string;
}

interface DocumentUploadProps {
  clientId: string;
  onUploadComplete?: () => void;
  allowCategorySelection?: boolean;
}

const ALLOWED_FILE_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/jpg",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/msword",
];

const ALLOWED_EXTENSIONS = [".pdf", ".jpg", ".jpeg", ".png", ".doc", ".docx"];

export function DocumentUpload({ clientId, onUploadComplete, allowCategorySelection = false }: DocumentUploadProps) {
  const { data: documents = [] } = useDocuments(clientId);
  const [uploadingFiles, setUploadingFiles] = useState<UploadingDocument[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedCategory, setSelectedCategory] = useState<string>("AUTO");

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      handleFiles(files);
    }
  };

  const validateFile = (file: File): { valid: boolean; error?: string } => {
    // Check file type
    const fileExtension = `.${file.name.split(".").pop()?.toLowerCase()}`;
    if (!ALLOWED_FILE_TYPES.includes(file.type) && !ALLOWED_EXTENSIONS.includes(fileExtension)) {
      return {
        valid: false,
        error: "File type not supported. Please upload PDF, JPG, PNG, or DOC files.",
      };
    }

    // Check file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return {
        valid: false,
        error: "File size exceeds 10MB limit.",
      };
    }

    return { valid: true };
  };

  const handleFiles = async (files: File[]) => {
    for (const file of files) {
      const validation = validateFile(file);

      if (!validation.valid) {
        alert(validation.error);
        continue;
      }

      // Create temporary uploading entry
      const tempId = `temp-${Date.now()}-${Math.random()}`;
      const uploadingDoc: UploadingDocument = {
        tempId,
        fileName: file.name,
        fileSize: file.size,
        status: "uploading",
      };

      setUploadingFiles((prev) => [...prev, uploadingDoc]);

      // Upload file
      await uploadFile(file, tempId);
    }
  };

  const uploadFile = async (file: File, tempId: string) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("clientId", clientId);

    // Only append documentType if it's not AUTO
    if (selectedCategory && selectedCategory !== "AUTO") {
      formData.append("documentType", selectedCategory);
    }

    try {
      const response = await fetch("/api/documents", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Upload failed");
      }

      // Update status to success
      setUploadingFiles((prev) =>
        prev.map((doc) =>
          doc.tempId === tempId ? { ...doc, status: "success" } : doc
        )
      );

      // Remove from uploading list after a short delay
      setTimeout(() => {
        setUploadingFiles((prev) => prev.filter((doc) => doc.tempId !== tempId));
      }, 2000);

      onUploadComplete?.();
    } catch (error) {
      console.error("Upload error:", error);
      const errorMessage = error instanceof Error ? error.message : "Upload failed";

      // Update status to error
      setUploadingFiles((prev) =>
        prev.map((doc) =>
          doc.tempId === tempId ? { ...doc, status: "error", errorMessage } : doc
        )
      );
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
  };

  const getDocumentTypeColor = (type?: string) => {
    const colors: Record<string, string> = {
      W2: "bg-blue-100 text-blue-700",
      "1099": "bg-green-100 text-green-700",
      "1040": "bg-purple-100 text-purple-700",
      SCHEDULE_C: "bg-orange-100 text-orange-700",
      RECEIPT: "bg-yellow-100 text-yellow-700",
      OTHER: "bg-gray-100 text-gray-700",
    };
    return colors[type || "OTHER"] || colors.OTHER;
  };

  const DOCUMENT_CATEGORIES = [
    { value: "AUTO", label: "Auto-detect Category" },
    { value: "W2", label: "W-2 Wage Statement" },
    { value: "1099_MISC", label: "1099-MISC" },
    { value: "1099_NEC", label: "1099-NEC" },
    { value: "1099_INT", label: "1099-INT" },
    { value: "1099_DIV", label: "1099-DIV" },
    { value: "SCHEDULE_C", label: "Business Expense (Sch C)" },
    { value: "RECEIPT", label: "Receipt" },
    { value: "INVOICE", label: "Invoice" },
    { value: "STATEMENT", label: "Bank Statement" },
    { value: "ID", label: "ID / Passport" },
    { value: "OTHER", label: "Other Document" },
  ];

  return (
    <div className="space-y-4">
      {/* Category Selection */}
      {allowCategorySelection && (
        <div className="flex items-center space-x-3 mb-2">
          <label htmlFor="doc-category" className="text-sm font-medium text-gray-700">
            Document Type:
          </label>
          <select
            id="doc-category"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="block w-full max-w-xs rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
          >
            {DOCUMENT_CATEGORIES.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>
      )}
      {/* Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          isDragging
            ? "border-blue-500 bg-blue-50"
            : "border-gray-300 hover:border-gray-400 bg-white"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={ALLOWED_EXTENSIONS.join(",")}
          onChange={handleFileSelect}
          className="hidden"
        />

        <svg
          className="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
          />
        </svg>

        <p className="mt-4 text-sm text-gray-600">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            Click to upload
          </button>{" "}
          or drag and drop
        </p>
        <p className="mt-2 text-xs text-gray-500">
          PDF, JPG, PNG, or DOC files up to 10MB
        </p>
      </div>

      {/* Uploading Files Status */}
      {uploadingFiles.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <h3 className="text-sm font-medium text-gray-900 mb-3">Uploading...</h3>
          <div className="space-y-3">
            {uploadingFiles.map((doc) => (
              <div
                key={doc.tempId}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-3 flex-1">
                  {/* File Icon */}
                  <div className="shrink-0">
                    {doc.status === "uploading" ? (
                      <LoadingSpinner />
                    ) : doc.status === "success" ? (
                      <svg
                        className="h-8 w-8 text-green-600"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="h-8 w-8 text-red-600"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </div>

                  {/* File Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {doc.fileName}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatFileSize(doc.fileSize)}
                      {doc.status === "uploading" && ` • Uploading...`}
                      {doc.status === "success" && ` • Uploaded successfully`}
                      {doc.status === "error" && ` • ${doc.errorMessage || "Upload failed"}`}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Uploaded Documents List */}
      {documents.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <h3 className="text-sm font-medium text-gray-900 mb-3">
            Documents ({documents.length})
          </h3>
          <div className="space-y-3">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-3 flex-1">
                  {/* Document Icon */}
                  <div className="shrink-0">
                    <svg
                      className="h-8 w-8 text-blue-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>

                  {/* File Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {doc.fileName}
                    </p>
                    <p className="text-xs text-gray-500">
                      {doc.fileSize ? formatFileSize(doc.fileSize) : "Unknown size"}
                      {doc.uploadedAt && ` • ${new Date(doc.uploadedAt).toLocaleDateString()}`}
                    </p>
                  </div>

                  {/* Document Type Badge */}
                  <div className="flex items-center space-x-2">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${getDocumentTypeColor(doc.documentType)}`}
                    >
                      {doc.documentType.replace(/_/g, " ")}
                    </span>
                    {doc.isVerified && (
                      <svg
                        className="h-5 w-5 text-green-600"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
