import React from "react";
import SpriteCard from "@/components/SpriteCard";
import { SafeAreaView } from "react-native-safe-area-context";
import { FlatList, View, ActivityIndicator } from "react-native";
import { data } from "@/mock/sprite-data";
import { router } from "expo-router";
import { VariantColors, type Variant } from "@/constant/VariantColors";
import { useSpriteHydration } from "@/hooks/useSpriteHydration";

const Index = () => {
  const hydrated = useSpriteHydration();
  if (!hydrated) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center">
        <ActivityIndicator color={"green"} size={45} />
      </SafeAreaView>
    );
  }
  return (
    <SafeAreaView className=" flex-1 bg-[#1F2937]">
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        className="flex-1"
        contentContainerClassName="px-1.5 py-3"
        numColumns={2}
        renderItem={({ item }) => (
          <View className="w-1/2 px-1.5 mb-3 ">
            <SpriteCard
              className=""
              onPress={() => {
                router.push({
                  pathname: "/details/[id]",
                  params: { id: item.id },
                });
              }}
              id={item.id}
              source={item.img}
              name={item.name}
              colors={VariantColors[item.variant as Variant]??VariantColors.default}
            />
          </View>
        )}
      />
    </SafeAreaView>
  );
};

export default Index;
