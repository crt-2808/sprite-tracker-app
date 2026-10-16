  import type { SQLiteDatabase } from "expo-sqlite";
  import { initialMigration } from "./001_initials";

  export const runMigrations = async (db:SQLiteDatabase) => {
    const PRAGMA_result = await db.getFirstAsync<{ user_version: number }>(
      "PRAGMA user_version",
    );
    const current_version = PRAGMA_result?.user_version ?? 0;

    if(current_version<1){
      await db.withTransactionAsync(async () => {
          await initialMigration(db);

          await db.execAsync("PRAGMA user_version=1")

      })
    }
    // console.log("pragma",current_version);
  };
