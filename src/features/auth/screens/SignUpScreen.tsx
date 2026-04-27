import { AppButton } from "@/shared/components/ui/AppButton";
import { AppInput } from "@/shared/components/ui/AppInput";
import images from "@/shared/constants/images";
import { Ionicons } from "@expo/vector-icons";
import { Link, router } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { signUpAuth } from "../lib/auth-actions";
import { useAuthStore } from "../store/auth.store";
import Toast from "react-native-toast-message";
import { handleGoogleSignIn } from "../lib/google-signin-helper";

export function SignUpScreen() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [age, setAge] = useState("");

  const isLoading = useAuthStore((state) => state.isLoading);

  const onSignUp = async () => {
    if (!fullName || !email || !password || !age) {
      Toast.show({
        type: 'error',
        text1: 'Lỗi',
        text2: "Vui lòng nhập đầy đủ thông tin"
      });
      return;
    }

    try {
      const userId = await signUpAuth({
        fullName,
        email,
        password,
        age: parseInt(age),
      });

      if (!userId) {
        throw new Error("API đăng ký không trả về User ID");
      }
      Toast.show({
        type: 'success',
        text1: 'Đăng ký thành công 👋',
      });

      router.push({
        pathname: "/(public)/verify-email",
        params: { userId, email },
      });
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: 'Đăng ký thất bại',
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

          {/* Illustration Placeholder */}
          <View className="items-center justify-center py-6">
            <Image source={images.register} className="w-40 h-40" />
          </View>

          <View className="gap-2 self-center pb-8">
            <Text className="text-3xl font-bold text-grey-900">Đăng ký</Text>
          </View>

          <View className="gap-5">
            <AppInput
              placeholder="Tên của bạn?"
              value={fullName}
              onChangeText={setFullName}
            />
            <AppInput
              placeholder="Tuổi"
              keyboardType="number-pad"
              value={age}
              onChangeText={setAge}
            />
            <AppInput
              placeholder="Email"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
            />
            <AppInput
              placeholder="Nhập mật khẩu"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />

            <AppButton
              label="Tạo tài khoản"
              onPress={onSignUp}
              loading={isLoading}
            />

            <View className="items-center py-2">
              <Text className="text-sm text-grey-400">
                Hoặc sử dụng email của bạn
              </Text>
            </View>

            <AppButton
              label="Đăng nhập với Google"
              variant="google"
              onPress={handleGoogleSignIn}
              loading={isLoading}
              icon={<Ionicons name="logo-google" size={20} color="#919EAB" />}
            />
          </View>

          <View className="mt-auto items-center py-8">
            <View className="flex-row items-center gap-1">
              <Text className="text-sm text-grey-500">
                Bạn có một tài khoản?
              </Text>
              <Link href="/(public)/sign-in" asChild>
                <Pressable>
                  <Text className="text-sm font-bold text-grey-900 underline">
                    Đăng nhập
                  </Text>
                </Pressable>
              </Link>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
