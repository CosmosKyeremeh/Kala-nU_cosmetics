"use client";

import { useEffect, useState } from "react";
import { formatGHS } from "@/lib/utils";

type Customer = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  region: string | null;
  createdAt: string;
  totalOrders: number;
  totalSpent: number;
};

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/customers")
      .then((res) => res.json())
      .then((data) => {
        setCustomers(data);
        setLoading(false);
      });
  }, []);

  return (
    <div>
      <h1 className="font-display mb-6 text-3xl font-semibold">Customers</h1>

      <div className="overflow-x-auto rounded-2xl border border-rose-light/40 bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-rose-light/40 bg-rose-light/10 text-left">
              <th className="p-3 font-medium">Name</th>
              <th className="p-3 font-medium">Email</th>
              <th className="p-3 font-medium">Region</th>
              <th className="p-3 font-medium">Orders</th>
              <th className="p-3 font-medium">Total Spent</th>
              <th className="p-3 font-medium">Joined</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="p-6 text-center text-slate">
                  Loading...
                </td>
              </tr>
            ) : customers.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-6 text-center text-slate">
                  No customers yet.
                </td>
              </tr>
            ) : (
              customers.map((c) => (
                <tr key={c.id} className="border-b border-rose-light/20 last:border-none">
                  <td className="p-3">{c.name}</td>
                  <td className="p-3 text-slate">{c.email}</td>
                  <td className="p-3">{c.region ?? "—"}</td>
                  <td className="p-3">{c.totalOrders}</td>
                  <td className="p-3 font-medium">{formatGHS(c.totalSpent)}</td>
                  <td className="p-3 text-slate">
                    {new Date(c.createdAt).toLocaleDateString("en-GH")}
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
