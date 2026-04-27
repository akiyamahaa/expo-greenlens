import { useAuthStore } from "@/features/auth/store/auth.store";
import { getImageUrl } from "@/shared/utils/image-utils";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { ArrowLeft, Camera } from "iconsax-react-nativejs";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useUpdateProfile, useUploadAvatar } from "../lib/profile-hooks";
import Toast from "react-native-toast-message";

export function EditProfileScreen() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);

  const [fullName, setFullName] = useState(user?.fullName || "");
  const [previewImage, setPreviewImage] = useState<string | null>(
    user?.avatar || null,
  );

  const { mutate: updateProfile, isPending: isUpdatingProfile } =
    useUpdateProfile();
  const { mutate: uploadAvatar, isPending: isUploadingAvatar } =
    useUploadAvatar();

  useEffect(() => {
    if (user) {
      setPreviewImage(user.avatar || null);
    }
  }, [user]);

  // Initial load
  useEffect(() => {
    if (user && !fullName) {
      setFullName(user.fullName);
    }
  }, []);

  const onPickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets[0].uri) {
      const selectedUri = result.assets[0].uri;
      setPreviewImage(selectedUri);
      uploadAvatar(selectedUri);
    }
  };

  const onSave = () => {
    if (!fullName.trim()) return;

    const updatePayload: any = {
      fullName,
      age: user?.age || 0,
    };

    // Send avatar if we have a path (server string) or if it's already a URL
    // Basically send anything that isn't a local file uri
    if (previewImage && !previewImage.startsWith("file")) {
      updatePayload.avatar = previewImage;
    }

    updateProfile(updatePayload);
    Toast.show({
      type: 'success',
      text1: 'Thành công',
      text2: "Cập nhật thông tin thành công!"
    });
  };

  const isLoading = isUpdatingProfile || isUploadingAvatar;

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        {/* Header */}
        <View className="flex-row items-center justify-between px-6 py-4 relative">
          <Pressable
            onPress={() => router.back()}
            disabled={isLoading}
            className="h-12 w-12 items-center justify-center rounded-2xl bg-grey-100 z-10"
          >
            <ArrowLeft size={24} color="#161C24" variant="Linear" />
          </Pressable>
          <View className="absolute inset-x-0 bottom-0 top-0 items-center justify-center -z-0">
            <Text className="text-xl font-bold text-grey-900">
              Chỉnh sửa hồ sơ
            </Text>
          </View>
          <Pressable
            onPress={onSave}
            disabled={isLoading}
            className="h-12 px-4 items-center justify-center"
          >
            {isUpdatingProfile ? (
              <ActivityIndicator color="#00A86B" />
            ) : (
              <Text className="text-base font-bold text-primary-main">Lưu</Text>
            )}
          </Pressable>
        </View>

        <ScrollView
          className="flex-1 px-6 py-10"
          showsVerticalScrollIndicator={false}
        >
          <View className="items-center mb-10">
            {/* Avatar with Camera Icon */}
            <Pressable
              onPress={onPickImage}
              className="relative"
              disabled={isLoading}
            >
              <Image
                source={{
                  uri: getImageUrl(previewImage) || "https://i.pravatar.cc/300",
                }}
                className="h-40 w-40 rounded-full border-4 border-grey-50"
              />
              <View className="absolute bottom-2 right-2 h-10 w-10 bg-white rounded-full items-center justify-center border border-grey-100 shadow-sm">
                {isUploadingAvatar ? (
                  <ActivityIndicator size="small" color="#919EAB" />
                ) : (
                  <Camera size={20} color="#919EAB" variant="Linear" />
                )}
              </View>
            </Pressable>
          </View>

          {/* Form */}
          <View className="w-full">
            <Text className="text-base font-bold text-grey-900 mb-3">Tên</Text>
            <TextInput
              value={fullName}
              onChangeText={setFullName}
              className="w-full h-14 px-5 rounded-2xl border border-grey-100 font-medium text-grey-800"
            />

            <Text className="text-base font-bold text-grey-900 mt-6 mb-3">
              Email
            </Text>
            <TextInput
              value={user?.email || ""}
              editable={false}
              className="w-full h-14 px-5 rounded-2xl bg-grey-50 border border-grey-100 font-medium text-grey-400"
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
