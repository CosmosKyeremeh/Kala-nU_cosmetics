import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

// Middleware already blocks /api/admin/* for non-admins, but every handler
// re-checks independently — defense in depth, not just relying on the UI
// gate. Returns the session on success, or a ready-to-return 401/403
// response on failure.
export async function requireAdmin() {
  const session = await auth();
  if (!session?.user) {
    return { session: null, response: NextResponse.json({ error: "Not authenticated" }, { status: 401 }) };
  }
  if (session.user.role !== "ADMIN") {
    return { session: null, response: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
  }
  return { session, response: null };
}
