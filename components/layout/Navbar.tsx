import Link from "next/link";
import { auth } from "@/lib/auth";
import { CartButton } from "@/components/layout/CartButton";
import { NavUserMenu } from "@/components/layout/NavUserMenu";
import { MobileNav } from "@/components/layout/MobileNav";
import { MegaMenu } from "@/components/layout/MegaMenu";
import { StickyHeader } from "@/components/layout/StickyHeader";
import { QUICK_LINKS } from "@/lib/categories";

export async function Navbar() {
  const session = await auth();

  return (
    <StickyHeader>
      <div className="hidden overflow-hidden border-b border-white/40 bg-charcoal text-cream transition-all duration-300 ease-out group-data-[scrolled=true]:max-h-0 group-data-[scrolled=true]:border-b-0 group-data-[scrolled=true]:opacity-0 lg:block lg:max-h-9 lg:opacity-100">
        <div className="mx-auto flex max-w-7xl items-center justify-center gap-6 px-4 py-1.5 text-xs font-medium sm:px-6">
          {QUICK_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="whitespace-nowrap hover:text-rose-light">
              {link.label}
            </Link>
          ))}
        </div>
      </div>

      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 transition-all duration-300 ease-out group-data-[scrolled=true]:py-2.5 sm:px-6">
        <Link
          href="/"
          className="font-display shrink-0 origin-left text-2xl font-semibold tracking-wide text-rose-primary transition-all duration-300 ease-out group-data-[scrolled=true]:scale-90 group-data-[scrolled=true]:text-xl"
        >
          GlowCart
        </Link>

        <MegaMenu />

        <div className="hidden items-center gap-3 sm:gap-4 lg:flex">
          <NavUserMenu user={session?.user ?? null} />
          <CartButton />
        </div>
      </div>

      <MobileNav user={session?.user ?? null} />
    </StickyHeader>
  );
}
