import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");
  const subcategory = searchParams.get("subcategory");
  const search = searchParams.get("search");
  const sort = searchParams.get("sort");
  const badge = searchParams.get("badge");
  const minPrice = searchParams.get("minPrice");
  const maxPrice = searchParams.get("maxPrice");

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

  return NextResponse.json(products);
}
