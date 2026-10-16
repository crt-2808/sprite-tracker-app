import React, { useEffect, useState } from "react";
import { Slot } from "expo-router";
import { useFonts } from "expo-font";
import { Text } from "react-native";

import { getDatabase } from "@/database/db";
import { runMigrations } from "@/database/migrations";
import { getTestDB } from "@/database/debug";

import "./global.css";

const RootLayout = () => {
  const [fontsloaded, error] = useFonts({
    gamesItalic: require("../assets/font/Games-Italic.ttf"),
  });

  const [readyDB, setReadyDB] = useState(false);
  const [dbError, setDbError] = useState<Error | null>(null);

  useEffect(() => {
    const initializeDatabase = async () => {
      try {
        const db = await getDatabase();
        await runMigrations(db);
        //await getTestDB();
        setReadyDB(true);
      } catch (error) {
        setDbError(error instanceof Error ? error : new Error(String(error)));
      }
    };

    void initializeDatabase();
  }, []);

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  if (dbError) {
    return <Text>{dbError.message}</Text>;
  }

  if (!fontsloaded || !readyDB) {
    return null;
  }

  return <Slot />;
};

export default RootLayout;
