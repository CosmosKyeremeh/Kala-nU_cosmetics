import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import type { Prisma } from "@prisma/client";

export async function GET(req: Request) {
  const { response } = await requireAdmin();
  if (response) return response;

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const region = searchParams.get("region");
  const page = Math.max(1, Number(searchParams.get("page") ?? "1"));
  const pageSize = 10;

  const where: Prisma.OrderWhereInput = {};
  if (status) where.status = status;
  if (region) where.region = region;

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: { user: { select: { name: true, email: true } }, items: true },
    }),
    prisma.order.count({ where }),
  ]);

  return NextResponse.json({ orders, total, page, pageSize });
}
