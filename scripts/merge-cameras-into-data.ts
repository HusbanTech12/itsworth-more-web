/**
 * Append camera brands/devices/prices from scripts/seed-cameras.ts into lib/data.ts
 */
import fs from "fs";
import path from "path";
import { cameraBrands } from "./seed-cameras";

const dataPath = path.join(process.cwd(), "lib/data.ts");
let data = fs.readFileSync(dataPath, "utf8").replace(/\r\n/g, "\n");

// Remove previous camera catalog block if re-running
data = data.replace(/\n  \/\/ ── Camera brands \(ItsWorthMore\) ──[\s\S]*?(?=\n\];\n\nexport const devices)/, "");
data = data.replace(/\n  \/\/ ── Camera devices \(ItsWorthMore\) ──[\s\S]*?(?=\n\];\n\nexport const conditions)/, "");
data = data.replace(/\n  \/\/ ── Camera prices \(ItsWorthMore\) ──[\s\S]*?(?=\n\};\n\nexport function getDevicesByBrand)/, "");

let brandsBlock = "\n  // ── Camera brands (ItsWorthMore) ──\n";
let devicesBlock = "\n  // ── Camera devices (ItsWorthMore) ──\n";
let pricesBlock = "\n  // ── Camera prices (ItsWorthMore) ──\n";

for (const b of cameraBrands) {
  brandsBlock += `  { slug: "${b.slug}", name: "${b.name}", imageUrl: "${b.imageUrl}", categorySlug: "camera" },\n`;
  for (const d of b.devices) {
    const name = d.name.replace(/"/g, '\\"');
    devicesBlock += `  { slug: "${d.slug}", name: "${name}", imageUrl: "${d.imageUrl}", brandSlug: "${b.slug}", maxQuoteCents: ${d.maxQuoteCents} },\n`;
    const entries = Object.entries(d.prices)
      .map(([k, v]) => `"${k}": ${v}`)
      .join(", ");
    pricesBlock += `  "${d.slug}": { ${entries} },\n`;
  }
}

function insertBefore(haystack: string, marker: string, insert: string): string {
  const idx = haystack.indexOf(marker);
  if (idx < 0) throw new Error(`Marker not found: ${marker.slice(0, 80)}`);
  return haystack.slice(0, idx) + insert + haystack.slice(idx);
}

data = insertBefore(data, "\n];\n\nexport const devices:", brandsBlock);
data = insertBefore(data, "\n];\n\nexport const conditions:", devicesBlock);
data = insertBefore(data, "\n};\n\nexport function getDevicesByBrand", pricesBlock);

fs.writeFileSync(dataPath, data);
console.log("Merged camera catalog into lib/data.ts");
console.log(
  `Brands: ${cameraBrands.length}, Devices: ${cameraBrands.reduce((n, b) => n + b.devices.length, 0)}`,
);
