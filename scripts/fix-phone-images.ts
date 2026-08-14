/**
 * Assign unique professional stock photos to Mobile Phones only.
 * Brand-matched pools + fold/flip/razr form-factor picks. No competitor scraping.
 */
import fs from "node:fs";
import path from "node:path";
import postgres from "postgres";

const u = (id: string) =>
  `https://images.unsplash.com/${id}?w=800&h=800&fit=crop&crop=center&auto=format&q=80`;
const p = (id: number) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop`;

const BRAND_IMAGES: Record<string, string> = {
  iphone: u("photo-1592899677977-9c10ca588bbd"),
  samsung: u("photo-1610945265064-0e34e5519bbf"),
  "google-phone": u("photo-1598327105666-5b89351aff97"),
  oneplus: u("photo-1585060544812-6b45742d762f"),
  motorola: p(404280),
};

/** Global unique URLs — each used at most once across all phone devices */
const MASTER_POOL = [
  // Unsplash — phone / smartphone product & lifestyle
  u("photo-1511707171634-5f897ff02aa9"),
  u("photo-1512496015851-a90fb38ba796"),
  u("photo-1601784551446-20c9e07cdbdb"),
  u("photo-1546054454-aa26e2b734c7"),
  u("photo-1579586337278-3befd40fd17a"),
  u("photo-1505236858219-8359eb29e329"),
  u("photo-1592890288564-7668b47bb5ee"),
  u("photo-1580910051074-3eb694886505"),
  u("photo-1592899677977-9c10ca588bbd"),
  u("photo-1523206489230-c012c64b2b48"),
  u("photo-1598327105666-5b89351aff97"),
  u("photo-1556656793-08538906a9f8"),
  u("photo-1565849904461-04a58ad377e0"),
  u("photo-1605236453806-6ff07563d2d6"),
  u("photo-1607936854279-55e8f798fcce"),
  u("photo-1611532736597-de2d4265fba3"),
  u("photo-1616348436168-de43ad0db179"),
  u("photo-1621330396173-e41b1cafd17f"),
  u("photo-1632661674596-df8be070a5c5"),
  u("photo-1610945265064-0e34e5519bbf"),
  u("photo-1586898633445-fc34716255b2"),
  u("photo-1512428559087-560fa5ceab42"),
  u("photo-1572016047668-5b5e909e1605"),
  u("photo-1570101945621-945409a6370f"),
  u("photo-1634403665481-74948d815f03"),
  u("photo-1423784346385-c1d4dac9893a"),
  u("photo-1573152143286-0c422b4d2175"),
  u("photo-1522125670776-3c7abb882bc2"),
  u("photo-1598826867442-9ef9e2527b1e"),
  u("photo-1567581935884-3349723552ca"),
  u("photo-1585060544812-6b45742d762f"),
  u("photo-1557185720-2e5e9f4f9e5e"), // may 404 — filtered by verify later if needed
  u("photo-1510557886007-b150ca0a1f0a"),
  u("photo-1483478550801-ceba5fe50e63"),
  u("photo-1560624052-449f5eea5a7a"),
  u("photo-1601784551456-3939a8f6f7e0"), // may be invalid
  u("photo-1512941937669-90a1b58e7e9c"),
  u("photo-1526045489820-9f9f4c0f8c5e"), // may invalid
  u("photo-1603909223429-69bb7101f420"),
  u("photo-1678912134244-4f7e6c5e5e5e"), // may invalid
  // Pexels — smartphone product shots
  p(404280),
  p(788946),
  p(1092644),
  p(699122),
  p(341523),
  p(607812),
  p(887751),
  p(1036936),
  p(1447254),
  p(1647976),
  p(1823681),
  p(2706379),
  p(3206177),
  p(3345882),
  p(3999536),
  p(3999538),
  p(5082579),
  p(5082580),
  p(583842),
  p(947885),
  p(1275229),
  p(163065),
  p(214821),
  p(47261),
  p(18525574),
  p(18525576),
  p(279906),
  p(8381358),
  p(36538952),
  p(36665171),
  p(1298389),
  p(1476321),
  p(193004),
  p(1092671),
  p(1616516),
  p(1786433),
  p(2265488),
  p(249324),
  p(2657669),
  p(276528),
  p(35192),
  p(364376),
  p(37547),
  p(4065876),
  p(4195325),
  p(4545965),
  p(5054213),
  p(5081398),
  p(5082567),
  p(51383),
  p(53453),
  p(6078120),
  p(6991220),
  p(7889460),
  p(821738),
  p(8877510),
  p(996828),
  p(1047384),
  p(1222271),
  p(133459),
  p(1415552),
  p(1543924),
  p(1666021),
  p(1779487),
  p(1841841),
  p(1995730),
  p(207589),
  p(2265482),
  p(2351844),
  p(248528),
  p(257897),
  p(2657668),
  p(276517),
  p(2897883),
  p(303383),
  p(325153),
  p(33622),
  p(356056),
  p(38271),
  p(4158),
  p(430768),
  p(448290),
  p(46194),
  p(50595),
  p(50987),
  p(518543),
  p(60781),
  p(68468),
  p(7432),
  p(82174),
  p(935756),
  p(1047385),
  p(1149831),
];

/** Prefer these for foldables / flip / razr */
const FORM_PREFER: Record<"fold" | "flip", string[]> = {
  fold: [p(8381358), p(36665171), u("photo-1634403665481-74948d815f03")],
  flip: [p(36538952), p(18525574), u("photo-1586898633445-fc34716255b2")],
};

/** Prefer brand-aligned URLs first (still drawn from MASTER once) */
const BRAND_PREFER: Record<string, string[]> = {
  iphone: [
    u("photo-1592899677977-9c10ca588bbd"),
    u("photo-1511707171634-5f897ff02aa9"),
    u("photo-1512496015851-a90fb38ba796"),
    u("photo-1601784551446-20c9e07cdbdb"),
    u("photo-1546054454-aa26e2b734c7"),
    u("photo-1579586337278-3befd40fd17a"),
    u("photo-1505236858219-8359eb29e329"),
    u("photo-1592890288564-7668b47bb5ee"),
    u("photo-1580910051074-3eb694886505"),
    u("photo-1523206489230-c012c64b2b48"),
    u("photo-1556656793-08538906a9f8"),
    u("photo-1565849904461-04a58ad377e0"),
    u("photo-1605236453806-6ff07563d2d6"),
    u("photo-1607936854279-55e8f798fcce"),
    u("photo-1611532736597-de2d4265fba3"),
    u("photo-1616348436168-de43ad0db179"),
    u("photo-1621330396173-e41b1cafd17f"),
    u("photo-1632661674596-df8be070a5c5"),
    p(788946),
    p(1092644),
    p(699122),
    p(341523),
    p(607812),
    p(887751),
    p(1036936),
    p(1447254),
    p(1647976),
    p(1823681),
    p(2706379),
    p(3206177),
    p(3345882),
    p(3999536),
    p(3999538),
    p(5082579),
    p(5082580),
    p(583842),
    p(947885),
    p(1275229),
    p(163065),
    p(214821),
    p(47261),
    p(821738),
    p(996828),
  ],
  samsung: [
    u("photo-1610945265064-0e34e5519bbf"),
    u("photo-1586898633445-fc34716255b2"),
    u("photo-1512428559087-560fa5ceab42"),
    u("photo-1572016047668-5b5e909e1605"),
    u("photo-1570101945621-945409a6370f"),
    u("photo-1634403665481-74948d815f03"),
    u("photo-1567581935884-3349723552ca"),
    p(404280),
    p(18525574),
    p(18525576),
    p(279906),
    p(1298389),
    p(1476321),
    p(193004),
    p(8381358),
    p(36538952),
    p(36665171),
  ],
  "google-phone": [
    u("photo-1598327105666-5b89351aff97"),
    u("photo-1512428559087-560fa5ceab42"),
    u("photo-1572016047668-5b5e909e1605"),
    u("photo-1634403665481-74948d815f03"),
    u("photo-1585060544812-6b45742d762f"),
    u("photo-1567581935884-3349723552ca"),
    p(1092671),
    p(1616516),
    p(1786433),
    p(2265488),
    p(249324),
    p(2657669),
    p(276528),
    p(35192),
    p(364376),
    p(37547),
    p(4065876),
    p(4195325),
    p(4545965),
    p(5054213),
  ],
  oneplus: [
    u("photo-1585060544812-6b45742d762f"),
    u("photo-1567581935884-3349723552ca"),
    u("photo-1512428559087-560fa5ceab42"),
    p(5081398),
    p(5082567),
    p(51383),
    p(53453),
    p(1047384),
    p(1222271),
    p(133459),
    p(1415552),
    p(1543924),
    p(1666021),
    p(1779487),
    p(1841841),
    p(1995730),
    p(207589),
  ],
  motorola: [
    p(404280),
    p(18525574),
    p(18525576),
    p(279906),
    u("photo-1601784551446-20c9e07cdbdb"),
    u("photo-1586898633445-fc34716255b2"),
    p(2265482),
    p(2351844),
    p(248528),
    p(257897),
    p(2657668),
    p(276517),
    p(2897883),
    p(303383),
    p(325153),
  ],
};

function dedupe(urls: string[]): string[] {
  return [...new Set(urls)];
}

function takeFrom(prefer: string[], used: Set<string>, master: string[]): string | null {
  for (const url of prefer) {
    if (!used.has(url) && master.includes(url)) {
      used.add(url);
      return url;
    }
  }
  for (const url of master) {
    if (!used.has(url)) {
      used.add(url);
      return url;
    }
  }
  return null;
}

async function main() {
  const master = dedupe(
    MASTER_POOL.filter(
      (url) =>
        !url.includes("1557185720") &&
        !url.includes("1601784551456") &&
        !url.includes("1526045489820") &&
        !url.includes("1678912134244") &&
        !url.includes("6078120") &&
        !url.includes("6991220") &&
        !url.includes("7889460") &&
        !url.includes("8877510"),
    ),
  );

  const sql = postgres(process.env.DATABASE_URL!, { prepare: false });
  const rows = await sql.unsafe<{ brand: string; slug: string; name: string }[]>(`
    select b.slug as brand, d.slug, d.name
    from devices d
    join brands b on b.id = d.brand_id
    join categories c on c.id = b.category_id
    where c.slug = 'phone'
    order by b.sort_order, d.sort_order, d.name
  `);

  if (master.length < rows.length) {
    throw new Error(`Need ${rows.length} unique images, only have ${master.length}`);
  }

  const used = new Set<string>();
  const assignments: { slug: string; brand: string; name: string; imageUrl: string }[] = [];

  for (const row of rows) {
    const { brand, slug, name } = row;
    let prefer = BRAND_PREFER[brand] ?? [];
    if (/fold|open/i.test(slug)) prefer = [...FORM_PREFER.fold, ...prefer];
    if (/flip|razr/i.test(slug)) prefer = [...FORM_PREFER.flip, ...prefer];

    const imageUrl = takeFrom(prefer, used, master);
    if (!imageUrl) {
      throw new Error(`No image left for ${slug}`);
    }
    assignments.push({ slug, brand, name, imageUrl });
  }

  for (const [slug, imageUrl] of Object.entries(BRAND_IMAGES)) {
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
    const re = new RegExp(
      `(\\{ slug: "${esc}", name: "[^"]*", imageUrl: ")[^"]*(")`,
      "g",
    );
    data = data.replace(re, `$1${a.imageUrl}$2`);
  }
  for (const [slug, imageUrl] of Object.entries(BRAND_IMAGES)) {
    const re = new RegExp(
      `(\\{ slug: "${slug}", name: "[^"]*", imageUrl: ")[^"]*(", categorySlug: "phone")`,
      "g",
    );
    data = data.replace(re, `$1${imageUrl}$2`);
  }
  fs.writeFileSync(dataPath, data);

  const unique = new Set(assignments.map((a) => a.imageUrl));
  console.log("phones updated:", assignments.length);
  console.log("unique images:", unique.size);
  if (unique.size !== assignments.length) {
    console.error("FAIL: duplicates remain");
    process.exit(1);
  }
  console.log("OK: every phone model has a unique image");

  await sql.end();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
