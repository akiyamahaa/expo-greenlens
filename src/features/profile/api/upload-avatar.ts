import { httpClient } from "@/shared/api/http-client";
import { PRIVATE_ROUTES } from "@/shared/api/private-routes";
import type { UploadAvatarResponse } from "../types/profile.types";

export async function uploadAvatarApi(file: File): Promise<UploadAvatarResponse> {
  const formData = new FormData();
  formData.append("file", file);

  const { data } = await httpClient.post<UploadAvatarResponse>(
    PRIVATE_ROUTES.uploadAvatar,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return data;
}
