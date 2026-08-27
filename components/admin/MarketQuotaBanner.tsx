"use client";

import { useEffect, useState } from "react";

interface Quota {
  calls: number;
  limit: number;
  percent: number;
  paused: boolean;
}

export function MarketQuotaBanner() {
  const [quota, setQuota] = useState<Quota | null>(null);

  useEffect(() => {
    fetch("/api/admin/market-refresh")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => setQuota(data?.quota ?? null))
      .catch(() => setQuota(null));
  }, []);

  if (!quota) return null;

  const { calls, limit, percent, paused } = quota;
  const level = paused || percent >= 100 ? "red" : percent >= 80 ? "amber" : null;
  if (!level) return null;

  const styles =
    level === "red"
      ? "border-red-200 bg-red-50 text-red-800"
      : "border-amber-200 bg-amber-50 text-amber-800";

  return (
    <div
      className={`mb-6 flex flex-wrap items-center gap-x-3 gap-y-1 rounded-lg border px-4 py-3 text-sm font-medium ${styles}`}
      role="alert"
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        className="shrink-0"
      >
        <path d="M12 9v4m0 4h.01M10.3 3.9L1.8 18a2 2 0 001.7 3h17a2 2 0 001.7-3L13.7 3.9a2 2 0 00-3.4 0z" />
      </svg>
      {level === "red" ? (
        <span>
          eBay API quota exhausted ({calls.toLocaleString()}/{limit.toLocaleString()} calls
          today) — market price refresh is paused until midnight Pacific. Stored prices
          still show on the site.
        </span>
      ) : (
        <span>
          eBay API quota at {percent}% ({calls.toLocaleString()}/{limit.toLocaleString()}{" "}
          calls today)
        </span>
      )}
    </div>
  );
}
