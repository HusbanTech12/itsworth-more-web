/**
 * Audit existing catalog — Step 1 of products_add.md
 */
import postgres from "postgres";

async function main() {
  const sql = postgres(process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL!, {
    prepare: false,
  });

  const conditions = await sql.unsafe(
    `select slug, label, sort_order from device_conditions order by sort_order`,
  );

  const rows = await sql.unsafe(`
    select
      c.slug as category_slug,
      c.name as category_name,
      b.slug as brand_slug,
      b.name as brand_name,
      d.slug as device_slug,
      d.name as device_name,
      d.max_quote_cents
    from categories c
    left join brands b on b.category_id = c.id
    left join devices d on d.brand_id = b.id
    order by c.sort_order, b.sort_order, d.sort_order, d.name
  `);

  const byCat = new Map<
    string,
    {
      name: string;
      brands: Map<string, { name: string; devices: { slug: string; name: string; max: number | null }[] }>;
    }
  >();

  for (const r of rows) {
    if (!byCat.has(r.category_slug)) {
      byCat.set(r.category_slug, { name: r.category_name, brands: new Map() });
    }
    const cat = byCat.get(r.category_slug)!;
    if (!r.brand_slug) continue;
    if (!cat.brands.has(r.brand_slug)) {
      cat.brands.set(r.brand_slug, { name: r.brand_name, devices: [] });
    }
    if (r.device_slug) {
      cat.brands.get(r.brand_slug)!.devices.push({
        slug: r.device_slug,
        name: r.device_name,
        max: r.max_quote_cents,
      });
    }
  }

  console.log("=== CONDITION TIERS ===");
  for (const c of conditions) {
    console.log(`  ${c.slug} — ${c.label}`);
  }

  console.log("\n=== EXISTING CATALOG (category → brand → devices) ===\n");

  let totalBrands = 0;
  let totalDevices = 0;

  for (const [catSlug, cat] of byCat) {
    const brandCount = cat.brands.size;
    const deviceCount = [...cat.brands.values()].reduce((n, b) => n + b.devices.length, 0);
    totalBrands += brandCount;
    totalDevices += deviceCount;

    console.log(`## ${cat.name} (/${catSlug}) — ${brandCount} brands, ${deviceCount} devices`);
    if (brandCount === 0) {
      console.log("  (no brands)\n");
      continue;
    }
    for (const [brandSlug, brand] of cat.brands) {
      console.log(`  ### ${brand.name} (${brandSlug}) — ${brand.devices.length} devices`);
      for (const d of brand.devices) {
        const max = d.max != null ? `$${(d.max / 100).toFixed(0)}` : "-";
        console.log(`    - ${d.name} [${d.slug}] max ${max}`);
      }
    }
    console.log("");
  }

  console.log("=== TOTALS ===");
  console.log(`Categories: ${byCat.size}`);
  console.log(`Brands: ${totalBrands}`);
  console.log(`Devices: ${totalDevices}`);

  await sql.end();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
