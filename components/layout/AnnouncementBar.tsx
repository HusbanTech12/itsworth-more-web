"use client";

import { useState } from "react";

export function AnnouncementBar() {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div className="relative bg-gradient-to-r from-primary to-primary-dark text-white text-center text-sm py-2.5 px-4">
      <p className="font-medium">
        Extra 5% Bonus on Trade-Ins. Up to $25 Per Item, Max of $100!{" "}
        <a
          href="/coupon/468XOR38"
          className="underline underline-offset-2 font-semibold hover:opacity-90 transition-opacity"
        >
          CLICK TO APPLY
        </a>
      </p>
      <button
        onClick={() => setVisible(false)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-colors"
        aria-label="Dismiss"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M4 4l8 8M12 4l-8 8" />
        </svg>
      </button>
    </div>
  );
}
