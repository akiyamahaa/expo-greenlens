import { AppButton } from "@/shared/components/ui/AppButton";
import { AppInput } from "@/shared/components/ui/AppInput";
import { Link, router } from "expo-router";
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
import { forgotPasswordAuth } from "../lib/auth-actions";
import { useAuthStore } from "../store/auth.store";
import Toast from "react-native-toast-message";

export function ForgotPasswordScreen() {
  const [email, setEmail] = useState("");
  const isLoading = useAuthStore((state) => state.isLoading);

  const onSendRequest = async () => {
    if (!email) {
      Toast.show({
        type: 'error',
        text1: 'Lỗi',
        text2: "Vui lòng nhập email"
      });
      return;
    }

    try {
      await forgotPasswordAuth({ email });
      Alert.alert("Thành công", "Liên kết đặt lại mật khẩu đã được gửi đến email của bạn", [
        { text: "Tiếp tục", onPress: () => router.push({ pathname: "/(public)/reset-password", params: { email } }) }
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
              Quên mật khẩu
            </Text>
            <Text className="mt-4 text-center text-base leading-6 text-grey-400">
              Vui lòng nhập địa chỉ email được liên kết với tài khoản của bạn và
              chúng tôi sẽ gửi cho bạn mã xác xác nhận để đặt lại mật khẩu.
            </Text>
          </View>

          <View className="gap-6">
            <AppInput 
              placeholder="Email" 
              keyboardType="email-address" 
              value={email}
              onChangeText={setEmail}
            />

            <AppButton 
              label="Gửi yêu cầu" 
              onPress={onSendRequest} 
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

