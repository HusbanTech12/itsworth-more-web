import {
  EbayQuotaPausedError,
  assertQuotaAvailable,
  recordApiCall,
  reportQuotaExceeded,
} from "./quota";

const EBAY_ENV = process.env.EBAY_ENV ?? "production";
const API_HOST =
  EBAY_ENV === "sandbox" ? "https://api.sandbox.ebay.com" : "https://api.ebay.com";

export const MARKET_SOURCE = "ebay";

// Site condition slugs -> eBay Browse API condition enum values
export const CONDITION_TO_EBAY: Record<string, string> = {
  "brand-new": "NEW",
  flawless: "LIKE_NEW",
  "very-good": "VERY_GOOD",
  good: "GOOD",
  fair: "ACCEPTABLE",
  broken: "FOR_PARTS_OR_NOT_WORKING",
};

export interface MarketStats {
  medianCents: number;
  avgCents: number;
  minCents: number;
  maxCents: number;
  sampleSize: number;
  currency: string;
}

interface EbayItemSummary {
  title?: string;
  price?: { value?: string; currency?: string };
  condition?: string;
}

let cachedToken: { token: string; expiresAt: number } | null = null;

async function getAccessToken(): Promise<string> {
  if (cachedToken && cachedToken.expiresAt > Date.now() + 60_000) {
    return cachedToken.token;
  }
  const clientId = process.env.EBAY_CLIENT_ID;
  const clientSecret = process.env.EBAY_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    throw new Error("EBAY_CLIENT_ID / EBAY_CLIENT_SECRET are not set");
  }

  const res = await fetch(`${API_HOST}/identity/v1/oauth2/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
    },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      scope: "https://api.ebay.com/oauth/api_scope",
    }),
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(`eBay OAuth failed (${res.status}): ${await res.text()}`);
  }
  const data = (await res.json()) as { access_token: string; expires_in: number };
  cachedToken = {
    token: data.access_token,
    expiresAt: Date.now() + data.expires_in * 1000,
  };
  return data.access_token;
}

function percentile(sorted: number[], p: number): number {
  const idx = (sorted.length - 1) * p;
  const lo = Math.floor(idx);
  const hi = Math.ceil(idx);
  return sorted[lo] + (sorted[hi] - sorted[lo]) * (idx - lo);
}

// Drop statistical outliers (accessories, parts, lots) via the IQR fence
function trimOutliers(values: number[]): number[] {
  if (values.length < 8) return values;
  const sorted = [...values].sort((a, b) => a - b);
  const q1 = percentile(sorted, 0.25);
  const q3 = percentile(sorted, 0.75);
  const iqr = q3 - q1;
  const lo = q1 - 1.5 * iqr;
  const hi = q3 + 1.5 * iqr;
  const kept = sorted.filter((v) => v >= lo && v <= hi);
  return kept.length >= 5 ? kept : sorted;
}

function summarize(valuesUsd: number[]): MarketStats | null {
  const trimmed = trimOutliers(valuesUsd.filter((v) => Number.isFinite(v) && v > 0));
  if (trimmed.length === 0) return null;
  const cents = trimmed.map((v) => Math.round(v * 100)).sort((a, b) => a - b);
  const sum = cents.reduce((s, v) => s + v, 0);
  return {
    medianCents: Math.round(percentile(cents, 0.5)),
    avgCents: Math.round(sum / cents.length),
    minCents: cents[0],
    maxCents: cents[cents.length - 1],
    sampleSize: cents.length,
    currency: "USD",
  };
}

/**
 * Median/avg asking price of active fixed-price eBay listings for a query,
 * optionally restricted to one eBay condition (e.g. "VERY_GOOD").
 * Returns null when there are too few matching listings to be meaningful.
 */
export async function fetchMarketPrice(
  query: string,
  ebayCondition?: string,
): Promise<MarketStats | null> {
  await assertQuotaAvailable();
  const token = await getAccessToken();
  const url = new URL(`${API_HOST}/buy/browse/v1/item_summary/search`);
  url.searchParams.set("q", query);
  url.searchParams.set("limit", "50");
  const filters = ["buyingOptions:{FIXED_PRICE}"];
  if (ebayCondition) filters.push(`conditions:{${ebayCondition}}`);
  url.searchParams.set("filter", filters.join(","));

  let res: Response;
  try {
    res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        "X-EBAY-C-MARKETPLACE-ID": "EBAY_US",
      },
      cache: "no-store",
    });
  } finally {
    await recordApiCall().catch(() => {});
  }
  if (res.status === 429) {
    await reportQuotaExceeded("eBay returned 429 (daily rate limit reached)");
    throw new EbayQuotaPausedError("eBay returned 429 — quota exhausted, paused until reset");
  }
  if (!res.ok) {
    throw new Error(`eBay search failed (${res.status}): ${await res.text()}`);
  }
  const data = (await res.json()) as { itemSummaries?: EbayItemSummary[] };

  const prices = (data.itemSummaries ?? [])
    .filter((it) => (it.price?.currency ?? "USD") === "USD")
    .map((it) => parseFloat(it.price?.value ?? ""))
    .filter((v) => Number.isFinite(v) && v > 0);

  return summarize(prices);
}

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
