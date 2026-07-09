import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import * as schema from "./schema";
import { categories as catData, brands as brandData, devices as devData, conditions, getDevicePrices } from "@/lib/data";

const sql = postgres(process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL!, { prepare: false });
const db = drizzle(sql, { schema });

async function seed() {
  console.log("Seeding database...\n");

  // Clean slate
  await sql`TRUNCATE device_prices, devices, brands, categories, device_conditions, coupons RESTART IDENTITY CASCADE`;

  // 1. Categories
  console.log("Seeding categories...");
  await db.insert(schema.categories).values(
    catData.map((c, i) => ({
      slug: c.slug,
      name: c.name,
      icon: c.icon,
      sortOrder: i,
      isActive: true,
    })),
  );
  const catList = await db.select().from(schema.categories);
  const catMap = new Map(catList.map((c) => [c.slug, c.id]));
  console.log(`  ${catList.length} categories`);

  // 2. Conditions
  console.log("Seeding device conditions...");
  const condEntries = Object.entries(conditions);
  await db.insert(schema.deviceConditions).values(
    condEntries.map(([, cond], i) => ({
      slug: cond.slug,
      label: cond.label,
      description: cond.description,
      isRetail: true,
      isBulk: false,
      sortOrder: i,
    })),
  );
  console.log(`  ${condEntries.length} conditions`);

  // 3. Brands
  console.log("Seeding brands...");
  const brandValues = brandData
    .filter((b) => catMap.has(b.categorySlug))
    .map((b, i) => ({
      categoryId: catMap.get(b.categorySlug)!,
      slug: b.slug,
      name: b.name,
      imageUrl: b.imageUrl,
      sortOrder: i,
      isActive: true,
    }));
  await db.insert(schema.brands).values(brandValues);
  const brandList = await db.select().from(schema.brands);
  const brandMap = new Map(brandList.map((b) => [b.slug, b.id]));
  console.log(`  ${brandList.length} brands`);

  // 4. Devices
  console.log("Seeding devices...");
  const deviceValues = devData
    .filter((d) => brandMap.has(d.brandSlug))
    .map((d, i) => ({
      brandId: brandMap.get(d.brandSlug)!,
      slug: d.slug,
      name: d.name,
      imageUrl: d.imageUrl,
      maxQuoteCents: d.maxQuoteCents,
      sortOrder: i,
      isActive: true,
    }));
  await db.insert(schema.devices).values(deviceValues);
  const deviceList = await db.select().from(schema.devices);
  const deviceMap = new Map(deviceList.map((d) => [d.slug, d.id]));
  console.log(`  ${deviceList.length} devices`);

  // 5. Prices
  console.log("Seeding device prices...");
  const priceValues = devData.flatMap((d) => {
    const deviceId = deviceMap.get(d.slug);
    if (!deviceId) return [];
    return getDevicePrices(d.slug).map((p) => ({
      deviceId,
      conditionSlug: p.slug,
      priceCents: p.priceCents,
      isActive: true,
    }));
  });
  await db.insert(schema.devicePrices).values(priceValues);
  console.log(`  ${priceValues.length} prices`);

  // 6. Coupon
  console.log("Seeding coupon...");
  await db.insert(schema.coupons).values({
    code: "468XOR38",
    type: "percentage",
    percentage: "5",
    maxApplyCents: 2500,
    maxApplyTotalCents: 10000,
    minOrderCents: 0,
    maxUses: 1000,
    maxUsesPerUser: 1,
    isActive: true,
  });
  console.log("  Coupon 468XOR38");

  await sql.end();
  console.log("\nSeed complete!");
}

seed()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .then(() => process.exit(0));
