import {
  View,
  StyleSheet,
  Image,
  ImageSourcePropType,
  Text,
} from "react-native";
import React, { useEffect, useState } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import CustomText from "./CustomText";

interface Props {
  source: ImageSourcePropType | undefined;
  isDiscovered?: boolean;
  name: string;
  fallbackMode?: "initials" | "message";
  className?: string
}

const CustomImage = ({
  source,
  isDiscovered,
  name,
  fallbackMode = "initials",
  className
}: Props) => {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setHasError(false);
  }, [source]);

  const initials = name
    .split(" ")
    .filter((element) => {
      return element.trim().length > 0;
    })
    .map((elemente) => {
      return elemente.charAt(0).toUpperCase();
    })
    .join("");
  const showFallback = !source || hasError;
  return (
    <View className={`w-full aspect-square ${className}`}>
      {showFallback ? (
        <View className="flex-1 items-center justify-center">
          {fallbackMode === "message" ? (
            <View className="items-center justify-center">
              <Ionicons name="image-sharp" size={30} />
              <CustomText title="Imagen no disponible" variant="onlyText" />
            </View>
          ) : (
            <View>
              <Text className="text-center text-white  text-7xl font-bold">
                {initials}
              </Text>
            </View>
          )}
        </View>
      ) : (
        <View className="w-full h-full ">
          <Image
            onError={() => setHasError(true)}
            alt="Sprite"
            source={source}
            style={[styles.spriteImage, styles.spriteGlow]}
          />
          <View className=" w-full h-full">
            <Image
              onError={() => setHasError(true)}
              alt="Sprite"
              source={source}
              style={[styles.spriteImage, { opacity: isDiscovered ? 1 : 0.4 }]}
            />
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  spriteImage: {
    resizeMode: "contain",
    width: "100%",
    height: "100%",
  },
  spriteGlow: {
    position: "absolute",
    opacity: 0.6,
    transform: [{ scale: 1.05 }],
    tintColor: "#ffffff6b",
  },
});

export default CustomImage;
