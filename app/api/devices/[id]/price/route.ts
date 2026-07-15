import { NextResponse } from "next/server";
import { db } from "@/db";
import { devicePrices, deviceConditions, devices } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(req.url);
    const condition = searchParams.get("condition");

    const deviceId = Number(id);
    if (isNaN(deviceId)) {
      return NextResponse.json({ error: "Invalid device ID" }, { status: 400 });
    }

    const device = await db
      .select()
      .from(devices)
      .where(eq(devices.id, deviceId))
      .limit(1);

    if (!device.length) {
      return NextResponse.json({ error: "Device not found" }, { status: 404 });
    }

    if (condition) {
      const price = await db
        .select()
        .from(devicePrices)
        .where(
          and(
            eq(devicePrices.deviceId, deviceId),
            eq(devicePrices.conditionSlug, condition),
            eq(devicePrices.isActive, true),
          ),
        )
        .limit(1);

      if (!price.length) {
        return NextResponse.json(
          { error: "Price not found for this condition" },
          { status: 404 },
        );
      }

      const cond = await db
        .select()
        .from(deviceConditions)
        .where(eq(deviceConditions.slug, condition))
        .limit(1);

      return NextResponse.json({
        device: device[0],
        price: price[0],
        condition: cond[0] || null,
      });
    }

    const prices = await db
      .select({
        id: devicePrices.id,
        conditionSlug: devicePrices.conditionSlug,
        priceCents: devicePrices.priceCents,
        conditionLabel: deviceConditions.label,
        conditionDescription: deviceConditions.description,
      })
      .from(devicePrices)
      .innerJoin(
        deviceConditions,
        eq(devicePrices.conditionSlug, deviceConditions.slug),
      )
      .where(
        and(eq(devicePrices.deviceId, deviceId), eq(devicePrices.isActive, true)),
      )
      .orderBy(devicePrices.priceCents);

    return NextResponse.json({
      device: device[0],
      prices,
    });
  } catch (e) {
    console.error("Route error:", e);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
