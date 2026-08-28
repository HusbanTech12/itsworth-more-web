/**
 * Retry eBay brand-new price fetch for devices missing market_prices.
 * Uses improved search queries so GSM/unlocked/color-heavy names match better.
 */
import postgres from "postgres";
import { fetchMarketPrice, sleep } from "../lib/market/ebay";
import { ebaySearchQuery } from "../lib/market/search-query";

async function main() {
  const sql = postgres(process.env.DATABASE_URL!, { prepare: false });

  const missing = await sql`
    select d.id, d.name
    from devices d
    where d.is_active = true
      and not exists (
        select 1 from market_prices mp
        where mp.device_id = d.id
          and mp.condition_slug = 'brand-new'
          and mp.source = 'ebay'
          and mp.median_cents is not null
          and mp.median_cents > 0
      )
    order by d.id
  `;

  console.log(`Missing brand-new prices: ${missing.length}`);

  let updated = 0;
  let skipped = 0;
  const results: Array<Record<string, unknown>> = [];

  for (const device of missing) {
    const query = ebaySearchQuery(device.name);
    try {
      const stats = await fetchMarketPrice(query, "NEW");
      // Hard-to-match devices: accept 2+ NEW listings after query cleanup
      if (!stats || stats.sampleSize < 2) {
        skipped++;
        results.push({
          id: device.id,
          name: device.name,
          query,
          status: "skipped",
          sample: stats?.sampleSize ?? 0,
        });
        console.log(
          `SKIP  #${device.id}  q="${query}"  samples=${stats?.sampleSize ?? 0}`,
        );
        await sleep(150);
        continue;
      }
      await sql`
        insert into market_prices (
          device_id, condition_slug, source,
          median_cents, avg_cents, min_cents, max_cents,
          sample_size, currency, fetched_at
        ) values (
          ${device.id}, 'brand-new', 'ebay',
          ${stats.medianCents}, ${stats.avgCents},
          ${stats.minCents}, ${stats.maxCents},
          ${stats.sampleSize}, ${stats.currency}, now()
        )
        on conflict (device_id, condition_slug, source)
        do update set
          median_cents = excluded.median_cents,
          avg_cents = excluded.avg_cents,
          min_cents = excluded.min_cents,
          max_cents = excluded.max_cents,
          sample_size = excluded.sample_size,
          currency = excluded.currency,
          fetched_at = now()
      `;
      updated++;
      results.push({
        id: device.id,
        name: device.name,
        query,
        status: "updated-new",
        median: stats.medianCents / 100,
        samples: stats.sampleSize,
      });
      console.log(
        `OK    #${device.id}  $${(stats.medianCents / 100).toFixed(2)}  q="${query}"  n=${stats.sampleSize}`,
      );
    } catch (e) {
      console.error(`FAIL  #${device.id}  ${e instanceof Error ? e.message : e}`);
      results.push({
        id: device.id,
        name: device.name,
        query,
        status: "failed",
        error: e instanceof Error ? e.message : String(e),
      });
    }
    await sleep(200);
  }

  console.log(JSON.stringify({ updated, skipped, results }, null, 2));
  await sql.end();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
