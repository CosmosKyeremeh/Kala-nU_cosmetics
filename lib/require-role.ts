import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

// Same defense-in-depth pattern as requireAdmin, but for the POS routes
// which CASHIER and ADMIN can both use.
export async function requireStaff() {
  const session = await auth();
  if (!session?.user) {
    return { session: null, response: NextResponse.json({ error: "Not authenticated" }, { status: 401 }) };
  }
  if (session.user.role !== "ADMIN" && session.user.role !== "CASHIER") {
    return { session: null, response: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
  }
  return { session, response: null };
}
