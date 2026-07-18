"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";
import { formatGHS } from "@/lib/utils";
import { toStringArray } from "@/lib/types";
import { playBeep } from "@/lib/beep";
import { generateReceiptPdf } from "@/lib/receipt";
import { QrScanner } from "@/components/pos/QrScanner";
import { ManualProductSearch } from "@/components/pos/ManualProductSearch";
import type { Product } from "@prisma/client";

type SessionItem = {
  productId: string;
  name: string;
  image: string;
  unitPrice: number;
  quantity: number;
  stock: number;
};

const PAYMENT_METHODS = [
  { value: "CASH", label: "Cash" },
  { value: "MOBILE_MONEY", label: "Mobile Money" },
  { value: "CARD", label: "Card" },
];

export default function PosScannerPage() {
  const { data: authSession } = useSession();
  const [items, setItems] = useState<SessionItem[]>([]);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("CASH");
  const [saving, setSaving] = useState(false);

  function addProduct(product: Product) {
    const image = toStringArray(product.images)[0] ?? "/products/rose-glow-body-spray.svg";
    setItems((current) => {
      const existing = current.find((i) => i.productId === product.id);
      if (existing) {
        if (existing.quantity >= product.stock) {
          toast.error(`Only ${product.stock} in stock`);
          return current;
        }
        return current.map((i) =>
          i.productId === product.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      if (product.stock <= 0) {
        toast.error("Out of stock");
        return current;
      }
      return [
        ...current,
        { productId: product.id, name: product.name, image, unitPrice: product.price, quantity: 1, stock: product.stock },
      ];
    });
  }

  async function handleScan(text: string) {
    let pid: string;
    try {
      const decoded = JSON.parse(atob(text));
      pid = decoded.pid;
      if (!pid) throw new Error("no pid");
    } catch {
      toast.error("Unrecognized QR code");
      return;
    }

    const res = await fetch(`/api/products/${pid}`);
    if (!res.ok) {
      toast.error("Unknown product");
      return;
    }
    const product = await res.json();
    playBeep();
    addProduct(product);
    toast.success(`${product.name} scanned`);
  }

  function updateQuantity(productId: string, quantity: number) {
    setItems((current) => {
      if (quantity <= 0) return current.filter((i) => i.productId !== productId);
      return current.map((i) =>
        i.productId === productId ? { ...i, quantity: Math.min(quantity, i.stock) } : i
      );
    });
  }

  function clearSession() {
    if (items.length > 0 && !confirm("Clear this sale and start a new one?")) return;
    setItems([]);
  }

  const subtotal = items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);

  async function handleGenerateReceipt() {
    setSaving(true);
    const receiptItems = items.map((i) => ({
      name: i.name,
      quantity: i.quantity,
      unitPrice: i.unitPrice,
      lineTotal: i.unitPrice * i.quantity,
    }));

    const res = await fetch("/api/pos/sessions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: items.map((i) => ({ productId: i.productId, quantity: i.quantity, unitPrice: i.unitPrice })),
        paymentMethod,
      }),
    });
    const data = await res.json();
    setSaving(false);

    if (!res.ok) {
      toast.error(data.error ?? "Failed to save sale");
      return;
    }

    const doc = generateReceiptPdf({
      receiptNumber: data.receiptNumber,
      cashierName: authSession?.user?.name ?? "Cashier",
      items: receiptItems,
      subtotal,
      total: subtotal,
      paymentMethod,
    });
    doc.save(`${data.receiptNumber}.pdf`);

    toast.success(`Sale saved — ${data.receiptNumber}`);
    setShowReceiptModal(false);
    setItems([]);
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-3xl font-semibold">POS Scanner</h1>
        <Link href="/pos/history" className="text-sm font-medium text-rose-primary hover:underline">
          Session History
        </Link>
      </div>

      <QrScanner onScan={handleScan} />

      <div className="mt-4">
        <ManualProductSearch onSelect={addProduct} />
      </div>

      <div className="mt-6 rounded-2xl border border-rose-light/40 bg-white p-4">
        <h2 className="mb-3 font-medium">Current Sale ({items.length} items)</h2>
        {items.length === 0 ? (
          <p className="py-8 text-center text-sm text-slate">
            Scan a product QR code or search above to begin.
          </p>
        ) : (
          <ul className="divide-y divide-rose-light/20">
            {items.map((item) => (
              <li key={item.productId} className="flex items-center gap-3 py-3">
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-rose-light/10">
                  <Image src={item.image} alt="" fill className="object-cover" />
                </div>
                <div className="flex-1">
                  <p className="text-base font-medium">{item.name}</p>
                  <p className="text-sm text-slate">{formatGHS(item.unitPrice)} each</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-rose-light text-lg"
                  >
                    −
                  </button>
                  <span className="w-6 text-center text-base">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                    disabled={item.quantity >= item.stock}
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-rose-light text-lg disabled:opacity-40"
                  >
                    +
                  </button>
                </div>
                <p className="w-20 text-right text-base font-medium">
                  {formatGHS(item.unitPrice * item.quantity)}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>

      {items.length > 0 && (
        <div className="mt-4 flex items-center justify-between rounded-2xl border border-rose-light/40 bg-white p-4">
          <div>
            <p className="text-sm text-slate">Grand Total</p>
            <p className="font-display text-2xl text-rose-primary">{formatGHS(subtotal)}</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={clearSession}
              className="rounded-full border border-rose-light px-5 py-3 text-sm font-medium hover:border-rose-primary"
            >
              New Sale
            </button>
            <button
              onClick={() => setShowReceiptModal(true)}
              className="rounded-full bg-rose-primary px-6 py-3 text-sm font-semibold text-white hover:bg-rose-primary/90"
            >
              Generate Receipt
            </button>
          </div>
        </div>
      )}

      {showReceiptModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/50 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6">
            <h2 className="font-display mb-4 text-xl font-semibold">Payment Method</h2>
            <div className="space-y-2">
              {PAYMENT_METHODS.map((m) => (
                <button
                  key={m.value}
                  onClick={() => setPaymentMethod(m.value)}
                  className={`w-full rounded-lg border px-4 py-3 text-left text-sm ${
                    paymentMethod === m.value ? "border-rose-primary bg-rose-light/20" : "border-rose-light"
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setShowReceiptModal(false)}
                className="flex-1 rounded-full border border-rose-light py-3 text-sm font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleGenerateReceipt}
                disabled={saving}
                className="flex-1 rounded-full bg-rose-primary py-3 text-sm font-semibold text-white disabled:opacity-60"
              >
                {saving ? "Saving..." : "Confirm & Print"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
