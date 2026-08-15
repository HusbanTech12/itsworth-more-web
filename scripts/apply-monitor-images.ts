/**
 * Sync monitor device + brand image_url in Neon to local /images/monitors files.
 * Run: npx tsx --env-file=.env scripts/apply-monitor-images.ts
 */
import fs from "node:fs";
import path from "node:path";
import postgres from "postgres";

export function fileForMonitor(deviceSlug: string): string | null {
  const map: Record<string, string> = {
    "apple-studio-display-xdr-27in-2026-silver": "apple-studio-display-xdr-27-2026.jpg",
    "apple-pro-display-xdr-32in-2019-silver": "apple-pro-display-xdr-32.jpg",
    "apple-studio-display-27in-2026-silver": "apple-studio-display-27-2026.jpg",
    "apple-studio-display-27in-2022-silver": "apple-studio-display-27-2022.jpg",
    "lg-ultrafine-27in": "lg-ultrafine-27.jpg",
    "lg-ultrafine-5k": "lg-ultrafine-5k.jpg",
    "lg-ultragear-27gp950": "lg-ultragear-27gp950.jpg",
    "lg-c3-oled-42": "lg-c3-oled-42.jpg",
    "samsung-odyssey-g9": "samsung-odyssey-g9.jpg",
    "samsung-odyssey-g7": "samsung-odyssey-g7.jpg",
    "samsung-viewfinity-s8": "samsung-viewfinity-s8.jpg",
    "dell-ultrasharp-u2723qe": "dell-ultrasharp-u2723qe.jpg",
    "dell-alienware-aw3423dwf": "dell-alienware-aw3423dwf.jpg",
  };
  return map[deviceSlug] ?? null;
}

export const MONITOR_BRANDS = new Set(["apple-display", "lg", "samsung-monitor", "dell-monitor"]);

export const MONITOR_BRAND_IMAGES: Record<string, string> = {
  "apple-display": "/images/monitors/apple-studio-display-27-2022.jpg",
  lg: "/images/monitors/lg-ultrafine-5k.jpg",
  "samsung-monitor": "/images/monitors/samsung-odyssey-g9.jpg",
  "dell-monitor": "/images/monitors/dell-ultrasharp-u2723qe.jpg",
};

async function main() {
  const imgDir = path.resolve("public/images/monitors");
  const sql = postgres(process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL!, {
    prepare: false,
  });

  const rows = await sql<{ slug: string; brand_slug: string }[]>`
    select d.slug, b.slug as brand_slug
    from devices d
    join brands b on b.id = d.brand_id
    join categories c on c.id = b.category_id
    where c.slug = 'monitor'
  `;

  let updated = 0;
  for (const row of rows) {
    if (!MONITOR_BRANDS.has(row.brand_slug)) continue;
    const file = fileForMonitor(row.slug);
    if (!file) {
      console.warn("unmapped", row.slug);
      continue;
    }
    if (!fs.existsSync(path.join(imgDir, file))) {
      console.warn("missing", file, row.slug);
      continue;
    }
    const url = `/images/monitors/${file}`;
    await sql`
      update devices
      set image_url = ${url}, updated_at = now()
      where slug = ${row.slug}
    `;
    updated += 1;
  }

  let brandsUpdated = 0;
  for (const [slug, url] of Object.entries(MONITOR_BRAND_IMAGES)) {
    await sql`
      update brands
      set image_url = ${url}, updated_at = now()
      where slug = ${slug}
    `;
    brandsUpdated += 1;
  }

  console.log(`Updated image_url on ${updated} monitor devices`);
  console.log(`Updated image_url on ${brandsUpdated} monitor brands`);
  await sql.end();
}

if (process.argv[1]?.replace(/\\/g, "/").endsWith("apply-monitor-images.ts")) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
