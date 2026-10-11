import React from "react";
import { Stack } from "expo-router";
const StackLayout = () => {
  return (
    <Stack
      screenOptions={{
        headerTitleAlign: "center",
        contentStyle: { backgroundColor: "#4B5563" },
        headerShadowVisible: false,
        headerStyle:{backgroundColor:"#9CA3AF"}
      }}
    >
      <Stack.Screen name="home/index" options={{ title: "Sprite Tracker", headerShown:false}} />
    </Stack>
  );
};

export default StackLayout;
