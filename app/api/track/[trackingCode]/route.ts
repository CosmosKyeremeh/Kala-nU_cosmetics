import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Public by design — the trackingCode itself (an unguessable cuid) is the
// "credential", the same way a real courier tracking number works. No auth
// required, matching the PRD's "publicly accessible" tracking page.
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ trackingCode: string }> }
) {
  const { trackingCode } = await params;

  const order = await prisma.order.findUnique({
    where: { trackingCode },
    include: { items: { include: { product: true } } },
  });

  if (!order) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({
    id: order.id,
    status: order.status,
    total: order.total,
    shippingAddress: order.shippingAddress,
    city: order.city,
    region: order.region,
    updatedAt: order.updatedAt,
    items: order.items.map((i) => ({
      name: i.product.name,
      quantity: i.quantity,
      unitPrice: i.unitPrice,
    })),
  });
}
