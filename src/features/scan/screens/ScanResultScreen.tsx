import { useLocalSearchParams, useRouter } from "expo-router";
import { ArrowLeft } from "iconsax-react-nativejs";
import React from "react";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import RenderHTML from "react-native-render-html";
import { SafeAreaView } from "react-native-safe-area-context";
import { useVisionDetail } from "../lib/vision-hooks";

const { width: contentWidth } = Dimensions.get("window");

const Section = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <View className="mb-8">
    <Text className="text-lg font-bold text-grey-900 mb-4">{title}</Text>
    {children}
  </View>
);

const BulletPoint = ({
  text,
  children,
}: {
  text?: string;
  children?: React.ReactNode;
}) => (
  <View className="flex-row mb-3">
    <Text className="text-grey-400 mr-2">•</Text>
    <View className="flex-1">
      {text ? (
        <Text className="text-base text-grey-600 leading-6">{text}</Text>
      ) : (
        children
      )}
    </View>
  </View>
);

export function ScanResultScreen() {
  const router = useRouter();
  const { id, result: passedResult } = useLocalSearchParams<{
    id: string;
    result?: string;
  }>();

  // If we came directly from the scanner, we might already have the data
  const initialData = passedResult ? JSON.parse(passedResult) : null;

  const {
    data: visionData,
    isLoading,
    error,
  } = useVisionDetail(initialData ? "" : id || "");

  const displayData = initialData || visionData;

  console.log(visionData, id, "----id")

  if (isLoading && !initialData) {
    return (
      <View className="flex-1 bg-white items-center justify-center">
        <ActivityIndicator size="large" color="#159947" />
        <Text className="mt-4 text-grey-600">Đang tải kết quả...</Text>
      </View>
    );
  }

  if ((error || !displayData) && !initialData) {
    return (
      <View className="flex-1 bg-white items-center justify-center px-6">
        <Text className="text-lg text-grey-800 text-center mb-6">
          {error?.message || "Không tìm thấy kết quả phân tích."}
        </Text>
        <Pressable
          onPress={() => router.back()}
          className="bg-primary-main px-8 py-3 rounded-xl"
        >
          <Text className="text-white font-bold">Quay lại</Text>
        </Pressable>
      </View>
    );
  }

  // Robust field extraction to handle different API response structures
  // 1. Nested in 'data' (common pattern)
  // 2. Contains 'article' and 'vision' (new scan result)
  // 3. Flat article object (library detail or some history items)
  const actualData = (displayData as any)?.data || displayData;
  
  const article = actualData?.article;
  const vision = actualData?.vision;
  const oldResult = actualData?.result;

  // Title: article.title -> root.title -> vision.label -> default
  const displayTitle = article?.title || actualData?.title || oldResult?.label || "Kết quả phân tích";
  
  // Image: article.image -> root.image -> vision.imageUrl -> root.imageUrl
  const displayImage = article?.image || actualData?.image || vision?.imageUrl || actualData?.imageUrl;
  
  // Content: article.content -> root.content
  const displayContent = article?.content || actualData?.content;
  
  // Confidence score
  const confidence = oldResult?.confidence || 0.95; 

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      {/* Header */}
      <View className="flex-row items-center px-6 py-4">
        <Pressable
          onPress={() => router.back()}
          className="h-12 w-12 items-center justify-center rounded-2xl bg-grey-100 z-10"
        >
          <ArrowLeft size={24} color="#161C24" variant="Linear" />
        </Pressable>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-6 pb-20">
          {displayImage && (
            <Image
              source={{ uri: displayImage }}
              className="w-full h-72 rounded-[32px] mb-6"
              resizeMode="cover"
            />
          )}

          <Text className="text-2xl font-bold text-primary-500 mb-6">
            {displayTitle}
          </Text>

          {!displayContent && oldResult && (
            <View className="mb-8 p-6 bg-grey-50 rounded-[32px] border border-grey-100">
              <View className="flex-row mb-2">
                <Text className="text-grey-900 font-bold">Độ tin cậy: </Text>
                <Text className="text-grey-600">
                  {Math.round(confidence * 100)}%
                </Text>
              </View>
              <View className="flex-row mb-2">
                <Text className="text-grey-900 font-bold">Chất liệu: </Text>
                <Text className="text-grey-600">
                  {oldResult.material || "Không xác định"}
                </Text>
              </View>
            </View>
          )}

          {displayContent ? (
            <RenderHTML
              contentWidth={contentWidth - 48}
              source={{ html: displayContent }}
              baseStyle={{ fontSize: 16, color: "#454F5B" }}
              tagsStyles={{
                p: { marginBottom: 12, lineHeight: 24 },
                h3: {
                  fontSize: 18,
                  fontWeight: "bold",
                  color: "#212B36",
                  marginTop: 20,
                  marginBottom: 10,
                },
                ul: { marginBottom: 12, paddingLeft: 10 },
                li: { marginBottom: 6, lineHeight: 22 },
                strong: { color: "#212B36", fontWeight: "bold" },
              }}
            />
          ) : (
            <>
              {oldResult?.description && (
                <Section title="Mô tả:">
                  <Text className="text-base text-grey-600 leading-6">
                    {oldResult.description}
                  </Text>
                </Section>
              )}

              {oldResult?.instructions && (
                <Section title="Hướng dẫn xử lý:">
                  <BulletPoint text={oldResult.instructions} />
                </Section>
              )}
            </>
          )}

          <Section title="Thông tin thêm:">
            <BulletPoint text="Hãy đảm bảo rác được vệ sinh sạch sẽ trước khi phân loại." />
            <BulletPoint text="Tham gia vào các chiến dịch thu mua rác để tích điểm." />
          </Section>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
