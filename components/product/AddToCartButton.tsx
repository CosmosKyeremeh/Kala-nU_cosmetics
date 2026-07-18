"use client";

import toast from "react-hot-toast";
import { useCartStore } from "@/lib/store/cart";
import { useFlyStore } from "@/lib/store/fly";
import { hapticTap } from "@/lib/haptics";
import { MagneticButton } from "@/components/ui/MagneticButton";
import type { ProductCardData } from "@/lib/types";

export function AddToCartButton({
  product,
  image,
  quantity = 1,
  className = "",
}: {
  product: ProductCardData;
  image: string;
  quantity?: number;
  className?: string;
}) {
  const addItem = useCartStore((s) => s.addItem);
  const launch = useFlyStore((s) => s.launch);

  const outOfStock = product.stock <= 0;

  return (
    <MagneticButton
      disabled={outOfStock}
      onClick={(e) => {
        e.preventDefault();
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
      className={`rounded-full bg-rose-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-primary/90 disabled:cursor-not-allowed disabled:bg-slate/40 ${className}`}
    >
      {outOfStock ? "Out of stock" : "Add to Cart"}
    </MagneticButton>
  );
}
