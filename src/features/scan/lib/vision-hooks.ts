import { useQuery } from "@tanstack/react-query";
import { getVisionHistoryApi, getVisionDetailApi } from "../api/vision-history";

export function useVisionHistory(params?: { page?: number; perPage?: number }) {
  return useQuery({
    queryKey: ["vision", "history", params],
    queryFn: () => getVisionHistoryApi(params),
  });
}

export function useVisionDetail(id: string) {
  return useQuery({
    queryKey: ["vision", id],
    queryFn: () => getVisionDetailApi(id),
    enabled: !!id,
  });
}
