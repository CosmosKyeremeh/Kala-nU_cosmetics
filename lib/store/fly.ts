import { create } from "zustand";

export type FlyingItem = {
  id: number;
  image: string;
  from: { x: number; y: number; width: number; height: number };
  to: { x: number; y: number };
};

type FlyState = {
  items: FlyingItem[];
  launch: (image: string, fromEl: HTMLElement) => void;
  remove: (id: number) => void;
};

export const CART_ICON_TARGET_ID = "cart-icon-target";

export const useFlyStore = create<FlyState>((set) => ({
  items: [],
  launch: (image, fromEl) => {
    const target = document.getElementById(CART_ICON_TARGET_ID);
    if (!target) return;

    const fromRect = fromEl.getBoundingClientRect();
    const toRect = target.getBoundingClientRect();

    const id = Date.now() + Math.random();
    set((s) => ({
      items: [
        ...s.items,
        {
          id,
          image,
          from: { x: fromRect.left, y: fromRect.top, width: fromRect.width, height: fromRect.height },
          to: { x: toRect.left + toRect.width / 2, y: toRect.top + toRect.height / 2 },
        },
      ],
    }));
  },
  remove: (id) => set((s) => ({ items: s.items.filter((i) => i.id !== id) })),
}));
