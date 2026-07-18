import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { pathname } = req.nextUrl;

  const isAdminArea = pathname.startsWith("/admin") || pathname.startsWith("/api/admin");
  const isPosArea = pathname.startsWith("/pos") || pathname.startsWith("/api/pos");

  if (!isAdminArea && !isPosArea) return NextResponse.next();

  const role = req.auth?.user?.role;
  const allowed = isAdminArea ? role === "ADMIN" : role === "ADMIN" || role === "CASHIER";

  if (!allowed) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    const loginUrl = new URL("/auth/login", req.nextUrl);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
});

// Every /api/admin/* and /api/pos/* route ALSO re-checks the role itself
// (see lib/require-admin.ts / lib/require-role.ts) rather than trusting
// middleware alone — defense in depth per the PRD's explicit security
// requirement.
export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*", "/pos/:path*", "/api/pos/:path*"],
};
