/** Price multipliers relative to Brand New (eBay NEW median = 100%). */
export const CONDITION_PRICE_RATIOS: Record<string, number> = {
  "brand-new": 1,
  flawless: 1 / 1.05,
  "very-good": (1 / 1.05) * 0.88,
  good: (1 / 1.05) * 0.75,
  fair: (1 / 1.05) * 0.55,
  broken: (1 / 1.05) * 0.25,
};

export const CONDITION_DISPLAY_ORDER = [
  "brand-new",
  "flawless",
  "very-good",
  "good",
  "fair",
  "broken",
] as const;

export function deriveConditionPricesFromBrandNew(
  brandNewCents: number,
): Record<string, number> {
  const out: Record<string, number> = {};
  for (const [slug, ratio] of Object.entries(CONDITION_PRICE_RATIOS)) {
    out[slug] = Math.max(0, Math.round(brandNewCents * ratio));
  }
  return out;
}
