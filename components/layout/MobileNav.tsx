"use client";

import { useState } from "react";
import Link from "next/link";
import { TOP_CATEGORIES, QUICK_LINKS } from "@/lib/categories";

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);

  function close() {
    setOpen(false);
    setExpanded(null);
  }

  return (
    <div className="md:hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        className="flex h-10 w-10 items-center justify-center rounded-full border border-rose-light text-ink"
      >
        <span className="relative block h-3.5 w-4">
          <span
            className={`absolute left-0 top-0 h-0.5 w-4 bg-current transition-transform ${open ? "translate-y-[6px] rotate-45" : ""}`}
          />
          <span
            className={`absolute left-0 top-1.5 h-0.5 w-4 bg-current transition-opacity ${open ? "opacity-0" : ""}`}
          />
          <span
            className={`absolute left-0 top-3 h-0.5 w-4 bg-current transition-transform ${open ? "-translate-y-[6px] -rotate-45" : ""}`}
          />
        </span>
      </button>

      {/* Thumb-reachable dropdown right below the header, not a full-screen
          takeover — keeps the page context visible and the tap targets
          large (44px+) per mobile usability guidance. */}
      <div
        className={`fixed inset-x-0 top-[65px] z-40 max-h-[calc(100vh-65px)] origin-top overflow-y-auto border-b border-rose-light/40 bg-cream shadow-lg transition duration-200 ${
          open ? "scale-y-100 opacity-100" : "pointer-events-none scale-y-0 opacity-0"
        }`}
      >
        <nav className="mx-auto flex max-w-6xl flex-col px-4 py-2">
          {TOP_CATEGORIES.map((cat) => {
            const isExpanded = expanded === cat.slug;
            return (
              <div key={cat.slug} className="border-b border-rose-light/20 last:border-none">
                <div className="flex items-center justify-between">
                  <Link
                    href={`/category/${cat.slug}`}
                    onClick={close}
                    className="flex-1 py-3.5 text-base font-medium text-ink"
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
                  <div className="flex flex-col pb-3 pl-4">
                    {cat.subcategories.map((sub) => (
                      <Link
                        key={sub.slug}
                        href={`/category/${cat.slug}?sub=${sub.slug}`}
                        onClick={close}
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
                onClick={close}
                className="text-sm font-medium text-rose-primary"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <Link
            href="/quiz"
            onClick={close}
            className="border-t border-rose-light/20 py-3.5 text-base font-medium text-ink"
          >
            Find Your Shade
          </Link>
        </nav>
      </div>
    </div>
  );
}
