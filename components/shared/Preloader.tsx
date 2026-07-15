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
        <div className="relative flex flex-col items-center gap-6">
          <div className="relative flex h-16 w-16 items-center justify-center">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-orange to-orange/60 opacity-20 animate-pulse" style={{ animationDuration: "3s" }} />
            <div className="absolute inset-0 rounded-2xl border-2 border-orange/30 animate-spin" style={{ animationDuration: "4s" }} />
            <span className="text-2xl font-black text-orange" style={{ fontFamily: "var(--font-heading)" }}>C</span>
          </div>

          <div className="h-1 w-48 overflow-hidden rounded-full bg-zinc-200">
            <div
              className="h-full w-full rounded-full bg-gradient-to-r from-orange to-orange/60"
              style={{ animation: "loading-sweep 2.5s ease-in-out infinite" }}
            />
          </div>

          <p className="text-xs font-medium tracking-widest uppercase text-zinc-400" style={{ animation: "pulse 2.5s ease-in-out infinite" }}>
            Loading...
          </p>
        </div>

        <style>{`
          @keyframes loading-sweep {
            0% { transform: translateX(-100%); }
            50% { transform: translateX(200%); }
            100% { transform: translateX(200%); }
          }
        `}</style>
      </div>
    );
  }

  return <>{children}</>;
}
