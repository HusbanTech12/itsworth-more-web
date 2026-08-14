/**
 * Sync Laptop device + brand image_url in Neon to local /images/laptops files.
 * Run: npx tsx --env-file=.env scripts/apply-laptop-images.ts
 */
import fs from "node:fs";
import path from "node:path";
import postgres from "postgres";

const SKU_ALIASES: Record<string, string> = {
  "macbook-pro-16-2021-m1-pro-16gb-512gb-space-gray": "apple-macbook-pro-16-2021.jpg",
  "macbook-pro-16-2021-m1-pro-16gb-1tb-space-gray": "apple-macbook-pro-16-2021.jpg",
  "macbook-pro-16-2021-m1-pro-16gb-512gb-silver": "apple-macbook-pro-16-2021.jpg",
  "macbook-pro-16-2019-i7-16gb-512gb-space-gray": "apple-macbook-pro-16-2019.jpg",
  "macbook-pro-16-2019-i9-16gb-1tb-space-gray": "apple-macbook-pro-16-2019.jpg",
  "macbook-pro-16-2019-i7-16gb-512gb-silver": "apple-macbook-pro-16-2019.jpg",
  "macbook-air-13-2020-m1-8gb-256gb-space-gray": "apple-macbook-air-13-2020-m1.jpg",
  "macbook-pro-14-2021-m1-pro-16gb-512gb-space-gray": "apple-macbook-pro-14-2021.jpg",
  "macbook-pro-15-mid-2015-i7-16gb-256gb-silver": "apple-macbook-pro-15-2015.jpg",
  "macbook-pro-15-mid-2015-i7-2-5ghz-16gb-512gb-silver": "apple-macbook-pro-15-2015.jpg",
  "macbook-pro-13-touch-bar-2020-i5-16gb-512gb-space-gray": "apple-macbook-pro-13-2020-intel.jpg",
  "macbook-pro-13-touch-bar-2020-m1-8gb-256gb-space-gray": "apple-macbook-pro-13-2020-m1.jpg",
  "macbook-pro-13-touch-bar-2020-m1-16gb-1tb-space-gray": "apple-macbook-pro-13-2020-m1.jpg",
  "macbook-pro-13-touch-bar-2020-m1-8gb-512gb-space-gray": "apple-macbook-pro-13-2020-m1.jpg",
  "macbook-air-13-2020-i3-8gb-256gb-gold": "apple-macbook-air-13-2020-intel.jpg",
  "macbook-air-13-2020-i5-8gb-512gb-space-gray": "apple-macbook-air-13-2020-intel.jpg",
  "macbook-air-13-2018-i5-8gb-128gb-space-gray": "apple-macbook-air-13-2018.jpg",
  "macbook-pro-13-touch-bar-late-2016-i5-8gb-256gb-space-gray": "apple-macbook-pro-13-2016.jpg",
};

function fileFor(brandSlug: string, deviceSlug: string): string | null {
  if (SKU_ALIASES[deviceSlug]) return SKU_ALIASES[deviceSlug];
  if (brandSlug === "macbook") return `apple-${deviceSlug}.jpg`;
  if (brandSlug === "microsoft-laptop") return `microsoft-${deviceSlug}.jpg`;
  if (brandSlug === "samsung-laptop") return `samsung-${deviceSlug}.jpg`;
  if (
    brandSlug === "dell-laptop" ||
    brandSlug === "hp-laptop" ||
    brandSlug === "lenovo-laptop" ||
    brandSlug === "asus-laptop" ||
    brandSlug === "acer-laptop" ||
    brandSlug === "razer-laptop"
  ) {
    return `${deviceSlug}.jpg`;
  }
  return null;
}

async function main() {
  const imgDir = path.resolve("public/images/laptops");
  const sql = postgres(process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL!, {
    prepare: false,
  });

  const rows = await sql<{ slug: string; brand_slug: string }[]>`
    select d.slug, b.slug as brand_slug
    from devices d
    join brands b on b.id = d.brand_id
    join categories c on c.id = b.category_id
    where c.slug = 'laptop'
  `;

  let updated = 0;
  for (const row of rows) {
    const file = fileFor(row.brand_slug, row.slug);
    if (!file) continue;
    if (!fs.existsSync(path.join(imgDir, file))) {
      console.warn("missing", file, row.slug);
      continue;
    }
    const url = `/images/laptops/${file}`;
    await sql`
      update devices
      set image_url = ${url}, updated_at = now()
      where slug = ${row.slug}
    `;
    updated += 1;
  }

  const brandImages: Record<string, string> = {
    macbook: "/images/laptops/apple-macbook-pro-16-m4.jpg",
    "dell-laptop": "/images/laptops/dell-xps-16-2024.jpg",
    "hp-laptop": "/images/laptops/hp-spectre-x360-14.jpg",
    "lenovo-laptop": "/images/laptops/lenovo-thinkpad-x1-carbon-gen-12.jpg",
    "microsoft-laptop": "/images/laptops/microsoft-surface-laptop-7.jpg",
    "asus-laptop": "/images/laptops/asus-zenbook-14-oled.jpg",
    "acer-laptop": "/images/laptops/acer-swift-go-14.jpg",
    "samsung-laptop": "/images/laptops/samsung-galaxy-book6-pro.jpg",
    "razer-laptop": "/images/laptops/razer-blade-16.jpg",
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

  console.log(`Updated image_url on ${updated} laptop devices`);
  console.log(`Updated image_url on ${brandsUpdated} laptop brands`);
  await sql.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
