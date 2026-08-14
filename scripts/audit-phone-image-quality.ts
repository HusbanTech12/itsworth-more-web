/**
 * Audit phone device images: flag URLs that aren't professional device photos,
 * and list devices that still need better images.
 */
import postgres from "postgres";

async function headOk(url: string): Promise<{ ok: boolean; status: number; type: string }> {
  try {
    const res = await fetch(url, { method: "HEAD", redirect: "follow" });
    return {
      ok: res.ok,
      status: res.status,
      type: res.headers.get("content-type") || "",
    };
  } catch {
    return { ok: false, status: 0, type: "" };
  }
}

async function main() {
  const sql = postgres(process.env.DATABASE_URL!, { prepare: false });
  const rows = await sql.unsafe<{ brand: string; slug: string; name: string; image_url: string | null }[]>(`
    select b.slug as brand, d.slug, d.name, d.image_url
    from devices d
    join brands b on b.id = d.brand_id
    join categories c on c.id = b.category_id
    where c.slug = 'phone'
    order by b.sort_order, d.sort_order, d.name
  `);

  console.log("total phones", rows.length);
  const missing = rows.filter((r) => !r.image_url);
  console.log("missing image_url", missing.length);

  // Spot-check HTTP availability (sample + any suspicious IDs)
  const suspicious: string[] = [];
  const broken: string[] = [];

  for (const r of rows) {
    if (!r.image_url) continue;
    // Heuristic: very old/short pexels IDs often aren't product shots
    const m = r.image_url.match(/pexels\.com\/photos\/(\d+)\//);
    if (m) {
      const id = Number(m[1]);
      if (id < 100000) suspicious.push(`${r.slug} pexels/${id}`);
    }
    if (r.image_url.includes("placehold.co")) suspicious.push(`${r.slug} placeholder`);
  }

  // Check first 20 + all suspicious for HTTP 200
  const toCheck = [
    ...rows.slice(0, 15),
    ...rows.filter((r) => r.image_url && /photos\/(\d{1,5})\//.test(r.image_url)),
  ];
  const seen = new Set<string>();
  for (const r of toCheck) {
    if (!r.image_url || seen.has(r.slug)) continue;
    seen.add(r.slug);
    const h = await headOk(r.image_url);
    if (!h.ok) broken.push(`${r.slug} ${h.status} ${r.image_url.slice(0, 80)}`);
  }

  console.log("\nsuspicious (likely not device product):", suspicious.length);
  for (const s of suspicious.slice(0, 40)) console.log(" ", s);
  console.log("\nbroken/unreachable sample:", broken.length);
  for (const b of broken.slice(0, 20)) console.log(" ", b);

  // Print all current urls for review grouping by brand
  console.log("\n--- all phone image urls ---");
  for (const r of rows) {
    console.log(`${r.brand}\t${r.slug}\t${(r.image_url || "").slice(0, 100)}`);
  }

  await sql.end();
}

main();
