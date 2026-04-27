import { useArticles } from "@/features/articles/lib/article-hooks";
import {
  CategoryTab,
  WasteCard,
} from "@/features/home/components/HomeScreenComponents";
import { router } from "expo-router";
import { Heart } from "iconsax-react-nativejs";
import React, { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useCategories } from "../lib/category-hooks";

export function LibraryScreen() {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null
  );

  const { data: categoriesData, isLoading: isLoadingCategories } =
    useCategories({
      status: "active",
      perPage: 20,
    });

  const { data: wasteData, isLoading: isLoadingWaste } = useArticles({
    status: "active",
    type: "library",
    categoryId: selectedCategoryId || undefined,
    perPage: 20,
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
      status: matchedCategory.title || "-",
      image: item.image,
      isFavorite: item.isLiked,
    }
  });

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      <View className="flex-row items-center justify-between px-6 py-4">
        <Text className="text-3xl font-bold text-grey-900">Thư viện rác</Text>
        <Pressable
          onPress={() => router.push("/(protected)/favorites")}
          className="h-12 w-12 items-center justify-center rounded-full bg-grey-200 border border-grey-100"
        >
          <Heart size={24} color="#161C24" variant="Linear" />
        </Pressable>
      </View>

      <View className="px-6 py-2">
        {isLoadingCategories ? (
          <ActivityIndicator className="mb-6" />
        ) : (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="mb-6"
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
      </View>

      {isLoadingWaste ? (
        <ActivityIndicator className="flex-1" />
      ) : (
        <FlatList
          data={wasteItems}
          renderItem={({ item }) => (
            <WasteCard
              item={item}
              onPress={() =>
                router.push({
                  pathname: "/(protected)/waste-details/[id]",
                  params: { id: item.id },
                })
              }
            />
          )}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={{
            justifyContent: "space-between",
            paddingHorizontal: 24,
          }}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
          ListEmptyComponent={
            <View className="flex-1 items-center justify-center py-20">
              <Text className="text-grey-400 italic">
                Không tìm thấy rác nào
              </Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}
