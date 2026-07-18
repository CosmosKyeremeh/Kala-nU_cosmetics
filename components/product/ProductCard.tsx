import Link from "next/link";
import Image from "next/image";
import { formatGHS } from "@/lib/utils";
import { toStringArray, type ProductCardData } from "@/lib/types";
import { AddToCartButton } from "@/components/product/AddToCartButton";

export function ProductCard({ product }: { product: ProductCardData }) {
  const image = toStringArray(product.images)[0] ?? "/products/rose-glow-body-spray.svg";

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-rose-light/40 bg-white transition hover:shadow-lg">
      <Link href={`/products/${product.slug}`} className="relative block aspect-square overflow-hidden bg-rose-light/10">
        <Image
          src={image}
          alt={product.name}
          fill
          sizes="(min-width: 1024px) 280px, 50vw"
          className="object-cover transition duration-300 group-hover:scale-105"
        />
        {product.badge && (
          <span className="absolute left-3 top-3 rounded-full bg-charcoal px-3 py-1 text-xs font-medium text-cream">
            {product.badge}
          </span>
        )}
      </Link>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <Link href={`/products/${product.slug}`} className="font-medium text-charcoal hover:text-rose-primary">
          {product.name}
        </Link>
        <p className="font-display text-lg text-rose-primary">{formatGHS(product.price)}</p>
        <AddToCartButton product={product} image={image} className="mt-auto" />
      </div>
    </div>
  );
}
