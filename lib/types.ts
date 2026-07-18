export function toStringArray(value: unknown): string[] {
  if (Array.isArray(value)) return value.filter((v): v is string => typeof v === "string");
  return [];
}

export type ProductCardData = {
  id: string;
  name: string;
  slug: string;
  price: number;
  images: unknown;
  stock: number;
  badge: string | null;
};
