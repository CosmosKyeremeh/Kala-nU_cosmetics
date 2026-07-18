import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatGHS } from "@/lib/utils";

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user) redirect("/auth/login?callbackUrl=/profile");

  const [user, orders] = await Promise.all([
    prisma.user.findUnique({ where: { id: session.user.id } }),
    prisma.order.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      include: { items: true },
    }),
  ]);

  if (!user) redirect("/auth/login");

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="font-display mb-8 text-4xl font-semibold">My Account</h1>

      <div className="rounded-2xl border border-rose-light/40 bg-white p-6">
        <h2 className="font-display mb-4 text-xl font-semibold">Profile</h2>
        <dl className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-slate">Name</dt>
            <dd className="font-medium">{user.name}</dd>
          </div>
          <div>
            <dt className="text-slate">Email</dt>
            <dd className="font-medium">{user.email}</dd>
          </div>
          <div>
            <dt className="text-slate">Phone</dt>
            <dd className="font-medium">{user.phone ?? "—"}</dd>
          </div>
          <div>
            <dt className="text-slate">Region</dt>
            <dd className="font-medium">{user.region ?? "—"}</dd>
          </div>
        </dl>
      </div>

      <div className="mt-10">
        <h2 className="font-display mb-4 text-xl font-semibold">Order History</h2>
        {orders.length === 0 ? (
          <p className="text-slate">You haven&apos;t placed any orders yet.</p>
        ) : (
          <ul className="space-y-3">
            {orders.map((order) => (
              <li
                key={order.id}
                className="flex items-center justify-between rounded-xl border border-rose-light/40 bg-white p-4 text-sm"
              >
                <div>
                  <p className="font-medium">#{order.id.slice(-8).toUpperCase()}</p>
                  <p className="text-slate">
                    {order.items.length} item(s) · {new Date(order.createdAt).toLocaleDateString("en-GH")}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="rounded-full bg-rose-light/30 px-3 py-1 text-xs font-medium text-rose-primary">
                    {order.status}
                  </span>
                  <span className="font-medium">{formatGHS(order.total)}</span>
                  <Link
                    href={`/order-confirmed?orderId=${order.id}`}
                    className="text-rose-primary hover:underline"
                  >
                    View
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
