import { useSyncExternalStore } from "react";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export const SKIN_TONES = ["fair", "light", "medium", "tan", "deep"] as const;
export const UNDERTONES = ["cool", "neutral", "warm"] as const;
export const CONCERNS = ["dryness", "oiliness", "dullness", "acne", "ageing", "sensitivity"] as const;
export const LIGHTING = ["natural daylight", "indoor warm light", "indoor cool/office light"] as const;

export type SkinTone = (typeof SKIN_TONES)[number];
export type Undertone = (typeof UNDERTONES)[number];
export type Concern = (typeof CONCERNS)[number];

type PersonalizationState = {
  skinTone: SkinTone | null;
  undertone: Undertone | null;
  concern: Concern | null;
  lighting: (typeof LIGHTING)[number] | null;
  completed: boolean;
  setAnswer: <K extends "skinTone" | "undertone" | "concern" | "lighting">(
    key: K,
    value: NonNullable<PersonalizationState[K]>
  ) => void;
  complete: () => void;
  reset: () => void;
};

export const usePersonalizationStore = create<PersonalizationState>()(
  persist(
    (set) => ({
      skinTone: null,
      undertone: null,
      concern: null,
      lighting: null,
      completed: false,
      setAnswer: (key, value) => set({ [key]: value }),
      complete: () => set({ completed: true }),
      reset: () =>
        set({ skinTone: null, undertone: null, concern: null, lighting: null, completed: false }),
    }),
    { name: "glowcart-personalization" }
  )
);

export function usePersonalizationHydrated(): boolean {
  return useSyncExternalStore(
    (callback) => usePersonalizationStore.persist.onFinishHydration(callback),
    () => usePersonalizationStore.persist.hasHydrated(),
    () => false
  );
}
