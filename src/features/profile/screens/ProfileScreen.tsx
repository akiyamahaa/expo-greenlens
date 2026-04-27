import env from "@/config/env";
import { signOutAuth } from "@/features/auth/lib/auth-actions";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { useRouter } from "expo-router";
import {
  CloseCircle,
  DocumentText,
  Edit2,
  Heart,
  InfoCircle,
  LogoutCurve,
  MessageQuestion,
  User as UserIcon,
} from "iconsax-react-nativejs";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Image,
  Modal,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const MenuItem = ({
  icon: Icon,
  label,
  onPress,
  isLogout = false,
}: {
  icon: any;
  label: string;
  onPress: () => void;
  isLogout?: boolean;
}) => (
  <Pressable onPress={onPress} className="flex-row items-center py-4 px-2">
    <View className="h-10 w-10 items-center justify-center rounded-xl bg-grey-50 mr-4">
      <Icon
        size={22}
        color={isLogout ? "#FF4842" : "#454F5B"}
        variant="Linear"
      />
    </View>
    <Text
      className={`text-base font-medium flex-1 ${isLogout ? "text-[#FF4842]" : "text-grey-800"}`}
    >
      {label}
    </Text>
  </Pressable>
);

const CLOUDINARY_BASE_URL = env.APP_CLOUDINARY;

const getImageUrl = (path: string | null | undefined) => {
  if (!path) return null;
  if (path.startsWith("http")) return path;
  if (path.startsWith("file")) return path;
  return `${CLOUDINARY_BASE_URL}${path}`;
};

export function ProfileScreen() {
  const router = useRouter();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const user = useAuthStore((state) => state.user);
  const isLoading = useAuthStore((state) => state.isLoading);

  const onLogout = async () => {
    try {
      await signOutAuth();
      setShowLogoutModal(false);
    } catch (error) {
      setShowLogoutModal(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      <View className="flex-row items-center justify-between px-6 py-4">
        <Text className="text-3xl font-bold text-grey-900">Cá nhân</Text>
        <Pressable
          onPress={() => router.push("/(protected)/favorites")}
          className="h-12 w-12 items-center justify-center rounded-full bg-grey-200 border border-grey-100"
        >
          <Heart size={24} color="#161C24" variant="Linear" />
        </Pressable>
      </View>

      <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
        {/* User Card */}
        <View className="bg-grey-200 rounded-[32px] p-6 flex-row items-center mb-10 border border-grey-100">
          <View className="h-20 w-20 rounded-full bg-grey-300 overflow-hidden items-center justify-center">
            {user?.avatar ? (
              <Image
                source={{ uri: getImageUrl(user.avatar) || "" }}
                className="w-full h-full"
              />
            ) : (
              <View className="bg-grey-50 p-4 rounded-full">
                <UserIcon size={32} color="#919EAB" variant="Linear" />
              </View>
            )}
          </View>
          <View className="ml-5 flex-1">
            <Text className="text-xl font-bold text-grey-900">
              {user?.fullName || "Người dùng"}
            </Text>
            <Text className="text-sm text-grey-500 mb-3">{user?.email}</Text>
            <Pressable
              onPress={() => router.push("/(protected)/edit-profile")}
              className="flex-row items-center bg-white px-4 py-2 rounded-xl self-start border border-grey-100 shadow-sm"
            >
              <Edit2
                size={16}
                color="#454F5B"
                variant="Linear"
                className="mr-2"
              />
              <Text className="text-xs font-bold text-grey-700 ml-1">
                Sửa hồ sơ
              </Text>
            </Pressable>
          </View>
        </View>

        <Text className="text-xl font-bold text-grey-900 mb-4">
          Cài đặt & Hỗ trợ
        </Text>

        <View className="mb-10">
          <MenuItem
            icon={InfoCircle}
            label="Giới thiệu"
            onPress={() => router.push("/(protected)/about")}
          />
          <MenuItem
            icon={MessageQuestion}
            label="Liên hệ hỗ trợ"
            onPress={() => router.push("/(protected)/contact")}
          />
          <MenuItem
            icon={DocumentText}
            label="Điều khoản & Điều kiện"
            onPress={() => router.push("/(protected)/terms")}
          />
          <MenuItem
            icon={LogoutCurve}
            label="Đăng xuất"
            isLogout
            onPress={() => setShowLogoutModal(true)}
          />
        </View>
      </ScrollView>

      {/* Logout Modal */}
      <Modal visible={showLogoutModal} transparent animationType="fade">
        <View className="flex-1 bg-black/50 items-center justify-center px-6">
          <View className="bg-white w-full rounded-[40px] p-8 pt-10 relative">
            <Pressable
              onPress={() => setShowLogoutModal(false)}
              className="absolute top-6 right-6"
            >
              <CloseCircle size={28} color="#919EAB" variant="Linear" />
            </Pressable>

            <Text className="text-2xl font-bold text-grey-900 text-center mb-3">
              Đăng xuất?
            </Text>
            <Text className="text-base text-grey-500 text-center mb-8">
              Bạn có chắc chắn muốn đăng xuất?
            </Text>

            <View className="flex-row gap-4">
              <Pressable
                onPress={() => setShowLogoutModal(false)}
                className="flex-1 h-14 items-center justify-center rounded-2xl border border-grey-200"
              >
                <Text className="text-base font-bold text-grey-600">
                  Hủy bỏ
                </Text>
              </Pressable>
              <Pressable
                onPress={onLogout}
                disabled={isLoading}
                className="flex-1 h-14 items-center justify-center rounded-2xl bg-primary-main"
              >
                {isLoading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text className="text-base font-bold text-white">
                    Xác nhận
                  </Text>
                )}
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
