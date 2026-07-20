"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { TOP_CATEGORIES, HIGHLIGHT_LINKS, subcategoryIcon } from "@/lib/categories";

const HIGHLIGHT_STYLES: Record<string, string> = {
  new: "bg-emerald-600/10 text-emerald-700 hover:bg-emerald-600/20 hover:shadow-[0_0_16px_-4px_rgba(5,150,105,0.5)]",
  sale: "bg-rose-primary/10 text-rose-primary hover:bg-rose-primary/20 hover:shadow-[0_0_16px_-4px_rgba(236,64,122,0.5)]",
};

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
    <nav className="hidden items-center gap-0.5 text-sm font-medium text-charcoal transition-all duration-300 ease-out group-data-[scrolled=true]:gap-0 lg:flex">
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
            className="group/link relative flex items-center gap-1 whitespace-nowrap rounded-full px-2.5 py-2 transition-all duration-300 ease-out hover:bg-rose-light/15 hover:text-rose-primary hover:shadow-[0_0_16px_-6px_rgba(236,64,122,0.5)] group-data-[scrolled=true]:px-2 group-data-[scrolled=true]:py-1.5 group-data-[scrolled=true]:text-[13px]"
            aria-expanded={openSlug === cat.slug}
          >
            {cat.label}
            {cat.subcategories.length > 0 && (
              <svg width="10" height="6" viewBox="0 0 10 6" className="fill-current opacity-60">
                <path d="M0 0 L5 6 L10 0 Z" />
              </svg>
            )}
            <span className="pointer-events-none absolute inset-x-2.5 -bottom-0 h-0.5 origin-left scale-x-0 rounded-full bg-rose-primary transition-transform duration-300 ease-out group-hover/link:scale-x-100" />
          </Link>

          {cat.subcategories.length > 0 && (
            <div
              className={`absolute left-1/2 top-full z-50 w-[560px] -translate-x-1/2 pt-2 transition duration-200 ease-out ${
                openSlug === cat.slug
                  ? "pointer-events-auto opacity-100"
                  : "pointer-events-none translate-y-1 opacity-0"
              }`}
            >
              <div className="flex overflow-hidden rounded-2xl border border-white/60 bg-white/90 shadow-2xl shadow-charcoal/15 backdrop-blur-xl">
                <div className="grid flex-1 grid-cols-2 gap-x-6 gap-y-1 p-6">
                  {cat.subcategories.map((sub) => (
                    <Link
                      key={sub.slug}
                      href={`/category/${cat.slug}?sub=${sub.slug}`}
                      className="flex items-center gap-2.5 rounded-lg px-2 py-1.5 text-sm text-charcoal transition-colors duration-200 ease-out hover:bg-rose-light/20 hover:text-rose-primary"
                    >
                      <span className="relative block h-8 w-8 shrink-0 overflow-hidden rounded-full bg-rose-light/20">
                        <Image
                          src={subcategoryIcon(cat, sub)}
                          alt=""
                          fill
                          sizes="32px"
                          className="object-cover"
                        />
                      </span>
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

      {HIGHLIGHT_LINKS.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={`ml-1 whitespace-nowrap rounded-full px-3.5 py-1.5 text-sm font-semibold transition-all duration-300 ease-out group-data-[scrolled=true]:px-3 group-data-[scrolled=true]:py-1 ${HIGHLIGHT_STYLES[link.tone]}`}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
