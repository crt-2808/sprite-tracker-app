import React, { useEffect } from "react";
import { Slot } from "expo-router";
import { useFonts } from "expo-font";
import "./global.css";
const RootLayout = () => {
  const [fontsloaded, error] = useFonts({
    "gamesItalic": require("../assets/font/Games-Italic.ttf"),
  });
  useEffect(() => {
    if (error) throw error;
  });

  if (!fontsloaded && !error) return null;
  
  return <Slot />;
};

export default RootLayout;
