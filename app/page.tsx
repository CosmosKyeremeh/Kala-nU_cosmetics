import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/product/ProductCard";
import { RecommendedForYou } from "@/components/product/RecommendedForYou";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { SwipeCarousel } from "@/components/ui/SwipeCarousel";
import { RotatingHero } from "@/components/home/RotatingHero";
import { TOP_CATEGORIES } from "@/lib/categories";
import { toStringArray } from "@/lib/types";
import { formatGHS } from "@/lib/utils";

export default async function Home() {
  const [featured, bestSellers, bundles] = await Promise.all([
    prisma.product.findMany({
      where: { isPublished: true, isFeatured: true },
      take: 8,
      orderBy: { createdAt: "desc" },
    }),
    prisma.product.findMany({
      where: { isPublished: true, badge: "Best Seller" },
      take: 8,
      orderBy: { createdAt: "desc" },
    }),
    prisma.bundle.findMany({ take: 3, orderBy: { createdAt: "desc" } }),
  ]);

  return (
    <div>
      {/* Cinematic hero — rotating backdrop photography behind editorial type */}
      <section className="relative overflow-hidden px-4 py-28 text-center sm:px-6 sm:py-36">
        <RotatingHero />
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal/55 via-charcoal/45 to-charcoal/70" />
        <div className="relative z-10">
          <p className="eyebrow text-cream/80">Ghana&apos;s Premium Cosmetics</p>
          <h1 className="font-display text-hero mx-auto mt-5 max-w-3xl font-semibold text-cream">
            Glow. Nourish. Shine.
          </h1>
          <p className="mx-auto mt-6 max-w-lg text-lg text-cream/85">
            Makeup, skincare, hair care, fragrance and body essentials — crafted for
            Ghana&apos;s climate, made to be felt.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/products"
              className="rounded-full bg-rose-primary px-9 py-4 font-semibold text-white shadow-xl shadow-rose-primary/25 transition hover:bg-rose-primary/90"
            >
              Shop the Collection
            </Link>
            <Link
              href="/quiz"
              className="rounded-full border border-cream/50 bg-white/10 px-9 py-4 font-semibold text-cream backdrop-blur transition hover:border-cream hover:bg-white/20"
            >
              Find Your Shade
            </Link>
          </div>
        </div>
      </section>

      <section className="section mx-auto max-w-6xl px-4 sm:px-6">
        <ScrollReveal>
          <p className="eyebrow">Shop by Category</p>
          <h2 className="font-display text-display-lg mt-3 mb-6 font-semibold">Find your routine</h2>
          <SwipeCarousel>
            {TOP_CATEGORIES.map((cat) => (
              <Link
                key={cat.slug}
                href={`/category/${cat.slug}`}
                className="group relative block h-56 w-40 shrink-0 snap-start overflow-hidden rounded-2xl sm:h-64 sm:w-48"
              >
                <Image
                  src={cat.image}
                  alt={cat.label}
                  fill
                  sizes="(min-width: 640px) 192px, 160px"
                  className="object-cover transition duration-300 group-hover:scale-105"
                  draggable={false}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-charcoal/10 to-transparent" />
                <p className="font-display absolute bottom-4 left-4 right-4 text-lg font-semibold text-white">
                  {cat.label}
                </p>
              </Link>
            ))}
          </SwipeCarousel>
        </ScrollReveal>
      </section>

      {bundles.length > 0 && (
        <section className="section mx-auto max-w-6xl px-4 sm:px-6">
          <ScrollReveal>
            <p className="eyebrow">Smart Bundles</p>
            <h2 className="font-display text-display-lg mt-3 mb-8 font-semibold">
              Curated routines, one price
            </h2>
            <div className="grid gap-6 sm:grid-cols-3">
              {bundles.map((bundle) => {
                const productIds = toStringArray(bundle.productIds);
                return (
                  <Link
                    key={bundle.id}
                    href={`/bundles/${bundle.slug}`}
                    className="group overflow-hidden rounded-2xl border border-rose-light/40 bg-white transition hover:shadow-xl"
                  >
                    <div className="relative aspect-[4/3]" style={{ aspectRatio: "4 / 3" }}>
                      <Image
                        src={bundle.image}
                        alt={bundle.name}
                        fill
                        sizes="(min-width: 640px) 33vw, 100vw"
                        className="object-cover transition duration-300 group-hover:scale-105"
                      />
                    </div>
                    <div className="p-5">
                      <p className="font-display text-xl font-semibold">{bundle.name}</p>
                      <p className="mt-1 text-sm text-slate">{productIds.length} products</p>
                      <p className="font-display mt-2 text-2xl text-rose-primary">
                        {formatGHS(bundle.price)}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </ScrollReveal>
        </section>
      )}

      <section className="section mx-auto max-w-6xl px-4 sm:px-6">
        <ScrollReveal>
          <div className="mb-6 flex items-center justify-between">
            <div>
              <p className="eyebrow">Featured</p>
              <h2 className="font-display text-display-lg mt-3 font-semibold">Editor&apos;s Picks</h2>
            </div>
            <Link href="/products" className="text-sm font-medium text-rose-primary hover:underline">
              View all
            </Link>
          </div>
          <SwipeCarousel>
            {featured.map((product) => (
              <div key={product.id} className="w-[46vw] shrink-0 snap-start sm:w-64">
                <ProductCard product={product} />
              </div>
            ))}
          </SwipeCarousel>
        </ScrollReveal>
      </section>

      {bestSellers.length > 0 && (
        <section className="section mx-auto max-w-6xl px-4 sm:px-6">
          <ScrollReveal>
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="eyebrow">Customer Favourites</p>
                <h2 className="font-display text-display-lg mt-3 font-semibold">Best Sellers</h2>
              </div>
              <Link
                href="/products?badge=Best+Seller"
                className="text-sm font-medium text-rose-primary hover:underline"
              >
                View all
              </Link>
            </div>
            <SwipeCarousel>
              {bestSellers.map((product) => (
                <div key={product.id} className="w-[46vw] shrink-0 snap-start sm:w-64">
                  <ProductCard product={product} />
                </div>
              ))}
            </SwipeCarousel>
          </ScrollReveal>
        </section>
      )}

      <RecommendedForYou />
    </div>
  );
}
