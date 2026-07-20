"use client";

import { useEffect, useState } from "react";

// Tracks scroll position and exposes it as a `data-scrolled` attribute on a
// named `group`, so descendant elements (logo, nav links, utility strip)
// can react via Tailwind's `group-data-[scrolled=true]:` variant without
// prop-drilling scroll state through every child.
export function StickyHeader({ children }: { children: React.ReactNode }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 16);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      data-scrolled={scrolled}
      className="group sticky top-0 z-40 border-b border-white/50 bg-cream/70 shadow-sm shadow-charcoal/5 backdrop-blur-xl transition-shadow duration-300 data-[scrolled=true]:shadow-md data-[scrolled=true]:shadow-charcoal/10"
    >
      {children}
    </header>
  );
}
