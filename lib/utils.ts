import { TOP_CATEGORIES } from "@/lib/categories";

export function formatGHS(amount: number): string {
  return `₵${amount.toLocaleString("en-GH", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function calculateDeliveryFee(subtotal: number): number {
  return subtotal >= 200 ? 0 : 15;
}

export const GHANA_REGIONS = [
  "Greater Accra",
  "Ashanti",
  "Western",
  "Western North",
  "Central",
  "Eastern",
  "Volta",
  "Oti",
  "Northern",
  "Savannah",
  "North East",
  "Upper East",
  "Upper West",
  "Bono",
  "Bono East",
  "Ahafo",
] as const;

export const CATEGORIES = TOP_CATEGORIES.map((c) => ({ value: c.value, label: c.label }));

export const BADGES = ["", "New", "Best Seller", "Sale", "Low Stock"] as const;

export function categoryLabel(value: string): string {
  return CATEGORIES.find((c) => c.value === value)?.label ?? value;
}
