import env from "@/config/env";
import { refreshTokenApi } from "@/features/auth/api/refresh-token";
import {
  clearPersistedSession,
  readPersistedRefreshToken,
  writePersistedAccessToken,
  writePersistedRefreshToken,
} from "@/features/auth/lib/auth-session";
import { useAuthStore } from "@/features/auth/store/auth.store";
import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import Toast from "react-native-toast-message";
import { ApiError, toApiError } from "./api-error";
import { readAccessToken } from "./auth-token";

const API_URL = env.API_URL;

interface CustomRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
  requiresAuth?: boolean;
}

export const httpClient = axios.create({
  baseURL: API_URL,
  timeout: 15000,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
    "x-tenant-id": env.API_TENANT_ID,
  },
});

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

httpClient.interceptors.request.use(
  (config: CustomRequestConfig) => {
    if (!API_URL) {
      throw new ApiError(
        "EXPO_PUBLIC_API_URL is not configured",
        500,
        "API_URL_MISSING"
      );
    }

    const token = readAccessToken();
    const requiresAuth = config.requiresAuth ?? true;

    if (requiresAuth && token) {
      config.headers.set("Authorization", `Bearer ${token}`);
    }

    return config;
  },
  (error) => Promise.reject(toApiError(error))
);

httpClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as CustomRequestConfig;
    const requiresAuth = originalRequest?.requiresAuth ?? true;

    // Handle 401 Unauthorized errors for authenticated requests
    if (
      error.response?.status === 401 &&
      requiresAuth &&
      !originalRequest._retry
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.set("Authorization", `Bearer ${token}`);
            return httpClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = await readPersistedRefreshToken();
        if (!refreshToken) {
          console.error(
            "[Auth] No refresh token found in storage. Session cannot be refreshed."
          );
          throw new Error("Session expired. Please log in again.");
        }

        console.log("[Auth] Attempting to refresh token...");
        const res = await refreshTokenApi({ refresh_token: refreshToken });
        console.log("[Auth] Token refreshed successfully.");

        // Save new tokens
        await Promise.all([
          writePersistedAccessToken(res.access_token),
          writePersistedRefreshToken(res.refresh_token),
        ]);

        // Update global state
        useAuthStore.getState().setAccessToken(res.access_token);

        // Retry original request
        processQueue(null, res.access_token);
        originalRequest.headers.set(
          "Authorization",
          `Bearer ${res.access_token}`
        );
        return httpClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);

        // Force logout on refresh failure
        await clearPersistedSession();
        useAuthStore.getState().clearSession();

        return Promise.reject(toApiError(refreshError));
      } finally {
        isRefreshing = false;
      }
    }

    const apiError = toApiError(error);

    // Only show toast for non-401 errors or if it's the last attempt
    if (error.response?.status !== 401 || originalRequest._retry) {
      Toast.show({
        type: "error",
        text1: "Lỗi",
        text2: apiError.message,
      });
    }

    return Promise.reject(apiError);
  }
);
