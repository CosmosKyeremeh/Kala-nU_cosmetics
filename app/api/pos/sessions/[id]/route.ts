import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireStaff } from "@/lib/require-role";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { session, response } = await requireStaff();
  if (response) return response;

  const { id } = await params;
  const scanSession = await prisma.scanSession.findUnique({
    where: { id },
    include: { items: { include: { product: true } }, cashier: { select: { name: true } } },
  });

  if (!scanSession) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // Cashiers can only reprint their own sessions; admins can view any.
  if (session!.user.role !== "ADMIN" && scanSession.cashierId !== session!.user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return NextResponse.json(scanSession);
}
