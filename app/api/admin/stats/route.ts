import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/db";
import {
  orders,
  users,
  categories,
  devices,
  coupons,
  contactMessages,
  bulkQuoteRequests,
} from "@/db/schema";
import { eq, sql } from "drizzle-orm";

export async function GET() {
  try {
    await requireAdmin();

    const [totalOrders] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(orders);

    const [pendingOrders] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(orders)
      .where(eq(orders.status, "quote_pending"));

    const [totalUsers] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(users);

    const [totalRevenue] = await db
      .select({ total: sql<number>`coalesce(sum(total_cents), 0)` })
      .from(orders)
      .where(eq(orders.paymentStatus, "completed"));

    const [totalCategories] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(categories);

    const [totalDevices] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(devices);

    const [totalCoupons] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(coupons);

    const [unreadMessages] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(contactMessages)
      .where(eq(contactMessages.isRead, false));

    const [pendingBulkQuotes] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(bulkQuoteRequests)
      .where(eq(bulkQuoteRequests.status, "new"));

    return NextResponse.json({
      totalOrders: totalOrders.count,
      pendingOrders: pendingOrders.count,
      totalUsers: totalUsers.count,
      totalRevenue: totalRevenue.total,
      totalCategories: totalCategories.count,
      totalDevices: totalDevices.count,
      activeCoupons: totalCoupons.count,
      unreadMessages: unreadMessages.count,
      pendingBulkQuotes: pendingBulkQuotes.count,
    });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}