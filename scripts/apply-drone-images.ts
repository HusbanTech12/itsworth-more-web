/**
 * Sync drone device + brand image_url in Neon to local /images/drones files.
 * Run: npx tsx --env-file=.env scripts/apply-drone-images.ts
 */
import fs from "node:fs";
import path from "node:path";
import postgres from "postgres";

export function fileForDrone(deviceSlug: string): string | null {
  const map: Record<string, string> = {
    "dji-air-3": "dji-air-3.jpg",
    "dji-air-3s": "dji-air-3s.jpg",
    "dji-air-2s": "dji-air-2s.jpg",
    "dji-mavic-4-pro": "dji-mavic-4-pro.jpg",
    "dji-mavic-3-pro": "dji-mavic-3-pro.jpg",
    "dji-mini-4-pro": "dji-mini-4-pro.jpg",
    "dji-mini-3-pro": "dji-mini-3-pro.jpg",
    "dji-mini-2": "dji-mini-2.jpg",
    "dji-mini-se": "dji-mini-se.jpg",
    "dji-avata-2": "dji-avata-2.jpg",
    "autel-evo-lite-plus": "autel-evo-lite-plus.jpg",
    "autel-evo-nano-plus": "autel-evo-nano-plus.jpg",
  };
  return map[deviceSlug] ?? null;
}

export const DRONE_BRANDS = new Set(["dji", "autel"]);

export const DRONE_BRAND_IMAGES: Record<string, string> = {
  dji: "/images/drones/dji-mavic-4-pro.jpg",
  autel: "/images/drones/autel-evo-lite-plus.jpg",
};

async function main() {
  const imgDir = path.resolve("public/images/drones");
  const sql = postgres(process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL!, {
    prepare: false,
  });

  const rows = await sql<{ slug: string; brand_slug: string }[]>`
    select d.slug, b.slug as brand_slug
    from devices d
    join brands b on b.id = d.brand_id
    join categories c on c.id = b.category_id
    where c.slug = 'drone'
  `;

  let updated = 0;
  for (const row of rows) {
    if (!DRONE_BRANDS.has(row.brand_slug)) continue;
    const file = fileForDrone(row.slug);
    if (!file) {
      console.warn("unmapped", row.slug);
      continue;
    }
    if (!fs.existsSync(path.join(imgDir, file))) {
      console.warn("missing", file, row.slug);
      continue;
    }
    const url = `/images/drones/${file}`;
    await sql`
      update devices
      set image_url = ${url}, updated_at = now()
      where slug = ${row.slug}
    `;
    updated += 1;
  }

  let brandsUpdated = 0;
  for (const [slug, url] of Object.entries(DRONE_BRAND_IMAGES)) {
    await sql`
      update brands
      set image_url = ${url}, updated_at = now()
      where slug = ${slug}
    `;
    brandsUpdated += 1;
  }

  console.log(`Updated image_url on ${updated} drone devices`);
  console.log(`Updated image_url on ${brandsUpdated} drone brands`);
  await sql.end();
}

if (process.argv[1]?.replace(/\\/g, "/").endsWith("apply-drone-images.ts")) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
