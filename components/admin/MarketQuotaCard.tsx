"use client";

import { useEffect, useState } from "react";

interface Quota {
  date: string;
  calls: number;
  limit: number;
  percent: number;
  paused: boolean;
}

interface HistoryRow {
  date: string;
  calls: number | null;
  paused: boolean | null;
}

interface Status {
  quota: Quota | null;
  history: HistoryRow[];
  stats: { devicesCovered: number; rows: number; lastFetchedAt: string | null } | null;
  ebayConfigured: boolean;
}

export function MarketQuotaCard() {
  const [data, setData] = useState<Status | null>(null);

  useEffect(() => {
    fetch("/api/admin/market-refresh")
      .then((r) => (r.ok ? r.json() : null))
      .then(setData)
      .catch(() => setData(null));
  }, []);

  const quota = data?.quota ?? null;
  const calls = quota?.calls ?? 0;
  const limit = quota?.limit ?? 5000;
  const percent = quota?.percent ?? 0;
  const paused = quota?.paused ?? false;

  const barColor = paused
    ? "bg-red-500"
    : percent >= 80
      ? "bg-amber-500"
      : "bg-emerald-500";

  const history = [...(data?.history ?? [])].reverse();
  const maxCalls = Math.max(1, ...history.map((h) => h.calls ?? 0));

  return (
    <div className="bg-white rounded-xl border border-border p-5">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
        <h2 className="text-sm font-semibold text-ink uppercase tracking-wider">
          eBay API Usage
        </h2>
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold ${
            paused
              ? "bg-red-100 text-red-700"
              : data?.ebayConfigured
                ? "bg-emerald-100 text-emerald-700"
                : "bg-zinc-100 text-zinc-500"
          }`}
        >
          {paused ? "Paused" : data?.ebayConfigured ? "Active" : "Keys not set"}
        </span>
      </div>

      <div className="flex items-end justify-between gap-4 mb-2">
        <p className="text-2xl font-bold text-ink">
          {calls.toLocaleString()}
          <span className="text-sm font-medium text-ink-muted">
            {" "}
            / {limit.toLocaleString()} calls today
          </span>
        </p>
        <p className="text-sm font-semibold text-ink-muted">{percent}%</p>
      </div>

      <div
        className="h-2.5 w-full rounded-full bg-cream overflow-hidden"
        role="progressbar"
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className={`h-full rounded-full transition-all ${barColor}`}
          style={{ width: `${Math.min(100, percent)}%` }}
        />
      </div>
      <p className="mt-2 text-xs text-ink-muted">
        Free tier resets daily at midnight Pacific. Market prices keep showing from the
        last successful refresh.
      </p>

      {data?.stats && (
        <p className="mt-1 text-xs text-ink-muted">
          Market data: {data.stats.devicesCovered.toLocaleString()} devices ·{" "}
          {data.stats.rows.toLocaleString()} rows
          {data.stats.lastFetchedAt &&
            ` · updated ${new Date(data.stats.lastFetchedAt).toLocaleString()}`}
        </p>
      )}

      {history.length > 0 && (
        <div className="mt-5">
          <p className="text-xs font-medium text-ink-muted uppercase tracking-wider mb-2">
            Last {history.length} days
          </p>
          <div className="flex items-end gap-2 h-20">
            {history.map((h) => {
              const dayCalls = h.calls ?? 0;
              const height = Math.max(4, Math.round((dayCalls / maxCalls) * 100));
              return (
                <div
                  key={h.date}
                  className="flex-1 flex flex-col items-center gap-1 min-w-0"
                  title={`${h.date}: ${dayCalls.toLocaleString()} calls${h.paused ? " (paused)" : ""}`}
                >
                  <div
                    className={`w-full rounded-t ${h.paused ? "bg-red-300" : "bg-primary/60"}`}
                    style={{ height: `${height}%` }}
                  />
                  <span className="text-[10px] text-ink-muted truncate w-full text-center">
                    {h.date.slice(5)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
