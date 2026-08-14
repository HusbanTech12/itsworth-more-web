import postgres from "postgres";

async function main() {
  const sql = postgres(process.env.DATABASE_URL!, { prepare: false });
  const rows = await sql.unsafe(`
    select b.slug as brand, d.slug, d.name, d.image_url
    from devices d
    join brands b on b.id = d.brand_id
    join categories c on c.id = b.category_id
    where c.slug = 'phone'
    order by b.sort_order, d.sort_order, d.name
  `);

  const byImg = new Map<string, string[]>();
  for (const r of rows) {
    const k = r.image_url || "(null)";
    if (!byImg.has(k)) byImg.set(k, []);
    byImg.get(k)!.push(r.slug);
  }

  console.log("phone devices", rows.length);
  console.log("unique images", byImg.size);
  const dups = [...byImg.entries()]
    .filter(([, v]) => v.length > 1)
    .sort((a, b) => b[1].length - a[1].length);
  console.log("duplicated image groups", dups.length);
  for (const [img, slugs] of dups.slice(0, 20)) {
    console.log(" count", slugs.length, String(img).slice(0, 90));
    console.log("  ", slugs.slice(0, 10).join(", "));
  }

  await sql.end();
}

main();
