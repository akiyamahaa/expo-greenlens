export interface EditProfilePayload {
  fullName: string;
  age: number;
}

export interface ChangePasswordPayload {
  oldPassword?: string;
  newPassword?: string;
}

export interface UploadAvatarResponse {
  avatarUrl: string;
}
