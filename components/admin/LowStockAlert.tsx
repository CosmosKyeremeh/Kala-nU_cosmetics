import Link from "next/link";

type LowStockProduct = { id: string; name: string; stock: number };

export function LowStockAlert({ products }: { products: LowStockProduct[] }) {
  if (products.length === 0) {
    return <p className="text-sm text-slate">All products are well stocked.</p>;
  }

  return (
    <ul className="space-y-2">
      {products.map((p) => (
        <li key={p.id} className="flex items-center justify-between text-sm">
          <Link href={`/admin/products/${p.id}/edit`} className="hover:text-rose-primary">
            {p.name}
          </Link>
          <span className="rounded-full bg-rose-primary/10 px-2.5 py-0.5 font-medium text-rose-primary">
            {p.stock} left
          </span>
        </li>
      ))}
    </ul>
  );
}
