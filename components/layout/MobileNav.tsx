"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { signOut } from "next-auth/react";
import { TOP_CATEGORIES, HIGHLIGHT_LINKS, QUICK_LINKS } from "@/lib/categories";
import { useCartStore, useCartHydrated, cartCount } from "@/lib/store/cart";

const HIGHLIGHT_STYLES: Record<string, string> = {
  new: "bg-emerald-600/10 text-emerald-700",
  sale: "bg-rose-primary/10 text-rose-primary",
};

type Props = {
  user: { name?: string | null; role?: string } | null;
};

export function MobileNav({ user }: Props) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);

  const items = useCartStore((s) => s.items);
  const openCart = useCartStore((s) => s.open);
  const hydrated = useCartHydrated();
  const count = hydrated ? cartCount(items) : 0;

  function closeDrawer() {
    setDrawerOpen(false);
    setExpanded(null);
  }

  return (
    <div className="md:hidden">
      {/* Bottom tab bar — cosmetics is a visually-browsed category, so
          categories/cart stay one tap away no matter how far down the
          page the user has scrolled. */}
      <nav className="fixed inset-x-0 bottom-0 z-40 flex h-16 items-stretch border-t border-rose-light/40 bg-cream/95 backdrop-blur [padding-bottom:env(safe-area-inset-bottom)]">
        <Link href="/" className="flex flex-1 flex-col items-center justify-center gap-1 text-ink">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M3 11l9-7 9 7M5 10v10h14V10" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="text-[11px] font-medium">Home</span>
        </Link>

        <button
          onClick={() => setDrawerOpen(true)}
          aria-label="Open shop menu"
          className="flex flex-1 flex-col items-center justify-center gap-1 text-ink"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
          </svg>
          <span className="text-[11px] font-medium">Shop</span>
        </button>

        <button
          onClick={openCart}
          aria-label="Open cart"
          className="relative flex flex-1 flex-col items-center justify-center gap-1 text-ink"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path
              d="M3 3h2l.4 2M7 13h10l3-8H5.4M7 13L5.4 5M7 13l-2.3 4.6A1 1 0 0 0 5.6 19H17M9 22a1 1 0 1 0 0-2 1 1 0 0 0 0 2Zm8 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          {count > 0 && (
            <span className="absolute right-[22%] top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-primary px-1 text-[10px] font-semibold text-white">
              {count}
            </span>
          )}
          <span className="text-[11px] font-medium">Cart</span>
        </button>

        <Link
          href={user ? "/profile" : "/auth/login"}
          className="flex flex-1 flex-col items-center justify-center gap-1 text-ink"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path
              d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 8a7 7 0 0 1 14 0"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="text-[11px] font-medium">{user ? "Account" : "Sign in"}</span>
        </Link>
      </nav>

      {/* Shop drawer — slides in from the left, opened by the bottom bar */}
      <div
        className={`fixed inset-0 z-50 bg-charcoal/40 transition-opacity ${
          drawerOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={closeDrawer}
      />
      <div
        className={`fixed inset-y-0 left-0 z-50 w-[86%] max-w-sm overflow-y-auto bg-cream shadow-2xl transition-transform duration-300 ${
          drawerOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-rose-light/40 px-4 py-4">
          <p className="font-display text-xl font-semibold text-rose-primary">GlowCart</p>
          <button
            onClick={closeDrawer}
            aria-label="Close menu"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-rose-light text-ink"
          >
            ✕
          </button>
        </div>

        <div className="flex gap-2 px-4 py-4">
          {HIGHLIGHT_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={closeDrawer}
              className={`flex-1 rounded-full px-4 py-2 text-center text-sm font-semibold ${HIGHLIGHT_STYLES[link.tone]}`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <nav className="flex flex-col px-4">
          {TOP_CATEGORIES.map((cat) => {
            const isExpanded = expanded === cat.slug;
            return (
              <div key={cat.slug} className="border-b border-rose-light/20 last:border-none">
                <div className="flex items-center gap-3 py-3">
                  <Link
                    href={`/category/${cat.slug}`}
                    onClick={closeDrawer}
                    className="relative block h-[60px] w-[60px] shrink-0 overflow-hidden rounded-xl bg-rose-light/20"
                  >
                    <Image src={cat.image} alt="" fill sizes="60px" className="object-cover" />
                  </Link>
                  <Link
                    href={`/category/${cat.slug}`}
                    onClick={closeDrawer}
                    className="flex-1 text-base font-medium text-ink"
                  >
                    {cat.label}
                  </Link>
                  {cat.subcategories.length > 0 && (
                    <button
                      onClick={() => setExpanded(isExpanded ? null : cat.slug)}
                      aria-label={`Toggle ${cat.label} subcategories`}
                      aria-expanded={isExpanded}
                      className="flex h-11 w-11 shrink-0 items-center justify-center text-slate"
                    >
                      <svg
                        width="12"
                        height="8"
                        viewBox="0 0 12 8"
                        className={`fill-current transition-transform ${isExpanded ? "rotate-180" : ""}`}
                      >
                        <path d="M0 0 L6 8 L12 0 Z" />
                      </svg>
                    </button>
                  )}
                </div>
                {isExpanded && (
                  <div className="flex flex-col pb-3 pl-[72px]">
                    {cat.subcategories.map((sub) => (
                      <Link
                        key={sub.slug}
                        href={`/category/${cat.slug}?sub=${sub.slug}`}
                        onClick={closeDrawer}
                        className="py-2.5 text-sm text-slate hover:text-rose-primary"
                      >
                        {sub.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          <div className="flex flex-wrap gap-x-4 gap-y-1 py-4">
            {QUICK_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={closeDrawer}
                className="text-sm font-medium text-rose-primary"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <Link
            href="/quiz"
            onClick={closeDrawer}
            className="border-t border-rose-light/20 py-3.5 text-base font-medium text-ink"
          >
            Find Your Shade
          </Link>

          {user && (
            <button
              onClick={() => {
                closeDrawer();
                signOut({ callbackUrl: "/" });
              }}
              className="border-t border-rose-light/20 py-3.5 text-left text-base font-medium text-slate"
            >
              Sign out
            </button>
          )}
        </nav>
      </div>
    </div>
  );
}
