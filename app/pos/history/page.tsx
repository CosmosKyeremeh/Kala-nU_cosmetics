"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { formatGHS } from "@/lib/utils";
import { generateReceiptPdf } from "@/lib/receipt";

type SessionRow = {
  id: string;
  receiptNumber: string;
  total: number;
  paymentMethod: string;
  createdAt: string;
  cashier: { name: string };
  items: { id: string; quantity: number; unitPrice: number; lineTotal: number; product: { name: string } }[];
};

export default function PosHistoryPage() {
  const [sessions, setSessions] = useState<SessionRow[] | null>(null);

  useEffect(() => {
    fetch("/api/pos/sessions")
      .then((res) => res.json())
      .then(setSessions);
  }, []);

  async function reprint(id: string) {
    const res = await fetch(`/api/pos/sessions/${id}`);
    if (!res.ok) {
      toast.error("Could not load receipt");
      return;
    }
    const session: SessionRow = await res.json();
    const doc = generateReceiptPdf({
      receiptNumber: session.receiptNumber,
      cashierName: session.cashier.name,
      items: session.items.map((i) => ({
        name: i.product.name,
        quantity: i.quantity,
        unitPrice: i.unitPrice,
        lineTotal: i.lineTotal,
      })),
      subtotal: session.total,
      total: session.total,
      paymentMethod: session.paymentMethod,
    });
    doc.save(`${session.receiptNumber}.pdf`);
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-3xl font-semibold">Session History</h1>
        <Link href="/pos" className="text-sm font-medium text-rose-primary hover:underline">
          Back to Scanner
        </Link>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-rose-light/40 bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-rose-light/40 bg-rose-light/10 text-left">
              <th className="p-3 font-medium">Receipt #</th>
              <th className="p-3 font-medium">Date</th>
              <th className="p-3 font-medium">Items</th>
              <th className="p-3 font-medium">Total</th>
              <th className="p-3 font-medium">Payment</th>
              <th className="p-3 font-medium">Cashier</th>
              <th className="p-3 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {!sessions ? (
              <tr>
                <td colSpan={7} className="p-6 text-center text-slate">
                  Loading...
                </td>
              </tr>
            ) : sessions.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-6 text-center text-slate">
                  No sales recorded yet.
                </td>
              </tr>
            ) : (
              sessions.map((s) => (
                <tr key={s.id} className="border-b border-rose-light/20 last:border-none">
                  <td className="p-3 font-mono text-xs">{s.receiptNumber}</td>
                  <td className="p-3 text-slate">{new Date(s.createdAt).toLocaleString("en-GH")}</td>
                  <td className="p-3">{s.items.length}</td>
                  <td className="p-3 font-medium">{formatGHS(s.total)}</td>
                  <td className="p-3">{s.paymentMethod.replace("_", " ")}</td>
                  <td className="p-3">{s.cashier.name}</td>
                  <td className="p-3">
                    <button onClick={() => reprint(s.id)} className="text-rose-primary hover:underline">
                      Reprint
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
