import { Card } from "@/components/ui/Card";
import { formatPrice } from "@/lib/utils";
import type { BoxItem } from "@/context/BoxContext";

interface BoxItemProps {
  item: BoxItem;
  onRemove: (id: string) => void;
}

export function BoxItemCard({ item, onRemove }: BoxItemProps) {
  return (
    <Card padding="md" className="flex items-center gap-4">
      <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-zinc-100 to-zinc-50 flex items-center justify-center flex-shrink-0">
        <svg className="w-8 h-8 text-zinc-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
          <path d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
        </svg>
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-zinc-900 truncate">
          {item.deviceName}
        </p>
        <p className="text-xs text-zinc-500 mt-0.5">{item.conditionLabel}</p>
        <p className="text-sm font-semibold text-zinc-900 mt-1">
          {formatPrice(item.priceCents)}
        </p>
      </div>

      <button
        onClick={() => onRemove(item.id)}
        className="p-2 rounded-lg text-zinc-400 hover:text-red-600 hover:bg-red-50 transition-colors"
        aria-label="Remove item"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M2 4h12M5 4V2.5a.5.5 0 01.5-.5h5a.5.5 0 01.5.5V4m-7 0v9.5a.5.5 0 00.5.5h5a.5.5 0 00.5-.5V4" />
        </svg>
      </button>
    </Card>
  );
}
