import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { orders, orderItems, orderTimeline } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { generateOfferNumber } from "@/lib/utils";

interface CheckoutItem {
  deviceId?: number;
  deviceName: string;
  conditionSlug?: string;
  conditionLabel?: string;
  offeredPriceCents: number;
  hasAccessories?: boolean;
  imei?: string;
  serialNumber?: string;
}

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const {
      shippingMethod,
      carrier,
      paymentMethod,
      paymentEmail,
    } = body;

    let [order] = await db
      .select()
      .from(orders)
      .where(
        and(eq(orders.userId, userId), eq(orders.status, "quote_pending")),
      )
      .limit(1);

    if (!order) {
      [order] = await db
        .insert(orders)
        .values({
          userId,
          offerNumber: generateOfferNumber(),
          status: "quote_pending",
        })
        .returning();

      const items: CheckoutItem[] = body.items || [];
      if (items.length > 0) {
        await db.insert(orderItems).values(
          items.map((i) => ({
            orderId: order.id,
            deviceId: i.deviceId || null,
            deviceName: i.deviceName || "",
            conditionSlug: i.conditionSlug || null,
            conditionLabel: i.conditionLabel || null,
            offeredPriceCents: i.offeredPriceCents || 0,
            hasAccessories: i.hasAccessories ?? false,
            imei: i.imei || null,
            serialNumber: i.serialNumber || null,
          })),
        );
      }
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
        subtotalCents: body.subtotalCents ?? order.subtotalCents,
        totalCents: body.totalCents ?? order.totalCents,
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
  } catch (e) {
    const message = e instanceof Error ? e.message : "Checkout failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
