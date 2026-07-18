import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { formatGHS } from "@/lib/utils";

export default async function OrderConfirmedPage({
  searchParams,
}: {
  searchParams: Promise<{ orderId?: string }>;
}) {
  const { orderId } = await searchParams;
  const session = await auth();

  if (!orderId || !session?.user) notFound();

  const order = await prisma.order.findFirst({
    where: { id: orderId, userId: session.user.id },
    include: { items: { include: { product: true } } },
  });

  if (!order) notFound();

  return (
    <div className="mx-auto max-w-2xl px-4 py-20 text-center sm:px-6">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-rose-primary text-3xl text-white">
        ✓
      </div>
      <h1 className="font-display mt-6 text-4xl font-semibold">Order Confirmed!</h1>
      <p className="mt-2 text-slate">
        Thank you — your order <strong>#{order.id.slice(-8).toUpperCase()}</strong> has been
        placed.
      </p>
      <p className="mt-1 text-sm text-slate">
        Tracking code: <span className="font-mono">{order.trackingCode}</span>
      </p>

      <div className="mt-10 rounded-2xl border border-rose-light/40 bg-white p-6 text-left">
        <ul className="divide-y divide-rose-light/40">
          {order.items.map((item) => (
            <li key={item.id} className="flex justify-between py-3 text-sm">
              <span>
                {item.product.name} × {item.quantity}
              </span>
              <span>{formatGHS(item.unitPrice * item.quantity)}</span>
            </li>
          ))}
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

      <Link
        href="/products"
        className="mt-8 inline-block rounded-full bg-rose-primary px-8 py-3 font-semibold text-white hover:bg-rose-primary/90"
      >
        Continue Shopping
      </Link>
    </div>
  );
}
