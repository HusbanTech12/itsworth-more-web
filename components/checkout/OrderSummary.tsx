import { Card } from "@/components/ui/Card";
import { formatPrice } from "@/lib/utils";
import type { BoxItem } from "@/context/BoxContext";

interface OrderSummaryProps {
  items: BoxItem[];
  subtotalCents: number;
  discountCents: number;
  totalCents: number;
  shippingMethod: "standard" | "expedited";
  carrier: string;
}

export function OrderSummary({
  items,
  subtotalCents,
  discountCents,
  totalCents,
  shippingMethod,
  carrier,
}: OrderSummaryProps) {
  return (
    <Card padding="md" className="space-y-4">
      <h2 className="text-lg font-semibold text-ink">Order Summary</h2>

      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className="flex items-center justify-between text-sm">
            <div className="flex-1 min-w-0">
              <p className="font-medium text-ink truncate">{item.deviceName}</p>
              <p className="text-xs text-ink-muted">{item.conditionLabel}</p>
            </div>
            <span className="ml-4 font-medium text-ink">
              {formatPrice(item.priceCents)}
            </span>
          </div>
        ))}
      </div>

      <div className="border-t border-border pt-3 space-y-1.5 text-sm">
        <div className="flex justify-between text-ink-muted">
          <span>Subtotal</span>
          <span>{formatPrice(subtotalCents)}</span>
        </div>

        <div className="flex justify-between text-ink-muted">
          <span>Shipping</span>
          <span className="text-emerald-600 font-medium">
            {shippingMethod === "standard" ? "FREE" : "Expedited"}
          </span>
        </div>

        <div className="flex justify-between text-ink-muted">
          <span>Carrier</span>
          <span className="capitalize">{carrier}</span>
        </div>

        {discountCents > 0 && (
          <div className="flex justify-between text-emerald-600">
            <span>Discount</span>
            <span>-{formatPrice(discountCents)}</span>
          </div>
        )}
      </div>

      <div className="border-t border-border pt-3 flex justify-between font-semibold text-lg text-ink">
        <span>Total</span>
        <span>{formatPrice(totalCents)}</span>
      </div>
    </Card>
  );
}
