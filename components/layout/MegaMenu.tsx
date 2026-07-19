"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { TOP_CATEGORIES } from "@/lib/categories";

export function MegaMenu() {
  const [openSlug, setOpenSlug] = useState<string | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function open(slug: string) {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpenSlug(slug);
  }

  function scheduleClose() {
    closeTimer.current = setTimeout(() => setOpenSlug(null), 120);
  }

  return (
    <nav className="hidden items-center gap-1 text-sm font-medium text-charcoal md:flex">
      {TOP_CATEGORIES.map((cat) => (
        <div
          key={cat.slug}
          className="relative"
          onMouseEnter={() => open(cat.slug)}
          onMouseLeave={scheduleClose}
          onFocus={() => open(cat.slug)}
          onBlur={scheduleClose}
        >
          <Link
            href={`/category/${cat.slug}`}
            className="flex items-center gap-1 rounded-full px-3 py-2 hover:text-rose-primary"
            aria-expanded={openSlug === cat.slug}
          >
            {cat.label}
            {cat.subcategories.length > 0 && (
              <svg width="10" height="6" viewBox="0 0 10 6" className="fill-current opacity-60">
                <path d="M0 0 L5 6 L10 0 Z" />
              </svg>
            )}
          </Link>

          {cat.subcategories.length > 0 && (
            <div
              className={`absolute left-1/2 top-full z-50 w-[520px] -translate-x-1/2 pt-2 transition ${
                openSlug === cat.slug
                  ? "pointer-events-auto opacity-100"
                  : "pointer-events-none translate-y-1 opacity-0"
              }`}
            >
              <div className="flex overflow-hidden rounded-2xl border border-rose-light/40 bg-white shadow-2xl shadow-charcoal/10">
                <div className="grid flex-1 grid-cols-2 gap-x-6 gap-y-1 p-6">
                  {cat.subcategories.map((sub) => (
                    <Link
                      key={sub.slug}
                      href={`/category/${cat.slug}?sub=${sub.slug}`}
                      className="rounded-lg px-2 py-1.5 text-sm text-charcoal hover:bg-rose-light/20 hover:text-rose-primary"
                    >
                      {sub.label}
                    </Link>
                  ))}
                  <Link
                    href={`/category/${cat.slug}`}
                    className="col-span-2 mt-2 rounded-lg px-2 py-1.5 text-sm font-semibold text-rose-primary hover:underline"
                  >
                    Shop all {cat.label} →
                  </Link>
                </div>
                <div className="relative hidden w-40 shrink-0 sm:block">
                  <Image src={cat.image} alt={cat.label} fill sizes="160px" className="object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal/60 to-transparent" />
                  <p className="absolute bottom-3 left-3 right-3 font-display text-sm font-semibold text-white">
                    {cat.label}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </nav>
  );
}
