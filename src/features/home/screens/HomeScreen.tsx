import { useArticles } from "@/features/articles/lib/article-hooks";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { useCategories } from "@/features/waste-library/lib/category-hooks";
import { getImageUrl } from "@/shared/utils/image-utils";
import { useRouter } from "expo-router";
import { Heart, SearchNormal1 } from "iconsax-react-nativejs";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ArticleCard,
  CategoryTab,
  SectionHeader,
  WasteCard,
} from "../components/HomeScreenComponents";
import { EnhancedArticleCard } from "@/features/articles/components/EnhancedArticleCard";

export function HomeScreen() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null
  );

  const { data: categoriesData, isLoading: isLoadingCategories } =
    useCategories({
      status: "active",
      perPage: 10,
    });

  const { data: articlesData, isLoading: isLoadingArticles } = useArticles({
    status: "active",
    type: "post",
    perPage: 5,
  });

  const { data: wasteData } = useArticles({
    status: "active",
    type: "library",
    categoryId: selectedCategoryId || undefined,
    perPage: 4,
  });

  const categories = categoriesData?.data || [];
  const libraryCategories = categories.filter((cat) => cat.type === "library");
  const wasteItems = (wasteData?.data || []).map((item) => {
    const matchedCategory = categories.find(
      (cat) => cat.id === item.categoryId
    );

    return {
      id: item.id,
      title: item.title,
      status: matchedCategory?.title || "-",
      image: getImageUrl(item.image) || "",
      isFavorite: item.isLiked,
    };
  });

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        stickyHeaderIndices={[1]}
      >
        {/* Header */}
        <View className="flex-row items-center justify-between px-6 py-4">
          <View className="flex-row items-center gap-3">
            <View className="h-12 w-12 rounded-full bg-grey-200 overflow-hidden">
              {user?.avatar ? (
                <Image
                  source={{ uri: getImageUrl(user.avatar) || "" }}
                  className="w-full h-full"
                />
              ) : (
                <View className="w-full h-full items-center justify-center bg-grey-300" />
              )}
            </View>
            <View>
              <Text className="text-xs text-grey-600">Xin chào!</Text>
              <Text className="text-lg font-bold text-grey-900">
                {user?.fullName || "Người dùng"} 👋
              </Text>
            </View>
          </View>
          <Pressable
            onPress={() => router.push("/favorites")}
            className="h-12 w-12 items-center justify-center rounded-full bg-grey-200 border border-grey-100"
          >
            <Heart size={24} color="#161C24" variant="Linear" />
          </Pressable>
        </View>

        {/* Search Bar */}
        <View className="bg-white px-6 pb-4">
          <Pressable
            onPress={() => router.push("/search")}
            className="flex-row items-center h-12 bg-grey-50 rounded-2xl px-4 border border-grey-100"
          >
            <SearchNormal1 size={20} color="#919EAB" variant="Linear" />
            <Text className="ml-3 text-grey-400 font-medium">Tìm kiếm...</Text>
          </Pressable>
        </View>

        {/* Content */}
        <View className="px-6 py-4">
          {/* Categories */}
          {isLoadingCategories ? (
            <ActivityIndicator className="mb-8" />
          ) : (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              className="mb-8"
            >
              <CategoryTab
                label="Tất cả"
                active={selectedCategoryId === null}
                onPress={() => setSelectedCategoryId(null)}
              />
              {libraryCategories.map((cat) => (
                <CategoryTab
                  key={cat.id}
                  label={cat.title}
                  active={selectedCategoryId === cat.id}
                  onPress={() => setSelectedCategoryId(cat.id)}
                />
              ))}
            </ScrollView>
          )}

          {/* Waste Library */}
          <SectionHeader
            title="Thư viện rác"
            onSeeAll={() => router.push("/library")}
          />
          <View className="flex-row flex-wrap justify-between">
            {wasteItems.length > 0 ? (
              wasteItems.map((item) => (
                <WasteCard
                  key={item.id}
                  item={item}
                  onPress={() =>
                    router.push({
                      pathname: "/(protected)/waste-details/[id]",
                      params: { id: item.id },
                    })
                  }
                />
              ))
            ) : (
              <Text className="text-grey-400 italic py-4">
                Không có rác nào trong danh mục này
              </Text>
            )}
          </View>

          {/* Articles */}
          <View className="mt-8 mb-20">
            <SectionHeader
              title="Bài viết kiến thức"
              onSeeAll={() => router.push("/articles")}
            />
            {isLoadingArticles ? (
              <ActivityIndicator />
            ) : (
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {articlesData?.data?.map((item) => (
                  <View className="mr-4" key={item.id}>
                    <EnhancedArticleCard
                      item={item}
                      onPress={() =>
                        router.push({
                          pathname: "/(protected)/article-details/[id]",
                          params: { id: item.id },
                        })
                      }
                    />
                  </View>
                ))}
              </ScrollView>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
