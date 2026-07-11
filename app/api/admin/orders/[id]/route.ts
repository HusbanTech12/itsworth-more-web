import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/db";
import { orders, orderItems, orderTimeline, users } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
    const { id } = await params;

    const [order] = await db
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
        paymentEmail: orders.paymentEmail,
        paymentStatus: orders.paymentStatus,
        shippingMethod: orders.shippingMethod,
        shippingLabelUrl: orders.shippingLabelUrl,
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
      .where(eq(orders.id, parseInt(id)));

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

    return NextResponse.json({ order: { ...order, items, timeline } });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
    const { id } = await params;
    const body = await request.json();

    const [existing] = await db
      .select()
      .from(orders)
      .where(eq(orders.id, parseInt(id)));

    if (!existing) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const allowedFields = [
      "status", "paymentStatus", "paymentMethod", "paymentEmail",
      "shippingMethod", "shippingLabelUrl", "trackingNumber", "carrier",
      "notes", "deviceReceivedAt", "inspectedAt", "paidAt", "cancelledAt",
    ];

    const updateData: Record<string, unknown> = {};
    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updateData[field] = body[field];
      }
    }
    updateData.updatedAt = new Date();

    if (body.status && body.status !== existing.status) {
      await db.insert(orderTimeline).values({
        orderId: parseInt(id),
        event: `status_${body.status}`,
        description: `Status changed from ${existing.status} to ${body.status}`,
      });
    }

    const [result] = await db
      .update(orders)
      .set(updateData)
      .where(eq(orders.id, parseInt(id)))
      .returning();

    return NextResponse.json({ order: result });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
    const { id } = await params;

    const [existing] = await db
      .select()
      .from(orders)
      .where(eq(orders.id, parseInt(id)));

    if (!existing) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    await db.delete(orders).where(eq(orders.id, parseInt(id)));

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}