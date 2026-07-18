"use client";

import { formatGHS } from "@/lib/utils";
import { AddToCartButton } from "@/components/product/AddToCartButton";
import type { ProductCardData } from "@/lib/types";

// Thumb-reachable primary action, pinned to the bottom of the viewport on
// mobile where the natural one-thumb tap zone is the bottom third of the
// screen — the in-flow "Add to Cart" button further up the page is easy to
// scroll past on a long cinematic page.
export function StickyMobileBuyBar({
  product,
  image,
}: {
  product: ProductCardData;
  image: string;
}) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-30 flex items-center gap-3 border-t border-rose-light/40 bg-cream/95 p-3 backdrop-blur md:hidden">
      <div className="flex-1">
        <p className="truncate text-sm font-medium text-ink">{product.name}</p>
        <p className="font-display text-lg text-rose-primary">{formatGHS(product.price)}</p>
      </div>
      <AddToCartButton product={product} image={image} className="!px-6 !py-3" />
    </div>
  );
}
