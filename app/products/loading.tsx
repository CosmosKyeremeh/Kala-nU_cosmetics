import { ProductGridSkeleton } from "@/components/product/ProductCardSkeleton";

export default function Loading() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <div className="mb-8 h-10 w-64 animate-pulse rounded bg-rose-light/30" />
      <div className="mb-8 h-10 w-full animate-pulse rounded-full bg-rose-light/20" />
      <ProductGridSkeleton />
    </div>
  );
}
