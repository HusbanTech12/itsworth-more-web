const timelineSteps: { status: string; label: string; description: string }[] = [
  { status: "quote_pending", label: "Quote Created", description: "Your offer has been generated." },
  { status: "quote_accepted", label: "Quote Accepted", description: "You accepted the offer." },
  { status: "device_shipped", label: "Device Shipped", description: "Your device is on its way." },
  { status: "device_received", label: "Device Received", description: "We received your device." },
  { status: "inspecting", label: "Inspecting", description: "Our team is inspecting your device." },
  { status: "payment_sent", label: "Payment Sent", description: "Payment has been issued." },
  { status: "completed", label: "Completed", description: "Order complete." },
];

interface OrderTimelineProps {
  currentStatus: string;
}

export function OrderTimeline({ currentStatus }: OrderTimelineProps) {
  const statusOrder = timelineSteps.map((s) => s.status);
  const currentIndex = statusOrder.indexOf(currentStatus);

  const isCancelled = currentStatus === "cancelled";
  const isRevision = currentStatus === "offer_revised" || currentStatus === "offer_accepted" || currentStatus === "offer_declined";

  if (isCancelled) {
    return (
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-zinc-900">Order Timeline</h3>
        <div className="flex items-center gap-3 rounded-lg bg-red-50 border border-red-200 px-4 py-3">
          <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
            <svg className="w-4 h-4 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-medium text-red-700">Order Cancelled</p>
            <p className="text-xs text-red-500">This order has been cancelled.</p>
          </div>
        </div>
      </div>
    );
  }

  if (isRevision) {
    return (
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-zinc-900">Order Timeline</h3>
        <div className="flex items-center gap-3 rounded-lg bg-amber-50 border border-amber-200 px-4 py-3">
          <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center">
            <svg className="w-4 h-4 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-medium text-amber-700">
              {currentStatus === "offer_revised" ? "Offer Revised" : currentStatus === "offer_accepted" ? "Revised Offer Accepted" : "Revised Offer Declined"}
            </p>
            <p className="text-xs text-amber-500">
              {currentStatus === "offer_revised" ? "Our inspection found a different condition. A revised offer has been sent." : ""}
              {currentStatus === "offer_accepted" ? "You accepted the revised offer. Payment will be processed." : ""}
              {currentStatus === "offer_declined" ? "You declined the revised offer. Device will be returned." : ""}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-zinc-900">Order Timeline</h3>
      <ol className="relative border-l border-zinc-200 ml-3 space-y-6">
        {timelineSteps.map((step, i) => {
          const isComplete = currentIndex !== undefined && i <= currentIndex;
          const isCurrent = i === currentIndex;

          return (
            <li key={step.status} className="pl-6">
              <div
                className={`absolute -left-2.5 w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  isComplete
                    ? "bg-primary border-primary"
                    : "bg-white border-zinc-300"
                }`}
              >
                {isComplete && (
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <p className={`text-sm font-medium ${isCurrent ? "text-primary" : isComplete ? "text-zinc-900" : "text-zinc-400"}`}>
                {step.label}
              </p>
              <p className={`text-xs mt-0.5 ${isComplete ? "text-zinc-500" : "text-zinc-300"}`}>
                {step.description}
              </p>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
