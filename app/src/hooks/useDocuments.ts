import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export interface Document {
  id: string;
  clientId: string;
  fileName: string;
  fileSize: number | null;
  fileType: string | null;
  documentType: string;
  isVerified: boolean | null;
  uploadedAt: Date;
  uploadedBy: {
    id: string;
    name: string;
    email: string;
  } | null;
}

export interface UploadDocumentData {
  file: File;
  clientId: string;
}

/**
 * Fetch all documents for a client
 */
export function useDocuments(clientId: string | null) {
  return useQuery({
    queryKey: ["documents", clientId],
    queryFn: async () => {
      if (!clientId) return [];

      const res = await fetch(`/api/documents?clientId=${clientId}`);
      if (!res.ok) {
        throw new Error("Failed to fetch documents");
      }

      const result = await res.json();
      return (result.data || result) as Document[];
    },
    enabled: !!clientId,
    staleTime: 30 * 1000, // 30 seconds
  });
}

/**
 * Upload a document for a client
 */
export function useUploadDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ file, clientId }: UploadDocumentData) => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("clientId", clientId);

      const res = await fetch("/api/documents", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to upload document");
      }

      const result = await res.json();
      return result.data || result;
    },
    onSuccess: (data, variables) => {
      // Invalidate documents query for this client
      queryClient.invalidateQueries({ queryKey: ["documents", variables.clientId] });
    },
  });
}
