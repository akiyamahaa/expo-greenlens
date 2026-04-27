import { httpClient } from "@/shared/api/http-client";
import { PRIVATE_ROUTES } from "@/shared/api/private-routes";
import type { VisionHistoryResponse, VisionResult } from "../types/vision.types";

export async function getVisionHistoryApi(params?: {
  page?: number;
  perPage?: number;
}): Promise<VisionHistoryResponse> {
  const { data } = await httpClient.get<VisionHistoryResponse>(
    PRIVATE_ROUTES.visionHistory,
    {
      params,
    }
  );

  return data;
}

export async function getVisionDetailApi(id: string): Promise<VisionResult> {
  const { data } = await httpClient.get<VisionResult>(
    `${PRIVATE_ROUTES.visionHistory}/${id}`
  );
  return data;
}
