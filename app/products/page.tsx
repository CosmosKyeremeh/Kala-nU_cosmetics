import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/product/ProductCard";
import { ProductFilters } from "@/components/product/ProductFilters";
import type { Prisma } from "@prisma/client";

type SearchParams = { [key: string]: string | undefined };

async function ProductResults({ searchParams }: { searchParams: SearchParams }) {
  const { category, subcategory, search, sort, badge, minPrice, maxPrice } = searchParams;

  const where: Prisma.ProductWhereInput = { isPublished: true };
  if (category) where.category = category;
  if (subcategory) where.subcategory = subcategory;
  if (badge) where.badge = badge;
  if (search) where.name = { contains: search };
  if (minPrice || maxPrice) {
    where.price = {
      ...(minPrice ? { gte: Number(minPrice) } : {}),
      ...(maxPrice ? { lte: Number(maxPrice) } : {}),
    };
  }

  const orderBy: Prisma.ProductOrderByWithRelationInput =
    sort === "price-asc"
      ? { price: "asc" }
      : sort === "price-desc"
        ? { price: "desc" }
        : sort === "popular"
          ? { viewCount: "desc" }
          : { createdAt: "desc" };

  const products = await prisma.product.findMany({ where, orderBy });

  if (products.length === 0) {
    return <p className="py-20 text-center text-slate">No products match your filters.</p>;
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <h1 className="font-display mb-8 text-4xl font-semibold">Shop All Products</h1>
      <Suspense>
        <ProductFilters />
      </Suspense>
      <ProductResults searchParams={params} />
    </div>
  );
}
