import { View, Text, TextProps } from "react-native";
import React from "react";

interface Props extends TextProps {
  title: string;
  description?: string;
  variant?: "blockText" | "onlyText" | "buttonText";
  backgroundColor?: string;
}

const CustomText = ({
  title,
  description,
  variant = "onlyText",
  backgroundColor = "#C7C7C7",
}: Props) => {
  if (variant === "blockText") {
    return (
      <View
        className="mx-5 rounded-xl p-4"
        style={{ backgroundColor: backgroundColor }}
      >
        <Text className="text-xl">
          <Text className="font-bold pt-20">{title}: </Text>
          {description}
        </Text>
      </View>
    );
  }
  if (variant === "buttonText") {
    return (
      <View
        className="mx-5 rounded-xl p-4 justify-center items-center"
        style={{ backgroundColor: backgroundColor }}
      >
        <Text className="text-2xl font-bold text-center">{title}</Text>
      </View>
    );
  }
  return (
    <View className="px-5">
      <Text className="text-xl">
        <Text className="font-bold pt-20">{title}: </Text>
        {description}
      </Text>
    </View>
  );
};

export default CustomText;
