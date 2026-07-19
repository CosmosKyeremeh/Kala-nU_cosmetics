import Link from "next/link";
import { auth } from "@/lib/auth";
import { CartButton } from "@/components/layout/CartButton";
import { NavUserMenu } from "@/components/layout/NavUserMenu";
import { MobileNav } from "@/components/layout/MobileNav";
import { MegaMenu } from "@/components/layout/MegaMenu";
import { QUICK_LINKS } from "@/lib/categories";

export async function Navbar() {
  const session = await auth();

  return (
    <header className="sticky top-0 z-40 border-b border-rose-light/40 bg-cream/95 backdrop-blur">
      <div className="hidden border-b border-rose-light/30 bg-charcoal text-cream md:block">
        <div className="mx-auto flex max-w-6xl items-center justify-center gap-6 px-4 py-1.5 text-xs font-medium sm:px-6">
          {QUICK_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-rose-light">
              {link.label}
            </Link>
          ))}
        </div>
      </div>

      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <Link href="/" className="font-display text-2xl font-semibold tracking-wide text-rose-primary">
          GlowCart
        </Link>

        <MegaMenu />

        <div className="hidden items-center gap-3 sm:gap-4 md:flex">
          <NavUserMenu user={session?.user ?? null} />
          <CartButton />
        </div>
      </div>

      <MobileNav user={session?.user ?? null} />
    </header>
  );
}
