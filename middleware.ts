import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isAdminArea = pathname.startsWith("/admin") || pathname.startsWith("/api/admin");
  if (!isAdminArea) return NextResponse.next();

  const role = req.auth?.user?.role;
  if (role !== "ADMIN") {
    if (pathname.startsWith("/api/admin")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    const loginUrl = new URL("/auth/login", req.nextUrl);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
});

// Every /api/admin/* route ALSO re-checks the role itself (see
// lib/require-admin.ts) rather than trusting middleware alone — defense in
// depth per the PRD's explicit security requirement.
export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
