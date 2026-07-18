import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireStaff } from "@/lib/require-role";

export async function GET() {
  const { session, response } = await requireStaff();
  if (response) return response;

  // Cashiers see only their own sessions; admins see everyone's.
  const where = session!.user.role === "ADMIN" ? {} : { cashierId: session!.user.id };

  const sessions = await prisma.scanSession.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: { items: true, cashier: { select: { name: true } } },
    take: 50,
  });

  return NextResponse.json(sessions);
}

const createSessionSchema = z.object({
  items: z
    .array(
      z.object({
        productId: z.string(),
        quantity: z.number().int().positive(),
        unitPrice: z.number().positive(),
      })
    )
    .min(1),
  paymentMethod: z.enum(["CASH", "MOBILE_MONEY", "CARD"]),
});

export async function POST(req: Request) {
  const { session, response } = await requireStaff();
  if (response) return response;

  const body = await req.json();
  const parsed = createSessionSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message }, { status: 400 });
  }

  const { items, paymentMethod } = parsed.data;
  const subtotal = items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);

  const today = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const todayCount = await prisma.scanSession.count({
    where: { receiptNumber: { startsWith: `REC-${today}` } },
  });
  const receiptNumber = `REC-${today}-${String(todayCount + 1).padStart(4, "0")}`;

  const scanSession = await prisma.scanSession.create({
    data: {
      cashierId: session!.user.id,
      subtotal,
      total: subtotal,
      paymentMethod,
      receiptNumber,
      items: {
        create: items.map((i) => ({
          productId: i.productId,
          quantity: i.quantity,
          unitPrice: i.unitPrice,
          lineTotal: i.unitPrice * i.quantity,
        })),
      },
    },
    include: { items: { include: { product: true } } },
  });

  return NextResponse.json(scanSession, { status: 201 });
}
