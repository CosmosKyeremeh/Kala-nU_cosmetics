export function ProductCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-rose-light/40 bg-white">
      <div className="aspect-square animate-pulse bg-rose-light/20" />
      <div className="space-y-2 p-4">
        <div className="h-4 w-3/4 animate-pulse rounded bg-rose-light/30" />
        <div className="h-5 w-1/3 animate-pulse rounded bg-rose-light/30" />
        <div className="h-9 w-full animate-pulse rounded-full bg-rose-light/20" />
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}
