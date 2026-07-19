import Link from "next/link";
import { TOP_CATEGORIES } from "@/lib/categories";

export function Footer() {
  return (
    <footer className="border-t border-rose-light/40 bg-charcoal pb-24 pt-10 text-cream md:pb-10">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col justify-between gap-8 sm:flex-row">
          <div>
            <p className="font-display text-xl text-rose-light">GlowCart</p>
            <p className="mt-2 max-w-md text-sm text-cream/70">
              Premium makeup, skincare, hair care, fragrance and body essentials —
              delivered across Ghana.
            </p>
          </div>
          <div className="flex flex-wrap gap-x-10 gap-y-4 text-sm">
            <div>
              <p className="mb-2 font-medium text-cream/90">Shop</p>
              <ul className="space-y-1.5 text-cream/60">
                {TOP_CATEGORIES.slice(0, 4).map((cat) => (
                  <li key={cat.slug}>
                    <Link href={`/category/${cat.slug}`} className="hover:text-cream">
                      {cat.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="mb-2 font-medium text-cream/90">More</p>
              <ul className="space-y-1.5 text-cream/60">
                <li>
                  <Link href="/bundles" className="hover:text-cream">
                    Gift Sets
                  </Link>
                </li>
                <li>
                  <Link href="/brands" className="hover:text-cream">
                    Brands
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="hover:text-cream">
                    Blog &amp; Tips
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <p className="mt-8 text-xs text-cream/40">
          Demo build — payments are simulated, no real charges occur.
        </p>
      </div>
    </footer>
  );
}
