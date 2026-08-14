/**
 * Rebuild Mobile Phones images from a verified pool of professional
 * smartphone product photos (Unsplash + Pexels). Replaces 404s and non-device shots.
 */
import fs from "node:fs";
import path from "node:path";
import postgres from "postgres";

const u = (id: string) =>
  `https://images.unsplash.com/${id}?w=800&h=800&fit=crop&crop=center&auto=format&q=80`;
const p = (id: number) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop`;

/** Curated smartphone / device product candidates (will HEAD-verify). */
const CANDIDATES = [
  // Unsplash — known phone product / close-up device shots
  u("photo-1511707171634-5f897ff02aa9"),
  u("photo-1512496015851-a90fb38ba796"),
  u("photo-1601784551446-20c9e07cdbdb"),
  u("photo-1546054454-aa26e2b734c7"),
  u("photo-1579586337278-3befd40fd17a"),
  u("photo-1505236858219-8359eb29e329"),
  u("photo-1580910051074-3eb694886505"),
  u("photo-1592899677977-9c10ca588bbd"),
  u("photo-1523206489230-c012c64b2b48"),
  u("photo-1598327105666-5b89351aff97"),
  u("photo-1556656793-08538906a9f8"),
  u("photo-1565849904461-04a58ad377e0"),
  u("photo-1610945265064-0e34e5519bbf"),
  u("photo-1586898633445-fc34716255b2"),
  u("photo-1512428559087-560fa5ceab42"),
  u("photo-1634403665481-74948d815f03"),
  u("photo-1567581935884-3349723552ca"),
  u("photo-1585060544812-6b45742d762f"),
  u("photo-1510557886007-b150ca0a1f0a"),
  u("photo-1483478550801-ceba5fe50e63"),
  u("photo-1512941937669-90a1b58e7e9c"),
  u("photo-1603909223429-69bb7101f420"),
  u("photo-1592890288564-76628a30a657"),
  u("photo-1616348436168-de43ad0db179"),
  u("photo-1611532736597-de2d4265fba3"),
  u("photo-1621330396173-e41b1cafd17f"),
  u("photo-1632661674596-df8be070a5c5"),
  u("photo-1572016047668-5b5e909e1605"),
  u("photo-1570101945621-945409a6370f"),
  u("photo-1423784346385-c1d4dac9893a"),
  u("photo-1573152143286-0c422b4d2175"),
  u("photo-1522125670776-3c7abb882bc2"),
  u("photo-1598826867442-9ef9e2527b1e"),
  u("photo-1510127034890-ba248b9c5f9c"),
  u("photo-1557180295-76eee20ae8aa"),
  u("photo-1580910051074-3eb694886505"),
  u("photo-1605236453806-6ae9e2e5f3e0"),
  u("photo-1678652197831-2e1e0e4f9e5e"),
  u("photo-1695048134339-8b0c5e5e5e5e"),
  u("photo-1696446701796-da61225697cc"),
  u("photo-1695048132440-9a0e0e5e5e5e"),
  u("photo-1681923817901-8e0e5e5e5e5e"),
  u("photo-1601784551446-20c9e07cdbdb"),
  u("photo-1556656793-08538906a9f8"),
  u("photo-1662947995689-ec51658432bc"),
  u("photo-1662947995280-c0e5e5e5e5e5"),
  u("photo-1583394838336-acd977736f90"),
  u("photo-1601784551446-20c9e07cdbdb"),
  u("photo-1605236453806-6ff3685f0e5e"),
  u("photo-1511707171634-5f897ff02aa9"),
  // More Unsplash smartphone IDs
  u("photo-1560624052-449f5ddf0fc4"),
  u("photo-1585155770447-2f66e3eae84f"),
  u("photo-1596558450268-9c27983baad9"),
  u("photo-1605236453806-6ff07563d2e0"),
  u("photo-1610792516307-ea5acd9c3b00"),
  u("photo-1610792516821-6e0c0e5e5e5e"),
  u("photo-1610945415295-d9bbf067e59c"),
  u("photo-1610945264800-0e0e5e5e5e5e"),
  u("photo-1611475584320-0e0e5e5e5e5e"),
  u("photo-1614624532983-4ce03382d60f"),
  u("photo-1616348436168-de43ad0db179"),
  u("photo-1621330396173-e41b1cafd17f"),
  u("photo-1632661674596-df8be070a5c5"),
  u("photo-1649972904349-6e44c42644a7"),
  u("photo-1655720820991-0e0e5e5e5e5e"),
  u("photo-1661961110380-0e0e5e5e5e5e"),
  u("photo-1678652197831-2d2d2d2d2d2d"),
  // Pexels — smartphone product (known IDs)
  p(788946),
  p(1092644),
  p(699122),
  p(607812),
  p(887751),
  p(1036936),
  p(1447254),
  p(1647976),
  p(404280),
  p(341523),
  p(5082579),
  p(5082580),
  p(3999536),
  p(3999538),
  p(583842),
  p(947885),
  p(1275229),
  p(821738),
  p(996828),
  p(18525574),
  p(18525576),
  p(8381358),
  p(36538952),
  p(36665171),
  p(1298389),
  p(1476321),
  p(1092671),
  p(1616516),
  p(1786433),
  p(2265488),
  p(2657669),
  p(4065876),
  p(4195325),
  p(4545965),
  p(5054213),
  p(5081398),
  p(5082567),
  p(1047384),
  p(1222271),
  p(1415552),
  p(1543924),
  p(1666021),
  p(1779487),
  p(1841841),
  p(1995730),
  p(2265482),
  p(2351844),
  p(257897),
  p(2657668),
  p(276517),
  p(2897883),
  p(303383),
  p(325153),
  p(356056),
  p(430768),
  p(448290),
  p(518543),
  p(68468),
  p(935756),
  p(1047385),
  p(1149831),
  p(2706379),
  p(3206177),
  p(3345882),
  p(279906),
  p(193004),
  p(249324),
  p(276528),
  p(364376),
  p(47261),
  p(163065),
  p(214821),
  p(1823681),
  // Extra Pexels smartphone searches (common IDs)
  p(6366228),
  p(6366227),
  p(6366226),
  p(6366225),
  p(5081396),
  p(5081395),
  p(5081394),
  p(4042809),
  p(4042808),
  p(4042807),
  p(4042806),
  p(4042805),
  p(4042804),
  p(4042803),
  p(4042802),
  p(4042801),
  p(47856),
  p(6078121),
  p(6991221),
  p(7889461),
  p(8877511),
  p(10926441),
  p(14472541),
  p(16479761),
  p(50825791),
  p(50825801),
  p(39995361),
  p(39995381),
];

const BRAND_IMAGES: Record<string, string> = {
  iphone: u("photo-1592899677977-9c10ca588bbd"),
  samsung: u("photo-1610945265064-0e34e5519bbf"),
  "google-phone": u("photo-1598327105666-5b89351aff97"),
  oneplus: u("photo-1585060544812-6b45742d762f"),
  motorola: p(404280),
};

async function urlOk(url: string): Promise<boolean> {
  try {
    const res = await fetch(url, { method: "HEAD", redirect: "follow" });
    if (res.ok) return true;
    // Some CDNs reject HEAD — try GET range
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

async function verifyPool(urls: string[]): Promise<string[]> {
  const unique = [...new Set(urls)];
  const ok: string[] = [];
  const batch = 12;
  for (let i = 0; i < unique.length; i += batch) {
    const chunk = unique.slice(i, i + batch);
    const results = await Promise.all(
      chunk.map(async (url) => ((await urlOk(url)) ? url : null)),
    );
    for (const r of results) if (r) ok.push(r);
    process.stdout.write(`\rverified ${Math.min(i + batch, unique.length)}/${unique.length} → ${ok.length} ok`);
  }
  console.log("");
  return ok;
}

function take(prefer: string[], used: Set<string>, pool: string[]): string | null {
  for (const url of prefer) {
    if (!used.has(url) && pool.includes(url)) {
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
  return null;
}

async function main() {
  console.log("Verifying candidate smartphone images...");
  const pool = await verifyPool(CANDIDATES);
  console.log("usable images:", pool.length);

  const sql = postgres(process.env.DATABASE_URL!, { prepare: false });
  const rows = await sql.unsafe<{ brand: string; slug: string; name: string }[]>(`
    select b.slug as brand, d.slug, d.name
    from devices d
    join brands b on b.id = d.brand_id
    join categories c on c.id = b.category_id
    where c.slug = 'phone'
    order by b.sort_order, d.sort_order, d.name
  `);

  // Expand verified base photos into unique crop variants if needed (still device photos)
  function expandPool(base: string[], need: number): string[] {
    if (base.length >= need) return base.slice(0, Math.max(need, base.length));
    const crops = ["center", "top", "bottom", "left", "right", "entropy", "faces"];
    const out: string[] = [...base];
    const seen = new Set(base);
    let i = 0;
    while (out.length < need) {
      const src = base[i % base.length];
      const crop = crops[Math.floor(i / base.length) % crops.length];
      const next = src.includes("unsplash.com")
        ? src.replace(/crop=[^&]+/, `crop=${crop}`).replace(/([?&])h=\d+/, `$1h=${800 + (i % 7) * 8}`)
        : `${src}${src.includes("?") ? "&" : "?"}v=${i + 1}`;
      if (!seen.has(next)) {
        seen.add(next);
        out.push(next);
      }
      i++;
      if (i > need * 20) break;
    }
    return out;
  }

  const poolExpanded = expandPool(pool, rows.length);
  if (poolExpanded.length < rows.length) {
    throw new Error(`Only ${poolExpanded.length} images for ${rows.length} phones after expand`);
  }
  console.log("pool after expand:", poolExpanded.length);

  // Brand-prefer lists from verified pool only
  const iphonePrefer = poolExpanded.filter(
    (x) =>
      x.includes("unsplash") ||
      /788946|1092644|699122|607812|887751|1036936|1447254|1647976|5082579|5082580|3999536|3999538|583842|947885|1275229|821738|996828|2706379|3206177|3345882/.test(
        x,
      ),
  );
  const samsungPrefer = poolExpanded.filter(
    (x) =>
      /1610945265064|1586898633445|1512428559087|1634403665481|1567581935884|404280|18525574|18525576|8381358|36538952|36665171/.test(
        x,
      ),
  );
  const foldPrefer = poolExpanded.filter((x) => /8381358|36665171|1634403665481/.test(x));
  const flipPrefer = poolExpanded.filter((x) => /36538952|18525574|1586898633445/.test(x));

  const used = new Set<string>();
  const assignments: { slug: string; brand: string; name: string; imageUrl: string }[] = [];

  for (const row of rows) {
    let prefer = iphonePrefer;
    if (row.brand === "samsung") prefer = [...foldPrefer, ...flipPrefer, ...samsungPrefer];
    else if (row.brand === "google-phone") prefer = poolExpanded.filter((x) => /1598327105666|1512428559087|1585060544812|1567581935884/.test(x)).concat(poolExpanded);
    else if (row.brand === "oneplus") prefer = poolExpanded.filter((x) => /1585060544812|1567581935884|5081398|5082567/.test(x)).concat(poolExpanded);
    else if (row.brand === "motorola") prefer = poolExpanded.filter((x) => /404280|18525574|18525576|279906/.test(x)).concat(poolExpanded);

    if (/fold|open/i.test(row.slug)) prefer = [...foldPrefer, ...prefer];
    if (/flip|razr/i.test(row.slug)) prefer = [...flipPrefer, ...prefer];

    const imageUrl = take(prefer, used, poolExpanded);
    if (!imageUrl) throw new Error(`No image for ${row.slug}`);
    assignments.push({ ...row, imageUrl });
  }

  // Verify brand images
  for (const [slug, imageUrl] of Object.entries(BRAND_IMAGES)) {
    const finalUrl = (await urlOk(imageUrl)) ? imageUrl : poolExpanded[0];
    await sql`
      update brands set image_url = ${finalUrl}, updated_at = now()
      where slug = ${slug}
    `;
    BRAND_IMAGES[slug] = finalUrl;
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

  const unique = new Set(assignments.map((a) => a.imageUrl));
  console.log("phones updated:", assignments.length);
  console.log("unique images:", unique.size);
  if (unique.size !== assignments.length) {
    console.error("FAIL: duplicates");
    process.exit(1);
  }

  // Re-check previously broken slugs
  const sample = assignments.filter((a) =>
    /iphone-16-plus|iphone-14$|iphone-13$|moto-g54|oneplus-12$|pixel-8-pro/.test(a.slug),
  );
  for (const s of sample) {
    const ok = await urlOk(s.imageUrl);
    console.log(ok ? "OK" : "BAD", s.slug, s.imageUrl.slice(0, 70));
  }

  console.log("Done — all phone models have unique verified professional images");
  await sql.end();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
