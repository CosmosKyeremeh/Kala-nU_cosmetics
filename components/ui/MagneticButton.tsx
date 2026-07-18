"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

type Props = Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  "onDrag" | "onDragStart" | "onDragEnd" | "onAnimationStart" | "onAnimationEnd" | "onAnimationIteration"
> & {
  strength?: number;
};

// A button that subtly pulls toward the cursor as it approaches, then
// springs back on leave — the "magnetic" feel that makes a primary CTA feel
// alive rather than static. Falls back to a normal button on touch devices
// (no mousemove there, so it just never displaces).
export function MagneticButton({ strength = 0.35, className = "", children, ...props }: Props) {
  const ref = useRef<HTMLButtonElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 300, damping: 20, mass: 0.4 });
  const springY = useSpring(y, { stiffness: 300, damping: 20, mass: 0.4 });

  function handleMouseMove(e: React.MouseEvent<HTMLButtonElement>) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const relX = e.clientX - (rect.left + rect.width / 2);
    const relY = e.clientY - (rect.top + rect.height / 2);
    x.set(relX * strength);
    y.set(relY * strength);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.button
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: springX, y: springY }}
      whileTap={{ scale: 0.94 }}
      className={className}
      {...props}
    >
      {children}
    </motion.button>
  );
}
