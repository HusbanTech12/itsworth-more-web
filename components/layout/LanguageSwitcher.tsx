"use client";

interface LanguageSwitcherProps {
  locale: "en" | "en-GB";
  onToggle: (locale: "en" | "en-GB") => void;
}

export function LanguageSwitcher({ locale, onToggle }: LanguageSwitcherProps) {
  return (
    <div className="inline-flex items-center rounded-lg bg-zinc-100 p-0.5 text-xs font-medium">
      <button
        onClick={() => onToggle("en")}
        className={`px-2.5 py-1 rounded-md transition-all ${
          locale === "en"
            ? "bg-white text-zinc-900 shadow-sm"
            : "text-zinc-500 hover:text-zinc-700"
        }`}
      >
        US
      </button>
      <button
        onClick={() => onToggle("en-GB")}
        className={`px-2.5 py-1 rounded-md transition-all ${
          locale === "en-GB"
            ? "bg-white text-zinc-900 shadow-sm"
            : "text-zinc-500 hover:text-zinc-700"
        }`}
      >
        UK
      </button>
    </div>
  );
}
