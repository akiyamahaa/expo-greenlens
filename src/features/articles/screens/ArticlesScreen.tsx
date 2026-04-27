import { useCategories } from "@/features/waste-library/lib/category-hooks";
import { useRouter } from "expo-router";
import { Heart } from "iconsax-react-nativejs";
import { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, FlatList, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CategoryDropdown } from "../components/CategoryDropdown";
import { EnhancedArticleCard } from "../components/EnhancedArticleCard";
import { SortDropdown, SortOption } from "../components/SortDropdown";
import { useArticles } from "../lib/article-hooks";

export function ArticlesScreen() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortOption, setSortOption] = useState<SortOption>("latest");

  const articlesParams = useMemo(() => ({
    status: "active" as const,
    type: "post" as const,
    ...(selectedCategory && { categoryId: selectedCategory }),
    perPage: 100,
  }), [selectedCategory]);

  const { data: articlesData, isLoading } = useArticles(articlesParams);

  // Debug logging để đảm bảo categoryId được truyền đúng
  useEffect(() => {
    console.log('Articles API params:', articlesParams);
    console.log('Selected category:', selectedCategory);
  }, [articlesParams, selectedCategory]);

  const { data: categoriesData, isLoading: categoriesLoading } = useCategories({
    status: "active",
    perPage: 50,
  });

  // Filter categories that are for posts
  const postCategories = useMemo(() => {
    return (categoriesData?.data || []).filter(category => 
      category.type === "post" || !category.type
    );
  }, [categoriesData]);

  const sortedArticles = useMemo(() => {
    const articles = articlesData?.data || [];
    
    switch (sortOption) {
      case "title_asc":
        return [...articles].sort((a, b) => a.title.localeCompare(b.title, "vi"));
      case "title_desc":
        return [...articles].sort((a, b) => b.title.localeCompare(a.title, "vi"));
      case "oldest":
        return [...articles].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      case "latest":
      default:
        return [...articles].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
  }, [articlesData, sortOption]);

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      {/* Header */}
      <View className="flex-row items-center justify-between px-6 py-4">
        <Text className="text-3xl font-bold text-grey-900">Bài viết</Text>
        <Pressable
          onPress={() => router.push("/(protected)/favorites")}
          className="h-12 w-12 items-center justify-center rounded-full bg-grey-200 border border-grey-100"
        >
          <Heart size={24} color="#161C24" variant="Linear" />
        </Pressable>
      </View>

      {/* Filter and Sort Controls */}
      <View className="px-6 pb-4">
        <View className="flex-row items-center justify-between">
          <CategoryDropdown
            categories={postCategories}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            isLoading={categoriesLoading}
          />
          <SortDropdown
            selectedSort={sortOption}
            onSortChange={setSortOption}
          />
        </View>
      </View>

      {/* Articles List */}
      {isLoading ? (
        <ActivityIndicator className="flex-1" />
      ) : (
        <FlatList
          data={sortedArticles}
          renderItem={({ item }) => (
            <EnhancedArticleCard
              item={{
                id: item.id,
                title: item.title,
                image: item.image,
                category: item.category,
                createdAt: item.createdAt,
              }}
              width="w-[48%]"
              onPress={() => router.push({ pathname: "/(protected)/article-details/[id]", params: { id: item.id } })}
            />
          )}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={{ justifyContent: "space-between", paddingHorizontal: 24 }}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
          ListEmptyComponent={
            <View className="flex-1 items-center justify-center py-20">
              <Text className="text-grey-400 italic">
                {selectedCategory ? "Không có bài viết nào trong danh mục này" : "Không có bài viết nào"}
              </Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

