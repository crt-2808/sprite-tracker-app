import { useState, useEffect } from "react";
import { useSpriteStore } from "@/store/useSpriteStore";

export const useSpriteHydration = () => {
  const [hydrated, setHydrated] = useState(
    useSpriteStore.persist.hasHydrated(),
  );

  useEffect(() => {
    const unsuscribe = useSpriteStore.persist.onFinishHydration(() => {
      setHydrated(true);
    });
    setHydrated(useSpriteStore.persist.hasHydrated());

    return unsuscribe;
  }, []);
  return hydrated;
};
