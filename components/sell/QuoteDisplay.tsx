interface QuoteDisplayProps {
  priceCents: number;
  deviceName: string;
  conditionLabel?: string;
}

function formatPrice(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(cents / 100);
}

export function QuoteDisplay({
  priceCents,
  deviceName,
  conditionLabel,
}: QuoteDisplayProps) {
  return (
    <div className="rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 p-6 text-center">
      <p className="text-xs font-medium uppercase tracking-wider text-zinc-500 mb-1">
        Your Quote
      </p>
      <p className="text-3xl sm:text-4xl font-bold text-zinc-900">
        {formatPrice(priceCents)}
      </p>
      <p className="text-sm text-zinc-500 mt-2">
        For {deviceName}
        {conditionLabel && (
          <>
            {" "}· <span className="font-medium text-zinc-700">{conditionLabel}</span>
          </>
        )}
      </p>
    </div>
  );
}
