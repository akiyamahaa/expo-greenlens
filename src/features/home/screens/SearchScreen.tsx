import React, { useState } from "react";
import { View, Text, TextInput, Pressable, ScrollView, ActivityIndicator, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { SearchNormal1, CloseCircle, Timer1 } from "iconsax-react-nativejs";
import { useRouter } from "expo-router";
import { useArticles } from "@/features/articles/lib/article-hooks";
import { WasteCard } from "@/features/home/components/HomeScreenComponents";

export function SearchScreen() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const recentSearches = ["Chai nhựa PET", "Túi nilon", "Hộp nhựa đựng thức ăn"];

  const { data: searchResults, isLoading } = useArticles({
    status: "active",
    keyword: search || undefined,
    perPage: 20,
    // Note: To search everything, we don't specify type or we'd need another hook if the backend doesn't support type-less search.
    // Assuming backend handles empty type as all types.
  });

  const results = (searchResults?.data || []).map(item => ({
    id: item.id,
    title: item.title,
    status: item.type === "library" ? "Rác tái chế" : "Bài viết",
    image: item.image,
    isFavorite: item.isLiked,
  }));

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      {/* Header Search */}
      <View className="flex-row items-center px-6 py-4">
        <View className="flex-1 flex-row items-center h-14 bg-grey-50 rounded-[20px] px-4 border border-grey-100">
          <SearchNormal1 size={20} color="#919EAB" variant="Linear" />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Tìm kiếm rác, bài viết..."
            autoFocus
            className="flex-1 ml-3 text-grey-900 font-medium"
            placeholderTextColor="#C4CDD5"
          />
          {search.length > 0 && (
            <Pressable onPress={() => setSearch("")}>
              <CloseCircle size={20} color="#919EAB" variant="Bold" />
            </Pressable>
          )}
        </View>
        <Pressable 
          onPress={() => router.back()}
          className="ml-4"
        >
          <Text className="text-base font-bold text-grey-600">Hủy</Text>
        </Pressable>
      </View>

      <View className="flex-1 px-6">
        {search.length === 0 ? (
          <View>
            <Text className="text-lg font-bold text-grey-900 mb-4 mt-2">Tìm kiếm gần đây</Text>
            {recentSearches.map((item, index) => (
              <Pressable 
                key={index}
                onPress={() => setSearch(item)}
                className="flex-row items-center py-4 border-b border-grey-50"
              >
                <View className="h-10 w-10 items-center justify-center rounded-full bg-grey-50 mr-4">
                  <Timer1 size={20} color="#919EAB" variant="Linear" />
                </View>
                <Text className="text-base font-medium text-grey-600">{item}</Text>
              </Pressable>
            ))}
          </View>
        ) : (
          <View className="flex-1">
            <Text className="text-lg font-bold text-grey-900 mb-4 mt-2">Kết quả tìm kiếm</Text>
            {isLoading ? (
              <ActivityIndicator className="mt-10" />
            ) : (
              <FlatList
                data={results}
                keyExtractor={(item) => item.id}
                numColumns={2}
                columnWrapperStyle={{ justifyContent: "space-between" }}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => (
                  <WasteCard 
                    item={item} 
                    onPress={() => {
                        const path = item.status === "Bài viết" 
                            ? "/(protected)/article-details/[id]" 
                            : "/(protected)/waste-details/[id]";
                        router.push({ pathname: path as any, params: { id: item.id } });
                    }}
                  />
                )}
                ListEmptyComponent={
                  <View className="flex-1 items-center justify-center py-20">
                    <Text className="text-grey-400 italic">Không tìm thấy kết quả nào</Text>
                  </View>
                }
              />
            )}
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}
