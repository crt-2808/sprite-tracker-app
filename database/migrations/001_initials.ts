import { SQLiteDatabase } from "expo-sqlite";

export const initialMigration = async (db: SQLiteDatabase) => {
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS seasons 
    (id INTEGER PRIMARY KEY, chapter INTEGER NOT NULL, 
    season INTEGER NOT NULL, name TEXT NOT NULL);

    CREATE TABLE IF NOT EXISTS sprite_families 
    (id INTEGER PRIMARY KEY, "key" TEXT NOT NULL,
    name TEXT NOT NULL, description TEXT NOT NULL, seasonID INTEGER NOT NULL, 
    FOREIGN KEY (seasonID) REFERENCES seasons(id));

    CREATE TABLE IF NOT EXISTS variants
    (id INTEGER PRIMARY KEY, code TEXT UNIQUE NOT NULL, name TEXT NOT NULL, effect TEXT);


    CREATE TABLE IF NOT EXISTS rarities
    (id INTEGER PRIMARY KEY, code TEXT NOT NULL UNIQUE, name TEXT NOT NULL );

    CREATE TABLE IF NOT EXISTS sprites
    (id INTEGER PRIMARY KEY, family_id INTEGER NOT NULL, variant_id INTEGER NOT NULL,
    rarity_id INTEGER NOT NULL, name TEXT NOT NULL, image_file TEXT NOT NULL,
    FOREIGN  KEY (family_id) REFERENCES sprite_families(id),
    FOREIGN  KEY (variant_id) REFERENCES variants(id),
    FOREIGN  KEY (rarity_id) REFERENCES rarities(id));


    CREATE TABLE IF NOT EXISTS sprite_progress
    (sprite_id INTEGER PRIMARY KEY, level INTEGER NOT NULL CHECK (level BETWEEN 1 AND 5),
    is_mastered INTEGER NOT NULL CHECK(is_mastered IN (0,1)), unlocked_at TEXT NOT NULL,
    mastered_at TEXT,
    FOREIGN KEY (sprite_id) REFERENCES sprites(id));


    CREATE TABLE IF NOT EXISTS season_variant_orders
    (season_id INTEGER NOT NULL, variant_id INTEGER NOT NULL, position INTEGER NOT NULL CHECK(position>0),
    PRIMARY KEY (season_id, variant_id),  
    UNIQUE (season_id, position), 

    FOREIGN KEY (season_id) REFERENCES seasons(id),
    FOREIGN KEY (variant_id) REFERENCES variants(id));

    CREATE TABLE IF NOT EXISTS app_settings
    (key TEXT PRIMARY KEY NOT NULL, value TEXT NOT NULL);
        `);
};
