/**
 * Final Mobile Phones image fix:
 * Only use visually confirmed smartphone product photos.
 * Unique per model via crop/size variants of that whitelist.
 */
import fs from "node:fs";
import path from "node:path";
import postgres from "postgres";

/** Visually confirmed: smartphone is the clear subject (not makeup, nature, watches, crowds). */
const CONFIRMED_UNSPLASH = [
  "photo-1511707171634-5f897ff02aa9",
  "photo-1601784551446-20c9e07cdbdb",
  "photo-1546054454-aa26e2b734c7",
  "photo-1580910051074-3eb694886505",
  "photo-1592899677977-9c10ca588bbd",
  "photo-1523206489230-c012c64b2b48",
  "photo-1598327105666-5b89351aff97",
  "photo-1556656793-08538906a9f8",
  "photo-1565849904461-04a58ad377e0",
  "photo-1610945265064-0e34e5519bbf",
  "photo-1586898633445-fc34716255b2",
  "photo-1634403665481-74948d815f03",
  "photo-1585060544812-6b45742d762f",
  "photo-1567581935884-3349723552ca",
  "photo-1616348436168-de43ad0db179",
];

const CONFIRMED_PEXELS = [
  788946, 1092644, 699122, 607812, 404280, 18525574, 8381358, 341523,
  36538952, 36665171, 5082579,
];

const u = (id: string, crop: string, h: number) =>
  `https://images.unsplash.com/${id}?w=800&h=${h}&fit=crop&crop=${crop}&auto=format&q=80`;
const p = (id: number, v: number) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=800&h=${800 + v * 8}&fit=crop&v=${v}`;

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
  const crops = ["center", "top", "bottom", "left", "right", "entropy", "faces"];
  const pool: string[] = [];
  const seen = new Set<string>();

  for (const id of CONFIRMED_UNSPLASH) {
    const base = u(id, "center", 800);
    if (!(await urlOk(base))) {
      console.log("skip broken unsplash", id);
      continue;
    }
    for (let i = 0; i < crops.length; i++) {
      const url = u(id, crops[i], 800 + i * 8);
      if (!seen.has(url)) {
        seen.add(url);
        pool.push(url);
      }
    }
  }

  for (const id of CONFIRMED_PEXELS) {
    const base = p(id, 0);
    if (!(await urlOk(base))) {
      console.log("skip broken pexels", id);
      continue;
    }
    for (let v = 0; v < 5; v++) {
      const url = p(id, v);
      if (!seen.has(url)) {
        seen.add(url);
        pool.push(url);
      }
    }
  }

  console.log("confirmed phone image urls:", pool.length);

  const sql = postgres(process.env.DATABASE_URL!, { prepare: false });
  const rows = await sql.unsafe<{ brand: string; slug: string }[]>(`
    select b.slug as brand, d.slug
    from devices d
    join brands b on b.id = d.brand_id
    join categories c on c.id = b.category_id
    where c.slug = 'phone'
    order by b.sort_order, d.sort_order, d.name
  `);

  if (pool.length < rows.length) {
    throw new Error(`Need ${rows.length}, have ${pool.length}`);
  }

  // Round-robin distinct base photos first (prefer unique photo id before crop variants)
  const byBase = new Map<string, string[]>();
  for (const url of pool) {
    const key = url.includes("unsplash.com")
      ? (url.match(/photo-[a-z0-9-]+/) || ["x"])[0]
      : (url.match(/photos\/(\d+)/) || ["x"])[0];
    if (!byBase.has(key)) byBase.set(key, []);
    byBase.get(key)!.push(url);
  }
  const baseKeys = [...byBase.keys()];

  const used = new Set<string>();
  const assignments: { slug: string; imageUrl: string }[] = [];

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    // Prefer brand-aligned bases
    let preferKeys = baseKeys;
    if (row.brand === "samsung") {
      preferKeys = [
        ...baseKeys.filter((k) => /1610945265064|1610945415295|404280|8381358|36665171|36538952/.test(k)),
        ...baseKeys,
      ];
    } else if (row.brand === "iphone") {
      preferKeys = [
        ...baseKeys.filter((k) =>
          /1511707171634|1601784551446|1546054454|1580910051074|1592899677977|1523206489230|1556656793|788946|699122|18525574|8381358/.test(
            k,
          ),
        ),
        ...baseKeys,
      ];
    }

    let picked: string | null = null;
    // First pass: unused base photo (first crop of each)
    for (const key of preferKeys) {
      const urls = byBase.get(key) || [];
      for (const url of urls) {
        if (!used.has(url)) {
          picked = url;
          break;
        }
      }
      if (picked) break;
    }
    if (!picked) throw new Error(`no image for ${row.slug}`);
    used.add(picked);
    assignments.push({ slug: row.slug, imageUrl: picked });
  }

  const brandImages: Record<string, string> = {
    iphone: u("photo-1592899677977-9c10ca588bbd", "center", 800),
    samsung: u("photo-1610945265064-0e34e5519bbf", "center", 800),
    "google-phone": u("photo-1598327105666-5b89351aff97", "center", 800),
    oneplus: u("photo-1585060544812-6b45742d762f", "center", 800),
    motorola: p(404280, 0),
  };

  for (const [slug, imageUrl] of Object.entries(brandImages)) {
    await sql`update brands set image_url = ${imageUrl}, updated_at = now() where slug = ${slug}`;
  }
  for (const a of assignments) {
    await sql`update devices set image_url = ${a.imageUrl}, updated_at = now() where slug = ${a.slug}`;
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

  // Spot-check previously bad models
  const dir = path.join(process.cwd(), "scripts", "tmp-imgs");
  for (const slug of ["moto-g54", "pixel-8-pro", "oneplus-13", "moto-razr-2024", "iphone-16-plus"]) {
    const a = assignments.find((x) => x.slug === slug)!;
    const res = await fetch(a.imageUrl);
    fs.writeFileSync(path.join(dir, `${slug}-v3.jpg`), Buffer.from(await res.arrayBuffer()));
    console.log(slug, "→", a.imageUrl.slice(0, 90));
  }

  console.log("OK:", assignments.length, "unique", new Set(assignments.map((a) => a.imageUrl)).size);
  await sql.end();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
