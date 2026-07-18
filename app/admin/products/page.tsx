"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import toast from "react-hot-toast";
import { formatGHS, categoryLabel, CATEGORIES } from "@/lib/utils";
import { toStringArray } from "@/lib/types";
import type { Product } from "@prisma/client";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    const params = new URLSearchParams({ page: String(page) });
    if (search) params.set("search", search);
    if (category) params.set("category", category);
    fetch(`/api/admin/products?${params}`)
      .then((res) => res.json())
      .then((data) => {
        setProducts(data.products);
        setTotal(data.total);
        setLoading(false);
      });
  }, [page, search, category]);

  useEffect(() => load(), [load]);

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Unpublish "${name}"? It will be hidden from the store.`)) return;
    const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
    if (res.ok) {
      toast.success("Product unpublished");
      load();
    } else {
      toast.error("Failed to unpublish product");
    }
  }

  const totalPages = Math.max(1, Math.ceil(total / 10));

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-3xl font-semibold">Products</h1>
        <Link
          href="/admin/products/new"
          className="rounded-full bg-rose-primary px-6 py-2.5 text-sm font-semibold text-white hover:bg-rose-primary/90"
        >
          Add Product
        </Link>
      </div>

      <div className="mb-4 flex flex-wrap gap-3">
        <input
          value={search}
          onChange={(e) => {
            setPage(1);
            setSearch(e.target.value);
          }}
          placeholder="Search products..."
          className="rounded-full border border-rose-light px-4 py-2 text-sm"
        />
        <select
          value={category}
          onChange={(e) => {
            setPage(1);
            setCategory(e.target.value);
          }}
          className="rounded-full border border-rose-light px-4 py-2 text-sm"
        >
          <option value="">All Categories</option>
          {CATEGORIES.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-rose-light/40 bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-rose-light/40 bg-rose-light/10 text-left">
              <th className="p-3 font-medium">Image</th>
              <th className="p-3 font-medium">Name</th>
              <th className="p-3 font-medium">Category</th>
              <th className="p-3 font-medium">Price</th>
              <th className="p-3 font-medium">Stock</th>
              <th className="p-3 font-medium">Status</th>
              <th className="p-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="p-6 text-center text-slate">
                  Loading...
                </td>
              </tr>
            ) : products.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-6 text-center text-slate">
                  No products found.
                </td>
              </tr>
            ) : (
              products.map((product) => {
                const image = toStringArray(product.images)[0];
                return (
                  <tr key={product.id} className="border-b border-rose-light/20 last:border-none">
                    <td className="p-3">
                      {image && (
                        <div className="relative h-10 w-10 overflow-hidden rounded-lg">
                          <Image src={image} alt="" fill className="object-cover" />
                        </div>
                      )}
                    </td>
                    <td className="p-3">{product.name}</td>
                    <td className="p-3">{categoryLabel(product.category)}</td>
                    <td className="p-3">{formatGHS(product.price)}</td>
                    <td className="p-3">{product.stock}</td>
                    <td className="p-3">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          product.isPublished
                            ? "bg-green-100 text-green-700"
                            : "bg-slate/10 text-slate"
                        }`}
                      >
                        {product.isPublished ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td className="p-3">
                      <div className="flex gap-3">
                        <Link
                          href={`/admin/products/${product.id}/edit`}
                          className="text-rose-primary hover:underline"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(product.id, product.name)}
                          className="text-slate hover:text-rose-primary"
                        >
                          Unpublish
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-center gap-2 text-sm">
          <button
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
            className="rounded-full border border-rose-light px-3 py-1 disabled:opacity-40"
          >
            Prev
          </button>
          <span>
            Page {page} of {totalPages}
          </span>
          <button
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="rounded-full border border-rose-light px-3 py-1 disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
