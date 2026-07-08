import { Card } from "@/components/ui/Card";
import { formatPrice } from "@/lib/utils";

interface BoxSummaryProps {
  subtotalCents: number;
  discountCents: number;
  totalCents: number;
  itemCount: number;
}

export function BoxSummary({
  subtotalCents,
  discountCents,
  totalCents,
  itemCount,
}: BoxSummaryProps) {
  return (
    <Card padding="md" className="space-y-3">
      <h3 className="text-sm font-semibold text-zinc-900">Order Summary</h3>

      <div className="space-y-2 text-sm">
        <div className="flex justify-between text-zinc-600">
          <span>Subtotal ({itemCount} item{itemCount !== 1 ? "s" : ""})</span>
          <span>{formatPrice(subtotalCents)}</span>
        </div>

        {discountCents > 0 && (
          <div className="flex justify-between text-emerald-600">
            <span>Discount</span>
            <span>-{formatPrice(discountCents)}</span>
          </div>
        )}

        <div className="border-t border-zinc-200 pt-2 flex justify-between font-semibold text-zinc-900">
          <span>Estimated Total</span>
          <span>{formatPrice(totalCents)}</span>
        </div>
      </div>

      <p className="text-xs text-zinc-400 pt-1">
        Final offer will be confirmed after device inspection.
      </p>
    </Card>
  );
}
