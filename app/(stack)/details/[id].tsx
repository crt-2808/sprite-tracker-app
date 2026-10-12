import { useEffect } from "react";
import { View, Pressable, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useNavigation } from "expo-router";
import CustomText from "@/components/shared/CustomText";
import { useSpriteStore } from "@/store/useSpriteStore";
import CustomImage from "@/components/shared/CustomImage";
import { getSpriteById } from "@/data/spriteCatalog.utils";
const SPRITE_LEVELS = [1, 2, 3, 4, 5] as const;

const SpriteDetailScreen = () => {
  const { id } = useLocalSearchParams();
  const navigation = useNavigation();
  const sprite = getSpriteById(Number(id))
  useEffect(() => {
    navigation.setOptions({
      title: sprite?.name ?? "Sprite",
    });
  }, [navigation, sprite?.name]);
  const progress = useSpriteStore((state) => state.progressById[id as string]);
  const unlockSprite = useSpriteStore((state) => state.unlockSprite);
  const setSpriteLevel = useSpriteStore((state) => state.setSpriteLevel);

  if (!sprite) {
    return <CustomText variant="onlyText" title="No se encontro el espiritu"/>;
  }

  const isDiscovered = !!progress;
  const level = progress?.level ?? null;

  return (
    <SafeAreaView>
      <View className="relative w-full items-center justify-center">
        <CustomImage
          source={sprite.imageSource}
          name={sprite.name}
          fallbackMode="message"
          isDiscovered={true}
          className="-mt-safe-offset-16"
        />
        {/* <Image source={sprite.img} className=" -mt-safe-offset-36" /> */}
        {progress?.is_mastered && (
          <View className="absolute bottom-2 right-0">
            <CustomText
              variant="buttonText"
              title="MASTERED"
              description=""
              backgroundColor="#FFD700"
            />
          </View>
        )}
      </View>
      <View className="pb-2">
        {sprite.spriteVariantEffect && (
          <CustomText
            variant="blockText"
            title="Special Effect"
            description={sprite.spriteVariantEffect}
          />
        )}
      </View>
      <CustomText
        className="pt-25"
        title="Sprite Effect"
        description={sprite.spriteFamilyEffect}
      />
      {!isDiscovered ? (
        <Pressable onPress={() => unlockSprite(id as string)}>
          <CustomText
            variant="buttonText"
            title="Unlock Sprite"
            backgroundColor="#16A34A"
          />
        </Pressable>
      ) : (
        <View className="flex-row justify-between gap-2 mx-5 mt-5">
          {SPRITE_LEVELS.map((nextLevel) => (
            <Pressable
              className={`flex-1 items-center justify-center rounded-xl p-4 ${
                level === nextLevel ? "bg-green-600" : "bg-gray-600"
              }`}
              onPress={() => setSpriteLevel(id as string, nextLevel)}
              key={nextLevel}
            >
              <Text className="text-white text-xl font-bold">{nextLevel}</Text>
            </Pressable>
          ))}
        </View>
      )}
    </SafeAreaView>
  );
};

export default SpriteDetailScreen;
