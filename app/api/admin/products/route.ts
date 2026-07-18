import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import { slugify } from "@/lib/utils";
import { generateProductQr } from "@/lib/qrcode";
import type { Prisma } from "@prisma/client";

export async function GET(req: Request) {
  const { response } = await requireAdmin();
  if (response) return response;

  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search");
  const category = searchParams.get("category");
  const page = Math.max(1, Number(searchParams.get("page") ?? "1"));
  const pageSize = 10;

  const where: Prisma.ProductWhereInput = {};
  if (search) where.name = { contains: search };
  if (category) where.category = category;

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.product.count({ where }),
  ]);

  return NextResponse.json({ products, total, page, pageSize });
}

const createProductSchema = z.object({
  name: z.string().min(2),
  slug: z.string().optional(),
  description: z.string().min(10),
  tagline: z.string().optional(),
  price: z.number().positive(),
  category: z.enum(["BODY_SPRAY", "SKINCARE", "DEODORANT", "LIP_CARE", "HAIR_CARE", "OTHER"]),
  stock: z.number().int().min(0),
  badge: z.string().nullable().optional(),
  images: z.array(z.string()).min(1),
  isFeatured: z.boolean().optional(),
  isPublished: z.boolean().optional(),
  texture: z.string().optional(),
  ingredients: z.array(z.string()).optional(),
});

export async function POST(req: Request) {
  const { response } = await requireAdmin();
  if (response) return response;

  const body = await req.json();
  const parsed = createProductSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message }, { status: 400 });
  }

  const data = parsed.data;
  const slug = data.slug ? slugify(data.slug) : slugify(data.name);

  const product = await prisma.product.create({
    data: { ...data, slug },
  });

  const qrCode = await generateProductQr(product.id);
  const withQr = await prisma.product.update({ where: { id: product.id }, data: { qrCode } });

  return NextResponse.json(withQr, { status: 201 });
}
