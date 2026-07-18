"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { formatGHS, GHANA_REGIONS } from "@/lib/utils";

const STATUSES = ["PLACED", "CONFIRMED", "PACKED", "SHIPPED", "DELIVERED", "CANCELLED"];

const STATUS_COLORS: Record<string, string> = {
  PLACED: "bg-rose-light/40 text-rose-primary",
  CONFIRMED: "bg-gold-accent/20 text-gold-accent",
  PACKED: "bg-rose-primary/10 text-rose-primary",
  SHIPPED: "bg-slate/10 text-slate",
  DELIVERED: "bg-green-100 text-green-700",
  CANCELLED: "bg-red-100 text-red-700",
};

type OrderRow = {
  id: string;
  total: number;
  status: string;
  createdAt: string;
  region: string;
  user: { name: string; email: string };
  items: { id: string }[];
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("");
  const [region, setRegion] = useState("");
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    const params = new URLSearchParams({ page: String(page) });
    if (status) params.set("status", status);
    if (region) params.set("region", region);
    fetch(`/api/admin/orders?${params}`)
      .then((res) => res.json())
      .then((data) => {
        setOrders(data.orders);
        setTotal(data.total);
        setLoading(false);
      });
  }, [page, status, region]);

  useEffect(() => load(), [load]);

  function exportCsv() {
    const header = "Order ID,Customer,Email,Total,Status,Region,Date\n";
    const rows = orders
      .map((o) =>
        [
          o.id,
          o.user.name,
          o.user.email,
          o.total.toFixed(2),
          o.status,
          o.region,
          new Date(o.createdAt).toISOString(),
        ]
          .map((v) => `"${String(v).replace(/"/g, '""')}"`)
          .join(",")
      )
      .join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `glowcart-orders-page${page}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const totalPages = Math.max(1, Math.ceil(total / 10));

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-3xl font-semibold">Orders</h1>
        <button
          onClick={exportCsv}
          disabled={orders.length === 0}
          className="rounded-full border border-rose-light px-5 py-2 text-sm font-medium hover:border-rose-primary hover:text-rose-primary disabled:opacity-40"
        >
          Export CSV (this page)
        </button>
      </div>

      <div className="mb-4 flex flex-wrap gap-3">
        <select
          value={status}
          onChange={(e) => {
            setPage(1);
            setStatus(e.target.value);
          }}
          className="rounded-full border border-rose-light px-4 py-2 text-sm"
        >
          <option value="">All Statuses</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <select
          value={region}
          onChange={(e) => {
            setPage(1);
            setRegion(e.target.value);
          }}
          className="rounded-full border border-rose-light px-4 py-2 text-sm"
        >
          <option value="">All Regions</option>
          {GHANA_REGIONS.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-rose-light/40 bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-rose-light/40 bg-rose-light/10 text-left">
              <th className="p-3 font-medium">Order</th>
              <th className="p-3 font-medium">Customer</th>
              <th className="p-3 font-medium">Total</th>
              <th className="p-3 font-medium">Status</th>
              <th className="p-3 font-medium">Date</th>
              <th className="p-3 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="p-6 text-center text-slate">
                  Loading...
                </td>
              </tr>
            ) : orders.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-6 text-center text-slate">
                  No orders found.
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order.id} className="border-b border-rose-light/20 last:border-none">
                  <td className="p-3 font-mono text-xs">{order.id.slice(-8).toUpperCase()}</td>
                  <td className="p-3">{order.user.name}</td>
                  <td className="p-3 font-medium">{formatGHS(order.total)}</td>
                  <td className="p-3">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_COLORS[order.status] ?? ""}`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="p-3 text-slate">
                    {new Date(order.createdAt).toLocaleDateString("en-GH")}
                  </td>
                  <td className="p-3">
                    <Link href={`/admin/orders/${order.id}`} className="text-rose-primary hover:underline">
                      View
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-center gap-2 text-sm">
          <button
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
            className="rounded-full border border-rose-light px-3 py-1 disabled:opacity-40"
          >
            Prev
          </button>
          <span>
            Page {page} of {totalPages}
          </span>
          <button
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="rounded-full border border-rose-light px-3 py-1 disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
