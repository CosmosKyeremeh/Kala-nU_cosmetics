"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCartStore, useCartHydrated, cartCount } from "@/lib/store/cart";
import { CART_ICON_TARGET_ID } from "@/lib/store/fly";

export function CartButton() {
  const items = useCartStore((s) => s.items);
  const open = useCartStore((s) => s.open);
  const hydrated = useCartHydrated();

  const count = hydrated ? cartCount(items) : 0;

  return (
    <button
      id={CART_ICON_TARGET_ID}
      onClick={open}
      aria-label="Open cart"
      className="relative flex h-10 w-10 items-center justify-center rounded-full border border-rose-light text-ink hover:bg-rose-light/30"
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M3 3h2l.4 2M7 13h10l3-8H5.4M7 13L5.4 5M7 13l-2.3 4.6A1 1 0 0 0 5.6 19H17M9 22a1 1 0 1 0 0-2 1 1 0 0 0 0 2Zm8 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <AnimatePresence>
        {count > 0 && (
          <motion.span
            key={count}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 500, damping: 15 }}
            className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-primary px-1 text-xs font-semibold text-white"
          >
            {count}
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}
