"use client";

interface LanguageSwitcherProps {
  locale: "en" | "en-GB";
  onToggle: (locale: "en" | "en-GB") => void;
}

export function LanguageSwitcher({ locale, onToggle }: LanguageSwitcherProps) {
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
