"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { OrderTimeline } from "./OrderTimeline";
import { formatPrice } from "@/lib/utils";

interface OrderItem {
  deviceName: string;
  conditionLabel: string | null;
  conditionSlug: string | null;
  offeredPriceCents: number;
  finalPriceCents: number | null;
  imei?: string | null;
  serialNumber?: string | null;
}

interface TimelineEvent {
  event: string;
  description: string | null;
  createdAt: Date | null;
}

interface Reinspection {
  reason: string | null;
  status: string | null;
  result: string | null;
  createdAt: Date | null;
}

interface Order {
  id: number;
  offerNumber: string;
  status: string;
  subtotalCents: number | null;
  couponDiscountCents: number | null;
  totalCents: number | null;
  paymentMethod: string | null;
  paymentEmail: string | null;
  shippingMethod: string | null;
  carrier: string | null;
  trackingNumber: string | null;
  submittedAt: Date | null;
  notes: string | null;
  items: OrderItem[];
}

interface OrderDetailProps {
  order: Order;
  timeline?: TimelineEvent[];
  reinspections?: Reinspection[];
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

export function OrderDetail({ order, timeline = [], reinspections = [] }: OrderDetailProps) {
  const router = useRouter();
  const [reinspectLoading, setReinspectLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  async function requestReinspection() {
    setReinspectLoading(true);
    try {
      await fetch(`/api/orders/${order.id}/reinspect`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason: "Customer requested reinspection" }),
      });
    } finally {
      setReinspectLoading(false);
      router.refresh();
    }
  }

  async function handleAcceptRevision() {
    setActionLoading(true);
    try {
      await fetch(`/api/orders/${order.id}/accept-revision`, { method: "POST" });
    } finally {
      setActionLoading(false);
      router.refresh();
    }
  }

  async function handleDeclineRevision() {
    setActionLoading(true);
    try {
      await fetch(`/api/orders/${order.id}/decline-revision`, { method: "POST" });
    } finally {
      setActionLoading(false);
      router.refresh();
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">{order.offerNumber}</h1>
          <p className="text-sm text-zinc-500">
            Submitted {order.submittedAt ? new Date(order.submittedAt).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            }) : "—"}
          </p>
        </div>
        <Badge variant={statusVariant[order.status] || "neutral"} className="text-sm px-3 py-1">
          {statusLabels[order.status] || order.status}
        </Badge>
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 space-y-6">
          <Card padding="lg" className="space-y-4">
            <h2 className="text-sm font-semibold text-zinc-900 uppercase tracking-wider">Items</h2>
            <div className="divide-y divide-zinc-100">
              {order.items.map((item, i) => (
                <div key={i} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                  <div>
                    <p className="text-sm font-medium text-zinc-900">{item.deviceName}</p>
                    <p className="text-xs text-zinc-500">{item.conditionLabel ?? ""}</p>
                    {item.imei && <p className="text-xs text-zinc-400">IMEI: {item.imei}</p>}
                    {item.serialNumber && <p className="text-xs text-zinc-400">S/N: {item.serialNumber}</p>}
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-zinc-900">
                      {formatPrice(item.finalPriceCents ?? item.offeredPriceCents)}
                    </p>
                    {item.finalPriceCents && item.finalPriceCents !== item.offeredPriceCents && (
                      <p className="text-xs text-zinc-400 line-through">
                        {formatPrice(item.offeredPriceCents)}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-zinc-200 pt-4 space-y-1.5 text-sm">
              <div className="flex justify-between text-zinc-600">
                <span>Subtotal</span>
                <span>{formatPrice(order.subtotalCents ?? 0)}</span>
              </div>
              {(order.couponDiscountCents ?? 0) > 0 && (
                <div className="flex justify-between text-emerald-600">
                  <span>Discount</span>
                  <span>-{formatPrice(order.couponDiscountCents ?? 0)}</span>
                </div>
              )}
            </div>

            <div className="border-t border-zinc-200 pt-3 flex justify-between font-semibold text-lg text-zinc-900">
              <span>Total</span>
              <span>{formatPrice(order.totalCents ?? 0)}</span>
            </div>
          </Card>

          <Card padding="lg">
            <h2 className="text-sm font-semibold text-zinc-900 uppercase tracking-wider mb-3"> Shipping & Payment</h2>
            <div className="text-sm text-zinc-600 space-y-1.5">
              <p>
                <span className="font-medium text-zinc-900">Shipping:</span>{" "}
                <span className="capitalize">{order.shippingMethod ?? "—"}</span>
              </p>
              <p>
                <span className="font-medium text-zinc-900">Carrier:</span>{" "}
                <span className="uppercase">{order.carrier ?? "—"}</span>
              </p>
              {order.trackingNumber && (
                <p>
                  <span className="font-medium text-zinc-900">Tracking:</span>{" "}
                  <span className="font-mono text-xs">{order.trackingNumber}</span>
                </p>
              )}
              <p>
                <span className="font-medium text-zinc-900">Payment Method:</span>{" "}
                <span className="capitalize">{order.paymentMethod ?? "—"}</span>
              </p>
              {order.paymentEmail && (
                <p>
                  <span className="font-medium text-zinc-900">Payment Email:</span> {order.paymentEmail}
                </p>
              )}
            </div>
          </Card>

          {order.status === "offer_revised" && (
            <Card padding="lg" className="space-y-4 border-amber-200 bg-amber-50">
              <div>
                <h2 className="text-sm font-semibold text-amber-900">Revised Offer</h2>
                <p className="text-xs text-amber-700 mt-1">
                  Our inspection found a different condition than what you selected. A revised offer is available.
                </p>
              </div>
              <div className="flex gap-3">
                <Button variant="primary" size="md" loading={actionLoading} onClick={handleAcceptRevision}>
                  Accept Revised Offer
                </Button>
                <Button variant="outline" size="md" loading={actionLoading} onClick={handleDeclineRevision}>
                  Decline & Return
                </Button>
              </div>
            </Card>
          )}

          {order.status === "inspecting" && (
            <Card padding="lg">
              <p className="text-sm text-zinc-600">
                Your device is being inspected. If the condition matches, your payment will be processed within 24-48 hours.
              </p>
              <Button variant="outline" size="sm" className="mt-3" loading={reinspectLoading} onClick={requestReinspection}>
                Request Reinspection
              </Button>
            </Card>
          )}

          {order.notes && (
            <Card padding="lg">
              <h2 className="text-sm font-semibold text-zinc-900 uppercase tracking-wider mb-2">Notes</h2>
              <p className="text-sm text-zinc-600">{order.notes}</p>
            </Card>
          )}

          {reinspections.length > 0 && (
            <Card padding="lg">
              <h2 className="text-sm font-semibold text-zinc-900 uppercase tracking-wider mb-3">Reinspections</h2>
              <div className="space-y-3">
                {reinspections.map((r, i) => (
                  <div key={i} className="rounded-lg border border-zinc-200 bg-zinc-50 p-3 text-sm">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-zinc-900 capitalize">{r.status}</span>
                      {r.createdAt && (
                        <span className="text-xs text-zinc-400">
                          {new Date(r.createdAt).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                    {r.reason && <p className="text-xs text-zinc-500">Reason: {r.reason}</p>}
                    {r.result && <p className="text-xs text-zinc-500 mt-1">Result: {r.result}</p>}
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>

        <div className="lg:col-span-2 space-y-6">
          <Card padding="lg">
            <OrderTimeline currentStatus={order.status} events={timeline} />
          </Card>
        </div>
      </div>
    </div>
  );
}
