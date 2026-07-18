import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import { sendOrderStatusSms, sendOrderStatusEmail } from "@/lib/notifications";
import { formatGHS } from "@/lib/utils";

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

  const existing = await prisma.order.findUnique({
    where: { id },
    include: { items: true, user: true },
  });
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

  // Notifications are best-effort — a failure here must never fail the
  // status update response itself.
  if (existing.user.notificationsEnabled) {
    try {
      if (existing.user.phone) {
        sendOrderStatusSms({
          phone: existing.user.phone,
          name: existing.user.name,
          orderId: order.id.slice(-8).toUpperCase(),
          status: newStatus,
          total: formatGHS(order.total),
        });
      }
      sendOrderStatusEmail({
        email: existing.user.email,
        name: existing.user.name,
        orderId: order.id.slice(-8).toUpperCase(),
        status: newStatus,
        trackingCode: order.trackingCode,
      });
    } catch (err) {
      console.error("[notify] failed to send order status notification", err);
    }
  }

  return NextResponse.json(order);
}
