import { formatGHS } from "@/lib/utils";

type TopProduct = { id: string; name: string; unitsSold: number; revenue: number };

export function TopProductsTable({ products }: { products: TopProduct[] }) {
  if (products.length === 0) {
    return <p className="text-sm text-slate">No sales yet.</p>;
  }

  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b border-rose-light/40 text-left text-slate">
          <th className="pb-2 font-medium">Product</th>
          <th className="pb-2 font-medium">Units Sold</th>
          <th className="pb-2 font-medium">Revenue</th>
        </tr>
      </thead>
      <tbody>
        {products.map((p) => (
          <tr key={p.id} className="border-b border-rose-light/20 last:border-none">
            <td className="py-2.5">{p.name}</td>
            <td className="py-2.5">{p.unitsSold}</td>
            <td className="py-2.5 font-medium">{formatGHS(p.revenue)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
