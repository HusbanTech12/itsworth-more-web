import { db } from "@/db";
import { marketApiUsage } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { sendEbayQuotaAlert } from "@/lib/email";

export const EBAY_DAILY_LIMIT = 5000;

export class EbayQuotaPausedError extends Error {
  constructor(message = "eBay API quota paused for today") {
    super(message);
    this.name = "EbayQuotaPausedError";
  }
}

export interface QuotaState {
  date: string;
  calls: number;
  limit: number;
  percent: number;
  paused: boolean;
}

// eBay resets daily API quotas at midnight US Pacific time
export function quotaDateKey(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Los_Angeles",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

export async function getQuotaState(): Promise<QuotaState> {
  const date = quotaDateKey();
  const [row] = await db
    .select()
    .from(marketApiUsage)
    .where(eq(marketApiUsage.date, date))
    .limit(1);
  const calls = row?.calls ?? 0;
  return {
    date,
    calls,
    limit: EBAY_DAILY_LIMIT,
    percent: Math.round((calls / EBAY_DAILY_LIMIT) * 100),
    paused: row?.paused ?? false,
  };
}

async function pauseQuota(reason: string) {
  const date = quotaDateKey();
  await db
    .insert(marketApiUsage)
    .values({ date, calls: 0, paused: true, pausedAt: new Date() })
    .onConflictDoUpdate({
      target: marketApiUsage.date,
      set: { paused: true, pausedAt: new Date() },
    });
  const state = await getQuotaState();
  await maybeAlert(state, "exhausted", reason);
}

async function maybeAlert(state: QuotaState, level: "warning" | "exhausted", reason?: string) {
  const [row] = await db
    .select()
    .from(marketApiUsage)
    .where(eq(marketApiUsage.date, state.date))
    .limit(1);
  if (!row) return;

  if (level === "warning" && !row.alert80SentAt) {
    await db
      .update(marketApiUsage)
      .set({ alert80SentAt: new Date() })
      .where(eq(marketApiUsage.date, state.date));
    await sendEbayQuotaAlert({ calls: state.calls, limit: state.limit, level, reason }).catch(
      () => {},
    );
  }
  if (level === "exhausted" && !row.alert100SentAt) {
    await db
      .update(marketApiUsage)
      .set({ alert100SentAt: new Date() })
      .where(eq(marketApiUsage.date, state.date));
    await sendEbayQuotaAlert({ calls: state.calls, limit: state.limit, level, reason }).catch(
      () => {},
    );
  }
}

export async function assertQuotaAvailable() {
  const state = await getQuotaState();
  if (state.paused || state.calls >= EBAY_DAILY_LIMIT) {
    throw new EbayQuotaPausedError(
      `eBay quota paused (${state.calls}/${EBAY_DAILY_LIMIT} calls today)`,
    );
  }
}

export async function recordApiCall() {
  const date = quotaDateKey();
  const [row] = await db
    .insert(marketApiUsage)
    .values({ date, calls: 1 })
    .onConflictDoUpdate({
      target: marketApiUsage.date,
      set: { calls: sql`${marketApiUsage.calls} + 1` },
    })
    .returning({ calls: marketApiUsage.calls });

  const calls = row?.calls ?? 1;
  if (calls >= EBAY_DAILY_LIMIT) {
    await pauseQuota(`Daily limit reached (${calls}/${EBAY_DAILY_LIMIT})`);
  } else if (calls >= EBAY_DAILY_LIMIT * 0.8) {
    await maybeAlert(
      { date, calls, limit: EBAY_DAILY_LIMIT, percent: Math.round((calls / EBAY_DAILY_LIMIT) * 100), paused: false },
      "warning",
    );
  }
}

export async function reportQuotaExceeded(reason: string) {
  await pauseQuota(reason);
}
