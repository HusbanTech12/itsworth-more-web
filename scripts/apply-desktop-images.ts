/**
 * Sync Desktop device + brand image_url in Neon to local /images/desktops files.
 * Run: npx tsx --env-file=.env scripts/apply-desktop-images.ts
 */
import fs from "node:fs";
import path from "node:path";
import postgres from "postgres";

export function fileForDesktop(deviceSlug: string): string {
  if (deviceSlug.startsWith("mac-mini-2024-m4-pro")) return "apple-mac-mini-2024-m4-pro.jpg";
  if (deviceSlug.startsWith("mac-mini-2024-m4")) return "apple-mac-mini-2024-m4.jpg";
  if (deviceSlug.startsWith("mac-mini-2023-m2-pro")) return "apple-mac-mini-2023-m2-pro.jpg";
  if (deviceSlug.startsWith("mac-mini-2023-m2")) return "apple-mac-mini-2023-m2.jpg";
  if (deviceSlug.startsWith("mac-mini-2020-m1")) return "apple-mac-mini-2020-m1.jpg";
  if (deviceSlug.startsWith("mac-mini-2018")) return "apple-mac-mini-2018.jpg";
  if (deviceSlug.startsWith("imac-24-2021")) return "apple-imac-24-2021.jpg";
  return `apple-${deviceSlug}.jpg`;
}

const DESKTOP_BRANDS = new Set(["mac-mini", "imac", "mac-studio", "mac-pro"]);

async function main() {
  const imgDir = path.resolve("public/images/desktops");
  const sql = postgres(process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL!, {
    prepare: false,
  });

  const rows = await sql<{ slug: string; brand_slug: string }[]>`
    select d.slug, b.slug as brand_slug
    from devices d
    join brands b on b.id = d.brand_id
    join categories c on c.id = b.category_id
    where c.slug = 'desktop'
  `;

  let updated = 0;
  for (const row of rows) {
    if (!DESKTOP_BRANDS.has(row.brand_slug)) continue;
    const file = fileForDesktop(row.slug);
    if (!fs.existsSync(path.join(imgDir, file))) {
      console.warn("missing", file, row.slug);
      continue;
    }
    const url = `/images/desktops/${file}`;
    await sql`
      update devices
      set image_url = ${url}, updated_at = now()
      where slug = ${row.slug}
    `;
    updated += 1;
  }

  const brandImages: Record<string, string> = {
    "mac-mini": "/images/desktops/apple-mac-mini-2024-m4.jpg",
    imac: "/images/desktops/apple-imac-24-m4.jpg",
    "mac-studio": "/images/desktops/apple-mac-studio-m4-max.jpg",
    "mac-pro": "/images/desktops/apple-mac-pro-m2-ultra.jpg",
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

  console.log(`Updated image_url on ${updated} desktop devices`);
  console.log(`Updated image_url on ${brandsUpdated} desktop brands`);
  await sql.end();
}

if (process.argv[1]?.replace(/\\/g, "/").endsWith("apply-desktop-images.ts")) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
