import { httpClient } from "@/shared/api/http-client";
import { PUBLIC_ROUTES } from "@/shared/api/public-routes";
import type { GoogleAuthPayload, SignInResponse } from "../types/auth.types";

export async function googleAuthApi(payload: GoogleAuthPayload): Promise<SignInResponse> {
  const { data } = await httpClient.post<any>(
    PUBLIC_ROUTES.googleAuth,
    payload,
    {
      requiresAuth: false, // Google auth không cần access token
    }
  );

  // Safely handle both { data: ... } and direct responses
  return data.data || data;
}