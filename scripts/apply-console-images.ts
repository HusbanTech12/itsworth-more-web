/**
 * Sync game-console device + brand image_url in Neon to local /images/consoles files.
 * Run: npx tsx --env-file=.env scripts/apply-console-images.ts
 */
import fs from "node:fs";
import path from "node:path";
import postgres from "postgres";

export function fileForConsole(deviceSlug: string): string | null {
  if (deviceSlug.startsWith("lenovo-legion-go-gen-2")) return "lenovo-legion-go-gen-2.jpg";
  if (deviceSlug.startsWith("lenovo-legion-go-s")) return "lenovo-legion-go-s.jpg";
  if (deviceSlug.startsWith("msi-claw-a8")) return "msi-claw-a8.jpg";
  if (deviceSlug.startsWith("msi-claw-8-ai")) return "msi-claw-8-ai.jpg";
  if (deviceSlug.startsWith("valve-steam-deck-oled")) return "valve-steam-deck-oled.jpg";
  if (deviceSlug.startsWith("asus-rog-xbox-ally-x")) return "asus-rog-xbox-ally-x.jpg";
  if (deviceSlug.startsWith("asus-rog-ally-x")) return "asus-rog-ally-x.jpg";
  if (deviceSlug.startsWith("sony-playstation-5-pro") || deviceSlug === "playstation-5-pro") {
    return "sony-playstation-5-pro.jpg";
  }
  if (deviceSlug === "playstation-5-slim") return "sony-playstation-5-slim.jpg";
  if (deviceSlug === "playstation-5-digital") return "sony-playstation-5-digital.jpg";
  if (deviceSlug === "playstation-5") return "sony-playstation-5.jpg";
  if (deviceSlug === "playstation-4-pro") return "sony-playstation-4-pro.jpg";
  if (deviceSlug === "playstation-4-slim") return "sony-playstation-4-slim.jpg";
  if (deviceSlug === "xbox-series-x") return "xbox-series-x.jpg";
  if (deviceSlug === "xbox-series-s") return "xbox-series-s.jpg";
  if (deviceSlug === "xbox-one-x") return "xbox-one-x.jpg";
  if (deviceSlug === "xbox-one-s") return "xbox-one-s.jpg";
  if (deviceSlug === "nintendo-switch-2") return "nintendo-switch-2.jpg";
  if (deviceSlug === "nintendo-switch-oled") return "nintendo-switch-oled.jpg";
  if (deviceSlug === "nintendo-switch-lite") return "nintendo-switch-lite.jpg";
  if (deviceSlug === "nintendo-switch") return "nintendo-switch.jpg";
  if (deviceSlug.startsWith("nintendo-new-3ds-xl")) return "nintendo-new-3ds-xl.jpg";
  return null;
}

export const CONSOLE_BRANDS = new Set(["lenovo", "msi", "valve", "asus", "sony", "nintendo", "xbox"]);

export const CONSOLE_BRAND_IMAGES: Record<string, string> = {
  lenovo: "/images/consoles/lenovo-legion-go-gen-2.jpg",
  msi: "/images/consoles/msi-claw-a8.jpg",
  valve: "/images/consoles/valve-steam-deck-oled.jpg",
  asus: "/images/consoles/asus-rog-ally-x.jpg",
  sony: "/images/consoles/sony-playstation-5.jpg",
  nintendo: "/images/consoles/nintendo-switch-2.jpg",
  xbox: "/images/consoles/xbox-series-x.jpg",
};

async function main() {
  const imgDir = path.resolve("public/images/consoles");
  const sql = postgres(process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL!, {
    prepare: false,
  });

  const rows = await sql<{ slug: string; brand_slug: string }[]>`
    select d.slug, b.slug as brand_slug
    from devices d
    join brands b on b.id = d.brand_id
    join categories c on c.id = b.category_id
    where c.slug = 'game-console'
  `;

  let updated = 0;
  for (const row of rows) {
    if (!CONSOLE_BRANDS.has(row.brand_slug)) continue;
    const file = fileForConsole(row.slug);
    if (!file) {
      console.warn("unmapped", row.slug);
      continue;
    }
    if (!fs.existsSync(path.join(imgDir, file))) {
      console.warn("missing", file, row.slug);
      continue;
    }
    const url = `/images/consoles/${file}`;
    await sql`
      update devices
      set image_url = ${url}, updated_at = now()
      where slug = ${row.slug}
    `;
    updated += 1;
  }

  let brandsUpdated = 0;
  for (const [slug, url] of Object.entries(CONSOLE_BRAND_IMAGES)) {
    await sql`
      update brands
      set image_url = ${url}, updated_at = now()
      where slug = ${slug}
    `;
    brandsUpdated += 1;
  }

  console.log(`Updated image_url on ${updated} console devices`);
  console.log(`Updated image_url on ${brandsUpdated} console brands`);
  await sql.end();
}

if (process.argv[1]?.replace(/\\/g, "/").endsWith("apply-console-images.ts")) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
