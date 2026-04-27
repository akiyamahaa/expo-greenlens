import { httpClient } from "@/shared/api/http-client";
import { PUBLIC_ROUTES } from "@/shared/api/public-routes";
import type { ForgotPasswordPayload } from "../types/auth.types";

export async function forgotPasswordApi(
  payload: ForgotPasswordPayload
): Promise<void> {
  await httpClient.post(PUBLIC_ROUTES.forgotPassword, payload, {
    requiresAuth: false,
  });
}
