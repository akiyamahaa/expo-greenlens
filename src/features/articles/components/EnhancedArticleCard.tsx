import { Image, Pressable, Text, View } from "react-native";
import { Article } from "../types/articles.types";

interface EnhancedArticleCardProps {
  item: Pick<Article, "id" | "title" | "image" | "category" | "createdAt">;
  onPress?: () => void;
  width?: string;
}

export const EnhancedArticleCard = ({
  item,
  onPress,
  width = "w-64",
}: EnhancedArticleCardProps) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <Pressable
      onPress={onPress}
      className={`${width} mb-4 bg-grey-200 rounded-[28px] overflow-hidden border border-grey-100 shadow-sm`}
    >
      <Image source={{ uri: item.image }} className="h-44 w-full" />
      <View className="p-4">
        {item.category && (
          <View className="mb-2">
            <Text className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full self-start">
              {item.category.title}
            </Text>
          </View>
        )}
        <Text
          className="text-sm font-bold text-grey-900 leading-5 mb-2"
          numberOfLines={2}
        >
          {item.title}
        </Text>
        <Text className="text-xs text-grey-500">
          {formatDate(item.createdAt)}
        </Text>
      </View>
    </Pressable>
  );
};