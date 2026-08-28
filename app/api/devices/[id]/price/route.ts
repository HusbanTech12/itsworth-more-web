import { NextResponse } from "next/server";
import { db } from "@/db";
import {
  devicePrices,
  deviceConditions,
  devices,
  marketPrices,
} from "@/db/schema";
import {
  CONDITION_DISPLAY_ORDER,
  deriveConditionPricesFromBrandNew,
} from "@/lib/pricing/condition-tiers";
import { and, asc, eq } from "drizzle-orm";

const MARKET_SOURCE = "ebay";

async function getBrandNewMarketCents(deviceId: number): Promise<number | null> {
  const [row] = await db
    .select({ medianCents: marketPrices.medianCents })
    .from(marketPrices)
    .where(
      and(
        eq(marketPrices.deviceId, deviceId),
        eq(marketPrices.conditionSlug, "brand-new"),
        eq(marketPrices.source, MARKET_SOURCE),
      ),
    )
    .limit(1);
  return row?.medianCents ?? null;
}

async function buildPriceList(deviceId: number) {
  const conditionRows = await db
    .select({
      slug: deviceConditions.slug,
      label: deviceConditions.label,
      description: deviceConditions.description,
      sortOrder: deviceConditions.sortOrder,
    })
    .from(deviceConditions)
    .orderBy(asc(deviceConditions.sortOrder));

  const dbPrices = await db
    .select({
      id: devicePrices.id,
      conditionSlug: devicePrices.conditionSlug,
      priceCents: devicePrices.priceCents,
    })
    .from(devicePrices)
    .where(and(eq(devicePrices.deviceId, deviceId), eq(devicePrices.isActive, true)));

  const dbBySlug = new Map(dbPrices.map((p) => [p.conditionSlug, p]));
  const brandNewMarket = await getBrandNewMarketCents(deviceId);
  const derived =
    brandNewMarket != null
      ? deriveConditionPricesFromBrandNew(brandNewMarket)
      : null;

  const order = new Map<string, number>(
    CONDITION_DISPLAY_ORDER.map((slug, index) => [slug, index]),
  );

  const prices = conditionRows
    .map((cond) => {
      const db = dbBySlug.get(cond.slug);
      const priceCents =
        derived?.[cond.slug] ?? db?.priceCents ?? null;
      if (priceCents == null || priceCents <= 0) return null;
      return {
        id: db?.id ?? 0,
        conditionSlug: cond.slug,
        priceCents,
        conditionLabel: cond.label,
        conditionDescription: cond.description,
        sortOrder: cond.sortOrder ?? order.get(cond.slug) ?? 99,
        priceSource: derived?.[cond.slug] != null ? "market-brand-new" : "catalog",
      };
    })
    .filter(Boolean)
    .sort(
      (a, b) =>
        (order.get(a!.conditionSlug) ?? a!.sortOrder) -
        (order.get(b!.conditionSlug) ?? b!.sortOrder),
    ) as Array<{
      id: number;
      conditionSlug: string;
      priceCents: number;
      conditionLabel: string;
      conditionDescription: string;
      sortOrder: number;
      priceSource: string;
    }>;

  return { prices, brandNewMarketCents: brandNewMarket };
}

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

    const [device] = await db
      .select()
      .from(devices)
      .where(eq(devices.id, deviceId))
      .limit(1);

    if (!device) {
      return NextResponse.json({ error: "Device not found" }, { status: 404 });
    }

    const { prices, brandNewMarketCents } = await buildPriceList(deviceId);

    if (condition) {
      const row = prices.find((p) => p.conditionSlug === condition);
      if (!row) {
        return NextResponse.json(
          { error: "Price not found for this condition" },
          { status: 404 },
        );
      }
      return NextResponse.json({
        device,
        price: {
          id: row.id,
          deviceId,
          conditionSlug: row.conditionSlug,
          priceCents: row.priceCents,
          isActive: true,
        },
        condition: {
          slug: row.conditionSlug,
          label: row.conditionLabel,
          description: row.conditionDescription,
        },
        brandNewMarketCents,
      });
    }

    return NextResponse.json({
      device,
      prices,
      brandNewMarketCents,
    });
  } catch (e) {
    console.error("Route error:", e);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
