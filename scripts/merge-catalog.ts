/**
 * Merge catalog snippet into lib/data.ts
 * Run after: npx tsx scripts/gen-catalog.ts
 */
import fs from "fs";
import path from "path";

const dataPath = path.join(process.cwd(), "lib/data.ts");
const snippetPath = path.join(process.cwd(), "scripts/catalog-snippet.txt");

let data = fs.readFileSync(dataPath, "utf8").replace(/\r\n/g, "\n");
const snippet = fs.readFileSync(snippetPath, "utf8").replace(/\r\n/g, "\n");

function extract(section: string): string {
  const marker = `${section}:\n`;
  const start = snippet.indexOf(marker);
  if (start < 0) throw new Error(`Missing section ${section}`);
  const bodyStart = start + marker.length;
  const next = ["BRANDS:", "DEVICES:", "PRICES:"]
    .map((m) => snippet.indexOf(`\n${m}`, bodyStart))
    .filter((i) => i >= 0);
  const end = next.length ? Math.min(...next) : snippet.length;
  return snippet.slice(bodyStart, end).replace(/\s+$/, "");
}

const brands = extract("BRANDS");
const devices = extract("DEVICES");
const prices = extract("PRICES");

// Remove previous catalog inserts if present
data = data.replace(/\n  \/\/ ── Catalog brands ──[\s\S]*?(?=\n\];\n\nexport const devices)/, "");
data = data.replace(/\n  \/\/ ── Catalog devices ──[\s\S]*?(?=\n\];\n\nexport const conditions)/, "");
data = data.replace(/\n  \/\/ ── Catalog prices ──[\s\S]*?(?=\n\};\n\nexport function getDevicesByBrand)/, "");

function insertBefore(haystack: string, marker: string, insert: string): string {
  const idx = haystack.indexOf(marker);
  if (idx < 0) throw new Error(`Marker not found: ${marker.slice(0, 60)}`);
  return haystack.slice(0, idx) + insert + "\n" + haystack.slice(idx);
}

// Insert brands before end of brands array
data = insertBefore(data, "\n];\n\nexport const devices:", brands);

// Insert devices before end of devices array
data = insertBefore(data, "\n];\n\nexport const conditions:", devices);

if (!data.includes('"very-good"')) {
  data = data.replace(
    '"flawless": { slug: "flawless", label: "Flawless", description: "Zero scratches, scuffs, or other marks. Looks like new." },',
    `"flawless": { slug: "flawless", label: "Flawless", description: "Zero scratches, scuffs, or other marks. Looks like new." },
  "very-good": { slug: "very-good", label: "Very Good", description: "Minor cosmetic wear. Fully functional with light signs of use." },`,
  );
}

// Insert prices before end of priceData
data = insertBefore(data, "\n};\n\nexport function getDevicesByBrand", prices);

fs.writeFileSync(dataPath, data);

console.log("Merged OK");
console.log("Catalog brands:", data.includes("Catalog brands"));
console.log("Catalog devices:", data.includes("Catalog devices"));
console.log("Catalog prices:", data.includes("Catalog prices"));
console.log("very-good:", data.includes('"very-good"'));
