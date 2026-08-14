import fs from "node:fs";
import path from "node:path";
import postgres from "postgres";

async function main() {
  const dir = path.join(process.cwd(), "scripts", "tmp-imgs");
  fs.mkdirSync(dir, { recursive: true });
  const sql = postgres(process.env.DATABASE_URL!, { prepare: false });
  const rows = await sql.unsafe<{ slug: string; image_url: string }[]>(`
    select d.slug, d.image_url
    from devices d
    join brands b on b.id = d.brand_id
    join categories c on c.id = b.category_id
    where c.slug = 'phone'
      and (
        d.slug like 'moto-%'
        or d.slug like 'oneplus-%'
        or d.slug in ('iphone-16-plus','galaxy-s25-ultra','pixel-8-pro','iphone-11-pro','galaxy-z-fold-6')
      )
    order by d.slug
  `);

  for (const r of rows) {
    const res = await fetch(r.image_url);
    if (!res.ok) {
      console.log("FAIL fetch", r.slug, res.status);
      continue;
    }
    const buf = Buffer.from(await res.arrayBuffer());
    const file = path.join(dir, `${r.slug}.jpg`);
    fs.writeFileSync(file, buf);
    console.log("saved", r.slug, buf.length);
  }
  await sql.end();
}

main();
