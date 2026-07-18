"use client";

import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { formatGHS } from "@/lib/utils";

const STEPS = ["PLACED", "CONFIRMED", "PACKED", "SHIPPED", "DELIVERED"] as const;

const ESTIMATES: Record<string, string> = {
  PLACED: "Your order has been received.",
  CONFIRMED: "We're preparing your order.",
  PACKED: "Packed and ready for shipping.",
  SHIPPED: "On its way — expected delivery in 1-3 days.",
  DELIVERED: "Delivered. Enjoy your products!",
  CANCELLED: "This order was cancelled.",
};

export type TrackedOrder = {
  id: string;
  status: string;
  total: number;
  shippingAddress: string;
  city: string;
  region: string;
  items: { name: string; quantity: number; unitPrice: number }[];
};

// Polls the tracking endpoint every few seconds rather than subscribing to
// a websocket/Pusher channel — no real-time service account needed, and
// for a low-traffic demo the UX difference (a few seconds of latency) is
// invisible.
const POLL_INTERVAL_MS = 5000;

export function OrderTimeline({
  trackingCode,
  initialOrder,
}: {
  trackingCode: string;
  initialOrder: TrackedOrder;
}) {
  const [order, setOrder] = useState(initialOrder);
  const statusRef = useRef(initialOrder.status);

  useEffect(() => {
    const interval = setInterval(() => {
      fetch(`/api/track/${trackingCode}`)
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (!data) return;
          if (data.status !== statusRef.current) {
            statusRef.current = data.status;
            setOrder(data);
            toast.success(`Order status updated: ${data.status}`);
          }
        })
        .catch(() => {});
    }, POLL_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [trackingCode]);

  function copyLink() {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Tracking link copied");
  }

  const isCancelled = order.status === "CANCELLED";
  const currentIndex = STEPS.indexOf(order.status as (typeof STEPS)[number]);

  return (
    <div>
      {isCancelled ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
          <p className="font-medium text-red-700">This order has been cancelled.</p>
        </div>
      ) : (
        <div className="flex items-center justify-between overflow-x-auto pb-4">
          {STEPS.map((step, i) => {
            const done = i < currentIndex;
            const active = i === currentIndex;
            return (
              <div key={step} className="flex flex-1 items-center last:flex-none">
                <div className="flex flex-col items-center gap-2">
                  <div
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                      done
                        ? "bg-green-500 text-white"
                        : active
                          ? "animate-pulse bg-rose-primary text-white"
                          : "bg-rose-light/30 text-slate"
                    }`}
                  >
                    {done ? "✓" : i + 1}
                  </div>
                  <span
                    className={`whitespace-nowrap text-xs ${active ? "font-semibold text-rose-primary" : "text-slate"}`}
                  >
                    {step}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className={`mx-2 h-0.5 flex-1 ${done ? "bg-green-500" : "bg-rose-light/30"}`} />
                )}
              </div>
            );
          })}
        </div>
      )}

      <p className="mt-4 text-center text-sm text-slate">{ESTIMATES[order.status]}</p>

      <button
        onClick={copyLink}
        className="mx-auto mt-4 block text-sm font-medium text-rose-primary hover:underline"
      >
        Copy tracking link
      </button>

      <div className="mt-8 rounded-2xl border border-rose-light/40 bg-white p-5">
        <h2 className="mb-3 font-medium">Order Details</h2>
        <ul className="divide-y divide-rose-light/20 text-sm">
          {order.items.map((item, i) => (
            <li key={i} className="flex justify-between py-2">
              <span>
                {item.name} × {item.quantity}
              </span>
              <span>{formatGHS(item.unitPrice * item.quantity)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-3 flex justify-between border-t border-rose-light/40 pt-3 font-display text-lg">
          <span>Total</span>
          <span>{formatGHS(order.total)}</span>
        </div>
        <p className="mt-3 text-sm text-slate">
          Delivering to {order.shippingAddress}, {order.city}, {order.region}
        </p>
      </div>
    </div>
  );
}
