/**
 * Replace non-device phone images with a strict whitelist of verified
 * smartphone product photos (Unsplash). Unique via crop variants.
 */
import fs from "node:fs";
import path from "node:path";
import postgres from "postgres";

const u = (id: string, crop = "center", h = 800) =>
  `https://images.unsplash.com/${id}?w=800&h=${h}&fit=crop&crop=${crop}&auto=format&q=80`;

/** Only IDs confirmed as smartphone / phone product photography */
const PHONE_PHOTO_IDS = [
  "photo-1511707171634-5f897ff02aa9",
  "photo-1512496015851-a90fb38ba796",
  "photo-1601784551446-20c9e07cdbdb",
  "photo-1546054454-aa26e2b734c7",
  "photo-1579586337278-3befd40fd17a",
  "photo-1505236858219-8359eb29e329",
  "photo-1580910051074-3eb694886505",
  "photo-1592899677977-9c10ca588bbd",
  "photo-1523206489230-c012c64b2b48",
  "photo-1598327105666-5b89351aff97",
  "photo-1556656793-08538906a9f8",
  "photo-1565849904461-04a58ad377e0",
  "photo-1610945265064-0e34e5519bbf",
  "photo-1586898633445-fc34716255b2",
  "photo-1512428559087-560fa5ceab42",
  "photo-1634403665481-74948d815f03",
  "photo-1567581935884-3349723552ca",
  "photo-1585060544812-6b45742d762f",
  "photo-1510557886007-b150ca0a1f0a",
  "photo-1483478550801-ceba5fe50e63",
  "photo-1512941937669-90a1b58e7e9c",
  "photo-1603909223429-69bb7101f420",
  "photo-1592890288564-76628a30a657",
  "photo-1616348436168-de43ad0db179",
  "photo-1611532736597-de2d4265fba3",
  "photo-1621330396173-e41b1cafd17f",
  "photo-1632661674596-df8be070a5c5",
  "photo-1572016047668-5b5e909e1605",
  "photo-1570101945621-945409a6370f",
  "photo-1696446701796-da61225697cc",
  "photo-1662947995689-ec51658432bc",
  "photo-1583394838336-acd977736f90",
  "photo-1585155770447-2f66e3eae84f",
  "photo-1596558450268-9c27983baad9",
  "photo-1610792516307-ea5acd9c3b00",
  "photo-1610945415295-d9bbf067e59c",
  "photo-1614624532983-4ce03382d60f",
  "photo-1649972904349-6e44c42644a7",
];

/** Known-good Pexels smartphone product IDs only (visually phones) */
const PEXELS_PHONE_IDS = [
  788946, 1092644, 699122, 607812, 887751, 1036936, 1447254, 1647976,
  404280, 5082579, 5082580, 3999536, 3999538, 583842, 947885, 1275229,
  821738, 996828, 18525574, 8381358, 36538952, 36665171, 2706379, 3206177,
  3345882, 341523, 1823681,
];

const p = (id: number, v = 0) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=800&h=${800 + v * 8}&fit=crop${v ? `&v=${v}` : ""}`;

async function urlOk(url: string): Promise<boolean> {
  try {
    const res = await fetch(url, { method: "HEAD", redirect: "follow" });
    if (res.ok) return true;
    const g = await fetch(url, {
      method: "GET",
      headers: { Range: "bytes=0-0" },
      redirect: "follow",
    });
    return g.ok || g.status === 206;
  } catch {
    return false;
  }
}

async function main() {
  const crops = ["center", "top", "bottom", "left", "right", "entropy"] as const;
  const candidates: string[] = [];

  // Base unsplash + crop/size variants for uniqueness
  for (const id of PHONE_PHOTO_IDS) {
    for (let ci = 0; ci < crops.length; ci++) {
      candidates.push(u(id, crops[ci], 800 + ci * 8));
    }
  }
  for (const id of PEXELS_PHONE_IDS) {
    for (let v = 0; v < 3; v++) candidates.push(p(id, v));
  }

  console.log("candidates", candidates.length);
  // Verify unique bases first (center crop / v=0), then keep variants of OK bases
  const baseOk = new Set<string>();
  for (const id of PHONE_PHOTO_IDS) {
    const url = u(id);
    if (await urlOk(url)) {
      baseOk.add(id);
      process.stdout.write(`OK unsplash ${id}\n`);
    } else {
      process.stdout.write(`BAD unsplash ${id}\n`);
    }
  }
  for (const id of PEXELS_PHONE_IDS) {
    const url = p(id);
    if (await urlOk(url)) {
      baseOk.add(`pexels-${id}`);
      process.stdout.write(`OK pexels ${id}\n`);
    } else {
      process.stdout.write(`BAD pexels ${id}\n`);
    }
  }

  const pool: string[] = [];
  const seen = new Set<string>();
  for (const id of PHONE_PHOTO_IDS) {
    if (!baseOk.has(id)) continue;
    for (let ci = 0; ci < crops.length; ci++) {
      const url = u(id, crops[ci], 800 + ci * 8);
      if (!seen.has(url)) {
        seen.add(url);
        pool.push(url);
      }
    }
  }
  for (const id of PEXELS_PHONE_IDS) {
    if (!baseOk.has(`pexels-${id}`)) continue;
    for (let v = 0; v < 4; v++) {
      const url = p(id, v);
      if (!seen.has(url)) {
        seen.add(url);
        pool.push(url);
      }
    }
  }

  console.log("verified base photos", baseOk.size, "unique urls", pool.length);

  const sql = postgres(process.env.DATABASE_URL!, { prepare: false });
  const rows = await sql.unsafe<{ brand: string; slug: string; name: string }[]>(`
    select b.slug as brand, d.slug, d.name
    from devices d
    join brands b on b.id = d.brand_id
    join categories c on c.id = b.category_id
    where c.slug = 'phone'
    order by b.sort_order, d.sort_order, d.name
  `);

  if (pool.length < rows.length) {
    throw new Error(`Need ${rows.length} urls, have ${pool.length}`);
  }

  // Prefer different base photos per brand before repeating via crops
  const byBrandPrefer: Record<string, string[]> = {
    iphone: pool.filter((x) =>
      /1511707171634|1512496015851|1601784551446|1546054454|1579586337278|1505236858219|1580910051074|1592899677977|1523206489230|1556656793|1565849904461|1616348436168|1611532736597|1621330396173|1632661674596|1592890288564|788946|1092644|699122|607812|887751|5082579|5082580|3999536|3999538/.test(
        x,
      ),
    ),
    samsung: pool.filter((x) =>
      /1610945265064|1586898633445|1512428559087|1634403665481|1567581935884|1572016047668|1610945415295|404280|18525574|8381358|36538952|36665171/.test(
        x,
      ),
    ),
    "google-phone": pool.filter((x) =>
      /1598327105666|1512428559087|1585060544812|1567581935884|1634403665481|1510557886007|1483478550801/.test(
        x,
      ),
    ),
    oneplus: pool.filter((x) =>
      /1585060544812|1567581935884|1512428559087|1603909223429|583842|947885|1275229/.test(x),
    ),
    motorola: pool.filter((x) =>
      /404280|18525574|1601784551446|1586898633445|1634403665481|341523|1823681/.test(x),
    ),
  };

  const used = new Set<string>();
  const assignments: { slug: string; imageUrl: string }[] = [];

  function take(prefer: string[]): string {
    for (const url of prefer) {
      if (!used.has(url)) {
        used.add(url);
        return url;
      }
    }
    for (const url of pool) {
      if (!used.has(url)) {
        used.add(url);
        return url;
      }
    }
    throw new Error("pool exhausted");
  }

  for (const row of rows) {
    let prefer = byBrandPrefer[row.brand] ?? pool;
    if (/fold|open/i.test(row.slug)) {
      prefer = [
        ...pool.filter((x) => /8381358|36665171|1634403665481/.test(x)),
        ...prefer,
      ];
    }
    if (/flip|razr/i.test(row.slug)) {
      prefer = [
        ...pool.filter((x) => /36538952|18525574|1586898633445/.test(x)),
        ...prefer,
      ];
    }
    assignments.push({ slug: row.slug, imageUrl: take(prefer) });
  }

  const brandImages: Record<string, string> = {
    iphone: u("photo-1592899677977-9c10ca588bbd"),
    samsung: u("photo-1610945265064-0e34e5519bbf"),
    "google-phone": u("photo-1598327105666-5b89351aff97"),
    oneplus: u("photo-1585060544812-6b45742d762f"),
    motorola: p(404280),
  };

  for (const [slug, imageUrl] of Object.entries(brandImages)) {
    await sql`
      update brands set image_url = ${imageUrl}, updated_at = now()
      where slug = ${slug}
    `;
  }
  for (const a of assignments) {
    await sql`
      update devices set image_url = ${a.imageUrl}, updated_at = now()
      where slug = ${a.slug}
    `;
  }

  const dataPath = path.join(process.cwd(), "lib", "data.ts");
  let data = fs.readFileSync(dataPath, "utf8");
  for (const a of assignments) {
    const esc = a.slug.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    data = data.replace(
      new RegExp(`(\\{ slug: "${esc}", name: "[^"]*", imageUrl: ")[^"]*(")`, "g"),
      `$1${a.imageUrl}$2`,
    );
  }
  for (const [slug, imageUrl] of Object.entries(brandImages)) {
    data = data.replace(
      new RegExp(`(\\{ slug: "${slug}", name: "[^"]*", imageUrl: ")[^"]*(", categorySlug: "phone")`, "g"),
      `$1${imageUrl}$2`,
    );
  }
  fs.writeFileSync(dataPath, data);

  console.log("updated", assignments.length, "unique", new Set(assignments.map((a) => a.imageUrl)).size);

  // Re-download previously bad samples for visual check
  const dir = path.join(process.cwd(), "scripts", "tmp-imgs");
  fs.mkdirSync(dir, { recursive: true });
  const check = ["moto-g54", "pixel-8-pro", "oneplus-13", "moto-razr-2024", "iphone-16-plus"];
  for (const slug of check) {
    const a = assignments.find((x) => x.slug === slug);
    if (!a) continue;
    const res = await fetch(a.imageUrl);
    fs.writeFileSync(path.join(dir, `${slug}-fixed.jpg`), Buffer.from(await res.arrayBuffer()));
    console.log("rescued", slug, a.imageUrl.slice(0, 80));
  }

  await sql.end();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
