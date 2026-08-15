/**
 * Sync graphics-card device + brand image_url in Neon to local /images/gpus files.
 * Run: npx tsx --env-file=.env scripts/apply-gpu-images.ts
 */
import fs from "node:fs";
import path from "node:path";
import postgres from "postgres";

export function fileForGpu(deviceSlug: string): string | null {
  if (deviceSlug.startsWith("evga-xc3-ultra-geforce-rtx-3070")) return "evga-rtx-3070-xc3-ultra.jpg";
  if (deviceSlug.startsWith("evga-rtx-3080-ftw3")) return "evga-rtx-3080-ftw3.jpg";
  if (deviceSlug.startsWith("evga-rtx-3090-ftw3")) return "evga-rtx-3090-ftw3.jpg";
  if (deviceSlug.startsWith("asus-rog-xg-mobile-rtx-4090")) return "asus-rog-xg-mobile-rtx-4090.jpg";
  if (deviceSlug === "rtx-4090") return "nvidia-geforce-rtx-4090.jpg";
  if (deviceSlug === "rtx-4080-super") return "nvidia-geforce-rtx-4080-super.jpg";
  if (deviceSlug === "rtx-4070-ti-super") return "nvidia-geforce-rtx-4070-ti-super.jpg";
  if (deviceSlug === "rtx-4070-super") return "nvidia-geforce-rtx-4070-super.jpg";
  if (deviceSlug === "rtx-4060-ti") return "nvidia-geforce-rtx-4060-ti.jpg";
  if (deviceSlug === "rx-7900-xtx") return "amd-radeon-rx-7900-xtx.jpg";
  if (deviceSlug === "rx-7900-xt") return "amd-radeon-rx-7900-xt.jpg";
  if (deviceSlug === "rx-7800-xt") return "amd-radeon-rx-7800-xt.jpg";
  if (deviceSlug === "rx-7600") return "amd-radeon-rx-7600.jpg";
  return null;
}

export const GPU_BRANDS = new Set(["evga", "asus-gpu", "nvidia", "amd-gpu"]);

export const GPU_BRAND_IMAGES: Record<string, string> = {
  evga: "/images/gpus/evga-rtx-3090-ftw3.jpg",
  "asus-gpu": "/images/gpus/asus-rog-xg-mobile-rtx-4090.jpg",
  nvidia: "/images/gpus/nvidia-geforce-rtx-4090.jpg",
  "amd-gpu": "/images/gpus/amd-radeon-rx-7900-xtx.jpg",
};

async function main() {
  const imgDir = path.resolve("public/images/gpus");
  const sql = postgres(process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL!, {
    prepare: false,
  });

  const rows = await sql<{ slug: string; brand_slug: string }[]>`
    select d.slug, b.slug as brand_slug
    from devices d
    join brands b on b.id = d.brand_id
    join categories c on c.id = b.category_id
    where c.slug = 'graphics-card'
  `;

  let updated = 0;
  for (const row of rows) {
    if (!GPU_BRANDS.has(row.brand_slug)) continue;
    const file = fileForGpu(row.slug);
    if (!file) {
      console.warn("unmapped", row.slug);
      continue;
    }
    if (!fs.existsSync(path.join(imgDir, file))) {
      console.warn("missing", file, row.slug);
      continue;
    }
    const url = `/images/gpus/${file}`;
    await sql`
      update devices
      set image_url = ${url}, updated_at = now()
      where slug = ${row.slug}
    `;
    updated += 1;
  }

  let brandsUpdated = 0;
  for (const [slug, url] of Object.entries(GPU_BRAND_IMAGES)) {
    await sql`
      update brands
      set image_url = ${url}, updated_at = now()
      where slug = ${slug}
    `;
    brandsUpdated += 1;
  }

  console.log(`Updated image_url on ${updated} GPU devices`);
  console.log(`Updated image_url on ${brandsUpdated} GPU brands`);
  await sql.end();
}

if (process.argv[1]?.replace(/\\/g, "/").endsWith("apply-gpu-images.ts")) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
