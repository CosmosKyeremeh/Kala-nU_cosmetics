import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCategoryBySlug } from "@/lib/categories";
import { ProductCard } from "@/components/product/ProductCard";
import { HeroBackdrop } from "@/components/ui/HeroBackdrop";

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ sub?: string }>;
}) {
  const { slug } = await params;
  const { sub } = await searchParams;

  const category = getCategoryBySlug(slug);
  if (!category) notFound();

  const products = await prisma.product.findMany({
    where: {
      isPublished: true,
      category: category.value,
      ...(sub ? { subcategory: sub } : {}),
    },
    orderBy: { createdAt: "desc" },
  });

  const activeSubLabel = category.subcategories.find((s) => s.slug === sub)?.label;

  return (
    <div>
      <section className="relative h-[300px] overflow-hidden sm:h-[420px]">
        <HeroBackdrop src={category.image} alt={category.label} priority />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/85 via-charcoal/30 to-transparent" />
        <div className="absolute inset-0 flex flex-col items-center justify-end px-4 pb-10 text-center sm:pb-14">
          <p className="eyebrow text-cream/80">GlowCart</p>
          <h1 className="font-display text-4xl font-semibold text-cream sm:text-5xl">
            {category.label}
          </h1>
          <p className="mt-3 max-w-lg text-sm text-cream/85 sm:text-base">{category.blurb}</p>
        </div>
      </section>

      {category.subcategories.length > 0 && (
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
          <div className="flex flex-wrap justify-center gap-2">
            <Link
              href={`/category/${slug}`}
              className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                !sub
                  ? "border-rose-primary bg-rose-primary text-white"
                  : "border-rose-light bg-white text-ink hover:border-rose-primary hover:text-rose-primary"
              }`}
            >
              All
            </Link>
            {category.subcategories.map((s) => (
              <Link
                key={s.slug}
                href={`/category/${slug}?sub=${s.slug}`}
                className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                  sub === s.slug
                    ? "border-rose-primary bg-rose-primary text-white"
                    : "border-rose-light bg-white text-ink hover:border-rose-primary hover:text-rose-primary"
                }`}
              >
                {s.label}
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
        {products.length === 0 ? (
          <p className="py-20 text-center text-slate">
            More {activeSubLabel ?? category.label.toLowerCase()} arriving soon.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
