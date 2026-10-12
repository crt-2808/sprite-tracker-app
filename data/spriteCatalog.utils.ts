import { catalog } from "./catalog";

const baseLINK = catalog.metadata.image_base_uri;

export const getSpritesBySeason = (seasonId: number) => {
  const seasonFamilies = catalog.sprite_families.filter((element) => {
    return element.seasonID === seasonId;
  });
  const seasonSprites = catalog.sprites.filter((sprite) => {
    return seasonFamilies.some((family) => {
      return family.id === sprite.family_id;
    });
  });
  const spriteWithVariants = seasonSprites.map((sprite) => {
    const variantCode = catalog.variants.find(
      (element) => element.id === sprite.variant_id,
    );

    return {
      ...sprite,
      variantCode: variantCode?.code,
      imageSource: { uri: `${baseLINK}${sprite.image_file}` },
    };
  });

  return spriteWithVariants;
};

export const getSpriteById = (id: number) => {
  const sprite = catalog.sprites.find((element) => element.id === id);
  if (!sprite) {
    return;
  }
  const spriteFamily = catalog.sprite_families.find(
    (element) => element.id === sprite.family_id,
  )?.description;
  const spriteVariant = catalog.variants.find(
    (element) => element.id === sprite.variant_id,
  )?.effect;

  return {
    ...sprite,
    spriteFamilyEffect: spriteFamily,
    spriteVariantEffect: spriteVariant,
    imageSource: { uri: `${baseLINK}${sprite.image_file}` },
  };
};
