/**
 * Idempotent catalog expansion (products_add.md Steps 3–6).
 * Adds missing brands/models only. Does NOT truncate.
 * Images: null (no image pipeline yet — see products_add.md Step 5).
 *
 * Run: npx tsx --env-file=.env scripts/seed-catalog-expansion.ts
 */
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { eq } from "drizzle-orm";
import * as schema from "../db/schema";

const sql = postgres(process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL!, {
  prepare: false,
});
const db = drizzle(sql, { schema });

type CondMap = Record<string, number>;

interface DevSpec {
  slug: string;
  name: string;
  /** Max cash-up-to in dollars (placeholder market estimates — not competitor scrape) */
  maxDollars: number;
}

interface BrandSpec {
  slug: string;
  name: string;
  categorySlug: string;
  devices: DevSpec[];
}

function tiers(maxCents: number): CondMap {
  return {
    "brand-new": Math.round(maxCents * 1.05),
    flawless: maxCents,
    "very-good": Math.round(maxCents * 0.88),
    good: Math.round(maxCents * 0.75),
    fair: Math.round(maxCents * 0.55),
    broken: Math.round(maxCents * 0.25),
  };
}

/**
 * Structural naming reference from trade-in industry categories.
 * Prices are rounded placeholder estimates for admin tuning — not copied verbatim.
 */
export const expansionCatalog: BrandSpec[] = [
  // ── Audio (empty category) ──
  {
    slug: "apple-audio",
    name: "Apple",
    categorySlug: "audio",
    devices: [
      { slug: "airpods-max-2", name: "AirPods Max 2", maxDollars: 260 },
      { slug: "airpods-max", name: "AirPods Max", maxDollars: 200 },
      { slug: "airpods-pro-3", name: "AirPods Pro 3", maxDollars: 75 },
      { slug: "airpods-pro-2", name: "AirPods Pro (2nd Gen.)", maxDollars: 55 },
      { slug: "airpods-4-anc", name: "AirPods (4th Gen.) ANC", maxDollars: 50 },
      { slug: "airpods-4", name: "AirPods (4th Gen.)", maxDollars: 35 },
      { slug: "airpods-3", name: "AirPods (3rd Gen.)", maxDollars: 28 },
      { slug: "homepod-2", name: "HomePod (2nd Gen.)", maxDollars: 135 },
    ],
  },
  {
    slug: "bose",
    name: "Bose",
    categorySlug: "audio",
    devices: [
      { slug: "bose-qc-ultra-headphones-2", name: "Bose QuietComfort Ultra Headphones (2nd Gen)", maxDollars: 200 },
      { slug: "bose-qc-ultra-headphones", name: "Bose QuietComfort Ultra Headphones", maxDollars: 105 },
      { slug: "bose-qc-ultra-earbuds-2", name: "Bose QuietComfort Ultra Earbuds (2nd Gen)", maxDollars: 95 },
      { slug: "bose-qc-ultra-earbuds", name: "Bose QuietComfort Ultra Earbuds", maxDollars: 48 },
      { slug: "bose-ultra-open-earbuds", name: "Bose Ultra Open Earbuds", maxDollars: 55 },
      { slug: "bose-qc-headphones-2023", name: "Bose QuietComfort Headphones (2023)", maxDollars: 48 },
      { slug: "bose-soundlink-max", name: "Bose SoundLink Max Portable Speaker", maxDollars: 140 },
      { slug: "bose-portable-smart-speaker", name: "Bose Portable Smart Speaker", maxDollars: 115 },
      { slug: "bose-soundlink-home", name: "Bose SoundLink Home Bluetooth Speaker", maxDollars: 60 },
    ],
  },
  {
    slug: "sony-audio",
    name: "Sony",
    categorySlug: "audio",
    devices: [
      { slug: "sony-wh-1000xm6", name: "Sony WH-1000XM6", maxDollars: 185 },
      { slug: "sony-wh-1000xm5", name: "Sony WH-1000XM5", maxDollars: 95 },
      { slug: "sony-wh-1000xm4", name: "Sony WH-1000XM4", maxDollars: 70 },
      { slug: "sony-wf-1000xm5", name: "Sony WF-1000XM5", maxDollars: 85 },
      { slug: "sony-wf-1000xm4", name: "Sony WF-1000XM4", maxDollars: 55 },
    ],
  },
  {
    slug: "beats",
    name: "Beats",
    categorySlug: "audio",
    devices: [
      { slug: "beats-studio-pro", name: "Beats Studio Pro", maxDollars: 120 },
      { slug: "beats-solo-4", name: "Beats Solo 4", maxDollars: 70 },
      { slug: "beats-fit-pro", name: "Beats Fit Pro", maxDollars: 55 },
      { slug: "beats-studio-buds-plus", name: "Beats Studio Buds +", maxDollars: 45 },
      { slug: "beats-powerbeats-pro-2", name: "Beats Powerbeats Pro 2", maxDollars: 90 },
    ],
  },

  // ── VR (empty category) ──
  {
    slug: "meta-vr",
    name: "Meta",
    categorySlug: "vr",
    devices: [
      { slug: "meta-quest-3s", name: "Meta Quest 3S", maxDollars: 180 },
      { slug: "meta-quest-3", name: "Meta Quest 3", maxDollars: 280 },
      { slug: "meta-quest-2", name: "Meta Quest 2", maxDollars: 90 },
      { slug: "meta-quest-pro", name: "Meta Quest Pro", maxDollars: 350 },
    ],
  },
  {
    slug: "apple-vr",
    name: "Apple",
    categorySlug: "vr",
    devices: [
      { slug: "apple-vision-pro-m5", name: "Apple Vision Pro (M5)", maxDollars: 2400 },
      { slug: "apple-vision-pro", name: "Apple Vision Pro", maxDollars: 1600 },
    ],
  },
  {
    slug: "valve-vr",
    name: "Valve",
    categorySlug: "vr",
    devices: [{ slug: "valve-index", name: "Valve Index", maxDollars: 500 }],
  },
  {
    slug: "sony-vr",
    name: "Sony",
    categorySlug: "vr",
    devices: [
      { slug: "playstation-vr2", name: "PlayStation VR2", maxDollars: 140 },
      { slug: "playstation-vr", name: "PlayStation VR", maxDollars: 50 },
    ],
  },
  {
    slug: "vive",
    name: "Vive",
    categorySlug: "vr",
    devices: [
      { slug: "vive-xr-elite", name: "Vive XR Elite", maxDollars: 450 },
      { slug: "vive-pro-2", name: "Vive Pro 2", maxDollars: 270 },
    ],
  },

  // ── Fill empty phone brands ──
  {
    slug: "oneplus",
    name: "OnePlus",
    categorySlug: "phone",
    devices: [
      { slug: "oneplus-13", name: "OnePlus 13", maxDollars: 520 },
      { slug: "oneplus-13r", name: "OnePlus 13R", maxDollars: 320 },
      { slug: "oneplus-12", name: "OnePlus 12", maxDollars: 380 },
      { slug: "oneplus-12r", name: "OnePlus 12R", maxDollars: 240 },
      { slug: "oneplus-open", name: "OnePlus Open", maxDollars: 550 },
      { slug: "oneplus-nord-4", name: "OnePlus Nord 4", maxDollars: 180 },
    ],
  },
  {
    slug: "motorola",
    name: "Motorola",
    categorySlug: "phone",
    devices: [
      { slug: "moto-razr-plus-2024", name: "Motorola Razr+ (2024)", maxDollars: 420 },
      { slug: "moto-razr-2024", name: "Motorola Razr (2024)", maxDollars: 280 },
      { slug: "moto-edge-50-ultra", name: "Motorola Edge 50 Ultra", maxDollars: 350 },
      { slug: "moto-edge-50-pro", name: "Motorola Edge 50 Pro", maxDollars: 250 },
      { slug: "moto-g-power-2025", name: "Motorola G Power (2025)", maxDollars: 90 },
      { slug: "moto-g-stylus-2024", name: "Motorola G Stylus (2024)", maxDollars: 85 },
    ],
  },

  // ── Fill empty tablet brand ──
  {
    slug: "samsung-tablet",
    name: "Samsung Tablet",
    categorySlug: "tablet",
    devices: [
      { slug: "galaxy-tab-s10-ultra", name: "Galaxy Tab S10 Ultra", maxDollars: 600 },
      { slug: "galaxy-tab-s10-plus", name: "Galaxy Tab S10+", maxDollars: 470 },
      { slug: "galaxy-tab-s10-fe", name: "Galaxy Tab S10 FE", maxDollars: 220 },
      { slug: "galaxy-tab-s9-ultra", name: "Galaxy Tab S9 Ultra", maxDollars: 500 },
      { slug: "galaxy-tab-s9-plus", name: "Galaxy Tab S9+", maxDollars: 380 },
      { slug: "galaxy-tab-s9", name: "Galaxy Tab S9", maxDollars: 260 },
      { slug: "galaxy-tab-s9-fe", name: "Galaxy Tab S9 FE", maxDollars: 170 },
      { slug: "galaxy-tab-s8-ultra", name: "Galaxy Tab S8 Ultra", maxDollars: 320 },
      { slug: "galaxy-tab-s8-plus", name: "Galaxy Tab S8+", maxDollars: 300 },
      { slug: "galaxy-tab-s8", name: "Galaxy Tab S8", maxDollars: 220 },
    ],
  },

  // ── Expand Apple Watch ──
  {
    slug: "apple-watch",
    name: "Apple Watch",
    categorySlug: "smart-watch",
    devices: [
      { slug: "apple-watch-series-10-46mm", name: "Apple Watch Series 10 46mm", maxDollars: 280 },
      { slug: "apple-watch-series-10-42mm", name: "Apple Watch Series 10 42mm", maxDollars: 250 },
      { slug: "apple-watch-ultra-2", name: "Apple Watch Ultra 2", maxDollars: 450 },
      { slug: "apple-watch-series-9-45mm", name: "Apple Watch Series 9 45mm", maxDollars: 200 },
      { slug: "apple-watch-series-9-41mm", name: "Apple Watch Series 9 41mm", maxDollars: 180 },
      { slug: "apple-watch-se-2-44mm", name: "Apple Watch SE (2nd Gen.) 44mm", maxDollars: 110 },
      { slug: "apple-watch-se-2-40mm", name: "Apple Watch SE (2nd Gen.) 40mm", maxDollars: 95 },
    ],
  },

  // ── New smartwatch brand ──
  {
    slug: "samsung-watch",
    name: "Samsung Galaxy Watch",
    categorySlug: "smart-watch",
    devices: [
      { slug: "galaxy-watch-ultra-2025", name: "Galaxy Watch Ultra (2025)", maxDollars: 190 },
      { slug: "galaxy-watch8-classic", name: "Galaxy Watch8 Classic", maxDollars: 140 },
      { slug: "galaxy-watch8", name: "Galaxy Watch8", maxDollars: 105 },
      { slug: "galaxy-watch-ultra", name: "Galaxy Watch Ultra", maxDollars: 120 },
      { slug: "galaxy-watch7", name: "Galaxy Watch7", maxDollars: 55 },
      { slug: "galaxy-watch6-classic", name: "Galaxy Watch6 Classic", maxDollars: 90 },
      { slug: "galaxy-watch6", name: "Galaxy Watch6", maxDollars: 70 },
    ],
  },
];

/** Near-duplicates flagged for manual review (not inserted) */
export const flaggedNearDuplicates = [
  {
    existing: "apple-watch-ultra-3-49mm-black-unlocked-64gb",
    proposed: "apple-watch-ultra-2",
    note: "Ultra 3 SKU already exists; Ultra 2 is a distinct generation — added. Confirm naming consistency.",
  },
  {
    existing: "sony (game-console) / sony-camera / sony-audio / sony-vr",
    proposed: "Multiple Sony brand slugs by category",
    note: "Intentional — brand.slug is globally unique in schema.",
  },
];

async function getCategoryId(slug: string): Promise<number> {
  const [cat] = await db
    .select()
    .from(schema.categories)
    .where(eq(schema.categories.slug, slug))
    .limit(1);
  if (!cat) throw new Error(`Category missing: ${slug}`);
  return cat.id;
}

async function main() {
  console.log("Catalog expansion (idempotent, images=null)...\n");

  const stats = {
    brandsAdded: 0,
    brandsSkipped: 0,
    devicesAdded: 0,
    devicesSkipped: 0,
    pricesWritten: 0,
    byCategory: {} as Record<string, { brands: number; devices: number }>,
  };

  for (const [bi, brand] of expansionCatalog.entries()) {
    const categoryId = await getCategoryId(brand.categorySlug);
    if (!stats.byCategory[brand.categorySlug]) {
      stats.byCategory[brand.categorySlug] = { brands: 0, devices: 0 };
    }

    const existingBrand = await db
      .select()
      .from(schema.brands)
      .where(eq(schema.brands.slug, brand.slug))
      .limit(1);

    let brandId: number;
    if (existingBrand[0]) {
      brandId = existingBrand[0].id;
      stats.brandsSkipped++;
      console.log(`  skip brand: ${brand.name} (${brand.slug})`);
    } else {
      const [inserted] = await db
        .insert(schema.brands)
        .values({
          categoryId,
          slug: brand.slug,
          name: brand.name,
          imageUrl: null,
          sortOrder: 200 + bi,
          isActive: true,
        })
        .returning();
      brandId = inserted.id;
      stats.brandsAdded++;
      stats.byCategory[brand.categorySlug].brands++;
      console.log(`  + brand: ${brand.name} (${brand.slug})`);
    }

    for (const [di, device] of brand.devices.entries()) {
      const existingDev = await db
        .select()
        .from(schema.devices)
        .where(eq(schema.devices.slug, device.slug))
        .limit(1);

      if (existingDev[0]) {
        stats.devicesSkipped++;
        continue;
      }

      const maxQuoteCents = Math.round(device.maxDollars * 100);
      const [inserted] = await db
        .insert(schema.devices)
        .values({
          brandId,
          slug: device.slug,
          name: device.name,
          imageUrl: null,
          maxQuoteCents,
          sortOrder: di,
          isActive: true,
        })
        .returning();

      const priceRows = Object.entries(tiers(maxQuoteCents)).map(([conditionSlug, priceCents]) => ({
        deviceId: inserted.id,
        conditionSlug,
        priceCents,
        isActive: true,
      }));
      await db.insert(schema.devicePrices).values(priceRows);

      stats.devicesAdded++;
      stats.pricesWritten += priceRows.length;
      stats.byCategory[brand.categorySlug].devices++;
    }
  }

  console.log("\n=== SUMMARY ===");
  console.log(`Brands added: ${stats.brandsAdded} (skipped existing: ${stats.brandsSkipped})`);
  console.log(`Devices added: ${stats.devicesAdded} (skipped existing: ${stats.devicesSkipped})`);
  console.log(`Prices written: ${stats.pricesWritten}`);
  console.log("\nPer category (newly added this run):");
  for (const [cat, s] of Object.entries(stats.byCategory)) {
    console.log(`  ${cat}: +${s.brands} brands, +${s.devices} devices`);
  }

  console.log("\n=== FLAGGED FOR REVIEW ===");
  for (const f of flaggedNearDuplicates) {
    console.log(`  - ${f.note}`);
    console.log(`    existing: ${f.existing}`);
    console.log(`    proposed: ${f.proposed}`);
  }

  const totals = await sql.unsafe(`
    select
      (select count(*)::int from brands) as brands,
      (select count(*)::int from devices) as devices
  `);
  console.log(`\nDB totals now: ${totals[0].brands} brands, ${totals[0].devices} devices`);

  await sql.end();
}

if (process.argv.some((a) => a.includes("seed-catalog-expansion"))) {
  main().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}
