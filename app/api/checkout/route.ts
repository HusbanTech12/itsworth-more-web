import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { orders, orderItems, orderTimeline } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const {
      offerNumber,
      shippingMethod,
      carrier,
      paymentMethod,
      paymentEmail,
    } = body;

    const [order] = await db
      .select()
      .from(orders)
      .where(
        and(
          eq(orders.userId, userId),
          eq(orders.offerNumber, offerNumber),
          eq(orders.status, "quote_pending"),
        ),
      )
      .limit(1);

    if (!order) {
      return NextResponse.json(
        { error: "Pending order not found" },
        { status: 404 },
      );
    }

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 21);

    await db
      .update(orders)
      .set({
        status: "quote_accepted",
        shippingMethod,
        carrier,
        paymentMethod,
        paymentEmail,
        expiresAt,
        submittedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(orders.id, order.id));

    await db.insert(orderTimeline).values({
      orderId: order.id,
      event: "quote_created",
      description: "Order submitted and quote accepted",
    });

    return NextResponse.json({
      success: true,
      offerNumber: order.offerNumber,
    });
  } catch {
    return NextResponse.json(
      { error: "Invalid request" },
      { status: 400 },
    );
  }
}
