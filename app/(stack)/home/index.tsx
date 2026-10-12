import React, { useState } from "react";
import SpriteCard from "@/components/SpriteCard";
import { SafeAreaView } from "react-native-safe-area-context";
import { FlatList, View, ActivityIndicator, Pressable } from "react-native";
import { router } from "expo-router";
import { VariantColors, type Variant } from "@/constant/VariantColors";
import { useSpriteHydration } from "@/hooks/useSpriteHydration";
import { getSpritesBySeason } from "@/data/spriteCatalog.utils";
import CustomText from "@/components/shared/CustomText";

const Index = () => {
  const hydrated = useSpriteHydration();

  const [selectedSeasonId, setSelectedSeasonId] = useState(42);
  const data = getSpritesBySeason(selectedSeasonId);

  if (!hydrated) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center">
        <ActivityIndicator color={"green"} size={45} />
      </SafeAreaView>
    );
  }
  return (
    <SafeAreaView className=" flex-1 bg-[#1F2937]">
      <Pressable
        onPress={() => {
          setSelectedSeasonId(selectedSeasonId === 42 ? 41 : 42);
        }}
      >
        <CustomText variant="buttonText" title="Cambia temporada" />
      </Pressable>
      <FlatList
        data={data}
        keyExtractor={(item) => String(item.id)}
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
                  params: { id: String(item.id) },
                });
              }}
              id={String(item.id)}
              source={item.imageSource}
              name={item.name}
              colors={
                VariantColors[item.variantCode as Variant] ??
                VariantColors.default
              }
            />
          </View>
        )}
      />
    </SafeAreaView>
  );
};

export default Index;
