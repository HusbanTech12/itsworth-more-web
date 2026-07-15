import type { Metadata } from "next";
import { auth } from "@clerk/nextjs/server";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { db } from "@/db";
import { orders, orderItems, orderTimeline, orderReinspections } from "@/db/schema";
import { eq, and, asc } from "drizzle-orm";
import { OrderDetail } from "@/components/dashboard/OrderDetail";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Order Details | CashingTech",
  description: "View your trade-in order status, timeline, and details.",
};

export default async function OrderPage({ params }: { params: Promise<{ id: string }> }) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const { id } = await params;

  const [order] = await db
    .select()
    .from(orders)
    .where(and(eq(orders.offerNumber, id), eq(orders.userId, userId)))
    .limit(1);

  if (!order) {
    notFound();
  }

  const items = await db
    .select()
    .from(orderItems)
    .where(eq(orderItems.orderId, order.id));

  const timeline = await db
    .select()
    .from(orderTimeline)
    .where(eq(orderTimeline.orderId, order.id))
    .orderBy(asc(orderTimeline.createdAt));

  const reinspections = await db
    .select()
    .from(orderReinspections)
    .where(eq(orderReinspections.orderId, order.id));

  return (
    <div className="min-h-screen bg-cream">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <Link href="/dashboard">
          <Button variant="ghost" size="sm" className="mb-6">
            &larr; Back to Dashboard
          </Button>
        </Link>
        <OrderDetail
          order={{ ...order, items }}
          timeline={timeline}
          reinspections={reinspections}
        />
      </div>
    </div>
  );
}
