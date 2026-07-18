import Image from "next/image";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatGHS } from "@/lib/utils";
import { toStringArray } from "@/lib/types";
import { ProductCard } from "@/components/product/ProductCard";

export default async function BundleDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const bundle = await prisma.bundle.findUnique({ where: { slug } });
  if (!bundle) notFound();

  const productIds = toStringArray(bundle.productIds);
  const products = await prisma.product.findMany({ where: { id: { in: productIds } } });
  const fullPrice = products.reduce((sum, p) => sum + p.price, 0);
  const savings = fullPrice - bundle.price;

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <div className="grid gap-10 md:grid-cols-2">
        <div
          className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-rose-light/10"
          style={{ aspectRatio: "4 / 3" }}
        >
          <Image
            src={bundle.image}
            alt={bundle.name}
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover"
          />
        </div>
        <div>
          <p className="eyebrow">Smart Bundle</p>
          <h1 className="font-display text-display-lg mt-3 font-semibold">{bundle.name}</h1>
          <p className="mt-4 leading-relaxed text-slate">{bundle.description}</p>
          <div className="mt-6 flex items-baseline gap-3">
            <p className="font-display text-3xl text-rose-primary">{formatGHS(bundle.price)}</p>
            {savings > 0 && (
              <p className="text-sm text-slate line-through">{formatGHS(fullPrice)}</p>
            )}
          </div>
          {savings > 0 && (
            <p className="mt-1 text-sm font-medium text-rose-primary">
              Save {formatGHS(savings)} vs. buying separately
            </p>
          )}
        </div>
      </div>

      <section className="mt-16">
        <h2 className="font-display mb-6 text-3xl font-semibold">What&apos;s Included</h2>
        <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
}
