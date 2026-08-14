/**
 * Sync Tablet device image_url in Neon to local /images/tablets files.
 * Run: npx tsx --env-file=.env scripts/apply-tablet-images.ts
 */
import fs from "node:fs";
import path from "node:path";
import postgres from "postgres";

const SKU_ALIASES: Record<string, string> = {
  "ipad-9-64gb-space-gray-wifi": "apple-ipad-9.jpg",
  "ipad-9-64gb-space-gray-gsm-unlocked": "apple-ipad-9.jpg",
  "ipad-9-256gb-space-gray-gsm-unlocked": "apple-ipad-9.jpg",
  "ipad-9-64gb-silver-wifi": "apple-ipad-9.jpg",
  "ipad-6-32gb-space-gray-wifi": "apple-ipad-6.jpg",
  "ipad-6-32gb-space-gray-gsm-unlocked": "apple-ipad-6.jpg",
  "ipad-6-128gb-space-gray-wifi": "apple-ipad-6.jpg",
  "ipad-mini-4-128gb-space-gray-wifi": "apple-ipad-mini-4.jpg",
  "ipad-mini-4-128gb-space-gray-gsm-unlocked": "apple-ipad-mini-4.jpg",
  "ipad-10-64gb-silver-wifi": "apple-ipad-10.jpg",
  "ipad-mini-5-64gb-space-gray-wifi": "apple-ipad-mini-5.jpg",
  "ipad-8-32gb-space-gray-wifi": "apple-ipad-8.jpg",
  "ipad-5-32gb-space-gray-wifi": "apple-ipad-5.jpg",
  "ipad-5-32gb-space-gray-gsm-unlocked": "apple-ipad-5.jpg",
  "ipad-7-32gb-space-gray-wifi": "apple-ipad-7.jpg",
  "ipad-7-32gb-space-gray-gsm-unlocked": "apple-ipad-7.jpg",
  "ipad-mini-6-64gb-grey-wifi": "apple-ipad-mini-6.jpg",
  "ipad-mini-6-64gb-grey-gsm-unlocked": "apple-ipad-mini-6.jpg",
};

function fileFor(brandSlug: string, deviceSlug: string): string | null {
  if (SKU_ALIASES[deviceSlug]) return SKU_ALIASES[deviceSlug];
  if (brandSlug === "ipad") return `apple-${deviceSlug}.jpg`;
  if (brandSlug === "samsung-tablet") return `samsung-${deviceSlug}.jpg`;
  if (brandSlug === "oneplus-tablet") return `${deviceSlug}.jpg`;
  return null;
}

async function main() {
  const imgDir = path.resolve("public/images/tablets");
  const sql = postgres(process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL!, {
    prepare: false,
  });

  const rows = await sql<{ slug: string; brand_slug: string }[]>`
    select d.slug, b.slug as brand_slug
    from devices d
    join brands b on b.id = d.brand_id
    join categories c on c.id = b.category_id
    where c.slug = 'tablet'
  `;

  let updated = 0;
  for (const row of rows) {
    const file = fileFor(row.brand_slug, row.slug);
    if (!file) continue;
    if (!fs.existsSync(path.join(imgDir, file))) {
      console.warn("missing", file, row.slug);
      continue;
    }
    const url = `/images/tablets/${file}`;
    await sql`
      update devices
      set image_url = ${url}, updated_at = now()
      where slug = ${row.slug}
    `;
    updated += 1;
  }

  const brandImages: Record<string, string> = {
    ipad: "/images/tablets/apple-ipad-pro-m4.jpg",
    "samsung-tablet": "/images/tablets/samsung-galaxy-tab-s11-ultra.jpg",
    "oneplus-tablet": "/images/tablets/oneplus-pad-3.jpg",
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

  console.log(`Updated image_url on ${updated} tablet devices`);
  console.log(`Updated image_url on ${brandsUpdated} tablet brands`);
  await sql.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
