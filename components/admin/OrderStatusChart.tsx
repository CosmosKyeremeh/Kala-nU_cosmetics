"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";

const COLORS: Record<string, string> = {
  PLACED: "#F8BBD0",
  CONFIRMED: "#D4AF37",
  PACKED: "#C2185B",
  SHIPPED: "#4A4A4A",
  DELIVERED: "#1C1C1C",
  CANCELLED: "#c9c9c9",
};

export function OrderStatusChart({ data }: { data: { status: string; count: number }[] }) {
  if (data.every((d) => d.count === 0)) {
    return <p className="py-16 text-center text-sm text-slate">No orders yet.</p>;
  }

  return (
    <ResponsiveContainer width="100%" height={260}>
      <PieChart>
        <Pie data={data} dataKey="count" nameKey="status" innerRadius={50} outerRadius={90}>
          {data.map((entry) => (
            <Cell key={entry.status} fill={COLORS[entry.status] ?? "#999"} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}
