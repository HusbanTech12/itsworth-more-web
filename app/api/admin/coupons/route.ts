import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { coupons } from "@/db/schema";
import { desc } from "drizzle-orm";

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
      .select()
      .from(coupons)
      .orderBy(desc(coupons.createdAt));

    return NextResponse.json({ coupons: result });
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
      code, type, valueCents, percentage, maxApplyCents, maxApplyTotalCents,
      minOrderCents, maxUses, maxUsesPerUser, isActive, startsAt, expiresAt,
    } = body;

    if (!code || !type) {
      return NextResponse.json({ error: "Code and type are required" }, { status: 400 });
    }

    const [result] = await db
      .insert(coupons)
      .values({
        code,
        type,
        valueCents,
        percentage,
        maxApplyCents,
        maxApplyTotalCents,
        minOrderCents: minOrderCents ?? 0,
        maxUses,
        maxUsesPerUser,
        isActive: isActive ?? true,
        startsAt: startsAt ? new Date(startsAt) : null,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
      })
      .returning();

    return NextResponse.json({ coupon: result }, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}