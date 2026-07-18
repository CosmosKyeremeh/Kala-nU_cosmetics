"use client";

import { useEffect, useRef, useState } from "react";
import type { Product } from "@prisma/client";

export function ManualProductSearch({ onSelect }: { onSelect: (product: Product) => void }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!query.trim()) return;
    debounceRef.current = setTimeout(() => {
      fetch(`/api/products?search=${encodeURIComponent(query)}`)
        .then((res) => res.json())
        .then((data) => setResults(data.slice(0, 6)));
    }, 300);
  }, [query]);

  const visibleResults = query.trim() ? results : [];

  return (
    <div className="relative">
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search product by name (if QR scan fails)..."
        className="w-full rounded-lg border border-rose-light px-4 py-3 text-base"
      />
      {visibleResults.length > 0 && (
        <ul className="absolute z-10 mt-1 w-full rounded-lg border border-rose-light/40 bg-white shadow-lg">
          {visibleResults.map((product) => (
            <li key={product.id}>
              <button
                type="button"
                onClick={() => {
                  onSelect(product);
                  setQuery("");
                  setResults([]);
                }}
                className="block w-full px-4 py-3 text-left text-sm hover:bg-rose-light/10"
              >
                {product.name} — {product.stock} in stock
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
