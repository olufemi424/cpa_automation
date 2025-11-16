import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export interface Message {
  id: string;
  clientId: string;
  senderId: string | null;
  senderType: "USER" | "AI" | "SYSTEM";
  sender?: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
  content: string;
  isRead: boolean | null;
  readAt: Date | null;
  parentMessageId: string | null;
  createdAt: Date;
}

export function useMessages(clientId: string | null) {
  return useQuery({
    queryKey: ["messages", clientId],
    queryFn: async () => {
      if (!clientId) return [];

      const response = await fetch(`/api/messages?clientId=${clientId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch messages");
      }
      const result = await response.json();
      return result.data as Message[];
    },
    enabled: !!clientId,
    staleTime: 10 * 1000, // 10 seconds
    refetchInterval: 30 * 1000, // Poll every 30 seconds for new messages
  });
}

export function useSendMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      clientId,
      content,
      parentMessageId,
    }: {
      clientId: string;
      content: string;
      parentMessageId?: string;
    }) => {
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clientId, content, parentMessageId }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || "Failed to send message");
      }

      const result = await response.json();
      return result.data as Message;
    },
    onSuccess: (data: Message) => {
      // Invalidate and refetch messages for this client
      queryClient.invalidateQueries({ queryKey: ["messages", data.clientId] });
    },
  });
}
