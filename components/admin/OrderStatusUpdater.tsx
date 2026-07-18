"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const FLOW = ["PLACED", "CONFIRMED", "PACKED", "SHIPPED", "DELIVERED"] as const;

export function OrderStatusUpdater({ orderId, currentStatus }: { orderId: string; currentStatus: string }) {
  const router = useRouter();
  const [updating, setUpdating] = useState(false);

  async function updateStatus(status: string) {
    setUpdating(true);
    const res = await fetch(`/api/admin/orders/${orderId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setUpdating(false);

    if (!res.ok) {
      toast.error("Failed to update status");
      return;
    }
    toast.success(`Order marked as ${status}`);
    router.refresh();
  }

  const currentIndex = FLOW.indexOf(currentStatus as (typeof FLOW)[number]);
  const nextStatus = currentIndex >= 0 && currentIndex < FLOW.length - 1 ? FLOW[currentIndex + 1] : null;
  const isCancelled = currentStatus === "CANCELLED";
  const isFinal = currentStatus === "DELIVERED" || isCancelled;

  return (
    <div className="flex flex-wrap items-center gap-3">
      {nextStatus && (
        <button
          disabled={updating}
          onClick={() => updateStatus(nextStatus)}
          className="rounded-full bg-rose-primary px-6 py-2.5 text-sm font-semibold text-white hover:bg-rose-primary/90 disabled:opacity-60"
        >
          Mark as {nextStatus}
        </button>
      )}
      {!isFinal && (
        <button
          disabled={updating}
          onClick={() => {
            if (confirm("Cancel this order? Stock will be restored.")) updateStatus("CANCELLED");
          }}
          className="rounded-full border border-red-300 px-6 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-60"
        >
          Cancel Order
        </button>
      )}
      {isFinal && <p className="text-sm text-slate">This order is {currentStatus.toLowerCase()} — no further status changes.</p>}
    </div>
  );
}
