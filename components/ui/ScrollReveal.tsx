"use client";

import { useEffect, useRef, useState } from "react";

// Deliberately dependency-free: a fade+slide-up-on-scroll used dozens of
// times per page doesn't need a full animation library's runtime cost just
// to toggle two CSS properties. IntersectionObserver + a CSS transition
// covers it for a fraction of the JS. Reserve framer-motion for the handful
// of spots that actually need gesture/spring physics (shade-compare drag,
// magnetic button, cart-fly).
export function ScrollReveal({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.1 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`transition duration-700 ease-out ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-7"
      } ${className}`}
      style={{ transitionDelay: `${delay * 1000}ms` }}
    >
      {children}
    </div>
  );
}
