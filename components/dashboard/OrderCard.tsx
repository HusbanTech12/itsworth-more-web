import { Badge } from "@/components/ui/Badge";
import { formatPrice } from "@/lib/utils";

interface OrderItem {
  deviceName: string;
  conditionLabel: string | null;
  conditionSlug: string | null;
  offeredPriceCents: number;
  finalPriceCents: number | null;
  imei?: string | null;
}

interface Order {
  offerNumber: string;
  status: string;
  subtotalCents: number | null;
  couponDiscountCents: number | null;
  totalCents: number | null;
  paymentMethod: string | null;
  shippingMethod: string | null;
  carrier: string | null;
  trackingNumber: string | null;
  submittedAt: Date | null;
  items: OrderItem[];
}

const statusVariant: Record<string, "success" | "warning" | "error" | "info" | "neutral"> = {
  quote_accepted: "info",
  device_shipped: "warning",
  device_received: "info",
  inspecting: "warning",
  payment_sent: "success",
  completed: "success",
  cancelled: "error",
  quote_pending: "neutral",
  offer_revised: "warning",
  offer_accepted: "success",
  offer_declined: "error",
  return_shipped: "info",
};

const statusLabels: Record<string, string> = {
  quote_pending: "Quote Pending",
  quote_accepted: "Quote Accepted",
  device_shipped: "Device Shipped",
  device_received: "Device Received",
  inspecting: "Inspecting",
  offer_revised: "Offer Revised",
  offer_accepted: "Offer Accepted",
  offer_declined: "Offer Declined",
  payment_sent: "Payment Sent",
  completed: "Completed",
  cancelled: "Cancelled",
  return_shipped: "Return Shipped",
};

interface OrderCardProps {
  order: Order;
}

export function OrderCard({ order }: OrderCardProps) {
  return (
    <a
      href={`/dashboard/orders/${order.offerNumber}`}
      className="block rounded-xl border border-zinc-200 bg-white p-5 shadow-sm transition-all hover:shadow-md hover:border-zinc-300"
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="text-sm font-semibold text-zinc-900">{order.offerNumber}</p>
          <p className="text-xs text-zinc-500">
            {order.submittedAt ? new Date(order.submittedAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            }) : "—"}
          </p>
        </div>
        <Badge variant={statusVariant[order.status] || "neutral"}>
          {statusLabels[order.status] || order.status}
        </Badge>
      </div>

      <div className="space-y-2">
        {order.items.map((item, i) => (
          <div key={i} className="flex items-center justify-between text-sm">
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium text-zinc-900">{item.deviceName}</p>
              <p className="text-xs text-zinc-500">{item.conditionLabel ?? ""}</p>
            </div>
            <span className="ml-3 font-medium text-zinc-900">
              {formatPrice(item.finalPriceCents ?? item.offeredPriceCents)}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-3 pt-3 border-t border-zinc-100 flex justify-between text-sm">
        <span className="text-zinc-500">Total</span>
        <span className="font-semibold text-zinc-900">{formatPrice(order.totalCents ?? 0)}</span>
      </div>
    </a>
  );
}
