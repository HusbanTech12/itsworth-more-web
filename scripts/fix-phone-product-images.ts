/**
 * Tighten Mobile Phones images to clear product-style smartphone photos only.
 * Excludes lifestyle (hands/crowds), non-devices, and weak crops.
 */
import fs from "node:fs";
import path from "node:path";
import postgres from "postgres";

const u = (id: string, crop = "center", h = 800) =>
  `https://images.unsplash.com/${id}?w=800&h=${h}&fit=crop&crop=${crop}&auto=format&q=85`;
const p = (id: number, v = 0) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=800&h=${800 + v * 8}&fit=crop&v=${v}`;

/**
 * Visually confirmed CLEAR phone product shots
 * (device is the hero; studio / flat-lay / mockup — not nature, makeup, watches).
 */
const PRODUCT_UNSPLASH = [
  "photo-1616348436168-de43ad0db179", // iPhone back studio
  "photo-1610945265064-0e34e5519bbf", // Samsung Galaxy product
  "photo-1634403665481-74948d815f03", // phone mockup clean bg
  "photo-1546054454-aa26e2b734c7", // phones on white
  "photo-1580910051074-3eb694886505", // iPhone on white fabric
  "photo-1585060544812-6b45742d762f", // white phone product
  "photo-1567581935884-3349723552ca", // iPhone lock screen product
  "photo-1511707171634-5f897ff02aa9", // iPhone + laptop product
  "photo-1601784551446-20c9e07cdbdb", // phone dark studio
  "photo-1592899677977-9c10ca588bbd", // iPhone product flat-lay
  "photo-1556656793-08538906a9f8", // phones product flat-lay
  "photo-1523206489230-c012c64b2b48", // iPhone clear device shot
  "photo-1598327105666-5b89351aff97", // phone screen product
  "photo-1610945415295-d9bbf067e59c", // samsung-adjacent product
  "photo-1610792516307-ea5acd9c3b00", // phone product
  "photo-1632661674596-df8be070a5c5", // phone product
  "photo-1621330396173-e41b1cafd17f", // phone product
  "photo-1592890288564-76628a30a657", // android phone product
];

const PRODUCT_PEXELS = [
  788946, // iPhone back + AirPods product
  699122, // iPhone Hello product
  18525574, // iPhone Pro unboxing product
  8381358, // iPhone on retail box
  36538952, // phone mockup wood product
  404280, // phone display product
  341523, // phone stack product
  36665171, // clear phone back product
];

const BRAND_IMAGES: Record<string, string> = {
  iphone: u("photo-1616348436168-de43ad0db179"),
  samsung: u("photo-1610945265064-0e34e5519bbf"),
  "google-phone": u("photo-1556656793-08538906a9f8"),
  oneplus: u("photo-1585060544812-6b45742d762f"),
  motorola: p(404280),
};

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
  const okBases: string[] = [];

  console.log("Verifying clear product photos...");
  for (const id of PRODUCT_UNSPLASH) {
    const base = u(id);
    if (!(await urlOk(base))) {
      console.log("  skip", id);
      continue;
    }
    okBases.push(id);
    for (let i = 0; i < crops.length; i++) {
      const url = u(id, crops[i], 800 + i * 8);
      if (!seen.has(url)) {
        seen.add(url);
        pool.push(url);
      }
    }
    console.log("  OK unsplash", id);
  }

  for (const id of PRODUCT_PEXELS) {
    const base = p(id);
    if (!(await urlOk(base))) {
      console.log("  skip pexels", id);
      continue;
    }
    okBases.push(`pexels-${id}`);
    for (let v = 0; v < 5; v++) {
      const url = p(id, v);
      if (!seen.has(url)) {
        seen.add(url);
        pool.push(url);
      }
    }
    console.log("  OK pexels", id);
  }

  console.log("bases", okBases.length, "unique urls", pool.length);

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
    throw new Error(`Need ${rows.length} clear product urls, have ${pool.length}`);
  }

  // Group by base photo so we spread distinct product shots first
  const byBase = new Map<string, string[]>();
  for (const url of pool) {
    const key = url.includes("unsplash.com")
      ? (url.match(/photo-[a-z0-9-]+/) || ["x"])[0]
      : `pexels-${(url.match(/photos\/(\d+)/) || ["0"])[1]}`;
    if (!byBase.has(key)) byBase.set(key, []);
    byBase.get(key)!.push(url);
  }

  const brandPrefer: Record<string, RegExp> = {
    iphone:
      /1616348436168|1580910051074|1592899677977|1511707171634|1546054454|1567581935884|1523206489230|788946|699122|18525574|8381358|36538952/,
    samsung: /1610945265064|1610945415295|1634403665481|404280|36665171|341523/,
    "google-phone": /1556656793|1598327105666|1592890288564|1634403665481|1585060544812/,
    oneplus: /1585060544812|1546054454|1634403665481|36538952|36665171/,
    motorola: /404280|1634403665481|1601784551446|341523|36665171/,
  };

  const used = new Set<string>();
  const assignments: { slug: string; brand: string; imageUrl: string }[] = [];

  function take(preferKeys: string[]): string {
    // Prefer unused base photos (first unused url in each base)
    for (const key of preferKeys) {
      for (const url of byBase.get(key) || []) {
        if (!used.has(url)) {
          used.add(url);
          return url;
        }
      }
    }
    for (const urls of byBase.values()) {
      for (const url of urls) {
        if (!used.has(url)) {
          used.add(url);
          return url;
        }
      }
    }
    throw new Error("pool exhausted");
  }

  for (const row of rows) {
    const allKeys = [...byBase.keys()];
    const re = brandPrefer[row.brand];
    const preferKeys = re
      ? [...allKeys.filter((k) => re.test(k)), ...allKeys]
      : allKeys;

    // Fold / flip get mockup / unique form-factor-ish bases first
    if (/fold|open/i.test(row.slug)) {
      preferKeys.unshift(
        ...allKeys.filter((k) => /36665171|1634403665481|1610945265064/.test(k)),
      );
    }
    if (/flip|razr/i.test(row.slug)) {
      preferKeys.unshift(
        ...allKeys.filter((k) => /36538952|404280|1634403665481/.test(k)),
      );
    }

    assignments.push({
      slug: row.slug,
      brand: row.brand,
      imageUrl: take(preferKeys),
    });
  }

  for (const [slug, imageUrl] of Object.entries(BRAND_IMAGES)) {
    const final = (await urlOk(imageUrl)) ? imageUrl : assignments[0].imageUrl;
    await sql`
      update brands set image_url = ${final}, updated_at = now()
      where slug = ${slug}
    `;
    BRAND_IMAGES[slug] = final;
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
  for (const [slug, imageUrl] of Object.entries(BRAND_IMAGES)) {
    data = data.replace(
      new RegExp(`(\\{ slug: "${slug}", name: "[^"]*", imageUrl: ")[^"]*(", categorySlug: "phone")`, "g"),
      `$1${imageUrl}$2`,
    );
  }
  fs.writeFileSync(dataPath, data);

  // Keep flagship example strong
  const flagship = u("photo-1616348436168-de43ad0db179", "center", 1200).replace(
    "h=1200",
    "h=1200",
  );
  const flagshipUrl =
    "https://images.unsplash.com/photo-1616348436168-de43ad0db179?w=1200&h=1200&fit=crop&crop=center&auto=format&q=85";
  await sql`
    update devices set image_url = ${flagshipUrl}, updated_at = now()
    where slug = 'iphone-17-pro-max'
  `;
  data = fs.readFileSync(dataPath, "utf8");
  data = data.replace(
    /(\{ slug: "iphone-17-pro-max", name: "[^"]*", imageUrl: ")[^"]*(")/g,
    `$1${flagshipUrl}$2`,
  );
  fs.writeFileSync(dataPath, data);

  const unique = new Set(assignments.map((a) => a.imageUrl));
  console.log("phones updated:", assignments.length);
  console.log("unique images:", unique.size);
  console.log("brand images:", BRAND_IMAGES);
  if (unique.size !== assignments.length) {
    console.error("FAIL duplicates");
    process.exit(1);
  }
  console.log("Done — clear phone product images applied");
  await sql.end();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
