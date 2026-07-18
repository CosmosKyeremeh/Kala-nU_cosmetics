"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { formatGHS } from "@/lib/utils";

export function CategoryChart({ data }: { data: { category: string; revenue: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f8bbd0" />
        <XAxis dataKey="category" tick={{ fontSize: 11, fill: "#4A4A4A" }} />
        <YAxis tick={{ fontSize: 12, fill: "#4A4A4A" }} width={50} />
        <Tooltip formatter={(value) => formatGHS(Number(value))} />
        <Bar dataKey="revenue" fill="#C2185B" radius={[6, 6, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
