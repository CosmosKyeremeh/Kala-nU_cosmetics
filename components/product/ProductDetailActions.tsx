"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { useCartStore } from "@/lib/store/cart";
import { useFlyStore } from "@/lib/store/fly";
import { hapticTap } from "@/lib/haptics";
import { MagneticButton } from "@/components/ui/MagneticButton";
import type { ProductCardData } from "@/lib/types";

export function ProductDetailActions({
  product,
  image,
}: {
  product: ProductCardData;
  image: string;
}) {
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore((s) => s.addItem);
  const launch = useFlyStore((s) => s.launch);
  const outOfStock = product.stock <= 0;

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center rounded-full border border-rose-light">
        <button
          className="h-11 w-11 text-lg"
          onClick={() => setQuantity((q) => Math.max(1, q - 1))}
        >
          −
        </button>
        <span className="w-8 text-center">{quantity}</span>
        <button
          className="h-11 w-11 text-lg"
          onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
        >
          +
        </button>
      </div>
      <MagneticButton
        disabled={outOfStock}
        onClick={(e) => {
          launch(image, e.currentTarget);
          hapticTap();
          addItem(
            {
              productId: product.id,
              name: product.name,
              slug: product.slug,
              price: product.price,
              image,
              stock: product.stock,
            },
            quantity
          );
          toast.success(`${product.name} added to cart`);
        }}
        className="flex-1 rounded-full bg-rose-primary py-3 font-semibold text-white transition hover:bg-rose-primary/90 disabled:cursor-not-allowed disabled:bg-slate/40"
      >
        {outOfStock ? "Out of Stock" : "Add to Cart"}
      </MagneticButton>
    </div>
  );
}
