import { catalog } from "./catalog";
import { VariantOrders } from "@/constant/VariantOrder";

const baseLINK = catalog.metadata.image_base_uri;

export const getSpritesBySeason = (seasonId: number) => {
  const seasonOrder = VariantOrders[seasonId];

  const seasonFamilies = catalog.sprite_families.filter((element) => {
    return element.seasonID === seasonId;
  });

  const seasonSprites = seasonFamilies.flatMap((family) => {
    const familySprites = catalog.sprites.filter(
      (element) => element.family_id === family.id,
    );
    return familySprites.sort((a, b)=>{
      const variantA = catalog.variants.find((element)=> element.id===a.variant_id)
      const variantB = catalog.variants.find((element)=> element.id===b.variant_id)
      if(!variantA || !variantB){ return 0}//Ya se que aqui iria el arreglo de seasonSprites 


      const positionA = seasonOrder.indexOf(variantA.code)
      const positionB = seasonOrder.indexOf(variantB.code)
      return positionA-positionB

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
