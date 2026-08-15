/**
 * Sync smart-watch device + brand image_url in Neon to local /images/watches files.
 * Run: npx tsx --env-file=.env scripts/apply-watch-images.ts
 */
import fs from "node:fs";
import path from "node:path";
import postgres from "postgres";

export function fileForWatch(deviceSlug: string): string | null {
  if (deviceSlug.startsWith("apple-watch-ultra-3")) return "apple-watch-ultra-3.jpg";
  if (deviceSlug.startsWith("apple-watch-ultra-2") || deviceSlug === "apple-watch-ultra-2") {
    return "apple-watch-ultra-2.jpg";
  }
  if (deviceSlug === "apple-watch-ultra" || deviceSlug.startsWith("apple-watch-ultra-")) {
    return "apple-watch-ultra.jpg";
  }
  if (deviceSlug.startsWith("apple-watch-series-10")) return "apple-watch-series-10.jpg";
  if (deviceSlug.startsWith("apple-watch-series-9")) return "apple-watch-series-9.jpg";
  if (deviceSlug.startsWith("apple-watch-series-8")) return "apple-watch-series-8.jpg";
  if (deviceSlug.startsWith("apple-watch-se-2")) return "apple-watch-se-2.jpg";
  if (deviceSlug.startsWith("garmin-tactix-8")) return "garmin-tactix-8.jpg";
  if (deviceSlug.startsWith("garmin-fenix-8-pro")) return "garmin-fenix-8-pro.jpg";
  if (deviceSlug.includes("sapphire") && deviceSlug.startsWith("garmin-fenix-8")) {
    return "garmin-fenix-8-sapphire.jpg";
  }
  if (deviceSlug.startsWith("garmin-fenix-8")) return "garmin-fenix-8.jpg";
  if (deviceSlug.startsWith("garmin-enduro-3")) return "garmin-enduro-3.jpg";
  if (deviceSlug === "galaxy-watch-ultra-2025") return "samsung-galaxy-watch-ultra-2025.jpg";
  if (deviceSlug === "galaxy-watch-ultra") return "samsung-galaxy-watch-ultra.jpg";
  if (deviceSlug === "galaxy-watch8-classic") return "samsung-galaxy-watch8-classic.jpg";
  if (deviceSlug === "galaxy-watch8") return "samsung-galaxy-watch8.jpg";
  if (deviceSlug === "galaxy-watch7") return "samsung-galaxy-watch7.jpg";
  if (deviceSlug === "galaxy-watch6-classic") return "samsung-galaxy-watch6-classic.jpg";
  if (deviceSlug === "galaxy-watch6") return "samsung-galaxy-watch6.jpg";
  return null;
}

const WATCH_BRANDS = new Set(["apple-watch", "garmin", "samsung-watch"]);

async function main() {
  const imgDir = path.resolve("public/images/watches");
  const sql = postgres(process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL!, {
    prepare: false,
  });

  const rows = await sql<{ slug: string; brand_slug: string }[]>`
    select d.slug, b.slug as brand_slug
    from devices d
    join brands b on b.id = d.brand_id
    join categories c on c.id = b.category_id
    where c.slug = 'smart-watch'
  `;

  let updated = 0;
  for (const row of rows) {
    if (!WATCH_BRANDS.has(row.brand_slug)) continue;
    const file = fileForWatch(row.slug);
    if (!file) continue;
    if (!fs.existsSync(path.join(imgDir, file))) {
      console.warn("missing", file, row.slug);
      continue;
    }
    const url = `/images/watches/${file}`;
    await sql`
      update devices
      set image_url = ${url}, updated_at = now()
      where slug = ${row.slug}
    `;
    updated += 1;
  }

  const brandImages: Record<string, string> = {
    "apple-watch": "/images/watches/apple-watch-ultra-3.jpg",
    garmin: "/images/watches/garmin-fenix-8.jpg",
    "samsung-watch": "/images/watches/samsung-galaxy-watch8.jpg",
  };

  let brandsUpdated = 0;
  for (const [slug, url] of Object.entries(brandImages)) {
    await sql`
      update brands
      set image_url = ${url}, updated_at = now()
      where slug = ${slug}
    `;
    brandsUpdated += 1;
  }

  console.log(`Updated image_url on ${updated} watch devices`);
  console.log(`Updated image_url on ${brandsUpdated} watch brands`);
  await sql.end();
}

if (process.argv[1]?.replace(/\\/g, "/").endsWith("apply-watch-images.ts")) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
