import { CatalogMetadata } from "./catalog-metadata.interface";
import { Rarity } from "./rarity.interface";
import { Season } from "./season.interface";
import { SpriteFamily } from "./sprite-family.interface";
import { Sprite } from "./sprite.interface";
import { SeasonVariantOrder } from "./variant-order";
import { Variant } from "./variant.interface";

export interface SpriteCatalog {
  seasons: Season[];
  sprite_families: SpriteFamily[];
  variants: Variant[];
  rarities: Rarity[];
  sprites: Sprite[];
  metadata: CatalogMetadata;
  season_variant_orders: SeasonVariantOrder[];
}
