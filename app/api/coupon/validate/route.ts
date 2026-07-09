import { NextResponse } from "next/server";
import { db } from "@/db";
import { coupons } from "@/db/schema";
import { eq, and, lt, gt, or, isNull } from "drizzle-orm";

export async function POST(req: Request) {
  try {
    const { code, subtotalCents } = await req.json();

    if (!code || subtotalCents == null) {
      return NextResponse.json(
        { error: "Code and subtotalCents are required" },
        { status: 400 },
      );
    }

    const [coupon] = await db
      .select()
      .from(coupons)
      .where(
        and(
          eq(coupons.code, code.toUpperCase()),
          eq(coupons.isActive, true),
          or(
            isNull(coupons.expiresAt),
            gt(coupons.expiresAt, new Date()),
          ),
          or(
            isNull(coupons.startsAt),
            lt(coupons.startsAt, new Date()),
          ),
        ),
      )
      .limit(1);

    if (!coupon) {
      return NextResponse.json(
        { error: "Invalid or expired coupon code" },
        { status: 404 },
      );
    }

    if (subtotalCents < (coupon.minOrderCents ?? 0)) {
      return NextResponse.json(
        { error: `Minimum order of ${(coupon.minOrderCents ?? 0) / 100} required` },
        { status: 400 },
      );
    }

    let discountCents = 0;
    if (coupon.type === "percentage") {
      const pct = Number(coupon.percentage ?? 0);
      discountCents = Math.round(subtotalCents * (pct / 100));
      if (coupon.maxApplyCents) {
        discountCents = Math.min(discountCents, coupon.maxApplyCents);
      }
    } else {
      discountCents = coupon.valueCents ?? 0;
    }

    if (coupon.maxApplyTotalCents) {
      discountCents = Math.min(discountCents, coupon.maxApplyTotalCents);
    }

    discountCents = Math.min(discountCents, subtotalCents);

    return NextResponse.json({
      coupon: {
        code: coupon.code,
        type: coupon.type,
        value: coupon.type === "percentage" ? Number(coupon.percentage) : coupon.valueCents,
        discountCents,
      },
    });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
