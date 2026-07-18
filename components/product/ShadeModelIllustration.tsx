"use client";

import { motion } from "framer-motion";

// A simple illustrated face used to compare shades on a consistent "model" —
// not a real photo or live camera try-on. It exists so shade swatches have
// somewhere to preview onto; swap for real model photography or a live
// AR try-on (a separate, camera-based phase) later.
export function ShadeModelIllustration({
  area,
  color,
}: {
  area: "LIP_CARE" | "SKINCARE" | "BLUSH";
  color: string;
}) {
  return (
    <svg viewBox="0 0 500 600" className="h-full w-full">
      <rect width="500" height="600" fill="#FFF8F0" />
      <ellipse cx="250" cy="270" rx="150" ry="190" fill="#EFC9A8" />
      <ellipse cx="185" cy="230" rx="14" ry="18" fill="#2b2320" />
      <ellipse cx="315" cy="230" rx="14" ry="18" fill="#2b2320" />
      <path d="M 190 190 Q 185 180 165 182" stroke="#6b4a30" strokeWidth="6" fill="none" strokeLinecap="round" />
      <path d="M 310 190 Q 315 180 335 182" stroke="#6b4a30" strokeWidth="6" fill="none" strokeLinecap="round" />

      <motion.ellipse
        cx="205"
        cy="300"
        rx="18"
        ry="11"
        animate={{ fill: area === "BLUSH" ? color : "#dba983" }}
        transition={{ duration: 0.25 }}
        opacity={area === "BLUSH" ? 0.85 : 0.4}
      />
      <motion.ellipse
        cx="295"
        cy="300"
        rx="18"
        ry="11"
        animate={{ fill: area === "BLUSH" ? color : "#dba983" }}
        transition={{ duration: 0.25 }}
        opacity={area === "BLUSH" ? 0.85 : 0.4}
      />

      <motion.path
        d="M 190 380 Q 250 410 310 380 Q 250 400 190 380 Z"
        animate={{ fill: area === "LIP_CARE" ? color : "#a15c4a" }}
        transition={{ duration: 0.25 }}
      />

      {area === "SKINCARE" && (
        <motion.ellipse
          cx="250"
          cy="270"
          rx="150"
          ry="190"
          animate={{ fill: color }}
          transition={{ duration: 0.25 }}
          opacity={0.16}
        />
      )}
    </svg>
  );
}
