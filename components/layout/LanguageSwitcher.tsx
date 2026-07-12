"use client";

import { useEffect, useState } from "react";

interface LanguageSwitcherProps {
  locale: "en" | "en-GB";
  onToggle: (locale: "en" | "en-GB") => void;
}

export function LanguageSwitcher({ locale, onToggle }: LanguageSwitcherProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  if (!mounted) {
    return (
      <div className="inline-flex items-center rounded-md bg-white/10 p-0.5 text-xs font-medium">
        <button className="px-2.5 py-1 rounded transition-all bg-white/20 text-white">US</button>
        <button className="px-2.5 py-1 rounded transition-all text-white/50 hover:text-white">UK</button>
      </div>
    );
  }

  return (
    <div className="inline-flex items-center rounded-md bg-white/10 p-0.5 text-xs font-medium">
      <button
        onClick={() => onToggle("en")}
        className={`px-2.5 py-1 rounded transition-all ${
          locale === "en"
            ? "bg-white/20 text-white"
            : "text-white/50 hover:text-white"
        }`}
      >
        US
      </button>
      <button
        onClick={() => onToggle("en-GB")}
        className={`px-2.5 py-1 rounded transition-all ${
          locale === "en-GB"
            ? "bg-white/20 text-white"
            : "text-white/50 hover:text-white"
        }`}
      >
        UK
      </button>
    </div>
  );
}
