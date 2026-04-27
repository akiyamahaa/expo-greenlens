import { httpClient } from "@/shared/api/http-client";
import { PRIVATE_ROUTES } from "@/shared/api/private-routes";
import { User } from "@/features/auth/types/auth.types";

export interface UpdateUserPayload {
  fullName: string;
  age: number;
  avatar?: string | null;
}

export async function updateUserApi(payload: UpdateUserPayload): Promise<User> {
  const { data } = await httpClient.patch<any>(PRIVATE_ROUTES.editUser, payload);
  return data.data || data;
}

export async function uploadAvatarApi(fileUri: string): Promise<{ avatar: string }> {
  const formData = new FormData();
  
  const filename = fileUri.split('/').pop() || 'avatar.jpg';
  const match = /\.(\w+)$/.exec(filename);
  const type = match ? `image/${match[1]}` : `image/jpeg`;

  // @ts-ignore: FormData in RN is slightly different
  formData.append('file', {
    uri: fileUri,
    name: filename,
    type,
  });

  const { data } = await httpClient.post<any>(PRIVATE_ROUTES.uploadAvatar, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return data.data || data;
}
