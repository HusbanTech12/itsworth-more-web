/**
 * Sync camera device + brand image_url in Neon to local /images/cameras files.
 * Run: npx tsx --env-file=.env scripts/apply-camera-images.ts
 */
import fs from "node:fs";
import path from "node:path";
import postgres from "postgres";

export function fileForCamera(deviceSlug: string): string | null {
  const map: Record<string, string> = {
    "nikon-z8": "nikon-z8.jpg",
    "nikon-z6-iii": "nikon-z6-iii.jpg",
    "nikon-z5-ii": "nikon-z5-ii.jpg",
    "nikon-z50-ii": "nikon-z50-ii.jpg",
    "nikon-d850": "nikon-d850.jpg",
    "nikon-d780": "nikon-d780.jpg",
    "nikon-d7500": "nikon-d7500.jpg",
    "canon-eos-r5-mark-ii": "canon-eos-r5-mark-ii.jpg",
    "canon-eos-r6-mark-ii": "canon-eos-r6-mark-ii.jpg",
    "canon-eos-r8": "canon-eos-r8.jpg",
    "canon-eos-r50": "canon-eos-r50.jpg",
    "canon-eos-5d-mark-iv": "canon-eos-5d-mark-iv.jpg",
    "canon-eos-90d": "canon-eos-90d.jpg",
    "canon-powershot-g7x-iii": "canon-powershot-g7x-iii.jpg",
    "sony-a7r-v": "sony-a7r-v.jpg",
    "sony-a7-iv": "sony-a7-iv.jpg",
    "sony-a7c-ii": "sony-a7c-ii.jpg",
    "sony-a6700": "sony-a6700.jpg",
    "sony-zv-e10-ii": "sony-zv-e10-ii.jpg",
    "sony-rx100-vii": "sony-rx100-vii.jpg",
    "sony-a6400": "sony-a6400.jpg",
    "leica-m11": "leica-m11.jpg",
    "leica-q3": "leica-q3.jpg",
    "leica-sl3": "leica-sl3.jpg",
    "leica-d-lux-8": "leica-d-lux-8.jpg",
    "leica-cl": "leica-cl.jpg",
    "fujifilm-x100vi": "fujifilm-x100vi.jpg",
    "fujifilm-x-t5": "fujifilm-x-t5.jpg",
    "fujifilm-x-t50": "fujifilm-x-t50.jpg",
    "fujifilm-x-s20": "fujifilm-x-s20.jpg",
    "fujifilm-gfx100s-ii": "fujifilm-gfx100s-ii.jpg",
    "fujifilm-x-h2": "fujifilm-x-h2.jpg",
    "panasonic-lumix-s5-ii": "panasonic-lumix-s5-ii.jpg",
    "panasonic-lumix-gh6": "panasonic-lumix-gh6.jpg",
    "panasonic-lumix-g9-ii": "panasonic-lumix-g9-ii.jpg",
    "panasonic-lumix-s9": "panasonic-lumix-s9.jpg",
    "panasonic-lumix-gh5-ii": "panasonic-lumix-gh5-ii.jpg",
    "olympus-om-1-mark-ii": "olympus-om-1-mark-ii.jpg",
    "olympus-om-5": "olympus-om-5.jpg",
    "olympus-e-m1-mark-iii": "olympus-e-m1-mark-iii.jpg",
    "olympus-pen-f": "olympus-pen-f.jpg",
    "olympus-e-m10-mark-iv": "olympus-e-m10-mark-iv.jpg",
    "gopro-max2": "gopro-max2.jpg",
    "gopro-hero-13-black": "gopro-hero-13-black.jpg",
    "gopro-hero-12-black": "gopro-hero-12-black.jpg",
    "gopro-hero-11-black": "gopro-hero-11-black.jpg",
    "gopro-hero-11-black-mini": "gopro-hero-11-black-mini.jpg",
    "gopro-hero-10-black": "gopro-hero-10-black.jpg",
    "gopro-hero-9-black": "gopro-hero-9-black.jpg",
    "gopro-max": "gopro-max.jpg",
    "gopro-hero-8-black": "gopro-hero-8-black.jpg",
    "gopro-hero-7": "gopro-hero-7.jpg",
    "gopro-hero-6-black": "gopro-hero-6-black.jpg",
    "gopro-hero-5": "gopro-hero-5.jpg",
    "dji-osmo-action-6": "dji-osmo-action-6.jpg",
    "dji-osmo-pocket-3": "dji-osmo-pocket-3.jpg",
    "dji-osmo-action-5-pro": "dji-osmo-action-5-pro.jpg",
    "dji-osmo-action-4": "dji-osmo-action-4.jpg",
    "dji-osmo-action-3": "dji-osmo-action-3.jpg",
  };
  return map[deviceSlug] ?? null;
}

export const CAMERA_BRANDS = new Set([
  "nikon",
  "canon",
  "sony-camera",
  "leica",
  "fujifilm",
  "panasonic",
  "olympus",
  "gopro",
  "dji-camera",
]);

export const CAMERA_BRAND_IMAGES: Record<string, string> = {
  nikon: "/images/cameras/nikon-z8.jpg",
  canon: "/images/cameras/canon-eos-r5-mark-ii.jpg",
  "sony-camera": "/images/cameras/sony-a7r-v.jpg",
  leica: "/images/cameras/leica-m11.jpg",
  fujifilm: "/images/cameras/fujifilm-x100vi.jpg",
  panasonic: "/images/cameras/panasonic-lumix-s5-ii.jpg",
  olympus: "/images/cameras/olympus-om-1-mark-ii.jpg",
  gopro: "/images/cameras/gopro-hero-13-black.jpg",
  "dji-camera": "/images/cameras/dji-osmo-pocket-3.jpg",
};

async function main() {
  const imgDir = path.resolve("public/images/cameras");
  const sql = postgres(process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL!, {
    prepare: false,
  });

  const rows = await sql<{ slug: string; brand_slug: string }[]>`
    select d.slug, b.slug as brand_slug
    from devices d
    join brands b on b.id = d.brand_id
    join categories c on c.id = b.category_id
    where c.slug = 'camera'
  `;

  let updated = 0;
  for (const row of rows) {
    if (!CAMERA_BRANDS.has(row.brand_slug)) continue;
    const file = fileForCamera(row.slug);
    if (!file) {
      console.warn("unmapped", row.slug);
      continue;
    }
    if (!fs.existsSync(path.join(imgDir, file))) {
      console.warn("missing", file, row.slug);
      continue;
    }
    const url = `/images/cameras/${file}`;
    await sql`
      update devices
      set image_url = ${url}, updated_at = now()
      where slug = ${row.slug}
    `;
    updated += 1;
  }

  let brandsUpdated = 0;
  for (const [slug, url] of Object.entries(CAMERA_BRAND_IMAGES)) {
    await sql`
      update brands
      set image_url = ${url}, updated_at = now()
      where slug = ${slug}
    `;
    brandsUpdated += 1;
  }

  console.log(`Updated image_url on ${updated} camera devices`);
  console.log(`Updated image_url on ${brandsUpdated} camera brands`);
  await sql.end();
}

if (process.argv[1]?.replace(/\\/g, "/").endsWith("apply-camera-images.ts")) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
