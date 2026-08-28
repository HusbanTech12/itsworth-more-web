/**
 * Build a broader eBay search query from a catalog device name.
 * Overly specific names (GSM Unlocked, color + storage combos, niche SKUs)
 * often return <3 NEW listings and get skipped.
 */
export function ebaySearchQuery(deviceName: string): string {
  let q = deviceName
    // Drop carrier / unlock marketing text
    .replace(/\s*\(?GSM\s+Unlocked\)?/gi, "")
    .replace(/\s*\(?Unlocked\)?/gi, "")
    .replace(/\s*\(?Wi[- ]?Fi\)?/gi, "")
    // Drop trailing color words after storage
    .replace(
      /\s*-\s*(Black|White|Silver|Gold|Space\s*Gray|Grey|Midnight|Starlight|Blue|Purple|Red|Green|Titanium|Graphite|Rose\s*Gold)\b.*$/i,
      "",
    )
    .replace(
      /\b(Black|White|Silver|Gold|Space\s*Gray|Grey|Midnight|Starlight|Blue|Purple|Red|Green|Titanium|Graphite|Rose\s*Gold)\b/gi,
      "",
    )
    // Normalize quotes / dashes / punctuation
    .replace(/[""]/g, '"')
    .replace(/[–—]/g, "-")
    .replace(/\s{2,}/g, " ")
    .trim();

  // Prefer model + storage (drop CPU/RAM/SSD long tails when too long)
  if (q.length > 72) {
    // Keep up to first comma-separated segment or first ~60 chars at a word boundary
    const head = q.split(",")[0].trim();
    q = head.length >= 12 ? head : q.slice(0, 60).replace(/\s+\S*$/, "");
  }

  // Known hard-to-match aliases
  const aliases: Array<[RegExp, string]> = [
    [/^MSI Claw A8 Polar Tempest.*$/i, "MSI Claw A8"],
    [/^MSI Claw 8 AI\+?\s*Sandstorm.*$/i, "MSI Claw 8 AI+"],
    [/^ASUS ROG XG Mobile RTX 4090.*$/i, "XG Mobile RTX 4090"],
    [/^Apple Pro Display XDR.*$/i, "Apple Pro Display XDR"],
    [/^Apple Watch \(Ultra 3\).*$/i, "Apple Watch Ultra 3 49mm"],
    [/^iPhone SE \(2nd Gen\.?\).*$/i, "iPhone SE 2nd generation"],
    [/^iPad Mini 4.*$/i, "iPad Mini 4"],
    [/^iPad Mini 6.*$/i, "iPad Mini 6"],
    [/^iPad 9.*$/i, "iPad 9th generation"],
    [/^iPad 7.*$/i, "iPad 7th generation"],
    [/^iPad 6.*$/i, "iPad 6th generation"],
    [/^iPad 5.*$/i, "iPad 5th generation"],
    [/^MacBook Pro 15" \(Mid 2015\).*$/i, "MacBook Pro 15 Mid 2015"],
    [/^MacBook Pro 13" Touch Bar \(Late 2016\).*$/i, "MacBook Pro 13 Touch Bar 2016"],
  ];

  for (const [re, alias] of aliases) {
    if (re.test(deviceName) || re.test(q)) return alias;
  }

  return q.replace(/\s{2,}/g, " ").trim();
}
