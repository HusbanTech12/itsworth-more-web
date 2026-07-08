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
  "flawless": "bg-blue-500",
  "good": "bg-primary",
  "fair": "bg-amber-500",
  "broken": "bg-red-500",
};

export function ConditionSelector({
  conditions,
  selected,
  onSelect,
}: ConditionSelectorProps) {
  return (
    <div className="space-y-3">
      {conditions.map((c) => {
        const isSelected = selected === c.slug;
        return (
          <button
            key={c.slug}
            onClick={() => onSelect(c.slug)}
            className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all ${
              isSelected
                ? "border-primary bg-primary/5 shadow-sm"
                : "border-zinc-200 hover:border-zinc-300 bg-white"
            }`}
          >
            <div
              className={`w-4 h-4 rounded-full flex-shrink-0 border-2 ${
                isSelected
                  ? "border-primary"
                  : "border-zinc-300"
              }`}
            >
              {isSelected && (
                <div className={`w-2 h-2 rounded-full m-0.5 ${conditionColors[c.slug] || "bg-primary"}`} />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-zinc-900">{c.label}</p>
              <p className="text-xs text-zinc-500 truncate">{c.description}</p>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="text-sm font-bold text-zinc-900">
                {formatPrice(c.priceCents)}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
}
