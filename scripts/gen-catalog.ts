/**
 * One-shot helper: parse product-catalog.md → TypeScript snippets for lib/data.ts
 * Run: npx tsx scripts/gen-catalog.ts
 */
import fs from "fs";
import path from "path";

const md = fs.readFileSync(path.join(process.cwd(), "product-catalog.md"), "utf8");

type CondSlug = "brand-new" | "flawless" | "very-good" | "good" | "fair";

const COND_MAP: Record<string, CondSlug> = {
  "open box": "flawless",
  excellent: "flawless",
  "very good": "very-good",
  good: "good",
  fair: "fair",
};

const COND_RANK: CondSlug[] = ["flawless", "very-good", "good", "fair", "brand-new"];

const CAT_SLUG: Record<string, string> = {
  phone: "phone",
  tablet: "tablet",
  laptop: "laptop",
  desktop: "desktop",
  smartwatch: "smart-watch",
  "game console": "game-console",
  "graphics card": "graphics-card",
  monitor: "monitor",
  drone: "drone",
};

const IMG: Record<string, string> = {
  phone: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300&q=80&fit=crop&auto=format",
  tablet: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=300&q=80&fit=crop&auto=format",
  laptop: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=300&q=80&fit=crop&auto=format",
  desktop: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=300&q=80&fit=crop&auto=format",
  "smart-watch": "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=300&q=80&fit=crop&auto=format",
  "game-console": "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=300&q=80&fit=crop&auto=format",
  "graphics-card": "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=300&q=80&fit=crop&auto=format",
  monitor: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=300&q=80&fit=crop&auto=format",
  drone: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=300&q=80&fit=crop&auto=format",
};

const BRAND_IMG: Record<string, string> = {
  iphone: "https://images.unsplash.com/photo-1546054454-aa26e2b734c7?w=200&q=80&fit=crop&auto=format",
  ipad: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=200&q=80&fit=crop&auto=format",
  macbook: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=200&q=80&fit=crop&auto=format",
  "mac-mini": "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=200&q=80&fit=crop&auto=format",
  imac: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=200&q=80&fit=crop&auto=format",
  "apple-watch": "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=200&q=80&fit=crop&auto=format",
  garmin: "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=200&q=80&fit=crop&auto=format",
  lenovo: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=200&q=80&fit=crop&auto=format",
  msi: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=200&q=80&fit=crop&auto=format",
  valve: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=200&q=80&fit=crop&auto=format",
  asus: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=200&q=80&fit=crop&auto=format",
  sony: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=200&q=80&fit=crop&auto=format",
  nintendo: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=200&q=80&fit=crop&auto=format",
  evga: "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=200&q=80&fit=crop&auto=format",
  "asus-gpu": "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=200&q=80&fit=crop&auto=format",
  "apple-display": "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=200&q=80&fit=crop&auto=format",
  lg: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=200&q=80&fit=crop&auto=format",
  dji: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=200&q=80&fit=crop&auto=format",
};

function dollarsToCents(s: string): number {
  return Math.round(parseFloat(s.replace(/[$,]/g, "")) * 100);
}

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/["']/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function brandFor(categorySlug: string, name: string): { slug: string; name: string } {
  const n = name.toLowerCase();
  if (categorySlug === "phone") return { slug: "iphone", name: "iPhone" };
  if (categorySlug === "tablet") return { slug: "ipad", name: "iPad" };
  if (categorySlug === "laptop") return { slug: "macbook", name: "MacBook" };
  if (categorySlug === "desktop") {
    if (n.includes("imac")) return { slug: "imac", name: "iMac" };
    return { slug: "mac-mini", name: "Mac Mini" };
  }
  if (categorySlug === "smart-watch") {
    if (n.includes("garmin")) return { slug: "garmin", name: "Garmin" };
    return { slug: "apple-watch", name: "Apple Watch" };
  }
  if (categorySlug === "game-console") {
    if (n.includes("lenovo")) return { slug: "lenovo", name: "Lenovo" };
    if (n.includes("msi")) return { slug: "msi", name: "MSI" };
    if (n.includes("valve") || n.includes("steam deck")) return { slug: "valve", name: "Valve" };
    if (n.includes("asus") || n.includes("rog")) return { slug: "asus", name: "ASUS" };
    if (n.includes("sony") || n.includes("playstation")) return { slug: "sony", name: "Sony" };
    if (n.includes("nintendo")) return { slug: "nintendo", name: "Nintendo" };
    return { slug: "sony", name: "Sony" };
  }
  if (categorySlug === "graphics-card") {
    if (n.includes("evga")) return { slug: "evga", name: "EVGA" };
    if (n.includes("asus")) return { slug: "asus-gpu", name: "ASUS" };
    return { slug: "evga", name: "EVGA" };
  }
  if (categorySlug === "monitor") {
    if (n.includes("lg")) return { slug: "lg", name: "LG" };
    return { slug: "apple-display", name: "Apple Display" };
  }
  if (categorySlug === "drone") return { slug: "dji", name: "DJI" };
  throw new Error(`Unknown category ${categorySlug} for ${name}`);
}

interface Row {
  category: string;
  name: string;
  conditions: string;
  low: number;
  high: number;
}

const rows: Row[] = [];
for (const line of md.split("\n")) {
  if (!line.startsWith("|") || line.includes("---") || line.includes("**Category**")) continue;
  const cells = line.split("|").map((c) => c.trim()).filter(Boolean);
  if (cells.length < 5) continue;
  const [category, name, conditions, lowStr, highStr] = cells;
  rows.push({
    category,
    name,
    conditions,
    low: dollarsToCents(lowStr),
    high: dollarsToCents(highStr),
  });
}

interface DeviceAgg {
  slug: string;
  name: string;
  brandSlug: string;
  categorySlug: string;
  prices: Partial<Record<CondSlug, number>>;
}

const devices = new Map<string, DeviceAgg>();
const brands = new Map<string, { slug: string; name: string; categorySlug: string }>();

for (const row of rows) {
  const categorySlug = CAT_SLUG[row.category.toLowerCase().trim()];
  if (!categorySlug) {
    console.warn("Unknown category:", row.category);
    continue;
  }
  const brand = brandFor(categorySlug, row.name);
  brands.set(`${brand.slug}|${categorySlug}`, { ...brand, categorySlug });

  const slug = slugify(row.name);
  if (!devices.has(slug)) {
    devices.set(slug, {
      slug,
      name: row.name,
      brandSlug: brand.slug,
      categorySlug,
      prices: {},
    });
  }
  const device = devices.get(slug)!;

  const condNames = row.conditions.split(",").map((c) => c.trim().toLowerCase());
  const mapped = condNames
    .map((c) => COND_MAP[c])
    .filter((c): c is CondSlug => Boolean(c));

  // Ignore placeholder $9,999.99 prices and other absurd catalog errors
  const PLACEHOLDER = 999900; // $9,999.00+
  if (row.low >= PLACEHOLDER) continue; // skip broken rows like Series 11 at $9,999.99
  let high = row.high;
  if (high >= PLACEHOLDER) high = row.low;
  // Cap absurd highs like $45,999
  if (high > row.low * 5) high = row.low;

  const ordered = [...mapped].sort(
    (a, b) => COND_RANK.indexOf(a) - COND_RANK.indexOf(b),
  );

  if (ordered.length === 0) continue;

  if (ordered.length === 1) {
    const prev = device.prices[ordered[0]] ?? 0;
    device.prices[ordered[0]] = Math.max(prev, high);
  } else {
    for (let i = 0; i < ordered.length; i++) {
      const t = ordered.length === 1 ? 1 : i / (ordered.length - 1);
      // index 0 = best = high, last = worst = low
      const price = Math.round(high - t * (high - row.low));
      const prev = device.prices[ordered[i]] ?? 0;
      device.prices[ordered[i]] = Math.max(prev, price);
    }
  }
}

// Ensure better conditions never price below worse ones
const RANK_ORDER: CondSlug[] = ["flawless", "very-good", "good", "fair"];
for (const device of devices.values()) {
  let floor = 0;
  for (const slug of [...RANK_ORDER].reverse()) {
    const p = device.prices[slug];
    if (p == null) continue;
    if (p < floor) device.prices[slug] = floor;
    floor = device.prices[slug]!;
  }
}

// Existing brand slugs already in data.ts — only emit NEW brands
const EXISTING_BRANDS = new Set([
  "iphone", "samsung", "google-phone", "oneplus", "motorola",
  "ipad", "samsung-tablet", "macbook", "apple-watch",
]);

const EXISTING_DEVICE_SLUGS = new Set([
  "iphone-17-pro-max", "iphone-17-pro", "iphone-17", "iphone-17e",
  "iphone-16-pro-max", "iphone-16-pro", "iphone-16", "iphone-16-plus",
  "iphone-15-pro-max", "iphone-15-pro", "iphone-15", "iphone-14-pro-max",
  "iphone-14", "iphone-13", "iphone-13-mini", "iphone-12", "iphone-se-3rd-gen",
  "galaxy-s25-ultra", "galaxy-s25-plus", "galaxy-s25", "galaxy-s24-ultra",
  "galaxy-z-fold-6", "galaxy-z-flip-6", "pixel-9-pro", "pixel-9",
  "ipad-pro-m4", "ipad-air-m2", "macbook-pro-16-m4", "macbook-air-15-m4",
]);

const newBrands = [...brands.values()].filter((b) => !EXISTING_BRANDS.has(b.slug));
const newDevices = [...devices.values()].filter(
  (d) => !EXISTING_DEVICE_SLUGS.has(d.slug) && Object.keys(d.prices).length > 0,
);

let brandOut = "\n  // ── Catalog brands ──\n";
for (const b of newBrands) {
  const img = BRAND_IMG[b.slug] || BRAND_IMG.iphone;
  brandOut += `  { slug: "${b.slug}", name: "${b.name}", imageUrl: "${img}", categorySlug: "${b.categorySlug}" },\n`;
}

let deviceOut = "\n  // ── Catalog devices ──\n";
let priceOut = "\n  // ── Catalog prices ──\n";

for (const d of newDevices) {
  const max = Math.max(...Object.values(d.prices));
  const img = IMG[d.categorySlug];
  const name = d.name.replace(/"/g, '\\"');
  deviceOut += `  { slug: "${d.slug}", name: "${name}", imageUrl: "${img}", brandSlug: "${d.brandSlug}", maxQuoteCents: ${max} },\n`;

  const entries = Object.entries(d.prices)
    .map(([k, v]) => `"${k}": ${v}`)
    .join(", ");
  priceOut += `  "${d.slug}": { ${entries} },\n`;
}

const out = `// AUTO-GENERATED — paste into lib/data.ts\n// New brands: ${newBrands.length}\n// New devices: ${newDevices.length}\n\nBRANDS:${brandOut}\nDEVICES:${deviceOut}\nPRICES:${priceOut}\n`;
fs.writeFileSync(path.join(process.cwd(), "scripts/catalog-snippet.txt"), out);
console.log(`Parsed ${rows.length} rows → ${newDevices.length} new devices, ${newBrands.length} new brands`);
console.log("Wrote scripts/catalog-snippet.txt");
