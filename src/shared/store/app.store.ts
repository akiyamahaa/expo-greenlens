import { create } from "zustand";
import { persist, createJSONStorage, StateStorage } from "zustand/middleware";
import * as SecureStore from "expo-secure-store";

// Custom storage wrapper for Expo SecureStore to avoid AsyncStorage native module issues
const expoSecureStorage: StateStorage = {
  getItem: (name: string): string | null | Promise<string | null> => {
    return SecureStore.getItemAsync(name);
  },
  setItem: (name: string, value: string): void | Promise<void> => {
    return SecureStore.setItemAsync(name, value);
  },
  removeItem: (name: string): void | Promise<void> => {
    return SecureStore.deleteItemAsync(name);
  },
};

interface AppState {
  hasOnboarded: boolean;
  completeOnboarding: () => void;
  resetOnboarding: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      hasOnboarded: false,
      completeOnboarding: () => set({ hasOnboarded: true }),
      resetOnboarding: () => set({ hasOnboarded: false }),
    }),
    {
      name: "app-storage",
      storage: createJSONStorage(() => expoSecureStorage),
    }
  )
);
