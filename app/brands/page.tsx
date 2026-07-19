import Link from "next/link";

export default function BrandsPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-24 text-center sm:px-6">
      <p className="eyebrow">Brands</p>
      <h1 className="font-display mt-3 text-4xl font-semibold">One house, one standard</h1>
      <p className="mt-4 text-slate">
        Every product on GlowCart is formulated and finished in-house — we don&apos;t carry
        third-party brands yet, so there&apos;s no brand directory to browse. That may change as
        we grow.
      </p>
      <Link
        href="/products"
        className="mt-8 inline-block rounded-full bg-rose-primary px-8 py-3 font-semibold text-white hover:bg-rose-primary/90"
      >
        Shop the Collection
      </Link>
    </div>
  );
}
