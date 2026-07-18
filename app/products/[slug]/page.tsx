import Image from "next/image";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatGHS, categoryLabel } from "@/lib/utils";
import { toStringArray } from "@/lib/types";
import { ProductDetailActions } from "@/components/product/ProductDetailActions";
import { ProductCard } from "@/components/product/ProductCard";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { TextureVisual } from "@/components/product/TextureVisual";
import { ShadeSelector, type Shade } from "@/components/product/ShadeSelector";
import { BeforeAfterSlider } from "@/components/product/BeforeAfterSlider";
import { ReviewList, type ReviewData } from "@/components/product/ReviewList";
import { UgcGallery } from "@/components/product/UgcGallery";
import { StickyMobileBuyBar } from "@/components/product/StickyMobileBuyBar";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const product = await prisma.product.findUnique({
    where: { slug },
    include: { reviews: { orderBy: { createdAt: "desc" } } },
  });
  if (!product || !product.isPublished) notFound();

  prisma.product
    .update({ where: { id: product.id }, data: { viewCount: { increment: 1 } } })
    .catch(() => {});

  const images = toStringArray(product.images);
  const image = images[0] ?? "/products/rose-glow-body-spray.svg";
  const ingredients = toStringArray(product.ingredients);
  const shades = (product.shades as Shade[] | null) ?? null;
  const ugcPosts = await prisma.ugcPost.findMany({ take: 6, orderBy: { createdAt: "desc" } });

  const reviews: ReviewData[] = product.reviews.map((r) => ({
    id: r.id,
    authorName: r.authorName,
    rating: r.rating,
    body: r.body,
    photos: toStringArray(r.photos),
    skinTone: r.skinTone,
    concern: r.concern,
    createdAt: r.createdAt.toISOString(),
  }));

  const related = await prisma.product.findMany({
    where: { category: product.category, isPublished: true, id: { not: product.id } },
    take: 4,
  });

  return (
    <div className="pb-24 md:pb-0">
      {/* Hero */}
      <section className="mx-auto max-w-6xl px-4 pt-10 pb-6 sm:px-6 sm:pt-16">
        <div className="grid items-center gap-10 md:grid-cols-2">
          <div className="relative aspect-square overflow-hidden rounded-3xl bg-rose-light/10">
            <Image src={image} alt={product.name} fill className="object-cover" priority />
            {product.badge && (
              <span className="absolute left-4 top-4 rounded-full bg-ink px-3 py-1 text-xs font-medium text-cream">
                {product.badge}
              </span>
            )}
          </div>

          <div>
            <p className="eyebrow">{categoryLabel(product.category)}</p>
            <h1 className="font-display text-display-lg mt-3 font-semibold">{product.name}</h1>
            {product.tagline && (
              <p className="mt-3 text-lg text-slate">{product.tagline}</p>
            )}
            <p className="font-display mt-5 text-3xl text-rose-primary">
              {formatGHS(product.price)}
            </p>
            <p className="mt-4 leading-relaxed text-slate">{product.description}</p>
            <p className="mt-2 text-sm text-slate">
              {product.stock > 0 ? `${product.stock} in stock` : "Currently unavailable"}
            </p>

            <div className="mt-8 hidden md:block">
              <ProductDetailActions product={product} image={image} />
            </div>
          </div>
        </div>
      </section>

      {/* Feel the product */}
      <section className="section mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid items-center gap-10 md:grid-cols-2">
          <ScrollReveal>
            <p className="eyebrow">The Feel</p>
            <h2 className="font-display text-display-lg mt-3 font-semibold">
              {product.texture ? "Made to be felt" : "A texture worth talking about"}
            </h2>
            <p className="mt-4 max-w-md leading-relaxed text-slate">
              {product.texture ??
                "A weightless, fast-absorbing feel that disappears into skin — never sticky, never heavy."}
            </p>
          </ScrollReveal>
          <ScrollReveal delay={0.15}>
            <TextureVisual color="#C2185B" />
          </ScrollReveal>
        </div>
      </section>

      {/* Ingredients */}
      {ingredients.length > 0 && (
        <section className="section mx-auto max-w-6xl px-4 sm:px-6">
          <ScrollReveal>
            <p className="eyebrow">Inside the Bottle</p>
            <h2 className="font-display text-display-lg mt-3 mb-8 font-semibold">
              What&apos;s actually in it
            </h2>
            <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {ingredients.map((ingredient) => (
                <li
                  key={ingredient}
                  className="rounded-xl border border-rose-light/40 bg-white px-5 py-4 text-sm text-ink"
                >
                  {ingredient}
                </li>
              ))}
            </ul>
          </ScrollReveal>
        </section>
      )}

      {/* Shade comparison */}
      {shades && shades.length > 0 && (
        <section className="section mx-auto max-w-6xl px-4 sm:px-6">
          <ScrollReveal>
            <p className="eyebrow">Find Your Shade</p>
            <h2 className="font-display text-display-lg mt-3 mb-8 font-semibold">
              Compare shades before you buy
            </h2>
            <ShadeSelector shades={shades} category={product.category} />
          </ScrollReveal>
        </section>
      )}

      {/* Real results */}
      <section className="section mx-auto max-w-6xl px-4 sm:px-6">
        <ScrollReveal>
          <p className="eyebrow">Real Results</p>
          <h2 className="font-display text-display-lg mt-3 mb-8 font-semibold">
            What customers are seeing
          </h2>
        </ScrollReveal>
        <div className="grid gap-10 md:grid-cols-2">
          <ScrollReveal>
            <BeforeAfterSlider beforeColor="#c9a98a" afterColor="#f3d9c4" />
            <p className="mt-2 text-xs text-slate">
              Illustrative before/after — swap in real customer photos once available.
            </p>
          </ScrollReveal>
          <ScrollReveal delay={0.15}>
            <ReviewList reviews={reviews} />
          </ScrollReveal>
        </div>

        {ugcPosts.length > 0 && (
          <ScrollReveal delay={0.1} className="mt-14">
            <p className="mb-4 text-sm font-medium text-slate">As worn by GlowCart customers</p>
            <UgcGallery
              posts={ugcPosts.map((p) => ({
                id: p.id,
                image: p.image,
                caption: p.caption,
                authorHandle: p.authorHandle,
              }))}
            />
          </ScrollReveal>
        )}
      </section>

      {/* Closing CTA — deliberately high-contrast so it reads as a decision
          point, not another content section to skim past. */}
      <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
        <ScrollReveal className="rounded-3xl bg-ink px-6 py-14 text-center text-cream sm:px-16">
          <p className="eyebrow text-rose-light">Ready When You Are</p>
          <h2 className="font-display text-display-lg mt-3 font-semibold">{product.name}</h2>
          <p className="mt-3 text-3xl font-display text-rose-light">{formatGHS(product.price)}</p>
          <div className="mx-auto mt-8 max-w-xs">
            <ProductDetailActions product={product} image={image} />
          </div>
        </ScrollReveal>
      </section>

      {/* Related */}
      {related.length > 0 && (
        <section className="section mx-auto max-w-6xl px-4 sm:px-6">
          <ScrollReveal>
            <h2 className="font-display mb-6 text-3xl font-semibold">You May Also Like</h2>
            <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </ScrollReveal>
        </section>
      )}

      <StickyMobileBuyBar product={product} image={image} />
    </div>
  );
}
