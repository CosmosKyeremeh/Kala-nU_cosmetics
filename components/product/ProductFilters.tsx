"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useRef, useState, useTransition } from "react";
import { CATEGORIES } from "@/lib/utils";

export function ProductFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") ?? "");
  const [, startTransition] = useTransition();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function updateParam(key: string, value: string | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    startTransition(() => router.push(`/products?${params.toString()}`));
  }

  function handleSearchChange(value: string) {
    setSearch(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => updateParam("search", value || null), 300);
  }

  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <input
        type="search"
        value={search}
        onChange={(e) => handleSearchChange(e.target.value)}
        placeholder="Search products..."
        className="w-full rounded-full border border-rose-light bg-white px-4 py-2 text-sm sm:max-w-xs"
      />

      <div className="flex flex-wrap gap-3">
        <select
          value={searchParams.get("category") ?? ""}
          onChange={(e) => updateParam("category", e.target.value || null)}
          className="rounded-full border border-rose-light bg-white px-4 py-2 text-sm"
        >
          <option value="">All Categories</option>
          {CATEGORIES.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>

        <select
          value={searchParams.get("sort") ?? ""}
          onChange={(e) => updateParam("sort", e.target.value || null)}
          className="rounded-full border border-rose-light bg-white px-4 py-2 text-sm"
        >
          <option value="">Newest</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="popular">Most Popular</option>
        </select>
      </div>
    </div>
  );
}
