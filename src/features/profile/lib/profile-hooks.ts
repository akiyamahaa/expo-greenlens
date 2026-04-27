import { useAuthStore } from "@/features/auth/store/auth.store";
import { toApiError } from "@/shared/api/api-error";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Alert } from "react-native";
import {
  updateUserApi,
  UpdateUserPayload,
  uploadAvatarApi,
} from "../api/profile-api";
import Toast from "react-native-toast-message";

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  const setSession = useAuthStore((state) => state.setSession);
  const user = useAuthStore((state) => state.user);
  const accessToken = useAuthStore((state) => state.accessToken);

  return useMutation({
    mutationFn: (payload: UpdateUserPayload) => updateUserApi(payload),
    onSuccess: (updatedUser) => {
      const currentUser = useAuthStore.getState().user;
      const accessToken = useAuthStore.getState().accessToken;

      // Merge updated data safely, ensuring avatar is preserved if not in response
      if (accessToken && currentUser) {
        console.log("[Profile] Current User before merge:", currentUser);
        console.log("[Profile] API response (updatedUser):", updatedUser);

        const updatedAvatar = (updatedUser as any)?.avatar;
        const currentAvatar = (currentUser as any)?.avatar;

        const mergedUser: any = {
          ...currentUser,
          ...updatedUser,
          // Fallback to current avatar if updated one is null, undefined or empty string
          avatar:
            updatedAvatar && updatedAvatar !== ""
              ? updatedAvatar
              : currentAvatar,
        };

        console.log("[Profile] Merged User to save in session:", mergedUser);

        setSession({
          accessToken,
          user: mergedUser,
        });

        // Refresh user queries
        queryClient.setQueryData(["auth", "me"], mergedUser);
      }
    },
    onError: (error) => {
      const apiError = toApiError(error);
      Toast.show({
        type: 'error',
        text1: 'Lỗi',
        text2: apiError.message
      });
    },
  });
}

export function useUploadAvatar() {
  const setSession = useAuthStore((state) => state.setSession);
  const user = useAuthStore((state) => state.user);
  const accessToken = useAuthStore((state) => state.accessToken);

  return useMutation({
    mutationFn: (fileUri: string) => uploadAvatarApi(fileUri),
    onSuccess: (res) => {
      console.log("[Profile] Avatar upload successful. Response:", res);
      // Update store with new avatar link
      if (user && accessToken) {
        const newUser = { ...user, avatar: res.avatar };
        Toast.show({
          type: 'success',
          text1: 'Thành công',
          text2: "Cập nhật avatar thành công!"
        });
        setSession({
          accessToken,
          user: newUser,
        });
      }
    },
    onError: (error) => {
      const apiError = toApiError(error);
      Toast.show({
        type: 'error',
        text1: 'Lỗi',
        text2: apiError.message
      });
    },
  });
}
