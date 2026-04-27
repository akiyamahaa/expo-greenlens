import { AppButton } from "@/shared/components/ui/AppButton";
import { Link, router, useLocalSearchParams } from "expo-router";
import { useState, useRef } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  View,
  Pressable,
  TextInput,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { verifyEmailAuth, resendOtpAuth } from "../lib/auth-actions";
import { useAuthStore } from "../store/auth.store";
import Toast from "react-native-toast-message";

export function VerifyEmailScreen() {
  const params = useLocalSearchParams<{ userId?: string; id?: string; email?: string }>();
  const userId = params.userId || params.id;
  const email = params.email;

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputs = useRef<Array<TextInput | null>>([]);
  
  const isLoading = useAuthStore((state) => state.isLoading);

  const onOtpChange = (value: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto focus next input
    if (value && index < 5) {
      inputs.current[index + 1]?.focus();
    }
  };

  const onKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === "Backspace" && !otp[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const onVerify = async () => {
    const otpCode = otp.join("");
    if (otpCode.length < 6) {
      Toast.show({
        type: 'error',
        text1: 'Lỗi',
        text2: "Vui lòng nhập đầy đủ mã xác nhận"
      });
      return;
    }

    try {
      if (!userId) throw new Error("Thiếu ID người dùng");
      await verifyEmailAuth({ userId, otpCode });
      Alert.alert("Thành công", "Email của bạn đã được xác thực", [
        { text: "Đăng nhập ngay", onPress: () => router.replace("/(public)/sign-in") }
      ]);
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: "Xác thực thất bại",
        text2: error.message || "Đã có lỗi xảy ra"
      });
    }
  };

  const onResend = async () => {
    try {
      if (!email) throw new Error("Thiếu email");
      await resendOtpAuth({ email });
      Toast.show({
        type: 'success',
        text1: "Thành công",
        text2: "Mã xác nhận đã được gửi lại"
      });
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: 'Lỗi',
        text2: error.message || "Không thể gửi lại mã"
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
              Kiểm tra email
            </Text>
            <Text className="mt-4 text-center text-base leading-6 text-grey-400">
              Chúng tôi đã gửi cho bạn một mã xác nhận.{"\n"}Vui lòng kiểm tra
              hộp thư đến của bạn tại{"\n"}
              <Text className="text-grey-600 font-medium">{email ?? "email của bạn"}</Text>
            </Text>
          </View>

          <View className="gap-8">
            <View className="flex-row justify-between">
              {[0, 1, 2, 3, 4, 5].map((index) => (
                <View
                  key={index}
                  className="h-14 w-[14%] items-center justify-center rounded-2xl border border-grey-200 bg-white"
                >
                  <TextInput
  ref={(ref) => {
    inputs.current[index] = ref;
  }}
  className="text-xl font-bold text-grey-900 text-center w-full"

                    maxLength={1}
                    keyboardType="number-pad"
                    value={otp[index]}
                    onChangeText={(v) => onOtpChange(v, index)}
                    onKeyPress={(e) => onKeyPress(e, index)}
                  />
                </View>
              ))}
            </View>

            <AppButton label="Xác thực" onPress={onVerify} loading={isLoading} />

            <View className="items-center gap-2">
              <Text className="text-sm text-grey-400">
                Gửi lại mã. Vui lòng kiểm tra email của bạn.
              </Text>
              <Pressable onPress={onResend}>
                <Text className="text-sm font-bold text-grey-900">
                  Gửi lại mã
                </Text>
              </Pressable>
            </View>

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

