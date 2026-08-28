import { formatPrice } from "@/lib/utils";

interface Condition {
  slug: string;
  label: string;
  description: string;
  priceCents: number;
}

interface ConditionSelectorProps {
  conditions: Condition[];
  selected: string;
  onSelect: (slug: string) => void;
}

const conditionColors: Record<string, string> = {
  "brand-new": "bg-emerald-500",
  flawless: "bg-blue-500",
  good: "bg-orange",
  fair: "bg-amber-500",
  broken: "bg-red-500",
};

export function ConditionSelector({
  conditions,
  selected,
  onSelect,
}: ConditionSelectorProps) {
  return (
    <div className="space-y-3" role="radiogroup" aria-label="Device condition">
      {conditions.map((c) => {
        const isSelected = selected === c.slug;
        return (
          <button
            key={c.slug}
            type="button"
            role="radio"
            aria-checked={isSelected}
            onClick={() => onSelect(c.slug)}
            className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all ${
              isSelected
                ? "border-orange bg-orange/5 shadow-sm"
                : "border-border hover:border-ink/20 bg-white"
            }`}
          >
            <div
              className={`w-4 h-4 rounded-full flex-shrink-0 border-2 ${
                isSelected ? "border-orange" : "border-border"
              }`}
            >
              {isSelected && (
                <div
                  className={`w-2 h-2 rounded-full m-0.5 ${conditionColors[c.slug] || "bg-orange"}`}
                />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-ink">{c.label}</p>
              <p className="text-xs text-ink-muted line-clamp-2">{c.description}</p>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="text-sm font-bold text-ink">{formatPrice(c.priceCents)}</p>
            </div>
          </button>
        );
      })}
    </div>
  );
}
