import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/db";
import { devices, marketApiUsage, marketPrices } from "@/db/schema";
import { desc, eq, sql } from "drizzle-orm";
import {
  CONDITION_TO_EBAY,
  MARKET_SOURCE,
  fetchMarketPrice,
  sleep,
} from "@/lib/market/ebay";
import {
  EbayQuotaPausedError,
  getQuotaState,
} from "@/lib/market/quota";

export const maxDuration = 60;

async function authorize(req: NextRequest): Promise<boolean> {
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret) {
    const header = req.headers.get("authorization");
    if (header === `Bearer ${cronSecret}`) return true;
  }
  try {
    await requireAdmin();
    return true;
  } catch {
    return false;
  }
}

export async function GET(req: NextRequest) {
  if (!(await authorize(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const [stats] = await db
    .select({
      rows: sql<number>`count(*)::int`,
      devicesCovered: sql<number>`count(distinct ${marketPrices.deviceId})::int`,
      lastFetchedAt: sql<string>`max(${marketPrices.fetchedAt})`,
    })
    .from(marketPrices);
  const quota = await getQuotaState().catch(() => null);
  const history = await db
    .select({
      date: marketApiUsage.date,
      calls: marketApiUsage.calls,
      paused: marketApiUsage.paused,
    })
    .from(marketApiUsage)
    .orderBy(desc(marketApiUsage.date))
    .limit(7)
    .catch(() => []);
  return NextResponse.json({ stats, quota, history, ebayConfigured: isEbayConfigured() });
}

function isEbayConfigured() {
  return Boolean(process.env.EBAY_CLIENT_ID && process.env.EBAY_CLIENT_SECRET);
}

/**
 * POST /api/admin/market-refresh
 * Query params:
 *   mode=all|conditions  (default "all" = 1 eBay call per device, condition-agnostic used market;
 *                         "conditions" = 1 call per device per condition tier)
 *   limit=50             devices per run (eBay free tier ≈ 5,000 calls/day)
 *   offset=0
 *   deviceId=123         refresh a single device
 */
export async function POST(req: NextRequest) {
  if (!(await authorize(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!isEbayConfigured()) {
    return NextResponse.json(
      { error: "EBAY_CLIENT_ID / EBAY_CLIENT_SECRET are not configured" },
      { status: 503 },
    );
  }

  const sp = req.nextUrl.searchParams;
  const mode = sp.get("mode") === "conditions" ? "conditions" : "all";
  const limit = Math.min(Number(sp.get("limit")) || 50, 200);
  const offset = Number(sp.get("offset")) || 0;
  const deviceId = Number(sp.get("deviceId")) || null;

  const batch = await db
    .select({ id: devices.id, name: devices.name })
    .from(devices)
    .where(deviceId ? eq(devices.id, deviceId) : eq(devices.isActive, true))
    .orderBy(devices.id)
    .limit(deviceId ? 1 : limit)
    .offset(deviceId ? 0 : offset);

  const conditionTiers: Array<[string, string | undefined]> =
    mode === "conditions"
      ? Object.entries(CONDITION_TO_EBAY)
      : [["all", undefined]];

  let updated = 0;
  let quotaPaused = false;
  const failed: Array<{ deviceId: number; error: string }> = [];
  const skipped: number[] = [];

  outer: for (const device of batch) {
    for (const [conditionSlug, ebayCondition] of conditionTiers) {
      try {
        const stats = await fetchMarketPrice(device.name, ebayCondition);
        if (!stats || stats.sampleSize < 3) {
          skipped.push(device.id);
          continue;
        }
        await db
          .insert(marketPrices)
          .values({
            deviceId: device.id,
            conditionSlug,
            source: MARKET_SOURCE,
            ...stats,
            fetchedAt: new Date(),
          })
          .onConflictDoUpdate({
            target: [
              marketPrices.deviceId,
              marketPrices.conditionSlug,
              marketPrices.source,
            ],
            set: { ...stats, fetchedAt: new Date() },
          });
        updated++;
      } catch (e) {
        if (e instanceof EbayQuotaPausedError) {
          quotaPaused = true;
          break outer;
        }
        failed.push({
          deviceId: device.id,
          error: e instanceof Error ? e.message : "unknown",
        });
      }
      await sleep(150); // stay well under eBay rate limits
    }
  }

  const [total] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(devices)
    .where(eq(devices.isActive, true));

  const quota = await getQuotaState().catch(() => null);

  return NextResponse.json({
    mode,
    processed: batch.length,
    updated,
    skipped: skipped.length,
    failed,
    quotaPaused,
    quota,
    nextOffset:
      !quotaPaused && offset + batch.length < total.count
        ? offset + batch.length
        : null,
    totalDevices: total.count,
  });
}
