import Link from "next/link";
import { auth } from "@/lib/auth";
import { CartButton } from "@/components/layout/CartButton";
import { NavUserMenu } from "@/components/layout/NavUserMenu";
import { MobileNav } from "@/components/layout/MobileNav";

export async function Navbar() {
  const session = await auth();

  return (
    <header className="sticky top-0 z-40 border-b border-rose-light/40 bg-cream/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <Link href="/" className="font-display text-2xl font-semibold tracking-wide text-rose-primary">
          GlowCart
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium text-charcoal md:flex">
          <Link href="/products" className="hover:text-rose-primary">
            Shop
          </Link>
          <Link href="/products?category=SKINCARE" className="hover:text-rose-primary">
            Skincare
          </Link>
          <Link href="/products?category=BODY_SPRAY" className="hover:text-rose-primary">
            Body Spray
          </Link>
          <Link href="/products?category=HAIR_CARE" className="hover:text-rose-primary">
            Hair Care
          </Link>
        </nav>

        <div className="flex items-center gap-3 sm:gap-4">
          <NavUserMenu user={session?.user ?? null} />
          <CartButton />
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
