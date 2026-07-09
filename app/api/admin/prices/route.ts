import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { devicePrices, devices } from "@/db/schema";
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
        id: devicePrices.id,
        deviceId: devicePrices.deviceId,
        conditionSlug: devicePrices.conditionSlug,
        priceCents: devicePrices.priceCents,
        isActive: devicePrices.isActive,
        createdAt: devicePrices.createdAt,
        updatedAt: devicePrices.updatedAt,
        deviceName: devices.name,
      })
      .from(devicePrices)
      .leftJoin(devices, eq(devicePrices.deviceId, devices.id))
      .orderBy(desc(devicePrices.createdAt));

    return NextResponse.json({ prices: result });
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
    const { deviceId, conditionSlug, priceCents, isActive } = body;

    if (!deviceId || !conditionSlug || priceCents === undefined) {
      return NextResponse.json({ error: "Device ID, condition slug, and price are required" }, { status: 400 });
    }

    const [result] = await db
      .insert(devicePrices)
      .values({
        deviceId,
        conditionSlug,
        priceCents,
        isActive: isActive ?? true,
      })
      .returning();

    return NextResponse.json({ price: result }, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}