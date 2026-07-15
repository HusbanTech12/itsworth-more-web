"use client";

import { useState, useEffect, type ReactNode } from "react";

interface PreloaderProps {
  minDisplayMs?: number;
  children: ReactNode;
}

export function Preloader({ minDisplayMs = 2000, children }: PreloaderProps) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setReady(true), minDisplayMs);
    return () => clearTimeout(timer);
  }, [minDisplayMs]);

  if (!ready) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-cream">
        <div className="relative flex flex-col items-center gap-5">
          {/* Logo mark */}
          <div className="relative flex h-14 w-14 items-center justify-center">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-orange to-orange/60 opacity-20 animate-pulse" style={{ animationDuration: "2s" }} />
            <span className="text-2xl font-black text-orange" style={{ fontFamily: "var(--font-heading)" }}>C</span>
          </div>

          {/* Company name */}
          <div className="text-center">
            <p className="text-xl font-bold text-ink" style={{ fontFamily: "var(--font-heading)" }}>
              CashingTech
            </p>
            <p className="text-sm text-zinc-500 mt-0.5 italic">
              Sell smarter
            </p>
          </div>

          {/* Simple dot loader */}
          <div className="flex gap-1.5 mt-2">
            <span className="h-2 w-2 rounded-full bg-orange/60 animate-bounce" />
            <span className="h-2 w-2 rounded-full bg-orange/40 animate-bounce [animation-delay:0.15s]" />
            <span className="h-2 w-2 rounded-full bg-orange/30 animate-bounce [animation-delay:0.3s]" />
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
