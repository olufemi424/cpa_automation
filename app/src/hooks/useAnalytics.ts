import { useQuery } from "@tanstack/react-query";
import type { AnalyticsType, AnalyticsData } from "@/types";

export function useAnalytics<T extends AnalyticsType>(type: T) {
  return useQuery<AnalyticsData<T>>({
    queryKey: ["analytics", type],
    queryFn: async () => {
      const res = await fetch(`/api/analytics?type=${type}`);
      if (!res.ok) {
        throw new Error("Failed to fetch analytics");
      }
      const result = await res.json();
      return result.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
