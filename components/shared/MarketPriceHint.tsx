"use client";

import { useEffect, useState } from "react";
import { formatPrice } from "@/lib/utils";

interface MarketRow {
  conditionSlug: string;
  medianCents: number | null;
  sampleSize: number | null;
  fetchedAt: string | null;
}

interface MarketPriceHintProps {
  deviceId?: number;
  deviceSlug?: string;
  conditionSlug?: string;
  offerCents?: number;
  variant?: "card" | "inline";
  className?: string;
}

export function MarketPriceHint({
  deviceId,
  deviceSlug,
  conditionSlug,
  offerCents,
  variant = "card",
  className = "",
}: MarketPriceHintProps) {
  const [rows, setRows] = useState<MarketRow[] | null>(null);
  const key = deviceId ?? deviceSlug;

  useEffect(() => {
    if (!key) return;
    let cancelled = false;
    fetch(`/api/market-price/${key}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (!cancelled) setRows(data?.market ?? []);
      })
      .catch(() => {
        if (!cancelled) setRows([]);
      });
    return () => {
      cancelled = true;
    };
  }, [key]);

  if (!rows || rows.length === 0) return null;

  const row =
    (conditionSlug && rows.find((r) => r.conditionSlug === conditionSlug)) ||
    rows.find((r) => r.conditionSlug === "all") ||
    rows[0];

  if (!row?.medianCents) return null;

  const beatsMarket = offerCents !== undefined && offerCents >= row.medianCents;

  if (variant === "inline") {
    return (
      <p
        className={`text-[11px] text-zinc-400 ${className}`}
        title="Median asking price of live eBay listings for this device"
      >
        eBay market value{" "}
        <span className="font-semibold text-zinc-600">
          {formatPrice(row.medianCents)}
        </span>
        {beatsMarket && (
          <span className="ml-1.5 inline-flex items-center rounded-full bg-emerald-50 px-1.5 py-px text-[10px] font-semibold text-emerald-700">
            at/above market
          </span>
        )}
      </p>
    );
  }

  return (
    <div
      className={`flex items-center justify-between gap-3 rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 ${className}`}
    >
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
          eBay market value
        </p>
        <p className="mt-0.5 text-[11px] text-zinc-400">
          Median of {row.sampleSize ?? "—"} live listings
        </p>
      </div>
      <div className="text-right shrink-0">
        <p className="text-lg font-bold text-zinc-900">
          {formatPrice(row.medianCents)}
        </p>
        {beatsMarket && (
          <span className="inline-flex items-center rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
            Your offer is at/above market
          </span>
        )}
      </div>
    </div>
  );
}
