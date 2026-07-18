"use client";

import { useState } from "react";
import Link from "next/link";

const LINKS = [
  { href: "/products", label: "Shop All" },
  { href: "/products?category=SKINCARE", label: "Skincare" },
  { href: "/products?category=BODY_SPRAY", label: "Body Spray" },
  { href: "/products?category=HAIR_CARE", label: "Hair Care" },
  { href: "/quiz", label: "Find Your Shade" },
];

export function MobileNav() {
  const [open, setOpen] = useState(false);

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
        className={`fixed inset-x-0 top-[65px] z-40 origin-top border-b border-rose-light/40 bg-cream shadow-lg transition duration-200 ${
          open ? "scale-y-100 opacity-100" : "pointer-events-none scale-y-0 opacity-0"
        }`}
      >
        <nav className="mx-auto flex max-w-6xl flex-col px-4 py-2">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="border-b border-rose-light/20 py-3.5 text-base font-medium text-ink last:border-none"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}
