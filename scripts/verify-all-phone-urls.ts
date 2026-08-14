import postgres from "postgres";

async function ok(url: string) {
  try {
    const r = await fetch(url, { method: "HEAD", redirect: "follow" });
    if (r.ok) return true;
    const g = await fetch(url, { method: "GET", headers: { Range: "bytes=0-0" }, redirect: "follow" });
    return g.ok || g.status === 206;
  } catch {
    return false;
  }
}

async function main() {
  const sql = postgres(process.env.DATABASE_URL!, { prepare: false });
  const rows = await sql.unsafe<{ slug: string; image_url: string }[]>(`
    select d.slug, d.image_url
    from devices d
    join brands b on b.id = d.brand_id
    join categories c on c.id = b.category_id
    where c.slug = 'phone'
  `);
  let bad = 0;
  const batch = 15;
  for (let i = 0; i < rows.length; i += batch) {
    const chunk = rows.slice(i, i + batch);
    const results = await Promise.all(chunk.map(async (r) => ({ slug: r.slug, ok: await ok(r.image_url) })));
    for (const r of results) {
      if (!r.ok) {
        bad++;
        console.log("BAD", r.slug);
      }
    }
  }
  console.log("checked", rows.length, "broken", bad, "unique", new Set(rows.map((r) => r.image_url)).size);
  await sql.end();
}

main();
