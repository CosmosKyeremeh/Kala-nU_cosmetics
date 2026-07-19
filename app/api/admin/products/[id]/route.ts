import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import { slugify } from "@/lib/utils";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { response } = await requireAdmin();
  if (response) return response;

  const { id } = await params;
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(product);
}

const updateProductSchema = z.object({
  name: z.string().min(2),
  slug: z.string().optional(),
  description: z.string().min(10),
  tagline: z.string().optional(),
  price: z.number().positive(),
  category: z.enum([
    "MAKEUP",
    "SKINCARE",
    "HAIR_CARE",
    "BATH_BODY",
    "FRAGRANCE",
    "GIFT_SETS",
    "TOOLS_ACCESSORIES",
  ]),
  subcategory: z.string().nullable().optional(),
  stock: z.number().int().min(0),
  badge: z.string().nullable().optional(),
  images: z.array(z.string()).min(1),
  isFeatured: z.boolean().optional(),
  isPublished: z.boolean().optional(),
  texture: z.string().optional(),
  ingredients: z.array(z.string()).optional(),
});

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { response } = await requireAdmin();
  if (response) return response;

  const { id } = await params;
  const body = await req.json();
  const parsed = updateProductSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message }, { status: 400 });
  }

  const data = parsed.data;
  const slug = data.slug ? slugify(data.slug) : slugify(data.name);

  const product = await prisma.product.update({
    where: { id },
    data: { ...data, slug },
  });

  return NextResponse.json(product);
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { response } = await requireAdmin();
  if (response) return response;

  const { id } = await params;
  // Soft delete — unpublish rather than hard-delete, so past orders that
  // reference this product (OrderItem.productId) never break.
  const product = await prisma.product.update({
    where: { id },
    data: { isPublished: false },
  });

  return NextResponse.json(product);
}
