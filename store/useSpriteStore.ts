import type {
  SpriteLevel,
  SpriteProgress,
} from "@/infrastructure/interface/sprite-progress.interface";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface SpriteStore {
  progressById: Record<string, SpriteProgress>;

  unlockSprite: (id: string) => void;
  setSpriteLevel: (id: string, level: SpriteLevel) => void;
  handleSpriteLongPress: (id: string) => void;
}

export const useSpriteStore = create<SpriteStore>()(
  persist(
    (set, get) => ({
      progressById: {},
      unlockSprite: (id: string) => {
        set((state) => {
          if (state.progressById[id]) {
            return state;
          }
          return {
            progressById: {
              ...state.progressById,

              [id]: {
                sprite_id: id,
                level: 1,
                is_mastered: false,
                unlocked_at: new Date().toISOString(),
                mastered_at: null,
              },
            },
          };
        });
      },
      setSpriteLevel: (id: string, level: SpriteLevel) => {
        set((state) => {
          const sprite = state.progressById[id];

          if (!sprite) {
            return state;
          }
          if (sprite.level === level) {
            return state;
          }
          const firstMastery = level === 5 && !sprite.is_mastered;
          let date = sprite.mastered_at;
          if (firstMastery) {
            //Solo es true cuando alcanza por primera vez
            date = new Date().toISOString();
          }
          return {
            progressById: {
              ...state.progressById,
              [id]: {
                ...sprite,
                level,
                is_mastered: sprite.is_mastered || firstMastery,
                mastered_at: date,
              },
            },
          };
        });
      },
      handleSpriteLongPress: (id: string) => {
        const progress = get().progressById[id];

        if (progress) {
          // Espíritu desbloqueado: llevarlo al nivel 5
          get().setSpriteLevel(id, 5);
        } else {
          // Espíritu bloqueado: desbloquearlo
          get().unlockSprite(id);
        }
      },
    }),
    {
      name: "sprite-storage",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        progressByID: state.progressById,
      }),
    },
  ),
);
