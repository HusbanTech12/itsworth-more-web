import { db } from "@/db";
import { devicePrices, marketPrices } from "@/db/schema";
import { and, eq, inArray } from "drizzle-orm";

const MARKET_SOURCE = "ebay";
const BRAND_NEW = "brand-new";

/** Brand-new sell price: eBay median first, then catalog brand-new price. */
export async function getBrandNewPricesForDevices(
  deviceIds: number[],
): Promise<Map<number, number>> {
  if (deviceIds.length === 0) return new Map();

  const [marketRows, catalogRows] = await Promise.all([
    db
      .select({
        deviceId: marketPrices.deviceId,
        medianCents: marketPrices.medianCents,
      })
      .from(marketPrices)
      .where(
        and(
          inArray(marketPrices.deviceId, deviceIds),
          eq(marketPrices.conditionSlug, BRAND_NEW),
          eq(marketPrices.source, MARKET_SOURCE),
        ),
      ),
    db
      .select({
        deviceId: devicePrices.deviceId,
        priceCents: devicePrices.priceCents,
      })
      .from(devicePrices)
      .where(
        and(
          inArray(devicePrices.deviceId, deviceIds),
          eq(devicePrices.conditionSlug, BRAND_NEW),
          eq(devicePrices.isActive, true),
        ),
      ),
  ]);

  const marketByDevice = new Map(
    marketRows
      .filter((r) => r.medianCents != null && r.medianCents > 0)
      .map((r) => [r.deviceId, r.medianCents!]),
  );
  const catalogByDevice = new Map(
    catalogRows
      .filter((r) => r.priceCents > 0)
      .map((r) => [r.deviceId, r.priceCents]),
  );

  const result = new Map<number, number>();
  for (const id of deviceIds) {
    const price = marketByDevice.get(id) ?? catalogByDevice.get(id);
    if (price != null) result.set(id, price);
  }
  return result;
}
