import { httpClient } from "@/shared/api/http-client";
import { PUBLIC_ROUTES } from "@/shared/api/public-routes";
import type { SignInPayload, SignInResponse } from "../types/auth.types";

export async function signInApi(
  payload: SignInPayload
): Promise<SignInResponse> {
  const { data } = await httpClient.post<any>(
    PUBLIC_ROUTES.signIn,
    payload,
    {
      requiresAuth: false,
    }
  );

  // Safely handle both { data: ... } and direct responses
  return data.data || data;
}
