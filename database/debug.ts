import { openDatabaseAsync, SQLiteDatabase } from "expo-sqlite";
import { getDatabase } from "./db";
import { runMigrations } from "./migrations";
import { initialMigration } from "./migrations/001_initials";
import { importCatalog } from "./repositories/importer";
import { catalog } from "@/data/catalog";
import { SpriteCatalog } from "@/infrastructure/interface/sprite-catalog.interface";
interface Props {
  tableName:
    "sprites" | "sprite_progress" | "sprite_families" | "season_variant_orders";
}

export const inspectTables = async (db: SQLiteDatabase) => {
  const result = await db.getAllAsync(`
        SELECT name FROM sqlite_master 
        WHERE type = 'table'
        AND name NOT GLOB 'sqlite_*'
        `);
  console.log(result);
};

export const inspectPragmaForeignKey = async () => {
  const db = await getDatabase();
  const result = await db.getFirstAsync(`
        PRAGMA foreign_keys
        `);
  console.log("Pragma Keys", result);
};

export const inspectPragmaForeignKeyList = async ({ tableName }: Props) => {
  const db = await getDatabase();
  const result = await db.getAllAsync(`
        PRAGMA foreign_key_list(${tableName})
        `);
  console.log(`Relationships of table ${tableName}:`, result);
};

export const testProgressCheck = async () => {
  const db = await getDatabase();
  let checkRejected = false;
  let masteredCheckRejected = false;
  try {
    await db.withTransactionAsync(async () => {
      await db.execAsync(`
        INSERT INTO "seasons" (id, chapter, season, name)
        VALUES(1, 7, 4, 'Override');
        
        INSERT INTO "sprite_families" (id, key, name, description, seasonID)
        VALUES(1, 'Water', 'Water', 'Replenish shields while standing in water. Increases in power 
        at each Level Up 2 Shield 3 Shield 4 Shield 5 Shield 6 Shield per tick', 1); 
        
        INSERT INTO "variants" (id, code, name, effect)
        VALUES(1,'base', 'Base', null);
        
        INSERT INTO "rarities" (id, code, name)
        VALUES(1, 'rare', 'Rare');
        
        INSERT INTO "sprites" (id, family_id, variant_id, rarity_id, name, image_file)
        VALUES(1, 1, 1, 1,'Water', 'T_Icon_BR_Creature_Sprite_Water_Unvault_Ch7S3_ui_L.webp');
        
        INSERT INTO "sprite_progress" (sprite_id, level, is_mastered, unlocked_at, mastered_at)
        VALUES(1, 1, 0, 'fecha desbloqueo', null);
        `);

      try {
        await db.execAsync(`
            UPDATE "sprite_progress"
            SET level = 6
            WHERE sprite_id = 1;
        `);
      } catch (error) {
        if (
          !(error instanceof Error) ||
          !error.message.includes("CHECK constraint failed")
        ) {
          throw error;
        }
        checkRejected = true;
      }

      try {
        await db.execAsync(`
            UPDATE "sprite_progress"
            SET is_mastered = 2
            WHERE sprite_id = 1;
        `);
      } catch (error) {
        if (
          !(error instanceof Error) ||
          !error.message.includes(
            "CHECK constraint failed: is_mastered IN (0,1)",
          )
        ) {
          throw error;
        }
        masteredCheckRejected = true;
      }

      throw new Error("TEST_ROLLBACK");
    });
  } catch (error) {
    if (!(error instanceof Error) || error.message !== "TEST_ROLLBACK") {
      throw error;
    }
  }

  const remaining = await db.getFirstAsync<{ total: number }>(`
    SELECT
      (SELECT COUNT(*) FROM seasons WHERE id = 1) +
      (SELECT COUNT(*) FROM sprite_families WHERE id = 1) +
      (SELECT COUNT(*) FROM variants WHERE id = 1) +
      (SELECT COUNT(*) FROM rarities WHERE id = 1) +
      (SELECT COUNT(*) FROM sprites WHERE id = 1) +
      (SELECT COUNT(*) FROM sprite_progress WHERE sprite_id = 1)
      AS total;
  `);

  if (remaining?.total !== 0) {
    throw new Error("La prueba dejó registros temporales.");
  }

  if (!checkRejected) {
    throw new Error("SQLite no rechazó el nivel 6 mediante CHECK.");
  }

  if (!masteredCheckRejected) {
    throw new Error("SQLite no rechazó el is_mastered=2 mediante CHECK.");
  }

  console.log("CHECK y ROLLBACK validados correctamente.");

  console.log("CHECK rechazó nivel 6:", checkRejected);
  console.log("CHECK rechazó el 2:", masteredCheckRejected);
};

export const testVariantUnique = async (db: SQLiteDatabase) => {
  let uniqueRejected = false;

  try {
    await db.withExclusiveTransactionAsync(async (txn) => {
      await txn.execAsync(`

        INSERT INTO "variants" (id, code, name, effect)
        VALUES(1,'base', 'Base', null);
        
        `);
      try {
        await txn.execAsync(`

        INSERT INTO "variants" (id, code, name, effect)
        VALUES(2,'base', 'Base copia', null);
        
        `);
      } catch (error) {
        if (
          !(error instanceof Error) ||
          !error.message.includes("UNIQUE constraint failed: variants.code")
        ) {
          throw error;
        }
        uniqueRejected = true;
      }
      throw new Error("TEST_ROLLBACK");
    });
  } catch (error) {
    if (!(error instanceof Error) || error.message !== "TEST_ROLLBACK") {
      throw error;
    }
  }

  const remaining = await db.getFirstAsync<{ total: number }>(`
    SELECT
      (SELECT COUNT(*) FROM variants WHERE id = 1)+
      (SELECT COUNT(*) FROM variants WHERE id = 2)
      AS total;
  `);

  if (remaining?.total !== 0) {
    throw new Error("La prueba dejó registros temporales.");
  }

  if (!uniqueRejected) {
    throw new Error("SQLite no rechazó el segundo registro mediante UNIQUE.");
  }

  console.log("ROLLBACK validados correctamente.");

  console.log("UNIQUE no registro otro dato:", uniqueRejected);
};

export const testVariantPKey = async () => {
  const db = await getDatabase();
  let pKeyRejected = false;

  try {
    await db.withExclusiveTransactionAsync(async (txn) => {
      await txn.execAsync(`

        INSERT INTO "variants" (id, code, name, effect)
        VALUES(1,'base', 'Base', null);
        
        `);
      try {
        await txn.execAsync(`

        INSERT INTO "variants" (id, code, name, effect)
        VALUES(1,'gold', 'Gold', null);
        
        `);
      } catch (error) {
        if (
          !(error instanceof Error) ||
          !error.message.includes("UNIQUE constraint failed: variants.id")
        ) {
          throw error;
        }
        pKeyRejected = true;
      }
      throw new Error("TEST_ROLLBACK");
    });
  } catch (error) {
    if (!(error instanceof Error) || error.message !== "TEST_ROLLBACK") {
      throw error;
    }
  }

  const remaining = await db.getFirstAsync<{ total: number }>(`
    SELECT
      (SELECT COUNT(*) FROM variants WHERE id = 1)      
      AS total;
  `);

  if (remaining?.total !== 0) {
    throw new Error("La prueba dejó registros temporales.");
  }

  if (!pKeyRejected) {
    throw new Error(
      "SQLite no rechazó el segundo registro mediante PRIMARY KEY.",
    );
  }

  console.log("ROLLBACK validados correctamente.");

  console.log("PRIMARY KEY no registro otro dato:", pKeyRejected);
};

export const testProgressFKey = async () => {
  const db = await getDatabase();
  const testSpriteId = 999;
  let fKRejected = false;

  // Comprobar que el ID de prueba esté libre.
  const sprite = await db.getFirstAsync("SELECT id FROM sprites WHERE id = ?", [
    testSpriteId,
  ]);

  const progress = await db.getFirstAsync(
    "SELECT sprite_id FROM sprite_progress WHERE sprite_id = ?",
    [testSpriteId],
  );

  if (sprite !== null || progress !== null) {
    throw new Error("El ID de prueba ya está ocupado.");
  }

  // Consultar la conexión principal.
  const mainPragma = await db.getFirstAsync<{
    foreign_keys: number;
  }>("PRAGMA foreign_keys");

  console.log("Foreign keys conexión principal:", mainPragma);

  try {
    await db.withTransactionAsync(async () => {
      // Consultar la conexión de la transacción.
      const txnPragma = await db.getFirstAsync<{
        foreign_keys: number;
      }>("PRAGMA foreign_keys");

      console.log("Foreign keys dentro de transacción:", txnPragma);

      try {
        await db.runAsync(
          `INSERT INTO sprite_progress
           (sprite_id, level, is_mastered, unlocked_at, mastered_at)
           VALUES (?, ?, ?, ?, ?)`,
          [testSpriteId, 1, 0, new Date().toISOString(), null],
        );

        console.log("La inserción fue aceptada.");
      } catch (error) {
        console.log("Error real de SQLite:", error);

        if (
          !(error instanceof Error) ||
          !error.message.includes("FOREIGN KEY constraint failed")
        ) {
          throw error;
        }

        fKRejected = true;
      }

      // Impedir COMMIT incluso si la inserción fue aceptada.
      throw new Error("TEST_ROLLBACK");
    });
  } catch (error) {
    if (!(error instanceof Error) || error.message !== "TEST_ROLLBACK") {
      throw error;
    }
  }

  // Comprobar que no quedaron registros.
  const remaining = await db.getFirstAsync<{ total: number }>(
    "SELECT COUNT(*) AS total FROM sprite_progress WHERE sprite_id = ?",
    [testSpriteId],
  );

  if (remaining?.total !== 0) {
    throw new Error("La prueba dejó registros temporales.");
  }

  console.log("Rollback verificado.");
  console.log("FOREIGN KEY rechazó sprite inexistente:", fKRejected);
};

export const testMigrationRollback = async () => {
  const db = await openDatabaseAsync("sprite-tracker-rollback-test.db");

  try {
    await db.execAsync("PRAGMA foreign_keys = ON;");

    // Esta base debe empezar sin migraciones.
    const initialVersion = await db.getFirstAsync<{
      user_version: number;
    }>("PRAGMA user_version");

    if (initialVersion?.user_version !== 0) {
      throw new Error("La base de prueba no está en versión 0");
    }

    // Verificamos que tampoco existan tablas previas.
    const initialTables = await db.getAllAsync<{ name: string }>(
      "SELECT name FROM sqlite_master WHERE type = 'table' AND name NOT GLOB 'sqlite_*'",
    );

    if (initialTables.length !== 0) {
      throw new Error("La base de prueba ya contiene tablas");
    }

    try {
      await db.withTransactionAsync(async () => {
        await initialMigration(db);

        await db.execAsync("PRAGMA user_version = 1");

        throw new Error("TEST_MIGRATION_ROLLBACK");
      });
    } catch (error) {
      if (
        !(error instanceof Error) ||
        error.message !== "TEST_MIGRATION_ROLLBACK"
      ) {
        throw error;
      }
    }

    const version = await db.getFirstAsync<{
      user_version: number;
    }>("PRAGMA user_version");

    const tables = await db.getAllAsync<{ name: string }>(
      "SELECT name FROM sqlite_master WHERE type = 'table' AND name NOT GLOB 'sqlite_*'",
    );

    if (version?.user_version !== 0) {
      throw new Error("FALLO: user_version no se revirtió");
    }

    if (tables.length !== 0) {
      throw new Error("FALLO: quedaron tablas después del rollback");
    }
  } finally {
    await db.closeAsync();
  }
};

export const getTestDB = async () => {
  let db: SQLiteDatabase | null = null;

  try {
    db = await openDatabaseAsync("sprite-tracker-test3.db");

    await db.execAsync("PRAGMA foreign_keys = ON;");
    await runMigrations(db);

    const pragmaResult = await db.getFirstAsync<{
      user_version: number;
    }>("PRAGMA user_version");

    if (pragmaResult?.user_version !== 1) {
      throw new Error("La base de pruebas no está en versión 1");
    }
    await importCatalog(catalog, db);

    const result = await db.getFirstAsync<{ value: string }>(
  `SELECT value
   FROM app_settings
   WHERE "key" = 'catalog_version';`
);

if (result?.value !== catalog.metadata.version) {
  throw new Error("La versión del catálogo no coincide");
}

console.log("Versión del catálogo validada:", result.value);

  } catch (error) {
    console.error("ERROR EN getTestDB:", error);
    throw error;
  } finally {
    if (db !== null) {
      await db.closeAsync();
    }
  }
};
