import type { SQLiteDatabase } from "expo-sqlite";
import { Rarity } from "@/infrastructure/interface/rarity.interface";
import { Variant } from "@/infrastructure/interface/variant.interface";
import { Season } from "@/infrastructure/interface/season.interface";
import { SpriteFamily } from "@/infrastructure/interface/sprite-family.interface";
import { Sprite } from "@/infrastructure/interface/sprite.interface";
import { CatalogMetadata } from "@/infrastructure/interface/catalog-metadata.interface";
import { SeasonVariantOrder } from "@/infrastructure/interface/variant-order";
import { SpriteCatalog } from "@/infrastructure/interface/sprite-catalog.interface";

export const countRaritiesInsertTest = async (db: SQLiteDatabase) => {
  const resultCount = await db.getFirstAsync<{ total: number }>(
    `
        SELECT COUNT(*) AS total FROM rarities; 
    `,
  );
  if (resultCount?.total !== 5) {
    throw new Error("No se han registrado las rarezas correctamente");
  }
  console.log("Este es el total de rarezas", resultCount.total);
};

export const countVariantsInsertTest = async (db: SQLiteDatabase) => {
  const resultCount = await db.getFirstAsync<{ total: number }>(
    `SELECT COUNT(*) AS total from variants;`,
  );
  if (resultCount?.total !== 12) {
    throw Error("No se han registrado las varaintes correctamente");
  }
  console.log("Este es el total de variantes", resultCount?.total);
};

export const countSeasonsInsertTest = async (db: SQLiteDatabase) => {
  const resultCount = await db.getFirstAsync<{ total: number }>(
    `SELECT COUNT(*) AS total from seasons;`,
  );
  if (resultCount?.total !== 2) {
    throw Error("No se han registrado las temporadas correctamente");
  }
  console.log("Este es el total de temporadas", resultCount?.total);
};

export const verifyUPSERTRarity = async (db: SQLiteDatabase) => {
  const result = await db.getFirstAsync<{ name: string }>(
    `
        SELECT name FROM rarities WHERE id = 1; 
    `,
  );
  if (result?.name !== "Segundo Nombre") {
    throw new Error("No se ha actualizado el registro");
  }
  console.log("Este es el nombre de la rareza", result?.name);
};

export const verifyUPSERTVariant = async (db: SQLiteDatabase) => {
  const result = await db.getFirstAsync<{ name: string }>(`
    SELECT name FROM variants WHERE id=1;
    `);
  if (result?.name !== "Base Nombre") {
    throw new Error("No se ha actualizado el registro");
  }
  console.log("Este es el nombre de la variante: ", result?.name);
};

export const countSpriteFamiliesInsertTest = async (db: SQLiteDatabase) => {
  const resultCount = await db.getFirstAsync<{ total: number }>(
    `
    SELECT COUNT(*) AS total FROM sprite_families;
    `,
  );
  if (resultCount?.total !== 50) {
    throw new Error("El total de familias no coincide");
  }
  console.log("Este es el total de familias: ", resultCount?.total);
};

export const countSpritesInsertTest = async (db: SQLiteDatabase) => {
  const resultCount = await db.getFirstAsync<{ total: number }>(
    `
    SELECT COUNT(*) AS total FROM sprites;
    `,
  );
  if (resultCount?.total !== 262) {
    throw new Error("El total de espiritus no coincide");
  }
  console.log("Este es el total de espiritus: ", resultCount?.total);
};

export const countSpritesOrderInsertTest = async (db: SQLiteDatabase) => {
  const resultCount = await db.getFirstAsync<{ total: number }>(
    `
    SELECT COUNT(*) AS total FROM season_variant_orders;
    `,
  );
  if (resultCount?.total !== 14) {
    throw new Error(
      "El total de orden con respecto a las variantes no coincide",
    );
  }
  console.log("Este es el total de ordenes registradas: ", resultCount?.total);
};
export const insertRarities = async (data: Rarity[], db: SQLiteDatabase) => {
  for (const rarity of data) {
    await db.runAsync(
      `
            INSERT INTO rarities (id, code, name)
            VALUES (?, ?, ?)
            ON CONFLICT(id)
            DO UPDATE SET
            	code = EXCLUDED.code,
            	name = EXCLUDED.name;`,
      rarity.id,
      rarity.code,
      rarity.name,
    );
  }
};

export const insertVariants = async (data: Variant[], db: SQLiteDatabase) => {
  for (const variant of data) {
    await db.runAsync(
      `
      INSERT INTO variants (id, code, name, effect)
      VALUES (?,?,?,?)
      ON CONFLICT(id)
      DO UPDATE SET
        code = EXCLUDED.code,
        name = EXCLUDED.name,
        effect = EXCLUDED.effect
      `,
      variant.id,
      variant.code,
      variant.name,
      variant.effect,
    );
  }
};

export const insertSeasons = async (data: Season[], db: SQLiteDatabase) => {
  for (const season of data) {
    await db.runAsync(
      `
      INSERT INTO seasons (id, chapter, season, name)
      VALUES (?,?,?,?)
      ON CONFLICT(id)
      DO UPDATE SET
        chapter = EXCLUDED.chapter,
        season = EXCLUDED.season,
        name = EXCLUDED.name
      `,
      season.id,
      season.chapter,
      season.season,
      season.name,
    );
  }
};

export const insertSpriteFamilies = async (
  data: SpriteFamily[],
  db: SQLiteDatabase,
) => {
  for (const family of data) {
    await db.runAsync(
      `
      INSERT INTO sprite_families (id, "key", name, description, seasonID)
      VALUES (?,?,?,?,?)
      ON CONFLICT(id)
      DO UPDATE SET
        "key" = EXCLUDED."key",
        name = EXCLUDED.name,
        description = EXCLUDED.description,
        seasonID = EXCLUDED.seasonID
      `,
      family.id,
      family.key,
      family.name,
      family.description,
      family.seasonID,
    );
  }
};

export const insertSprites = async (data: Sprite[], db: SQLiteDatabase) => {
  for (const sprite of data) {
    await db.runAsync(
      `INSERT INTO sprites (id,family_id, variant_id,rarity_id,name,image_file)
    VALUES(?,?,?,?,?,?)
    ON CONFLICT(id)
    DO UPDATE SET
      family_id= EXCLUDED.family_id,
      variant_id= EXCLUDED.variant_id,
      rarity_id= EXCLUDED.rarity_id,
      name= EXCLUDED.name,
      image_file= EXCLUDED.image_file
    `,
      sprite.id,
      sprite.family_id,
      sprite.variant_id,
      sprite.rarity_id,
      sprite.name,
      sprite.image_file,
    );
  }
};

export const insertVariantSpriteOrder = async (
  data: SeasonVariantOrder[],
  db: SQLiteDatabase,
) => {
  // Eliminar los órdenes anteriores.
  await db.runAsync("DELETE FROM season_variant_orders;");

  // Insertar los nuevos órdenes.
  for (const variantPosition of data) {
    await db.runAsync(
      `INSERT INTO season_variant_orders
          (season_id, variant_id, position)
         VALUES (?, ?, ?);`,
      [
        variantPosition.season_id,
        variantPosition.variant_id,
        variantPosition.position,
      ],
    );
  }

  console.log("Órdenes de variantes importados:", data.length);
};

export const saveCatalogVersion = async (
  version: string,
  db: SQLiteDatabase,
) => {
  await db.runAsync(
    `
            INSERT INTO app_settings ("key", value)
            VALUES ('catalog_version', ?)
            ON CONFLICT("key")
            DO UPDATE SET
            	value = EXCLUDED.value;`,
    version,
  );
};

export const importCatalog = async (
  data: SpriteCatalog,
  db: SQLiteDatabase,
) => {
  await db.withTransactionAsync(async () => {
    await insertSeasons(data.seasons, db);
    await insertVariants(data.variants, db);
    await insertRarities(data.rarities, db);
    await insertSpriteFamilies(data.sprite_families, db);
    await insertSprites(data.sprites, db);
    await insertVariantSpriteOrder(data.season_variant_orders, db);
    await saveCatalogVersion(data.metadata.version, db);

    const result = await db.getFirstAsync<{value:string}>(`Select value from app_settings WHERE "key"='catalog_version' `);

    if(result?.value!== data.metadata.version){
      throw new Error("No se registro la ultima version");
    }
  });
};
