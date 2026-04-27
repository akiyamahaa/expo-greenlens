import { toApiError } from "@/shared/api/api-error";
import { router } from "expo-router";
import { forgotPasswordApi } from "../api/forgot-password";
import { getMeApi } from "../api/get-me";
import { resendOtpApi } from "../api/resend-otp";
import { resetPasswordApi } from "../api/reset-password";
import { signInApi } from "../api/sign-in";
import { signUpApi } from "../api/sign-up";
import { verifyEmailApi } from "../api/verify-email";
import { googleAuthApi } from "../api/google-auth";

import { useAuthStore } from "../store/auth.store";
import type {
  ForgotPasswordPayload,
  GoogleAuthPayload,
  ResendOtpPayload,
  ResetPasswordPayload,
  SignInPayload,
  SignInResponse,
  SignUpPayload,
  VerifyEmailPayload,
} from "../types/auth.types";
import {
  clearPersistedSession,
  readPersistedAccessToken,
  writePersistedAccessToken,
  writePersistedRefreshToken,
} from "./auth-session";
import Toast from "react-native-toast-message";

let hydratePromise: Promise<void> | null = null;

export async function hydrateAuth(): Promise<void> {
  const store = useAuthStore.getState();

  if (store.isHydrated) return;
  if (hydratePromise) return hydratePromise;

  hydratePromise = (async () => {
    try {
      const persistedAccessToken = await readPersistedAccessToken();

      if (!persistedAccessToken) {
        useAuthStore.getState().clearSession();
        return;
      }

      useAuthStore.getState().setAccessToken(persistedAccessToken);

      const me = await getMeApi();

      useAuthStore.getState().setSession({
        accessToken: persistedAccessToken,
        user: me,
      });
    } catch (error) {
      await clearPersistedSession();
      useAuthStore.getState().clearSession();
      // throw toApiError(error); // Usually we don't throw on hydrate failure to allow user to re-login
    } finally {
      useAuthStore.getState().setHydrated(true);
    }
  })().finally(() => {
    hydratePromise = null;
  });

  return hydratePromise;
}

export async function signInAuth(
  payload: SignInPayload,
): Promise<SignInResponse | void> {
  useAuthStore.getState().setLoading(true);

  try {
    const response = await signInApi(payload);

    console.log(response, "response");

    if (response.requiresVerification && response.userId) {
      Toast.show({
        type: 'error',
        text1: 'Lỗi',
        text2: response.message
      });
      router.push({
        pathname: "/(public)/verify-email",
        params: { userId: response.userId, email: payload.email },
      });
      return response;
    }

    // Save tokens securely
    await Promise.all([
      writePersistedAccessToken(response.access_token),
      writePersistedRefreshToken(response.refresh_token),
    ]);

    useAuthStore.getState().setAccessToken(response.access_token);

    const user = await getMeApi();

    useAuthStore.getState().setSession({
      accessToken: response.access_token,
      user,
    });

    useAuthStore.getState().setHydrated(true);
    return response;
  } catch (error) {
    console.log(error);
    await clearPersistedSession();
    useAuthStore.getState().clearSession();
    useAuthStore.getState().setHydrated(true);
    throw toApiError(error);
  } finally {
    useAuthStore.getState().setLoading(false);
  }
}

export async function signUpAuth(payload: SignUpPayload): Promise<string> {
  useAuthStore.getState().setLoading(true);

  try {
    const response = await signUpApi(payload);
    return response.userId;
  } catch (error) {
    throw toApiError(error);
  } finally {
    useAuthStore.getState().setLoading(false);
  }
}

export async function verifyEmailAuth(
  payload: VerifyEmailPayload,
): Promise<void> {
  useAuthStore.getState().setLoading(true);

  try {
    await verifyEmailApi(payload);
  } catch (error) {
    throw toApiError(error);
  } finally {
    useAuthStore.getState().setLoading(false);
  }
}

export async function resendOtpAuth(payload: ResendOtpPayload): Promise<void> {
  useAuthStore.getState().setLoading(true);

  try {
    await resendOtpApi(payload);
  } catch (error) {
    throw toApiError(error);
  } finally {
    useAuthStore.getState().setLoading(false);
  }
}

export async function forgotPasswordAuth(
  payload: ForgotPasswordPayload,
): Promise<void> {
  useAuthStore.getState().setLoading(true);

  try {
    await forgotPasswordApi(payload);
  } catch (error) {
    throw toApiError(error);
  } finally {
    useAuthStore.getState().setLoading(false);
  }
}

export async function resetPasswordAuth(
  payload: ResetPasswordPayload,
): Promise<void> {
  useAuthStore.getState().setLoading(true);

  try {
    await resetPasswordApi(payload);
  } catch (error) {
    throw toApiError(error);
  } finally {
    useAuthStore.getState().setLoading(false);
  }
}

export async function googleAuth(
  payload: GoogleAuthPayload,
): Promise<SignInResponse | void> {
  useAuthStore.getState().setLoading(true);

  try {
    const response = await googleAuthApi(payload);

    await Promise.all([
      writePersistedAccessToken(response.access_token),
      writePersistedRefreshToken(response.refresh_token),
    ]);

    useAuthStore.getState().setAccessToken(response.access_token);
    const user = await getMeApi();

    useAuthStore.getState().setSession({
      accessToken: response.access_token,
      user,
    });

    useAuthStore.getState().setHydrated(true);
    return response;
  } catch (error) {
    await clearPersistedSession();
    useAuthStore.getState().clearSession();
    useAuthStore.getState().setHydrated(true);
    throw toApiError(error);
  } finally {
    useAuthStore.getState().setLoading(false);
  }
}

export async function signOutAuth(): Promise<void> {
  useAuthStore.getState().setLoading(true);

  try {
    await clearPersistedSession();
  } finally {
    useAuthStore.getState().clearSession();
    useAuthStore.getState().setHydrated(true);
    useAuthStore.getState().setLoading(false);
  }
}
