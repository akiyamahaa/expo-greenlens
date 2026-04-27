import { Heart } from "iconsax-react-nativejs";
import React from "react";
import { Image, Pressable, Text, View } from "react-native";

export const CategoryTab = ({
  label,
  active = false,
  onPress,
}: {
  label: string;
  active?: boolean;
  onPress?: () => void;
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

export const SectionHeader = ({
  title,
  onSeeAll,
}: {
  title: string;
  onSeeAll?: () => void;
}) => (
  <View className="flex-row items-center justify-between mb-4">
    <Text className="text-xl font-bold text-grey-900">{title}</Text>
    <Pressable onPress={onSeeAll} className="flex-row items-center">
      <Text className="text-sm font-medium text-grey-500 mr-1">Xem thêm</Text>
    </Pressable>
  </View>
);

export const WasteCard = ({
  item,
  onPress,
}: {
  item: {
    id: string;
    title: string;
    image: string;
    isFavorite?: boolean;
    status?: string | null;
  };
  onPress?: () => void;
}) => (
  <Pressable
    onPress={onPress}
    className="w-[48%] mb-6 bg-white rounded-2xl overflow-hidden shadow-md h-72"
  >
    {/* Full size background image */}
    <Image
      source={{ uri: item.image }}
      className="absolute w-full h-full"
      resizeMode="cover"
    />

    {/* Favorite Button Overlay (Top Right of Card) */}
    <Pressable className="absolute top-3 right-3 h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm">
      <Heart
        size={20}
        color={item.isFavorite ? "#EB5757" : "#161C24"}
        variant={item.isFavorite ? "Bold" : "Linear"}
      />
    </Pressable>

    {/* Info Box Overlay (Bottom) */}
    <View className="mt-auto p-2">
      <View className="bg-white rounded-2xl p-3 shadow-sm">
        <Text
          className="text-sm font-bold text-grey-900 leading-5"
          numberOfLines={1}
        >
          {item.title}
        </Text>
        <Text className="text-[11px] font-semibold text-primary-main mt-1">
          {item.status}
        </Text>

        {/* <View className="flex-row items-center justify-between mt-3">
          <Text className="text-[10px] font-bold text-grey-400 uppercase tracking-tighter">
            MÀU THÙNG RÁC
          </Text>
          <View className="h-6 w-6 items-center justify-center rounded-lg bg-grey-50">
            <Trash size={16} color="#007AFF" variant="Bold" />
          </View>
        </View> */}
      </View>
    </View>
  </Pressable>
);

export const ArticleCard = ({
  item,
  onPress,
  width = "w-64",
}: {
  item: {
    id: string;
    title: string;
    image: string;
  };
  onPress?: () => void;
  width?: string;
}) => (
  <Pressable
    onPress={onPress}
    className={`${width} mb-4 bg-grey-200 rounded-[28px] overflow-hidden border border-grey-100 shadow-sm`}
  >
    <Image source={{ uri: item.image }} className="h-44 w-full" />
    <View className="p-4">
      <Text
        className="text-sm font-bold text-grey-900 leading-5"
        numberOfLines={2}
      >
        {item.title}
      </Text>
    </View>
  </Pressable>
);
