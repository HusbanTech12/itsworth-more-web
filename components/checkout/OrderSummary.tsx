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
      <h2 className="text-lg font-semibold text-zinc-900">Order Summary</h2>

      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className="flex items-center justify-between text-sm">
            <div className="flex-1 min-w-0">
              <p className="font-medium text-zinc-900 truncate">
                {item.deviceName}
              </p>
              <p className="text-xs text-zinc-500">{item.conditionLabel}</p>
            </div>
            <span className="ml-4 font-medium text-zinc-900">
              {formatPrice(item.priceCents)}
            </span>
          </div>
        ))}
      </div>

      <div className="border-t border-zinc-200 pt-3 space-y-1.5 text-sm">
        <div className="flex justify-between text-zinc-600">
          <span>Subtotal</span>
          <span>{formatPrice(subtotalCents)}</span>
        </div>

        <div className="flex justify-between text-zinc-600">
          <span>Shipping</span>
          <span className="text-emerald-600 font-medium">
            {shippingMethod === "standard" ? "FREE" : "Expedited"}
          </span>
        </div>

        <div className="flex justify-between text-zinc-600">
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

      <div className="border-t border-zinc-200 pt-3 flex justify-between font-semibold text-lg text-zinc-900">
        <span>Total</span>
        <span>{formatPrice(totalCents)}</span>
      </div>
    </Card>
  );
}
