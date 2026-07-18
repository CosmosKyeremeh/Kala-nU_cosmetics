import Image from "next/image";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatGHS } from "@/lib/utils";
import { toStringArray } from "@/lib/types";
import { OrderStatusUpdater } from "@/components/admin/OrderStatusUpdater";

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await prisma.order.findUnique({
    where: { id },
    include: { user: true, items: { include: { product: true } } },
  });
  if (!order) notFound();

  return (
    <div className="max-w-3xl">
      <h1 className="font-display mb-1 text-3xl font-semibold">
        Order #{order.id.slice(-8).toUpperCase()}
      </h1>
      <p className="mb-6 text-sm text-slate">
        Placed {new Date(order.createdAt).toLocaleString("en-GH")} · Tracking: {order.trackingCode}
      </p>

      <div className="mb-6 rounded-2xl border border-rose-light/40 bg-white p-5">
        <h2 className="mb-3 font-medium">Status</h2>
        <OrderStatusUpdater orderId={order.id} currentStatus={order.status} />
      </div>

      <div className="mb-6 grid gap-6 sm:grid-cols-2">
        <div className="rounded-2xl border border-rose-light/40 bg-white p-5">
          <h2 className="mb-3 font-medium">Customer</h2>
          <p className="text-sm">{order.user.name}</p>
          <p className="text-sm text-slate">{order.user.email}</p>
          <p className="text-sm text-slate">{order.phone}</p>
        </div>
        <div className="rounded-2xl border border-rose-light/40 bg-white p-5">
          <h2 className="mb-3 font-medium">Shipping Address</h2>
          <p className="text-sm">{order.shippingAddress}</p>
          <p className="text-sm text-slate">
            {order.city}, {order.region}
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-rose-light/40 bg-white p-5">
        <h2 className="mb-3 font-medium">Items</h2>
        <ul className="divide-y divide-rose-light/20">
          {order.items.map((item) => {
            const image = toStringArray(item.product.images)[0];
            return (
              <li key={item.id} className="flex items-center gap-3 py-3">
                {image && (
                  <div className="relative h-12 w-12 overflow-hidden rounded-lg">
                    <Image src={image} alt="" fill className="object-cover" />
                  </div>
                )}
                <div className="flex-1 text-sm">
                  <p>{item.product.name}</p>
                  <p className="text-slate">
                    {item.quantity} × {formatGHS(item.unitPrice)}
                  </p>
                </div>
                <p className="text-sm font-medium">{formatGHS(item.unitPrice * item.quantity)}</p>
              </li>
            );
          })}
        </ul>
        <div className="mt-4 space-y-1 border-t border-rose-light/40 pt-4 text-sm">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>{formatGHS(order.subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span>Delivery</span>
            <span>{order.deliveryFee === 0 ? "Free" : formatGHS(order.deliveryFee)}</span>
          </div>
          <div className="flex justify-between font-display text-lg">
            <span>Total</span>
            <span>{formatGHS(order.total)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
