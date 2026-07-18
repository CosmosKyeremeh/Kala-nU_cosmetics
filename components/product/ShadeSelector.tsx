"use client";

import { useState } from "react";
import { motion, AnimatePresence, type PanInfo } from "framer-motion";
import { ShadeModelIllustration } from "@/components/product/ShadeModelIllustration";

export type Shade = { name: string; hex: string };

export function ShadeSelector({
  shades,
  category,
  onSelect,
}: {
  shades: Shade[];
  category: string;
  onSelect?: (shade: Shade) => void;
}) {
  const [index, setIndex] = useState(0);
  const [previewIndex, setPreviewIndex] = useState<number | null>(null);
  const [direction, setDirection] = useState(0);

  const active = shades[previewIndex ?? index];
  const area = category === "LIP_CARE" ? "LIP_CARE" : category === "SKINCARE" ? "SKINCARE" : "BLUSH";

  function goTo(next: number) {
    const clamped = Math.max(0, Math.min(shades.length - 1, next));
    setDirection(clamped > index ? 1 : -1);
    setIndex(clamped);
    setPreviewIndex(null);
    onSelect?.(shades[clamped]);
  }

  function handleDragEnd(_: unknown, info: PanInfo) {
    if (info.offset.x < -60) goTo(index + 1);
    else if (info.offset.x > 60) goTo(index - 1);
  }

  return (
    <div>
      <div className="relative aspect-[5/6] w-full max-w-xs overflow-hidden rounded-2xl bg-rose-light/10">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={active.hex}
            custom={direction}
            initial={{ x: direction * 80, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -direction * 80, opacity: 0 }}
            transition={{ duration: 0.3 }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={handleDragEnd}
            className="absolute inset-0 cursor-grab active:cursor-grabbing"
          >
            <ShadeModelIllustration area={area} color={active.hex} />
          </motion.div>
        </AnimatePresence>
        <p className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-ink/70 px-3 py-1 text-xs text-cream">
          Swipe to compare · {active.name}
        </p>
      </div>

      <div className="mt-4 flex flex-wrap gap-3">
        {shades.map((shade, i) => (
          <button
            key={shade.hex}
            type="button"
            aria-label={`Preview shade ${shade.name}`}
            onMouseEnter={() => setPreviewIndex(i)}
            onMouseLeave={() => setPreviewIndex(null)}
            onClick={() => goTo(i)}
            className={`h-9 w-9 rounded-full border-2 transition ${
              i === index ? "border-ink scale-110" : "border-white"
            } shadow-md`}
            style={{ backgroundColor: shade.hex }}
          />
        ))}
      </div>
      <p className="mt-2 text-sm text-slate">
        Hover a swatch to preview instantly, tap to select — currently{" "}
        <span className="font-medium text-ink">{shades[index].name}</span>.
      </p>
    </div>
  );
}
