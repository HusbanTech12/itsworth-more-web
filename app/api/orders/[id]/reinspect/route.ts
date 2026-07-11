import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { orderReinspections, orders } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const orderId = Number(id);
  let order;

  if (isNaN(orderId)) {
    [order] = await db
      .select()
      .from(orders)
      .where(and(eq(orders.offerNumber, id), eq(orders.userId, userId)))
      .limit(1);
  } else {
    [order] = await db
      .select()
      .from(orders)
      .where(and(eq(orders.id, orderId), eq(orders.userId, userId)))
      .limit(1);
  }

  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  const { reason } = await req.json();

  const [reinspection] = await db
    .insert(orderReinspections)
    .values({
      orderId: order.id,
      reason: reason || "Customer requested reinspection",
    })
    .returning();

  return NextResponse.json(
    { success: true, reinspection },
    { status: 201 },
  );
}
