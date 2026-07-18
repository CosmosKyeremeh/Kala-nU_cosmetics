"use client";

import { useEffect, useState } from "react";
import { formatGHS } from "@/lib/utils";
import { StatsCard } from "@/components/admin/StatsCard";
import { RevenueChart } from "@/components/admin/RevenueChart";
import { CategoryChart } from "@/components/admin/CategoryChart";
import { OrderStatusChart } from "@/components/admin/OrderStatusChart";
import { TopProductsTable } from "@/components/admin/TopProductsTable";
import { LowStockAlert } from "@/components/admin/LowStockAlert";

type Stats = {
  revenueToday: number;
  revenueThisWeek: number;
  revenueThisMonth: number;
  totalOrders: number;
  totalCustomers: number;
  newCustomersToday: number;
  dailyRevenue: { date: string; revenue: number }[];
  revenueByCategory: { category: string; revenue: number }[];
  orderStatusBreakdown: { status: string; count: number }[];
  topProducts: { id: string; name: string; unitsSold: number; revenue: number }[];
  lowStockProducts: { id: string; name: string; stock: number }[];
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((res) => res.json())
      .then(setStats);
  }, []);

  if (!stats) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-24 animate-pulse rounded-2xl bg-rose-light/20" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h1 className="font-display text-3xl font-semibold">Dashboard</h1>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatsCard label="Revenue Today" value={formatGHS(stats.revenueToday)} accent />
        <StatsCard label="Revenue This Week" value={formatGHS(stats.revenueThisWeek)} />
        <StatsCard label="Revenue This Month" value={formatGHS(stats.revenueThisMonth)} />
        <StatsCard label="Total Orders" value={String(stats.totalOrders)} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-rose-light/40 bg-white p-5">
          <h2 className="mb-3 font-medium">Daily Revenue (14 days)</h2>
          <RevenueChart data={stats.dailyRevenue} />
        </div>
        <div className="rounded-2xl border border-rose-light/40 bg-white p-5">
          <h2 className="mb-3 font-medium">Revenue by Category</h2>
          <CategoryChart data={stats.revenueByCategory} />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-rose-light/40 bg-white p-5">
          <h2 className="mb-3 font-medium">Order Status</h2>
          <OrderStatusChart data={stats.orderStatusBreakdown} />
        </div>
        <div className="rounded-2xl border border-rose-light/40 bg-white p-5">
          <h2 className="mb-3 font-medium">Top 5 Products</h2>
          <TopProductsTable products={stats.topProducts} />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-rose-light/40 bg-white p-5">
          <h2 className="mb-3 font-medium">Low Stock Alerts</h2>
          <LowStockAlert products={stats.lowStockProducts} />
        </div>
        <div className="rounded-2xl border border-rose-light/40 bg-white p-5">
          <h2 className="mb-3 font-medium">Customers</h2>
          <p className="text-sm text-slate">
            {stats.totalCustomers} total · {stats.newCustomersToday} new today
          </p>
        </div>
      </div>
    </div>
  );
}
