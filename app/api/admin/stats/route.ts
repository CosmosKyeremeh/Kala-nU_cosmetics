import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import { categoryLabel } from "@/lib/utils";

function startOfDay(d: Date) {
  const copy = new Date(d);
  copy.setHours(0, 0, 0, 0);
  return copy;
}

export async function GET() {
  const { response } = await requireAdmin();
  if (response) return response;

  const now = new Date();
  const todayStart = startOfDay(now);
  const weekStart = new Date(todayStart);
  weekStart.setDate(weekStart.getDate() - 6);
  const monthStart = new Date(todayStart);
  monthStart.setDate(monthStart.getDate() - 29);

  const [orders, totalOrders, totalCustomers, newCustomersToday, lowStockProducts] =
    await Promise.all([
      prisma.order.findMany({
        where: { status: { not: "CANCELLED" }, createdAt: { gte: monthStart } },
        include: { items: { include: { product: true } } },
      }),
      prisma.order.count(),
      prisma.user.count({ where: { role: "CUSTOMER" } }),
      prisma.user.count({ where: { role: "CUSTOMER", createdAt: { gte: todayStart } } }),
      prisma.product.findMany({
        where: { stock: { lte: 5 }, isPublished: true },
        select: { id: true, name: true, stock: true },
        take: 10,
      }),
    ]);

  const revenueToday = orders
    .filter((o) => o.createdAt >= todayStart)
    .reduce((sum, o) => sum + o.total, 0);
  const revenueThisWeek = orders
    .filter((o) => o.createdAt >= weekStart)
    .reduce((sum, o) => sum + o.total, 0);
  const revenueThisMonth = orders.reduce((sum, o) => sum + o.total, 0);

  const dailyRevenueMap = new Map<string, number>();
  for (let i = 13; i >= 0; i--) {
    const d = new Date(todayStart);
    d.setDate(d.getDate() - i);
    dailyRevenueMap.set(d.toISOString().slice(0, 10), 0);
  }
  for (const order of orders) {
    const key = order.createdAt.toISOString().slice(0, 10);
    if (dailyRevenueMap.has(key)) {
      dailyRevenueMap.set(key, (dailyRevenueMap.get(key) ?? 0) + order.total);
    }
  }
  const dailyRevenue = Array.from(dailyRevenueMap.entries()).map(([date, revenue]) => ({
    date,
    revenue,
  }));

  const categoryRevenue = new Map<string, number>();
  const productStats = new Map<string, { id: string; name: string; unitsSold: number; revenue: number }>();
  for (const order of orders) {
    for (const item of order.items) {
      const lineTotal = item.unitPrice * item.quantity;
      categoryRevenue.set(
        item.product.category,
        (categoryRevenue.get(item.product.category) ?? 0) + lineTotal
      );
      const existing = productStats.get(item.productId);
      if (existing) {
        existing.unitsSold += item.quantity;
        existing.revenue += lineTotal;
      } else {
        productStats.set(item.productId, {
          id: item.productId,
          name: item.product.name,
          unitsSold: item.quantity,
          revenue: lineTotal,
        });
      }
    }
  }

  const revenueByCategory = Array.from(categoryRevenue.entries()).map(([category, revenue]) => ({
    category: categoryLabel(category),
    revenue,
  }));

  const topProducts = Array.from(productStats.values())
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  const allOrders = await prisma.order.groupBy({ by: ["status"], _count: { status: true } });
  const orderStatusBreakdown = allOrders.map((o) => ({ status: o.status, count: o._count.status }));

  return NextResponse.json({
    revenueToday,
    revenueThisWeek,
    revenueThisMonth,
    totalOrders,
    totalCustomers,
    newCustomersToday,
    dailyRevenue,
    revenueByCategory,
    orderStatusBreakdown,
    topProducts,
    lowStockProducts,
  });
}
