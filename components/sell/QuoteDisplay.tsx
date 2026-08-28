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
    <div className="rounded-xl bg-cream border border-border p-6 text-center">
      <p className="text-xs font-medium uppercase tracking-wider text-ink-muted mb-1">
        Your Quote
      </p>
      <p className="text-3xl sm:text-4xl font-bold text-ink">{formatPrice(priceCents)}</p>
      <p className="text-sm text-ink-muted mt-2">
        For {deviceName}
        {conditionLabel && (
          <>
            {" "}
            · <span className="font-medium text-ink">{conditionLabel}</span>
          </>
        )}
      </p>
    </div>
  );
}
