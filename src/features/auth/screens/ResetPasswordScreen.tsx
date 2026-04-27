import { AppButton } from "@/shared/components/ui/AppButton";
import { AppInput } from "@/shared/components/ui/AppInput";
import { Link, router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  View,
  Pressable,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { resetPasswordAuth } from "../lib/auth-actions";
import { useAuthStore } from "../store/auth.store";
import Toast from "react-native-toast-message";

export function ResetPasswordScreen() {
  const { email, userId: paramUserId } = useLocalSearchParams<{ email: string; userId: string }>();
  const [otpCode, setOtpCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const isLoading = useAuthStore((state) => state.isLoading);

  const onReset = async () => {
    if (!otpCode || !password || !confirmPassword) {
      Toast.show({
        type: 'error',
        text1: 'Lỗi',
        text2: "Vui lòng nhập đầy đủ thông tin"
      });
      return;
    }

    if (password !== confirmPassword) {
      Toast.show({
        type: 'error',
        text1: 'Lỗi',
        text2: "Vui lòng nhập đầy đủ thông tin"
      });
      return;
    }

    try {
      // NOTE: Swagger requires userId. If it's not provided by forgot-password, 
      // we might need a different way to identify the user here.
      await resetPasswordAuth({ 
        userId: paramUserId || "", // Fallback if needed
        otpCode, 
        password, 
        confirmPassword 
      });
      Alert.alert("Thành công", "Mật khẩu của bạn đã được đặt lại", [
        { text: "Đăng nhập", onPress: () => router.replace("/(public)/sign-in") }
      ]);
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: 'Lỗi',
        text2: error.message || "Đã có lỗi xảy ra"
      });
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top", "bottom"]}>
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          className="px-6"
        >
          {/* Back Button */}
          <View className="mt-4">
            <Pressable
              onPress={() => router.back()}
              className="h-10 w-10 items-center justify-center rounded-full bg-grey-100"
            >
              <Ionicons name="chevron-back" size={24} color="#212B36" />
            </Pressable>
          </View>

          <View className="items-center py-12">
            <Text className="text-3xl font-bold text-grey-900">
              Đặt lại mật khẩu
            </Text>
            <Text className="mt-4 text-center text-base leading-6 text-grey-400">
              Nhập mã xác nhận đã gửi đến {email ?? "email"} và mật khẩu mới của bạn
            </Text>
          </View>

          <View className="gap-6">
            <AppInput 
              placeholder="Mã xác nhận (OTP)" 
              value={otpCode}
              onChangeText={setOtpCode}
            />
            <AppInput 
              placeholder="Nhập mật khẩu mới" 
              secureTextEntry 
              value={password}
              onChangeText={setPassword}
            />
            <AppInput 
              placeholder="Nhập lại mật khẩu mới" 
              secureTextEntry 
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />

            <AppButton 
              label="Đặt lại mật khẩu" 
              onPress={onReset} 
              loading={isLoading}
            />

            <Link href="/(public)/sign-in" asChild>
              <Pressable className="flex-row items-center justify-center gap-1 py-4">
                <Ionicons name="chevron-back" size={18} color="#212B36" />
                <Text className="text-sm font-semibold text-grey-900">
                  Quay lại đăng nhập
                </Text>
              </Pressable>
            </Link>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

