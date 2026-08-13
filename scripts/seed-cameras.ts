/**
 * Seed Camera category: 9 brands + models + condition prices into Neon.
 * Does NOT truncate existing data.
 *
 * Run: npx tsx --env-file=.env scripts/seed-cameras.ts
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

interface CamDevice {
  slug: string;
  name: string;
  imageUrl: string;
  maxQuoteCents: number;
  prices: CondMap;
}

interface CamBrand {
  slug: string;
  name: string;
  imageUrl: string;
  devices: CamDevice[];
}

function tiers(max: number): CondMap {
  return {
    flawless: max,
    "very-good": Math.round(max * 0.88),
    good: Math.round(max * 0.75),
    fair: Math.round(max * 0.55),
    broken: Math.round(max * 0.25),
  };
}

function d(
  slug: string,
  name: string,
  imageUrl: string,
  maxDollars: number,
): CamDevice {
  const maxQuoteCents = Math.round(maxDollars * 100);
  return { slug, name, imageUrl, maxQuoteCents, prices: tiers(maxQuoteCents) };
}

/** Professional camera / action-cam Unsplash images (unique per brand/model) */
const IMG = {
  nikonBrand: "https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=200&q=80&fit=crop&auto=format",
  canonBrand: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=200&q=80&fit=crop&auto=format",
  sonyBrand: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=200&q=80&fit=crop&auto=format",
  leicaBrand: "https://images.unsplash.com/photo-1495704907340-23e14c3b68cb?w=200&q=80&fit=crop&auto=format",
  fujiBrand: "https://images.unsplash.com/photo-1616423640778-28cb5eda7f0d?w=200&q=80&fit=crop&auto=format",
  panasonicBrand: "https://images.unsplash.com/photo-1581591524425-c7e097886c91?w=200&q=80&fit=crop&auto=format",
  olympusBrand: "https://images.unsplash.com/photo-1452780212940-6f5c0d14d848?w=200&q=80&fit=crop&auto=format",
  goproBrand: "https://images.unsplash.com/photo-1564466809058-bf4114d55352?w=200&q=80&fit=crop&auto=format",
  djiBrand: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=200&q=80&fit=crop&auto=format",

  cam1: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=300&q=80&fit=crop&auto=format",
  cam2: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=300&q=80&fit=crop&auto=format",
  cam3: "https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=300&q=80&fit=crop&auto=format",
  cam4: "https://images.unsplash.com/photo-1495704907340-23e14c3b68cb?w=300&q=80&fit=crop&auto=format",
  cam5: "https://images.unsplash.com/photo-1616423640778-28cb5eda7f0d?w=300&q=80&fit=crop&auto=format",
  cam6: "https://images.unsplash.com/photo-1581591524425-c7e097886c91?w=300&q=80&fit=crop&auto=format",
  cam7: "https://images.unsplash.com/photo-1452780212940-6f5c0d14d848?w=300&q=80&fit=crop&auto=format",
  cam8: "https://images.unsplash.com/photo-1484704849700-f032a97bd089?w=300&q=80&fit=crop&auto=format",
  cam9: "https://images.unsplash.com/photo-1471341971476-ae15ff2c041f?w=300&q=80&fit=crop&auto=format",
  cam10: "https://images.unsplash.com/photo-1510127034890-ba248b9c5f9c?w=300&q=80&fit=crop&auto=format",
  cam11: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=300&q=80&fit=crop&auto=format",
  cam12: "https://images.unsplash.com/photo-1554048612-b6a482bc67e5?w=300&q=80&fit=crop&auto=format",
  action1: "https://images.unsplash.com/photo-1564466809058-bf4114d55352?w=300&q=80&fit=crop&auto=format",
  action2: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=300&q=80&fit=crop&auto=format",
  action3: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&q=80&fit=crop&auto=format",
  action4: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&q=80&fit=crop&auto=format",
  action5: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=300&q=80&fit=crop&auto=format",
};

/** Matching ItsWorthMore camera brands: Nikon, Canon, Sony, Leica, Fujifilm, Panasonic, Olympus, GoPro, DJI */
export const cameraBrands: CamBrand[] = [
  {
    slug: "nikon",
    name: "Nikon",
    imageUrl: IMG.nikonBrand,
    devices: [
      d("nikon-z8", "Nikon Z8", IMG.cam3, 2800),
      d("nikon-z6-iii", "Nikon Z6 III", IMG.cam1, 1800),
      d("nikon-z5-ii", "Nikon Z5 II", IMG.cam2, 1100),
      d("nikon-z50-ii", "Nikon Z50 II", IMG.cam5, 750),
      d("nikon-d850", "Nikon D850", IMG.cam8, 1200),
      d("nikon-d780", "Nikon D780", IMG.cam9, 900),
      d("nikon-d7500", "Nikon D7500", IMG.cam10, 450),
    ],
  },
  {
    slug: "canon",
    name: "Canon",
    imageUrl: IMG.canonBrand,
    devices: [
      d("canon-eos-r5-mark-ii", "Canon EOS R5 Mark II", IMG.cam1, 3200),
      d("canon-eos-r6-mark-ii", "Canon EOS R6 Mark II", IMG.cam2, 1800),
      d("canon-eos-r8", "Canon EOS R8", IMG.cam3, 1200),
      d("canon-eos-r50", "Canon EOS R50", IMG.cam5, 650),
      d("canon-eos-5d-mark-iv", "Canon EOS 5D Mark IV", IMG.cam8, 900),
      d("canon-eos-90d", "Canon EOS 90D", IMG.cam9, 700),
      d("canon-powershot-g7x-iii", "Canon PowerShot G7 X Mark III", IMG.cam11, 450),
    ],
  },
  {
    // "sony" slug already used for PlayStation — use sony-camera
    slug: "sony-camera",
    name: "Sony",
    imageUrl: IMG.sonyBrand,
    devices: [
      d("sony-a7r-v", "Sony A7R V", IMG.cam2, 3200),
      d("sony-a7-iv", "Sony A7 IV", IMG.cam1, 2000),
      d("sony-a7c-ii", "Sony A7C II", IMG.cam3, 1600),
      d("sony-a6700", "Sony A6700", IMG.cam5, 1100),
      d("sony-zv-e10-ii", "Sony ZV-E10 II", IMG.cam6, 750),
      d("sony-rx100-vii", "Sony RX100 VII", IMG.cam11, 800),
      d("sony-a6400", "Sony A6400", IMG.cam10, 700),
    ],
  },
  {
    slug: "leica",
    name: "Leica",
    imageUrl: IMG.leicaBrand,
    devices: [
      d("leica-m11", "Leica M11", IMG.cam4, 4800),
      d("leica-q3", "Leica Q3", IMG.cam4, 3800),
      d("leica-sl3", "Leica SL3", IMG.cam1, 4000),
      d("leica-d-lux-8", "Leica D-Lux 8", IMG.cam11, 1200),
      d("leica-cl", "Leica CL", IMG.cam8, 900),
    ],
  },
  {
    slug: "fujifilm",
    name: "Fujifilm",
    imageUrl: IMG.fujiBrand,
    devices: [
      d("fujifilm-x100vi", "Fujifilm X100VI", IMG.cam5, 1600),
      d("fujifilm-x-t5", "Fujifilm X-T5", IMG.cam1, 1400),
      d("fujifilm-x-t50", "Fujifilm X-T50", IMG.cam2, 900),
      d("fujifilm-x-s20", "Fujifilm X-S20", IMG.cam3, 800),
      d("fujifilm-gfx100s-ii", "Fujifilm GFX 100S II", IMG.cam8, 3500),
      d("fujifilm-x-h2", "Fujifilm X-H2", IMG.cam9, 1500),
    ],
  },
  {
    slug: "panasonic",
    name: "Panasonic",
    imageUrl: IMG.panasonicBrand,
    devices: [
      d("panasonic-lumix-s5-ii", "Panasonic Lumix S5 II", IMG.cam6, 1500),
      d("panasonic-lumix-gh6", "Panasonic Lumix GH6", IMG.cam1, 1200),
      d("panasonic-lumix-g9-ii", "Panasonic Lumix G9 II", IMG.cam2, 1300),
      d("panasonic-lumix-s9", "Panasonic Lumix S9", IMG.cam3, 1000),
      d("panasonic-lumix-gh5-ii", "Panasonic Lumix GH5 II", IMG.cam10, 850),
    ],
  },
  {
    slug: "olympus",
    name: "Olympus",
    imageUrl: IMG.olympusBrand,
    devices: [
      d("olympus-om-1-mark-ii", "Olympus OM-1 Mark II", IMG.cam7, 1600),
      d("olympus-om-5", "Olympus OM-5", IMG.cam1, 700),
      d("olympus-e-m1-mark-iii", "Olympus E-M1 Mark III", IMG.cam2, 800),
      d("olympus-pen-f", "Olympus PEN-F", IMG.cam5, 450),
      d("olympus-e-m10-mark-iv", "Olympus E-M10 Mark IV", IMG.cam10, 400),
    ],
  },
  {
    slug: "gopro",
    name: "GoPro",
    imageUrl: IMG.goproBrand,
    devices: [
      // Prices aligned with ItsWorthMore /sell/gopro
      d("gopro-max2", "GoPro Max2", IMG.action1, 205),
      d("gopro-hero-13-black", "GoPro Hero 13 Black", IMG.action2, 150),
      d("gopro-hero-12-black", "GoPro Hero 12 Black", IMG.action3, 150),
      d("gopro-hero-11-black", "GoPro Hero 11 Black", IMG.action1, 110),
      d("gopro-hero-11-black-mini", "GoPro Hero 11 Black Mini", IMG.action4, 80),
      d("gopro-hero-10-black", "GoPro Hero 10 Black", IMG.action2, 100),
      d("gopro-hero-9-black", "GoPro Hero 9 Black", IMG.action3, 95),
      d("gopro-max", "GoPro Max", IMG.action1, 110),
      d("gopro-hero-8-black", "GoPro Hero 8 Black", IMG.action5, 80),
      d("gopro-hero-7", "GoPro Hero 7", IMG.action2, 35),
      d("gopro-hero-6-black", "GoPro Hero 6 Black", IMG.action3, 25),
      d("gopro-hero-5", "GoPro Hero 5", IMG.action4, 20),
    ],
  },
  {
    // "dji" slug already used for drones — use dji-camera
    slug: "dji-camera",
    name: "DJI",
    imageUrl: IMG.djiBrand,
    devices: [
      // Prices aligned with ItsWorthMore /sell/dji-camera
      d("dji-osmo-action-6", "DJI Osmo Action 6", IMG.action2, 210),
      d("dji-osmo-pocket-3", "DJI Osmo Pocket 3", IMG.action1, 240),
      d("dji-osmo-action-5-pro", "DJI Osmo Action 5 Pro", IMG.action3, 120),
      d("dji-osmo-action-4", "DJI Osmo Action 4", IMG.action4, 90),
      d("dji-osmo-action-3", "DJI Osmo Action 3", IMG.action5, 70),
    ],
  },
];

async function main() {
  console.log("Seeding Camera brands + devices (no truncate)...\n");

  const [cat] = await db
    .select()
    .from(schema.categories)
    .where(eq(schema.categories.slug, "camera"))
    .limit(1);

  if (!cat) {
    throw new Error('Category "camera" not found — run full seed first');
  }

  let brandCount = 0;
  let deviceCount = 0;
  let priceCount = 0;

  for (const [bi, brand] of cameraBrands.entries()) {
    const existingBrand = await db
      .select()
      .from(schema.brands)
      .where(eq(schema.brands.slug, brand.slug))
      .limit(1);

    let brandId: number;
    if (existingBrand[0]) {
      brandId = existingBrand[0].id;
      await db
        .update(schema.brands)
        .set({
          name: brand.name,
          imageUrl: brand.imageUrl,
          categoryId: cat.id,
          isActive: true,
          updatedAt: new Date(),
        })
        .where(eq(schema.brands.id, brandId));
      console.log(`  Brand exists: ${brand.name} (#${brandId})`);
    } else {
      const [inserted] = await db
        .insert(schema.brands)
        .values({
          categoryId: cat.id,
          slug: brand.slug,
          name: brand.name,
          imageUrl: brand.imageUrl,
          sortOrder: 100 + bi,
          isActive: true,
        })
        .returning();
      brandId = inserted.id;
      brandCount++;
      console.log(`  + Brand: ${brand.name} (#${brandId})`);
    }

    for (const [di, device] of brand.devices.entries()) {
      const existingDev = await db
        .select()
        .from(schema.devices)
        .where(eq(schema.devices.slug, device.slug))
        .limit(1);

      let deviceId: number;
      if (existingDev[0]) {
        deviceId = existingDev[0].id;
        await db
          .update(schema.devices)
          .set({
            name: device.name,
            imageUrl: device.imageUrl,
            maxQuoteCents: device.maxQuoteCents,
            brandId,
            isActive: true,
            updatedAt: new Date(),
          })
          .where(eq(schema.devices.id, deviceId));
      } else {
        const [inserted] = await db
          .insert(schema.devices)
          .values({
            brandId,
            slug: device.slug,
            name: device.name,
            imageUrl: device.imageUrl,
            maxQuoteCents: device.maxQuoteCents,
            sortOrder: di,
            isActive: true,
          })
          .returning();
        deviceId = inserted.id;
        deviceCount++;
      }

      // Upsert prices: delete existing for device then insert
      await sql`DELETE FROM device_prices WHERE device_id = ${deviceId}`;
      const priceRows = Object.entries(device.prices).map(([conditionSlug, priceCents]) => ({
        deviceId,
        conditionSlug,
        priceCents,
        isActive: true,
      }));
      await db.insert(schema.devicePrices).values(priceRows);
      priceCount += priceRows.length;
    }

    console.log(`    ${brand.devices.length} devices`);
  }

  const check = await sql.unsafe(`
    select count(distinct b.id)::int as brands, count(d.id)::int as devices
    from brands b
    left join devices d on d.brand_id = b.id
    join categories c on c.id = b.category_id
    where c.slug = 'camera'
  `);

  console.log(`\nDone. Inserted brands: ${brandCount}, devices: ${deviceCount}, prices: ${priceCount}`);
  console.log(`Camera category now: ${check[0].brands} brands, ${check[0].devices} devices`);

  await sql.end();
}

if (process.argv.some((a) => a.includes("seed-cameras"))) {
  main().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}
