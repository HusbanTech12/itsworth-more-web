import { NextResponse } from "next/server";
import { db } from "@/db";
import { devices, marketPrices } from "@/db/schema";
import { and, eq } from "drizzle-orm";

export const revalidate = 3600;

export async function GET(
  req: Request,
  { params }: { params: Promise<{ deviceId: string }> },
) {
  try {
    const { deviceId: rawKey } = await params;
    const numericId = Number(rawKey);
    const byId = !isNaN(numericId) && String(numericId) === rawKey;

    const [device] = await db
      .select({ id: devices.id, name: devices.name })
      .from(devices)
      .where(byId ? eq(devices.id, numericId) : eq(devices.slug, rawKey))
      .limit(1);

    const deviceId = device?.id ?? numericId;

    if (!device) {
      return NextResponse.json({ error: "Device not found" }, { status: 404 });
    }

    const { searchParams } = new URL(req.url);
    const condition = searchParams.get("condition");

    const rows = await db
      .select()
      .from(marketPrices)
      .where(
        condition
          ? and(
              eq(marketPrices.deviceId, deviceId),
              eq(marketPrices.conditionSlug, condition),
            )
          : eq(marketPrices.deviceId, deviceId),
      );

    return NextResponse.json(
      { device, market: rows },
      { headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400" } },
    );
  } catch (e) {
    console.error("Route error:", e);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
