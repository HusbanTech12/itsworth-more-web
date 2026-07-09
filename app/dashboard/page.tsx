import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { orders, orderItems } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { OrderCard } from "@/components/dashboard/OrderCard";

export default async function DashboardPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const userOrders = await db
    .select()
    .from(orders)
    .where(eq(orders.userId, userId))
    .orderBy(desc(orders.createdAt));

  const ordersWithItems = await Promise.all(
    userOrders.map(async (order) => {
      const items = await db
        .select()
        .from(orderItems)
        .where(eq(orderItems.orderId, order.id));
      return { ...order, items };
    }),
  );

  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900">Dashboard</h1>
            <p className="text-sm text-zinc-500 mt-1">Manage your orders and track your payouts.</p>
          </div>
        </div>

        <div className="grid gap-1 mb-8">
          <div className="grid grid-cols-3 gap-4">
            <div className="rounded-xl border border-zinc-200 bg-white p-5">
              <p className="text-2xl font-bold text-zinc-900">{ordersWithItems.length}</p>
              <p className="text-xs text-zinc-500 mt-1">Total Orders</p>
            </div>
            <div className="rounded-xl border border-zinc-200 bg-white p-5">
              <p className="text-2xl font-bold text-emerald-600">
                ${ordersWithItems.reduce((s, o) => s + (o.status === "completed" || o.status === "payment_sent" ? (o.totalCents ?? 0) : 0), 0) / 100}
              </p>
              <p className="text-xs text-zinc-500 mt-1">Paid Out</p>
            </div>
            <div className="rounded-xl border border-zinc-200 bg-white p-5">
              <p className="text-2xl font-bold text-primary">
                ${ordersWithItems.filter((o) => o.status !== "completed" && o.status !== "cancelled").reduce((s, o) => s + (o.totalCents ?? 0), 0) / 100}
              </p>
              <p className="text-xs text-zinc-500 mt-1">Pending</p>
            </div>
          </div>
        </div>

        {ordersWithItems.length === 0 ? (
          <div className="text-center py-20">
            <svg className="w-16 h-16 mx-auto text-zinc-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <h2 className="text-lg font-semibold text-zinc-900">No orders yet</h2>
            <p className="text-sm text-zinc-500 mt-2">Start selling to see your orders here.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {ordersWithItems.map((order) => (
              <OrderCard key={order.offerNumber} order={order} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
