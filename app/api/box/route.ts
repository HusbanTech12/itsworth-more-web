import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { orders, orderItems } from "@/db/schema";
import { eq, and, isNull } from "drizzle-orm";
import { generateOfferNumber } from "@/lib/utils";

async function getOrCreatePendingOrder(userId: string) {
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
  }

  return order;
}

export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [order] = await db
    .select()
    .from(orders)
    .where(
      and(eq(orders.userId, userId), eq(orders.status, "quote_pending")),
    )
    .limit(1);

  if (!order) {
    return NextResponse.json({ items: [], subtotalCents: 0 });
  }

  const items = await db
    .select()
    .from(orderItems)
    .where(eq(orderItems.orderId, order.id));

  const subtotalCents = items.reduce((sum, i) => sum + i.offeredPriceCents, 0);

  return NextResponse.json({
    items,
    subtotalCents,
    orderId: order.id,
    offerNumber: order.offerNumber,
  });
}

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { deviceId, deviceName, conditionSlug, conditionLabel, offeredPriceCents, hasAccessories, imei, serialNumber, imageUrl } = body;

    if (!deviceId || !deviceName || !conditionSlug || offeredPriceCents == null) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const order = await getOrCreatePendingOrder(userId);

    const [item] = await db
      .insert(orderItems)
      .values({
        orderId: order.id,
        deviceId,
        deviceName,
        conditionSlug,
        conditionLabel,
        offeredPriceCents,
        hasAccessories: hasAccessories ?? false,
        imei: imei || null,
        serialNumber: serialNumber || null,
      })
      .returning();

    const newSubtotal =
      (order.subtotalCents ?? 0) + offeredPriceCents;

    await db
      .update(orders)
      .set({ subtotalCents: newSubtotal, totalCents: newSubtotal, updatedAt: new Date() })
      .where(eq(orders.id, order.id));

    return NextResponse.json({ success: true, item }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 },
    );
  }
}
