/**
 * Sync Phone device image_url in Neon to local /images/phones files.
 * lib/data.ts is already updated. This only writes image_url on existing phone rows.
 *
 * Run: npx tsx --env-file=.env scripts/apply-phone-images.ts
 */
import fs from "node:fs";
import path from "node:path";
import postgres from "postgres";

const SKU_ALIASES: Record<string, string> = {
  "iphone-12-64gb-black-gsm-unlocked": "apple-iphone-12.jpg",
  "iphone-13-128gb-midnight-gsm-unlocked": "apple-iphone-13.jpg",
  "iphone-14-128gb-midnight-gsm-unlocked": "apple-iphone-14.jpg",
  "iphone-11-64gb-black-gsm-unlocked": "apple-iphone-11.jpg",
  "iphone-11-128gb-black-gsm-unlocked": "apple-iphone-11.jpg",
  "iphone-x-64gb-space-gray-gsm-unlocked": "apple-iphone-x.jpg",
  "iphone-x-256gb-space-gray-gsm-unlocked": "apple-iphone-x.jpg",
  "iphone-x-64gb-silver-gsm-unlocked": "apple-iphone-x.jpg",
  "iphone-xr-64gb-black-gsm-unlocked": "apple-iphone-xr.jpg",
  "iphone-8-64gb-space-gray-gsm-unlocked": "apple-iphone-8.jpg",
  "iphone-8-plus-64gb-space-gray-gsm-unlocked": "apple-iphone-8-plus.jpg",
  "iphone-se-2nd-gen-64gb-black-gsm-unlocked": "apple-iphone-se-2nd-gen.jpg",
};

function fileFor(brandSlug: string, deviceSlug: string): string | null {
  if (SKU_ALIASES[deviceSlug]) return SKU_ALIASES[deviceSlug];
  if (brandSlug === "iphone") return `apple-${deviceSlug}.jpg`;
  if (brandSlug === "samsung") return `samsung-${deviceSlug}.jpg`;
  if (brandSlug === "google-phone") return `google-${deviceSlug}.jpg`;
  if (brandSlug === "oneplus") return `${deviceSlug}.jpg`;
  if (brandSlug === "motorola") return `motorola-${deviceSlug}.jpg`;
  return null;
}

async function main() {
  const imgDir = path.resolve("public/images/phones");
  const sql = postgres(process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL!, {
    prepare: false,
  });

  const rows = await sql<{ slug: string; brand_slug: string }[]>`
    select d.slug, b.slug as brand_slug
    from devices d
    join brands b on b.id = d.brand_id
    join categories c on c.id = b.category_id
    where c.slug = 'phone'
  `;

  let updated = 0;
  for (const row of rows) {
    const file = fileFor(row.brand_slug, row.slug);
    if (!file) continue;
    if (!fs.existsSync(path.join(imgDir, file))) {
      console.warn("missing", file, row.slug);
      continue;
    }
    const url = `/images/phones/${file}`;
    await sql`
      update devices
      set image_url = ${url}, updated_at = now()
      where slug = ${row.slug}
    `;
    updated += 1;
  }

  console.log(`Updated image_url on ${updated} phone devices`);
  await sql.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
