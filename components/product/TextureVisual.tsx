"use client";

import { motion } from "framer-motion";

// A "feel the product" visual — an animated, morphing gradient blob with a
// light sweep to suggest cream texture / gloss shine, since there's no real
// product-application video to work with yet. Swap for real macro footage
// (cream spreading, gloss catching light) when available.
export function TextureVisual({ color = "#C2185B" }: { color?: string }) {
  return (
    <div className="relative flex h-72 w-full items-center justify-center overflow-hidden rounded-3xl bg-gradient-to-br from-cream to-rose-light/30 sm:h-96">
      <motion.div
        className="absolute h-56 w-56 sm:h-72 sm:w-72"
        style={{
          background: `radial-gradient(circle at 30% 30%, ${color}dd, ${color}55 60%, transparent 80%)`,
        }}
        animate={{
          borderRadius: [
            "60% 40% 55% 45% / 50% 60% 40% 50%",
            "45% 55% 40% 60% / 55% 45% 55% 45%",
            "60% 40% 55% 45% / 50% 60% 40% 50%",
          ],
          scale: [1, 1.08, 1],
          rotate: [0, 8, 0],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute inset-0"
        initial={{ x: "-120%" }}
        whileInView={{ x: "120%" }}
        viewport={{ once: true }}
        transition={{ duration: 1.4, ease: "easeInOut", delay: 0.2 }}
        style={{
          background:
            "linear-gradient(75deg, transparent 40%, rgba(255,255,255,0.55) 50%, transparent 60%)",
        }}
      />
    </div>
  );
}
