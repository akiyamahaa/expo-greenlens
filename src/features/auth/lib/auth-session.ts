import { storageKeys } from "@/shared/constants/storage";
import * as SecureStore from "expo-secure-store";

export async function readPersistedAccessToken(): Promise<string | null> {
  return SecureStore.getItemAsync(storageKeys.accessToken);
}

export async function writePersistedAccessToken(
  accessToken: string
): Promise<void> {
  await SecureStore.setItemAsync(storageKeys.accessToken, accessToken);
}

export async function readPersistedRefreshToken(): Promise<string | null> {
  return SecureStore.getItemAsync(storageKeys.refreshToken);
}

export async function writePersistedRefreshToken(
  refreshToken: string
): Promise<void> {
  await SecureStore.setItemAsync(storageKeys.refreshToken, refreshToken);
}

export async function clearPersistedSession(): Promise<void> {
  await Promise.allSettled([
    SecureStore.deleteItemAsync(storageKeys.accessToken),
    SecureStore.deleteItemAsync(storageKeys.refreshToken),
  ]);
}
