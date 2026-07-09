import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { orders, coupons } from "@/db/schema";
import { eq, and, lt, gt, or, isNull } from "drizzle-orm";

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { code } = await req.json();

    const [coupon] = await db
      .select()
      .from(coupons)
      .where(
        and(
          eq(coupons.code, code.toUpperCase()),
          eq(coupons.isActive, true),
          or(isNull(coupons.expiresAt), gt(coupons.expiresAt, new Date())),
          or(isNull(coupons.startsAt), lt(coupons.startsAt, new Date())),
        ),
      )
      .limit(1);

    if (!coupon) {
      return NextResponse.json(
        { error: "Invalid or expired coupon code" },
        { status: 404 },
      );
    }

    const [order] = await db
      .select()
      .from(orders)
      .where(
        and(eq(orders.userId, userId), eq(orders.status, "quote_pending")),
      )
      .limit(1);

    if (order) {
      const subtotal = order.subtotalCents ?? 0;

      let discountCents = 0;
      if (coupon.type === "percentage") {
        const pct = Number(coupon.percentage ?? 0);
        discountCents = Math.round(subtotal * (pct / 100));
        if (coupon.maxApplyCents) discountCents = Math.min(discountCents, coupon.maxApplyCents);
      } else {
        discountCents = coupon.valueCents ?? 0;
      }
      if (coupon.maxApplyTotalCents) discountCents = Math.min(discountCents, coupon.maxApplyTotalCents);
      discountCents = Math.min(discountCents, subtotal);

      await db
        .update(orders)
        .set({
          couponId: coupon.id,
          couponDiscountCents: discountCents,
          totalCents: subtotal - discountCents,
          updatedAt: new Date(),
        })
        .where(eq(orders.id, order.id));
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

export async function DELETE() {
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

  if (order) {
    await db
      .update(orders)
      .set({
        couponId: null,
        couponDiscountCents: 0,
        totalCents: order.subtotalCents,
        updatedAt: new Date(),
      })
      .where(eq(orders.id, order.id));
  }

  return NextResponse.json({ success: true });
}
