export default function Loading() {
  return (
    <div className="mx-auto max-w-6xl px-4 pt-10 pb-6 sm:px-6 sm:pt-16">
      <div className="grid items-center gap-10 md:grid-cols-2">
        <div className="aspect-square animate-pulse rounded-3xl bg-rose-light/20" />
        <div className="space-y-4">
          <div className="h-4 w-32 animate-pulse rounded bg-rose-light/30" />
          <div className="h-10 w-3/4 animate-pulse rounded bg-rose-light/30" />
          <div className="h-6 w-1/2 animate-pulse rounded bg-rose-light/20" />
          <div className="h-24 w-full animate-pulse rounded bg-rose-light/20" />
        </div>
      </div>
    </div>
  );
}
