/**
 * Sync VR headset device + brand image_url in Neon to local /images/vr files.
 * Run: npx tsx --env-file=.env scripts/apply-vr-images.ts
 */
import fs from "node:fs";
import path from "node:path";
import postgres from "postgres";

export function fileForVr(deviceSlug: string): string | null {
  const map: Record<string, string> = {
    "meta-quest-3s": "meta-quest-3s.jpg",
    "meta-quest-3": "meta-quest-3.jpg",
    "meta-quest-2": "meta-quest-2.jpg",
    "meta-quest-pro": "meta-quest-pro.jpg",
    "apple-vision-pro-m5": "apple-vision-pro-m5.jpg",
    "apple-vision-pro": "apple-vision-pro.jpg",
    "valve-index": "valve-index.jpg",
    "playstation-vr2": "sony-playstation-vr2.jpg",
    "playstation-vr": "sony-playstation-vr.jpg",
    "vive-xr-elite": "vive-xr-elite.jpg",
    "vive-pro-2": "vive-pro-2.jpg",
  };
  return map[deviceSlug] ?? null;
}

export const VR_BRANDS = new Set(["meta-vr", "apple-vr", "valve-vr", "sony-vr", "vive"]);

export const VR_BRAND_IMAGES: Record<string, string> = {
  "meta-vr": "/images/vr/meta-quest-3.jpg",
  "apple-vr": "/images/vr/apple-vision-pro.jpg",
  "valve-vr": "/images/vr/valve-index.jpg",
  "sony-vr": "/images/vr/sony-playstation-vr2.jpg",
  vive: "/images/vr/vive-xr-elite.jpg",
};

async function main() {
  const imgDir = path.resolve("public/images/vr");
  const sql = postgres(process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL!, {
    prepare: false,
  });

  const rows = await sql<{ slug: string; brand_slug: string }[]>`
    select d.slug, b.slug as brand_slug
    from devices d
    join brands b on b.id = d.brand_id
    join categories c on c.id = b.category_id
    where c.slug = 'vr'
  `;

  let updated = 0;
  for (const row of rows) {
    if (!VR_BRANDS.has(row.brand_slug)) continue;
    const file = fileForVr(row.slug);
    if (!file) {
      console.warn("unmapped", row.slug);
      continue;
    }
    if (!fs.existsSync(path.join(imgDir, file))) {
      console.warn("missing", file, row.slug);
      continue;
    }
    const url = `/images/vr/${file}`;
    await sql`
      update devices
      set image_url = ${url}, updated_at = now()
      where slug = ${row.slug}
    `;
    updated += 1;
  }

  let brandsUpdated = 0;
  for (const [slug, url] of Object.entries(VR_BRAND_IMAGES)) {
    await sql`
      update brands
      set image_url = ${url}, updated_at = now()
      where slug = ${slug}
    `;
    brandsUpdated += 1;
  }

  console.log(`Updated image_url on ${updated} VR devices`);
  console.log(`Updated image_url on ${brandsUpdated} VR brands`);
  await sql.end();
}

if (process.argv[1]?.replace(/\\/g, "/").endsWith("apply-vr-images.ts")) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
