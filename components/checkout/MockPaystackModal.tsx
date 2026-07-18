"use client";

import { useState } from "react";
import { formatGHS } from "@/lib/utils";

type Props = {
  amount: number;
  email: string;
  onClose: () => void;
  onSuccess: (reference: string) => void;
};

// A stand-in for the real Paystack inline popup — no Paystack account/keys
// required. It mimics the same UX (choose a payment channel, "processing",
// success/fail) and hands back a fake reference the rest of the checkout
// flow treats exactly like a real one.
export function MockPaystackModal({ amount, email, onClose, onSuccess }: Props) {
  const [channel, setChannel] = useState<"momo" | "card">("momo");
  const [processing, setProcessing] = useState(false);

  async function handlePay() {
    setProcessing(true);
    const reference = `MOCK-${Date.now()}`;

    const res = await fetch("/api/paystack/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reference }),
    });
    const data = await res.json();
    setProcessing(false);

    if (data.status) {
      onSuccess(reference);
    } else {
      onClose();
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/50 p-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
        <div className="mb-4 flex items-center justify-between">
          <p className="font-display text-lg font-semibold text-charcoal">Paystack (Demo)</p>
          <button onClick={onClose} className="text-slate hover:text-rose-primary" aria-label="Close">
            ✕
          </button>
        </div>

        <p className="text-sm text-slate">Paying as {email}</p>
        <p className="font-display mt-1 text-3xl text-rose-primary">{formatGHS(amount)}</p>

        <div className="mt-6 space-y-2">
          <button
            onClick={() => setChannel("momo")}
            className={`w-full rounded-lg border px-4 py-3 text-left text-sm ${
              channel === "momo" ? "border-rose-primary bg-rose-light/20" : "border-rose-light"
            }`}
          >
            Mobile Money (MTN / Vodafone / AirtelTigo)
          </button>
          <button
            onClick={() => setChannel("card")}
            className={`w-full rounded-lg border px-4 py-3 text-left text-sm ${
              channel === "card" ? "border-rose-primary bg-rose-light/20" : "border-rose-light"
            }`}
          >
            Visa / Mastercard
          </button>
        </div>

        <button
          onClick={handlePay}
          disabled={processing}
          className="mt-6 w-full rounded-full bg-rose-primary py-3 font-semibold text-white hover:bg-rose-primary/90 disabled:opacity-60"
        >
          {processing ? "Processing..." : `Pay ${formatGHS(amount)}`}
        </button>
        <p className="mt-3 text-center text-xs text-slate">
          Demo mode — no real payment is made.
        </p>
      </div>
    </div>
  );
}
