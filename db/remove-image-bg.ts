import postgres from "postgres";
import { existsSync, mkdirSync } from "fs";
import { readFile, writeFile } from "fs/promises";
import path from "path";
import sharp from "sharp";
import { removeBackground } from "@imgly/background-removal-node";

/**
 * One-time batch: put catalog images on a clean white background.
 *
 * Install once locally (not needed on Vercel):
 *   npm install -D @imgly/background-removal-node sharp
 *
 *   npx tsx --env-file=.env db/remove-image-bg.ts                 # all devices
 *   npx tsx --env-file=.env db/remove-image-bg.ts --table=brands  # all brands
 *   npx tsx --env-file=.env db/remove-image-bg.ts --limit=5
 *   npx tsx --env-file=.env db/remove-image-bg.ts --slug=iphone-17-pro-max
 *
 * Removes the original background, composites onto pure white, saves WebP to
 * public/images/<table>/whitebg/<slug>.webp and updates <table>.image_url.
 * Remote image URLs are downloaded first. Originals are never touched;
 * re-runs skip finished rows.
 */

const args = process.argv.slice(2);
const table = args.find((a) => a.startsWith("--table="))?.split("=")[1] === "brands"
  ? "brands"
  : "devices";
const OUT_DIR = path.join(process.cwd(), "public", "images", table, "whitebg");

async function loadSource(
  imageUrl: string,
): Promise<{ buf: Buffer; mime: string } | null> {
  if (imageUrl.startsWith("http")) {
    const res = await fetch(imageUrl);
    if (!res.ok) return null;
    const mime = res.headers.get("content-type")?.split(";")[0] || "image/jpeg";
    return { buf: Buffer.from(await res.arrayBuffer()), mime };
  }
  // catalogSrc() serves the .webp sibling for local .jpg catalog images
  const candidates =
    imageUrl.endsWith(".jpg") || imageUrl.endsWith(".jpeg")
      ? [imageUrl.replace(/\.jpe?g$/i, ".webp"), imageUrl]
      : [imageUrl];
  for (const rel of candidates) {
    const abs = path.join(process.cwd(), "public", rel);
    if (existsSync(abs)) {
      return {
        buf: await readFile(abs),
        mime: abs.endsWith(".webp") ? "image/webp" : "image/jpeg",
      };
    }
  }
  return null;
}

async function main() {
  const limitArg = args.find((a) => a.startsWith("--limit="));
  const slugArg = args.find((a) => a.startsWith("--slug="));
  const limit = limitArg ? Number(limitArg.split("=")[1]) : null;
  const onlySlug = slugArg ? slugArg.split("=")[1] : null;

  mkdirSync(OUT_DIR, { recursive: true });

  const sql = postgres(process.env.DATABASE_URL!, { prepare: false });
  const whitebgLike = `/images/${table}/whitebg/%`;
  const rows = await sql<{ id: number; slug: string; image_url: string }[]>`
    select id, slug, image_url from ${sql(table)}
    where image_url is not null
      and image_url not like ${whitebgLike}
      ${onlySlug ? sql`and slug = ${onlySlug}` : sql``}
    order by id
    ${limit ? sql`limit ${limit}` : sql``}
  `;
  console.log(`Processing ${rows.length} ${table} images...`);

  let done = 0;
  let failed = 0;
  for (const d of rows) {
    const outAbs = path.join(OUT_DIR, `${d.slug}.webp`);
    const outRel = `/images/${table}/whitebg/${d.slug}.webp`;
    try {
      if (existsSync(outAbs)) {
        await sql`update ${sql(table)} set image_url = ${outRel} where id = ${d.id} and image_url not like ${whitebgLike}`;
        done++;
        continue;
      }
      const src = await loadSource(d.image_url);
      if (!src) {
        console.log(`  [skip] ${d.slug}: source unavailable (${d.image_url})`);
        failed++;
        continue;
      }
      const blob = await removeBackground(
        new Blob([new Uint8Array(src.buf)], { type: src.mime }),
      );
      const transparentPng = Buffer.from(await blob.arrayBuffer());
      const whiteBgWebp = await sharp(transparentPng)
        .flatten({ background: "#ffffff" })
        .webp({ quality: 90 })
        .toBuffer();
      await writeFile(outAbs, whiteBgWebp);
      await sql`update ${sql(table)} set image_url = ${outRel} where id = ${d.id}`;
      done++;
      if (done % 10 === 0) console.log(`  ${done}/${rows.length} done`);
    } catch (e) {
      failed++;
      console.log(`  [fail] ${d.slug}: ${e instanceof Error ? e.message : e}`);
    }
  }

  console.log(`\nFinished: ${done} processed, ${failed} failed/skipped`);
  await sql.end();
  process.exit(0);
}

main();
