"use client";

import { useEffect, useState } from "react";
import { HeroBackdrop } from "@/components/ui/HeroBackdrop";

const HERO_IMAGES = [
  "/images/categories/makeup-hero.jpg",
  "/images/categories/skincare-hero.jpg",
  "/images/categories/fragrance-hero.jpg",
  "/images/categories/bathbody-hero.jpg",
  "/images/categories/haircare-hero.jpg",
];

export function RotatingHero() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % HERO_IMAGES.length);
    }, 5000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden">
      {HERO_IMAGES.map((src, i) => (
        <div
          key={src}
          className="absolute inset-0 transition-opacity duration-1000 ease-out"
          style={{ opacity: i === index ? 1 : 0 }}
        >
          <HeroBackdrop src={src} alt="" priority={i === 0} />
        </div>
      ))}
    </div>
  );
}
