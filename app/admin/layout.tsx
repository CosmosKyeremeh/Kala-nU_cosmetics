import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

const NAV = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/customers", label: "Customers" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // Belt-and-suspenders alongside proxy.ts — never trust a single gate.
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/auth/login?callbackUrl=/admin");
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-rose-light/40 bg-ink text-cream">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <div className="flex items-center gap-8">
            <Link href="/admin" className="font-display text-xl font-semibold text-rose-light">
              GlowCart Admin
            </Link>
            <nav className="flex flex-wrap gap-1 text-sm font-medium">
              {NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-full px-4 py-2 text-cream/80 transition hover:bg-white/10 hover:text-cream"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-4 text-sm text-cream/70">
            <span>{session.user.name}</span>
            <Link href="/" className="rounded-full border border-cream/30 px-3 py-1.5 hover:bg-white/10">
              Exit to Store
            </Link>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">{children}</main>
    </div>
  );
}
