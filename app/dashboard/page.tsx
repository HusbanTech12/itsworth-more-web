import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { db } from "@/db";
import { orders, orderItems, affiliateCommissions } from "@/db/schema";
import { eq, desc, and } from "drizzle-orm";
import { OrderCard } from "@/components/dashboard/OrderCard";
import { Badge } from "@/components/ui/Badge";
import { formatPrice } from "@/lib/utils";

const statusCounts: Record<string, { label: string; variant: "success" | "warning" | "error" | "info" | "neutral" }> = {
  quote_pending: { label: "Quote Pending", variant: "neutral" },
  quote_accepted: { label: "Quote Accepted", variant: "info" },
  device_shipped: { label: "Shipped", variant: "warning" },
  device_received: { label: "Received", variant: "info" },
  inspecting: { label: "Inspecting", variant: "warning" },
  offer_revised: { label: "Offer Revised", variant: "warning" },
  offer_accepted: { label: "Offer Accepted", variant: "success" },
  offer_declined: { label: "Declined", variant: "error" },
  payment_sent: { label: "Payment Sent", variant: "success" },
  completed: { label: "Completed", variant: "success" },
  cancelled: { label: "Cancelled", variant: "error" },
  return_shipped: { label: "Return Shipped", variant: "info" },
};

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const { status } = await searchParams;

  const conditions = [eq(orders.userId, userId)];
  if (status && status !== "all") {
    conditions.push(eq(orders.status, status));
  }

  let userOrders: any[] = [];
  let allOrders: any[] = [];
  let ordersWithItems: any[] = [];

  try {
    userOrders = await db
      .select()
      .from(orders)
      .where(and(...conditions))
      .orderBy(desc(orders.createdAt));

    ordersWithItems = await Promise.all(
      userOrders.map(async (order) => {
        const items = await db
          .select()
          .from(orderItems)
          .where(eq(orderItems.orderId, order.id));
        return { ...order, items };
      }),
    );

    allOrders = await db
      .select()
      .from(orders)
      .where(eq(orders.userId, userId));
  } catch (e) {
    console.error("Dashboard query failed:", e);
  }

  const totalOrders = allOrders.length;
  const paidOut = allOrders
    .filter((o) => o.status === "completed" || o.status === "payment_sent")
    .reduce((s, o) => s + (o.totalCents ?? 0), 0);
  const pending = allOrders
    .filter((o) => o.status !== "completed" && o.status !== "cancelled")
    .reduce((s, o) => s + (o.totalCents ?? 0), 0);
  const activeOrders = allOrders.filter(
    (o) => o.status !== "completed" && o.status !== "cancelled" && o.status !== "return_shipped",
  ).length;

  const [commissions] = await db
    .select()
    .from(affiliateCommissions)
    .where(eq(affiliateCommissions.userId, userId));

  const statusSummary = Object.keys(statusCounts).reduce(
    (acc, key) => {
      acc[key] = allOrders.filter((o) => o.status === key).length;
      return acc;
    },
    {} as Record<string, number>,
  );

  return (
    <div className="min-h-screen bg-cream">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-ink">Dashboard</h1>
            <p className="text-sm text-ink-muted mt-1">Manage your orders and track your payouts.</p>
          </div>
          <Link
            href="/sell"
            className="inline-flex items-center gap-1.5 rounded-md bg-orange px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-orange/90 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path d="M12 4v16m8-8H4" />
            </svg>
            Start Selling
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="rounded-xl border border-border bg-white p-5">
            <p className="text-3xl font-bold text-ink">{totalOrders}</p>
            <p className="text-xs text-ink-muted mt-1">Total Orders</p>
          </div>
          <div className="rounded-xl border border-border bg-white p-5">
            <p className="text-3xl font-bold text-emerald-600">{formatPrice(paidOut)}</p>
            <p className="text-xs text-ink-muted mt-1">Paid Out</p>
          </div>
          <div className="rounded-xl border border-border bg-white p-5">
            <p className="text-3xl font-bold text-orange">{formatPrice(pending)}</p>
            <p className="text-xs text-ink-muted mt-1">Pending</p>
          </div>
          <div className="rounded-xl border border-border bg-white p-5">
            <p className="text-3xl font-bold text-ink">{activeOrders}</p>
            <p className="text-xs text-ink-muted mt-1">Active Orders</p>
          </div>
        </div>

        {commissions && commissions.amountCents > 0 && (
          <div className="rounded-xl border border-lime/20 bg-lime/10 p-5 mb-8 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-emerald-900">Affiliate Earnings</p>
              <p className="text-xs text-emerald-700 mt-0.5">
                Earned from referrals
              </p>
            </div>
            <p className="text-xl font-bold text-emerald-700">{formatPrice(commissions.amountCents)}</p>
          </div>
        )}

        <div className="flex flex-wrap gap-2 mb-6">
          <a
            href="/dashboard"
            className={`inline-flex items-center rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors ${
              !status ? "bg-ink text-white" : "bg-white text-ink-muted border border-border hover:bg-cream"
            }`}
          >
            All
          </a>
          {Object.entries(statusCounts).map(([key, val]) => {
            if (!statusSummary[key]) return null;
            return (
              <a
                key={key}
                href={`/dashboard?status=${key}`}
                className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors ${
                  status === key
                    ? "bg-ink text-white"
                    : "bg-white text-ink-muted border border-border hover:bg-cream"
                }`}
              >
                <Badge variant={val.variant}>{val.label}</Badge>
                <span>{statusSummary[key]}</span>
              </a>
            );
          })}
        </div>

        {ordersWithItems.length === 0 ? (
          <div className="text-center py-20">
            <svg className="w-16 h-16 mx-auto text-ink-muted mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <h2 className="text-lg font-semibold text-ink">No orders yet</h2>
            <p className="text-sm text-ink-muted mt-2 mb-6">
              {status ? "No orders match this filter." : "Start selling to see your orders here."}
            </p>
            {!status && (
              <a
                href="/sell"
                className="inline-flex items-center gap-1.5 rounded-md bg-orange px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-orange/90 transition-colors"
              >
                Sell Your First Device
              </a>
            )}
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
