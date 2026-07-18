"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { CATEGORIES, slugify } from "@/lib/utils";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { toStringArray } from "@/lib/types";
import type { Product } from "@prisma/client";

const BADGES = ["", "New", "Best Seller", "Low Stock"];

export function ProductForm({ product }: { product?: Product }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: product?.name ?? "",
    description: product?.description ?? "",
    tagline: product?.tagline ?? "",
    price: product?.price ?? 0,
    category: product?.category ?? "SKINCARE",
    stock: product?.stock ?? 0,
    badge: product?.badge ?? "",
    images: toStringArray(product?.images),
    isFeatured: product?.isFeatured ?? false,
    isPublished: product?.isPublished ?? true,
    texture: product?.texture ?? "",
    ingredients: toStringArray(product?.ingredients).join(", "),
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (form.images.length === 0) {
      toast.error("Add at least one product image");
      return;
    }

    setSaving(true);
    const payload = {
      ...form,
      slug: slugify(form.name),
      badge: form.badge || null,
      ingredients: form.ingredients
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    };

    const url = product ? `/api/admin/products/${product.id}` : "/api/admin/products";
    const method = product ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    setSaving(false);

    if (!res.ok) {
      toast.error(data.error ?? "Failed to save product");
      return;
    }

    toast.success(product ? "Product updated" : "Product created");
    router.push("/admin/products");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-5">
      <div>
        <label className="mb-1 block text-sm font-medium">Product Name</label>
        <input
          required
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full rounded-lg border border-rose-light px-4 py-2.5"
        />
        {form.name && <p className="mt-1 text-xs text-slate">Slug: {slugify(form.name)}</p>}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Tagline</label>
        <input
          value={form.tagline}
          onChange={(e) => setForm({ ...form, tagline: e.target.value })}
          placeholder="Short, transformation-focused hook"
          className="w-full rounded-lg border border-rose-light px-4 py-2.5"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Description</label>
        <textarea
          required
          rows={3}
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="w-full rounded-lg border border-rose-light px-4 py-2.5"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Texture / Feel</label>
        <textarea
          rows={2}
          value={form.texture}
          onChange={(e) => setForm({ ...form, texture: e.target.value })}
          placeholder="Sensory description for the product page's 'feel' section"
          className="w-full rounded-lg border border-rose-light px-4 py-2.5"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Ingredients (comma-separated)</label>
        <input
          value={form.ingredients}
          onChange={(e) => setForm({ ...form, ingredients: e.target.value })}
          className="w-full rounded-lg border border-rose-light px-4 py-2.5"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium">Price (₵)</label>
          <input
            required
            type="number"
            min={0}
            step={0.01}
            value={form.price}
            onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
            className="w-full rounded-lg border border-rose-light px-4 py-2.5"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Stock</label>
          <input
            required
            type="number"
            min={0}
            value={form.stock}
            onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })}
            className="w-full rounded-lg border border-rose-light px-4 py-2.5"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Category</label>
          <select
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            className="w-full rounded-lg border border-rose-light px-4 py-2.5"
          >
            {CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Badge</label>
          <select
            value={form.badge}
            onChange={(e) => setForm({ ...form, badge: e.target.value })}
            className="w-full rounded-lg border border-rose-light px-4 py-2.5"
          >
            {BADGES.map((b) => (
              <option key={b} value={b}>
                {b || "None"}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex gap-6">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.isFeatured}
            onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })}
          />
          Featured on homepage
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.isPublished}
            onChange={(e) => setForm({ ...form, isPublished: e.target.checked })}
          />
          Published (visible in store)
        </label>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Images</label>
        <ImageUploader images={form.images} onChange={(images) => setForm({ ...form, images })} />
      </div>

      <button
        type="submit"
        disabled={saving}
        className="rounded-full bg-rose-primary px-8 py-3 font-semibold text-white hover:bg-rose-primary/90 disabled:opacity-60"
      >
        {saving ? "Saving..." : product ? "Save Changes" : "Create Product"}
      </button>
    </form>
  );
}
