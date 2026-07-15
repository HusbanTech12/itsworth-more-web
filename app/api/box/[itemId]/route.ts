import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { orderItems, orders } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ itemId: string }> },
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { itemId } = await params;
    const id = Number(itemId);

    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid item ID" }, { status: 400 });
    }

    const [item] = await db
      .select()
      .from(orderItems)
      .where(eq(orderItems.id, id))
      .limit(1);

    if (!item) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    const [order] = await db
      .select()
      .from(orders)
      .where(and(eq(orders.id, item.orderId), eq(orders.userId, userId)))
      .limit(1);

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const body = await req.json();
    const updates: Record<string, unknown> = {};

    if (body.conditionSlug) updates.conditionSlug = body.conditionSlug;
    if (body.conditionLabel) updates.conditionLabel = body.conditionLabel;
    if (body.offeredPriceCents != null) updates.offeredPriceCents = body.offeredPriceCents;

    const [updated] = await db
      .update(orderItems)
      .set(updates)
      .where(eq(orderItems.id, id))
      .returning();

    const allItems = await db
      .select()
      .from(orderItems)
      .where(eq(orderItems.orderId, order.id));

    const subtotal = allItems.reduce((s, i) => s + i.offeredPriceCents, 0);

    await db
      .update(orders)
      .set({ subtotalCents: subtotal, totalCents: subtotal, updatedAt: new Date() })
      .where(eq(orders.id, order.id));

    return NextResponse.json({ success: true, item: updated });
  } catch (e) {
    console.error("Route error:", e);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ itemId: string }> },
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { itemId } = await params;
    const id = Number(itemId);

    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid item ID" }, { status: 400 });
    }

    const [item] = await db
      .select()
      .from(orderItems)
      .where(eq(orderItems.id, id))
      .limit(1);

    if (!item) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    const [order] = await db
      .select()
      .from(orders)
      .where(and(eq(orders.id, item.orderId), eq(orders.userId, userId)))
      .limit(1);

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    await db.delete(orderItems).where(eq(orderItems.id, id));

    const remaining = await db
      .select()
      .from(orderItems)
      .where(eq(orderItems.orderId, order.id));

    const subtotal = remaining.reduce((s, i) => s + i.offeredPriceCents, 0);

    await db
      .update(orders)
      .set({ subtotalCents: subtotal, totalCents: subtotal, updatedAt: new Date() })
      .where(eq(orders.id, order.id));

    return NextResponse.json({ success: true, itemId: id });
  } catch (e) {
    console.error("Route error:", e);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
