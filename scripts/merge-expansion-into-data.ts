/**
 * Merge expansionCatalog into lib/data.ts for full-seed compatibility.
 */
import fs from "fs";
import path from "path";
import { expansionCatalog } from "./seed-catalog-expansion";

const dataPath = path.join(process.cwd(), "lib/data.ts");
let data = fs.readFileSync(dataPath, "utf8").replace(/\r\n/g, "\n");

data = data.replace(/\n  \/\/ ── Expansion brands ──[\s\S]*?(?=\n\];\n\nexport const devices)/, "");
data = data.replace(/\n  \/\/ ── Expansion devices ──[\s\S]*?(?=\n\];\n\nexport const conditions)/, "");
data = data.replace(/\n  \/\/ ── Expansion prices ──[\s\S]*?(?=\n\};\n\nexport function getDevicesByBrand)/, "");

function tiers(maxCents: number) {
  return {
    "brand-new": Math.round(maxCents * 1.05),
    flawless: maxCents,
    "very-good": Math.round(maxCents * 0.88),
    good: Math.round(maxCents * 0.75),
    fair: Math.round(maxCents * 0.55),
    broken: Math.round(maxCents * 0.25),
  };
}

const existingBrandSlugs = new Set(
  [...data.matchAll(/\{ slug: "([^"]+)", name: "[^"]+", imageUrl:[\s\S]*?categorySlug:/g)].map((m) => m[1]),
);
const existingDeviceSlugs = new Set(
  [...data.matchAll(/\{ slug: "([^"]+)", name: "[^"]+", imageUrl:[\s\S]*?brandSlug:/g)].map((m) => m[1]),
);

let brandsBlock = "\n  // ── Expansion brands ──\n";
let devicesBlock = "\n  // ── Expansion devices ──\n";
let pricesBlock = "\n  // ── Expansion prices ──\n";
let brandsAdded = 0;
let devicesAdded = 0;

for (const b of expansionCatalog) {
  if (!existingBrandSlugs.has(b.slug)) {
    brandsBlock += `  { slug: "${b.slug}", name: "${b.name}", imageUrl: "", categorySlug: "${b.categorySlug}" },\n`;
    brandsAdded++;
  }
  for (const d of b.devices) {
    if (existingDeviceSlugs.has(d.slug)) continue;
    const max = Math.round(d.maxDollars * 100);
    const name = d.name.replace(/"/g, '\\"');
    devicesBlock += `  { slug: "${d.slug}", name: "${name}", imageUrl: "", brandSlug: "${b.slug}", maxQuoteCents: ${max} },\n`;
    const entries = Object.entries(tiers(max))
      .map(([k, v]) => `"${k}": ${v}`)
      .join(", ");
    pricesBlock += `  "${d.slug}": { ${entries} },\n`;
    devicesAdded++;
  }
}

function insertBefore(haystack: string, marker: string, insert: string): string {
  const idx = haystack.indexOf(marker);
  if (idx < 0) throw new Error(`Marker not found: ${marker.slice(0, 60)}`);
  return haystack.slice(0, idx) + insert + haystack.slice(idx);
}

if (brandsAdded) data = insertBefore(data, "\n];\n\nexport const devices:", brandsBlock);
if (devicesAdded) {
  data = insertBefore(data, "\n];\n\nexport const conditions:", devicesBlock);
  data = insertBefore(data, "\n};\n\nexport function getDevicesByBrand", pricesBlock);
}

fs.writeFileSync(dataPath, data);
console.log(`Merged into data.ts: +${brandsAdded} brands, +${devicesAdded} devices`);
