import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { response } = await requireAdmin();
  if (response) return response;

  const { id } = await params;
  const order = await prisma.order.findUnique({
    where: { id },
    include: { user: true, items: { include: { product: true } } },
  });
  if (!order) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(order);
}

const STATUSES = ["PLACED", "CONFIRMED", "PACKED", "SHIPPED", "DELIVERED", "CANCELLED"] as const;
const updateStatusSchema = z.object({ status: z.enum(STATUSES) });

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { response } = await requireAdmin();
  if (response) return response;

  const { id } = await params;
  const body = await req.json();
  const parsed = updateStatusSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const existing = await prisma.order.findUnique({ where: { id }, include: { items: true } });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const newStatus = parsed.data.status;
  const isNewlyCancelled = newStatus === "CANCELLED" && existing.status !== "CANCELLED";

  const order = await prisma.$transaction(async (tx) => {
    const updated = await tx.order.update({ where: { id }, data: { status: newStatus } });

    // Restock items if an order is cancelled after stock was already
    // decremented at checkout.
    if (isNewlyCancelled) {
      for (const item of existing.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { increment: item.quantity } },
        });
      }
    }

    return updated;
  });

  // A real deployment would send SMS/email here (Phase 5). Logged instead
  // since there's no SMS/email provider wired up for this demo.
  console.log(`[notify] Order ${order.id} status -> ${newStatus} (would SMS/email customer)`);

  return NextResponse.json(order);
}
