import { Pressable, ImageSourcePropType, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import CustomImage from "./shared/customImage";
import { useSpriteStore } from "@/store/useSpriteStore";
import Ionicons from "@expo/vector-icons/Ionicons";
interface Props {
  id: string;
  source?: ImageSourcePropType;
  colors: [string, string, string];
  className?: string;
  onPress: () => void;
}

const SpriteCard = ({ id, source, colors, className, onPress }: Props) => {
  const progress = useSpriteStore(
    (state) =>
      // Aquí debes consultar el progreso mediante el id
      state.progressById[id],
  );
  const handleSpriteLongPress = useSpriteStore(
    (state) => state.handleSpriteLongPress,
  );

  const isDiscovered = !!progress;
  const level = progress?.level ?? null;
  return (
    <View
      className={`w-full aspect-square rounded-2xl overflow-hidden ${className}`}
    >
      <LinearGradient colors={colors} className="flex-1">
        {/* <Pressable onPress={toggleDiscovered}> */}
        <Pressable
          onPress={onPress}
          onLongPress={() => handleSpriteLongPress(id)}
          className="flex-1"
        >
          <CustomImage isDiscovered={isDiscovered} source={source} />
          {progress?.is_mastered &&(
            <View className="absolute top-2 right-2 rounded-full bg-black/60 p-1.5">
              <Ionicons name="medal-sharp" size={30} color="#FFD700" />
            </View>
          )}
          {isDiscovered ? (
            <Text className="absolute bottom-2 left-2 right-2 text-white text-base font-games">
              Level: {level}
            </Text>
          ) : (
            <></>
          )}
        </Pressable>
      </LinearGradient>
    </View>
  );
};

export default SpriteCard;
