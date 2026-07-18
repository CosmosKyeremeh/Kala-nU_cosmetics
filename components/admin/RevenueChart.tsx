"use client";

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { formatGHS } from "@/lib/utils";

export function RevenueChart({ data }: { data: { date: string; revenue: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f8bbd0" />
        <XAxis
          dataKey="date"
          tickFormatter={(d) => d.slice(5)}
          tick={{ fontSize: 12, fill: "#4A4A4A" }}
        />
        <YAxis tick={{ fontSize: 12, fill: "#4A4A4A" }} width={50} />
        <Tooltip formatter={(value) => formatGHS(Number(value))} labelFormatter={(l) => l} />
        <Line type="monotone" dataKey="revenue" stroke="#C2185B" strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}
