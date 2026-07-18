"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePersonalizationStore, usePersonalizationHydrated } from "@/lib/store/personalization";
import { ProductCard } from "@/components/product/ProductCard";
import { ProductGridSkeleton } from "@/components/product/ProductCardSkeleton";
import type { ProductCardData } from "@/lib/types";
import { toStringArray } from "@/lib/types";

type ApiProduct = ProductCardData & { skinTones: unknown; concerns: unknown };

export function RecommendedForYou() {
  const hydrated = usePersonalizationHydrated();
  const { skinTone, concern, completed } = usePersonalizationStore();
  const [products, setProducts] = useState<ApiProduct[] | null>(null);

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then(setProducts)
      .catch(() => setProducts([]));
  }, []);

  if (!hydrated || !products) {
    return (
      <section className="section mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-6 h-8 w-56 animate-pulse rounded bg-rose-light/30" />
        <ProductGridSkeleton />
      </section>
    );
  }

  const matches = completed
    ? products.filter((p) => {
        const tones = toStringArray(p.skinTones);
        const concerns = toStringArray(p.concerns);
        return (skinTone && tones.includes(skinTone)) || (concern && concerns.includes(concern));
      })
    : [];

  const showing = matches.length > 0 ? matches.slice(0, 4) : products.slice(0, 4);

  return (
    <section id="recommended" className="section mx-auto max-w-6xl px-4 sm:px-6">
      <div className="mb-6 flex items-end justify-between">
        <div>
          <p className="eyebrow">{completed ? "Picked For You" : "Personalize Your Picks"}</p>
          <h2 className="font-display text-display-lg mt-3 font-semibold">
            {completed && matches.length > 0
              ? "Matched to your skin"
              : "Take the 30-second quiz"}
          </h2>
        </div>
        {!completed && (
          <Link
            href="/quiz"
            className="hidden shrink-0 rounded-full bg-rose-primary px-6 py-2.5 text-sm font-semibold text-white hover:bg-rose-primary/90 sm:block"
          >
            Start Quiz
          </Link>
        )}
      </div>

      {!completed && (
        <Link
          href="/quiz"
          className="mb-6 block rounded-full bg-rose-primary px-6 py-3 text-center text-sm font-semibold text-white hover:bg-rose-primary/90 sm:hidden"
        >
          Start Quiz
        </Link>
      )}

      <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
        {showing.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
