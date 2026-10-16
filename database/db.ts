import * as SQLite from "expo-sqlite";

let dbPromise: Promise<SQLite.SQLiteDatabase> | null = null;

export const getDatabase = async () => {
  if (dbPromise === null) {
    dbPromise = (async () => {
      const db = await SQLite.openDatabaseAsync("sprite-tracker.db");

      await db.execAsync("PRAGMA foreign_keys = ON;");

      return db;
    })();
  }
  return dbPromise;
};
