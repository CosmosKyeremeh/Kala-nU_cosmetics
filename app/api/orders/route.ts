import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { calculateDeliveryFee } from "@/lib/utils";

const createOrderSchema = z.object({
  items: z
    .array(
      z.object({
        productId: z.string(),
        quantity: z.number().int().positive(),
      })
    )
    .min(1, "Cart is empty"),
  shippingAddress: z.string().min(3),
  city: z.string().min(2),
  region: z.string().min(2),
  phone: z.string().min(9),
  paymentRef: z.string(),
});

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const body = await req.json();
  const parsed = createOrderSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 }
    );
  }

  const { items, shippingAddress, city, region, phone, paymentRef } = parsed.data;

  const productIds = items.map((i) => i.productId);
  const products = await prisma.product.findMany({
    where: { id: { in: productIds } },
  });

  if (products.length !== productIds.length) {
    return NextResponse.json({ error: "Some products are no longer available" }, { status: 400 });
  }

  for (const item of items) {
    const product = products.find((p) => p.id === item.productId);
    if (!product || product.stock < item.quantity) {
      return NextResponse.json(
        { error: `Insufficient stock for ${product?.name ?? "an item"}` },
        { status: 400 }
      );
    }
  }

  const subtotal = items.reduce((sum, item) => {
    const product = products.find((p) => p.id === item.productId)!;
    return sum + product.price * item.quantity;
  }, 0);
  const deliveryFee = calculateDeliveryFee(subtotal);
  const total = subtotal + deliveryFee;

  const order = await prisma.$transaction(async (tx) => {
    const created = await tx.order.create({
      data: {
        userId: session.user.id,
        subtotal,
        deliveryFee,
        total,
        status: "CONFIRMED",
        paymentRef,
        paymentStatus: "paid",
        shippingAddress,
        city,
        region,
        phone,
        items: {
          create: items.map((item) => {
            const product = products.find((p) => p.id === item.productId)!;
            return {
              productId: item.productId,
              quantity: item.quantity,
              unitPrice: product.price,
            };
          }),
        },
      },
      include: { items: true },
    });

    for (const item of items) {
      await tx.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } },
      });
    }

    return created;
  });

  return NextResponse.json(order, { status: 201 });
}
