import postgres from "postgres";

async function main() {
  const sql = postgres(process.env.DATABASE_URL!, { prepare: false });

  const total = await sql`
    select count(*)::int as n from devices where is_active = true
  `;
  const withBn = await sql`
    select count(distinct device_id)::int as n
    from market_prices
    where condition_slug = 'brand-new'
      and source = 'ebay'
      and median_cents is not null
      and median_cents > 0
  `;
  const missing = await sql`
    select d.id, d.slug, d.name, b.slug as brand, c.slug as category
    from devices d
    join brands b on b.id = d.brand_id
    join categories c on c.id = b.category_id
    where d.is_active = true
      and not exists (
        select 1 from market_prices mp
        where mp.device_id = d.id
          and mp.condition_slug = 'brand-new'
          and mp.source = 'ebay'
          and mp.median_cents is not null
          and mp.median_cents > 0
      )
    order by c.slug, b.slug, d.sort_order, d.id
  `;

  const byCategory: Record<string, number> = {};
  for (const row of missing) {
    byCategory[row.category] = (byCategory[row.category] || 0) + 1;
  }

  console.log(
    JSON.stringify(
      {
        totalActive: total[0].n,
        withBrandNew: withBn[0].n,
        missingCount: missing.length,
        byCategory,
        missing,
      },
      null,
      2,
    ),
  );
  await sql.end();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
