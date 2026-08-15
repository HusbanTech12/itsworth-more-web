/**
 * Sync audio device + brand image_url in Neon to local /images/audio files.
 * Run: npx tsx --env-file=.env scripts/apply-audio-images.ts
 */
import fs from "node:fs";
import path from "node:path";
import postgres from "postgres";

export function fileForAudio(deviceSlug: string): string | null {
  const map: Record<string, string> = {
    "airpods-max-2": "apple-airpods-max-2.jpg",
    "airpods-max": "apple-airpods-max.jpg",
    "airpods-pro-3": "apple-airpods-pro-3.jpg",
    "airpods-pro-2": "apple-airpods-pro-2.jpg",
    "airpods-4-anc": "apple-airpods-4.jpg",
    "airpods-4": "apple-airpods-4.jpg",
    "airpods-3": "apple-airpods-3.jpg",
    "homepod-2": "apple-homepod-2.jpg",
    "bose-qc-ultra-headphones-2": "bose-qc-ultra-headphones-2.jpg",
    "bose-qc-ultra-headphones": "bose-qc-ultra-headphones.jpg",
    "bose-qc-ultra-earbuds-2": "bose-qc-ultra-earbuds-2.jpg",
    "bose-qc-ultra-earbuds": "bose-qc-ultra-earbuds.jpg",
    "bose-ultra-open-earbuds": "bose-ultra-open-earbuds.jpg",
    "bose-qc-headphones-2023": "bose-qc-headphones-2023.jpg",
    "bose-soundlink-max": "bose-soundlink-max.jpg",
    "bose-portable-smart-speaker": "bose-portable-smart-speaker.jpg",
    "bose-soundlink-home": "bose-soundlink-home.jpg",
    "sony-wh-1000xm6": "sony-wh-1000xm6.jpg",
    "sony-wh-1000xm5": "sony-wh-1000xm5.jpg",
    "sony-wh-1000xm4": "sony-wh-1000xm4.jpg",
    "sony-wf-1000xm5": "sony-wf-1000xm5.jpg",
    "sony-wf-1000xm4": "sony-wf-1000xm4.jpg",
    "beats-studio-pro": "beats-studio-pro.jpg",
    "beats-solo-4": "beats-solo-4.jpg",
    "beats-fit-pro": "beats-fit-pro.jpg",
    "beats-studio-buds-plus": "beats-studio-buds-plus.jpg",
    "beats-powerbeats-pro-2": "beats-powerbeats-pro-2.jpg",
  };
  return map[deviceSlug] ?? null;
}

export const AUDIO_BRANDS = new Set(["apple-audio", "bose", "sony-audio", "beats"]);

export const AUDIO_BRAND_IMAGES: Record<string, string> = {
  "apple-audio": "/images/audio/apple-airpods-max-2.jpg",
  bose: "/images/audio/bose-qc-ultra-headphones-2.jpg",
  "sony-audio": "/images/audio/sony-wh-1000xm6.jpg",
  beats: "/images/audio/beats-studio-pro.jpg",
};

async function main() {
  const imgDir = path.resolve("public/images/audio");
  const sql = postgres(process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL!, {
    prepare: false,
  });

  const rows = await sql<{ slug: string; brand_slug: string }[]>`
    select d.slug, b.slug as brand_slug
    from devices d
    join brands b on b.id = d.brand_id
    join categories c on c.id = b.category_id
    where c.slug = 'audio'
  `;

  let updated = 0;
  for (const row of rows) {
    if (!AUDIO_BRANDS.has(row.brand_slug)) continue;
    const file = fileForAudio(row.slug);
    if (!file) {
      console.warn("unmapped", row.slug);
      continue;
    }
    if (!fs.existsSync(path.join(imgDir, file))) {
      console.warn("missing", file, row.slug);
      continue;
    }
    const url = `/images/audio/${file}`;
    await sql`
      update devices
      set image_url = ${url}, updated_at = now()
      where slug = ${row.slug}
    `;
    updated += 1;
  }

  let brandsUpdated = 0;
  for (const [slug, url] of Object.entries(AUDIO_BRAND_IMAGES)) {
    await sql`
      update brands
      set image_url = ${url}, updated_at = now()
      where slug = ${slug}
    `;
    brandsUpdated += 1;
  }

  console.log(`Updated image_url on ${updated} audio devices`);
  console.log(`Updated image_url on ${brandsUpdated} audio brands`);
  await sql.end();
}

if (process.argv[1]?.replace(/\\/g, "/").endsWith("apply-audio-images.ts")) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
