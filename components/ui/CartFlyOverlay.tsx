"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useFlyStore } from "@/lib/store/fly";

// Renders the "product flies into the cart" flourish that fires whenever
// AddToCartButton launches one. Lives once at the root layout so it can
// animate across the whole viewport regardless of where the button was.
export function CartFlyOverlay() {
  const items = useFlyStore((s) => s.items);
  const remove = useFlyStore((s) => s.remove);

  return (
    <div className="pointer-events-none fixed inset-0 z-[60]">
      <AnimatePresence>
        {items.map((item) => (
          <motion.img
            key={item.id}
            src={item.image}
            alt=""
            initial={{
              position: "fixed",
              left: item.from.x,
              top: item.from.y,
              width: item.from.width,
              height: item.from.height,
              opacity: 1,
              scale: 1,
              borderRadius: 12,
            }}
            animate={{
              left: item.to.x - 12,
              top: item.to.y - 12,
              width: 24,
              height: 24,
              opacity: 0.4,
              scale: 0.6,
            }}
            transition={{ duration: 0.65, ease: [0.32, 0, 0.67, 0] }}
            onAnimationComplete={() => remove(item.id)}
            className="object-cover shadow-lg"
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
