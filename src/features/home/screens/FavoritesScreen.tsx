import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Image,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowLeft, Heart, Trash } from "iconsax-react-nativejs";
import { useRouter } from "expo-router";
import { useLikedArticles } from "@/features/articles/lib/article-hooks";
import { useCategories } from "@/features/waste-library/lib/category-hooks";
import { Category } from "@/features/waste-library/types/categories.types";

const CategoryTab = ({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) => (
  <Pressable
    onPress={onPress}
    className={`mr-2 px-5 py-2.5 rounded-full ${
      active ? "bg-primary-main" : "bg-grey-100"
    }`}
  >
    <Text
      className={`text-sm font-semibold ${
        active ? "text-white" : "text-grey-600"
      }`}
    >
      {label}
    </Text>
  </Pressable>
);

const WasteCard = ({ item, onPress }: { item: any; onPress: () => void }) => (
  <Pressable 
    onPress={onPress}
    className="w-[48%] mb-4 bg-white rounded-3xl border border-grey-100 overflow-hidden shadow-sm"
  >
    <View className="relative h-48">
      <Image
        source={{ uri: item.image }}
        className="w-full h-full"
        resizeMode="cover"
      />
      <View className="absolute top-2 right-2 h-8 w-8 items-center justify-center rounded-full bg-white/80">
        <Heart size={18} color="#EB5757" variant="Bold" />
      </View>
    </View>
    <View className="p-3">
      <Text className="text-sm font-bold text-grey-900" numberOfLines={1}>
        {item.title}
      </Text>
      <View className="flex-row items-center justify-between mt-2">
        <Text className="text-[10px] font-bold text-primary-main uppercase">
          MÀU THÙNG RÁC
        </Text>
        <Trash size={14} color="#2D9CDB" variant="Linear" />
      </View>
    </View>
  </Pressable>
);

export function FavoritesScreen() {
  const router = useRouter();
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);

  const { data: categoriesData, isLoading: isLoadingCategories } = useCategories({
    status: "active",
  });

  const { data: favoritesData, isLoading: isLoadingFavorites } = useLikedArticles({
    status: "active",
    type: "library",
    categoryId: selectedCategoryId || undefined,
  });

  const categories = categoriesData?.data || [];
  const wasteItems = (favoritesData?.data || []).map(item => ({
    id: item.id,
    title: item.title,
    image: item.image,
  }));

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      {/* Header */}
      <View className="flex-row items-center px-6 py-4 h-20">
        <Pressable
          onPress={() => router.back()}
          className="h-12 w-12 items-center justify-center rounded-2xl bg-grey-100 z-10"
        >
          <ArrowLeft size={24} color="#161C24" variant="Linear" />
        </Pressable>
        <View className="absolute left-0 right-0 items-center justify-center h-20 -z-0">
           <Text className="text-xl font-bold text-grey-900">
             Yêu thích
           </Text>
        </View>
      </View>

      <View className="flex-1">
        <View className="px-6 py-2">
          {isLoadingCategories ? (
            <ActivityIndicator />
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
              {categories.map((cat: Category) => (
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

        {isLoadingFavorites ? (
          <ActivityIndicator className="mt-10" />
        ) : (
          <ScrollView className="px-6" showsVerticalScrollIndicator={false}>
            <View className="flex-row flex-wrap justify-between pb-20">
              {wasteItems.length > 0 ? (
                wasteItems.map((item) => (
                  <WasteCard 
                    key={item.id} 
                    item={item} 
                    onPress={() => router.push({ pathname: "/(protected)/waste-details/[id]", params: { id: item.id } })}
                  />
                ))
              ) : (
                <View className="w-full items-center py-20">
                  <Text className="text-grey-400 italic">Chưa có mục yêu thích nào</Text>
                </View>
              )}
            </View>
          </ScrollView>
        )}
      </View>
    </SafeAreaView>
  );
}
