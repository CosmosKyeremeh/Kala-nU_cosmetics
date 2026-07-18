import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { OrderTimeline } from "@/components/track/OrderTimeline";

export default async function TrackOrderPage({
  params,
}: {
  params: Promise<{ trackingCode: string }>;
}) {
  const { trackingCode } = await params;

  const order = await prisma.order.findUnique({
    where: { trackingCode },
    include: { items: { include: { product: true } } },
  });
  if (!order) notFound();

  const initialOrder = {
    id: order.id,
    status: order.status,
    total: order.total,
    shippingAddress: order.shippingAddress,
    city: order.city,
    region: order.region,
    items: order.items.map((i) => ({
      name: i.product.name,
      quantity: i.quantity,
      unitPrice: i.unitPrice,
    })),
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <h1 className="font-display mb-1 text-3xl font-semibold">Track Your Order</h1>
      <p className="mb-8 text-sm text-slate">Order #{order.id.slice(-8).toUpperCase()}</p>
      <OrderTimeline trackingCode={trackingCode} initialOrder={initialOrder} />
    </div>
  );
}
