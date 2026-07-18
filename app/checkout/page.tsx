"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import { useCartStore, useCartHydrated, cartSubtotal } from "@/lib/store/cart";
import { formatGHS, calculateDeliveryFee, GHANA_REGIONS } from "@/lib/utils";
import { MockPaystackModal } from "@/components/checkout/MockPaystackModal";

export default function CheckoutPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { items, clear } = useCartStore();
  const hydrated = useCartHydrated();
  const [showPaystack, setShowPaystack] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    shippingAddress: "",
    city: "",
    region: GHANA_REGIONS[0] as string,
    phone: "",
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login?callbackUrl=/checkout");
    }
  }, [status, router]);

  if (!hydrated || status === "loading" || status === "unauthenticated") return null;

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center sm:px-6">
        <h1 className="font-display text-3xl font-semibold">Your cart is empty</h1>
      </div>
    );
  }

  const subtotal = cartSubtotal(items);
  const deliveryFee = calculateDeliveryFee(subtotal);
  const total = subtotal + deliveryFee;

  function handleFormSubmit(e: React.FormEvent) {
    e.preventDefault();
    setShowPaystack(true);
  }

  async function handlePaymentSuccess(reference: string) {
    setShowPaystack(false);
    setSubmitting(true);

    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
        ...form,
        paymentRef: reference,
      }),
    });

    const data = await res.json();
    setSubmitting(false);

    if (!res.ok) {
      toast.error(data.error ?? "Could not place order");
      return;
    }

    clear();
    router.push(`/order-confirmed?orderId=${data.id}`);
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <h1 className="font-display mb-8 text-4xl font-semibold">Checkout</h1>

      <div className="grid gap-10 md:grid-cols-2">
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium">Delivery Address</label>
            <input
              required
              value={form.shippingAddress}
              onChange={(e) => setForm({ ...form, shippingAddress: e.target.value })}
              placeholder="House number, street"
              className="w-full rounded-lg border border-rose-light px-4 py-2.5"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">City</label>
            <input
              required
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
              className="w-full rounded-lg border border-rose-light px-4 py-2.5"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Region</label>
            <select
              value={form.region}
              onChange={(e) => setForm({ ...form, region: e.target.value })}
              className="w-full rounded-lg border border-rose-light px-4 py-2.5"
            >
              {GHANA_REGIONS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Phone Number</label>
            <input
              required
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="0244000000"
              className="w-full rounded-lg border border-rose-light px-4 py-2.5"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-full bg-rose-primary py-3 font-semibold text-white hover:bg-rose-primary/90 disabled:opacity-60"
          >
            {submitting ? "Placing order..." : `Pay with Paystack — ${formatGHS(total)}`}
          </button>
        </form>

        <div className="h-fit rounded-2xl border border-rose-light/40 bg-white p-6">
          <h2 className="font-display mb-4 text-xl font-semibold">Order Summary</h2>
          <ul className="space-y-2 text-sm">
            {items.map((item) => (
              <li key={item.productId} className="flex justify-between">
                <span>
                  {item.name} × {item.quantity}
                </span>
                <span>{formatGHS(item.price * item.quantity)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 space-y-1 border-t border-rose-light/40 pt-4 text-sm">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{formatGHS(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery</span>
              <span>{deliveryFee === 0 ? "Free" : formatGHS(deliveryFee)}</span>
            </div>
            <div className="flex justify-between font-display text-lg">
              <span>Total</span>
              <span>{formatGHS(total)}</span>
            </div>
          </div>
        </div>
      </div>

      {showPaystack && (
        <MockPaystackModal
          amount={total}
          email={session?.user?.email ?? ""}
          onClose={() => setShowPaystack(false)}
          onSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
}
