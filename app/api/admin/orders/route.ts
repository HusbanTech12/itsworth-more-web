import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { orders, orderItems, users } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

async function requireAdmin() {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }
}

export async function GET() {
  try {
    await requireAdmin();
    const result = await db
      .select({
        id: orders.id,
        userId: orders.userId,
        offerNumber: orders.offerNumber,
        status: orders.status,
        subtotalCents: orders.subtotalCents,
        couponId: orders.couponId,
        couponDiscountCents: orders.couponDiscountCents,
        totalCents: orders.totalCents,
        paymentMethod: orders.paymentMethod,
        paymentStatus: orders.paymentStatus,
        shippingMethod: orders.shippingMethod,
        trackingNumber: orders.trackingNumber,
        carrier: orders.carrier,
        expiresAt: orders.expiresAt,
        submittedAt: orders.submittedAt,
        deviceReceivedAt: orders.deviceReceivedAt,
        inspectedAt: orders.inspectedAt,
        paidAt: orders.paidAt,
        cancelledAt: orders.cancelledAt,
        notes: orders.notes,
        createdAt: orders.createdAt,
        updatedAt: orders.updatedAt,
        userEmail: users.email,
        userFirstName: users.firstName,
        userLastName: users.lastName,
      })
      .from(orders)
      .leftJoin(users, eq(orders.userId, users.id))
      .orderBy(desc(orders.createdAt));

    const withItems = await Promise.all(
      result.map(async (order) => {
        const items = await db
          .select()
          .from(orderItems)
          .where(eq(orderItems.orderId, order.id));
        return { ...order, items };
      }),
    );

    return NextResponse.json({ orders: withItems });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await requireAdmin();
    const body = await request.json();
    const {
      userId, offerNumber, status, subtotalCents, totalCents,
      paymentMethod, paymentEmail, paymentStatus, shippingMethod,
      trackingNumber, carrier, notes,
    } = body;

    if (!offerNumber) {
      return NextResponse.json({ error: "Offer number is required" }, { status: 400 });
    }

    const [result] = await db
      .insert(orders)
      .values({
        userId: userId ?? "",
        offerNumber,
        status: status ?? "quote_pending",
        subtotalCents: subtotalCents ?? 0,
        totalCents: totalCents ?? 0,
        paymentMethod,
        paymentEmail,
        paymentStatus: paymentStatus ?? "pending",
        shippingMethod,
        trackingNumber,
        carrier,
        notes,
        submittedAt: new Date(),
      })
      .returning();

    return NextResponse.json({ order: result }, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}