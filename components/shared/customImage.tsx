import { View, StyleSheet, Image, ImageSourcePropType } from "react-native";
import React from "react";

interface Props {
  source: ImageSourcePropType|undefined;
  isDiscovered?: boolean;
}

const CustomImage = ({ source, isDiscovered }: Props) => {
  return (
    <View className="w-full aspect-square">
      <Image
        alt="Sprite"
        source={source}
        style={[styles.spriteImage, styles.spriteGlow]}
      />
      <View className="w-full h-full items-center">
        <Image
          alt="Sprite"
          source={source}
          style={[styles.spriteImage, { opacity: isDiscovered ? 1 : 0.4 }]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  spriteName: {
    fontSize: 28,
    textAlign: "center",
    width: "100%",
    color: "white",
    fontWeight: "600",
  },
  spriteImage: {
    resizeMode: "contain",
    width: "100%",
    height: "100%"
  },
  gradient: {
    borderRadius: 16,
    padding: 12,
    alignItems: "center",
  },
  spriteGlow: {
    position: "absolute",
    opacity: 0.6,
    transform: [{ scale: 1.05 }],
    tintColor: "#ffffff6b",
  },
});

export default CustomImage;
