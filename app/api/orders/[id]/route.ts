import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { orders, orderItems, orderTimeline, orderReinspections } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const orderId = Number(id);

    if (isNaN(orderId)) {
      const [orderByOffer] = await db
        .select()
        .from(orders)
        .where(
          and(eq(orders.offerNumber, id), eq(orders.userId, userId)),
        )
        .limit(1);

      if (!orderByOffer) {
        return NextResponse.json({ error: "Order not found" }, { status: 404 });
      }

      const items = await db
        .select()
        .from(orderItems)
        .where(eq(orderItems.orderId, orderByOffer.id));
      const timeline = await db
        .select()
        .from(orderTimeline)
        .where(eq(orderTimeline.orderId, orderByOffer.id))
        .orderBy(orderTimeline.createdAt);
      const reinspections = await db
        .select()
        .from(orderReinspections)
        .where(eq(orderReinspections.orderId, orderByOffer.id));

      return NextResponse.json({
        order: { ...orderByOffer, items, timeline, reinspections },
      });
    }

    const [order] = await db
      .select()
      .from(orders)
      .where(
        and(eq(orders.id, orderId), eq(orders.userId, userId)),
      )
      .limit(1);

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const items = await db
      .select()
      .from(orderItems)
      .where(eq(orderItems.orderId, order.id));
    const timeline = await db
      .select()
      .from(orderTimeline)
      .where(eq(orderTimeline.orderId, order.id))
      .orderBy(orderTimeline.createdAt);
    const reinspections = await db
      .select()
      .from(orderReinspections)
      .where(eq(orderReinspections.orderId, order.id));

    return NextResponse.json({
      order: { ...order, items, timeline, reinspections },
    });
  } catch (e) {
    console.error("Route error:", e);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
