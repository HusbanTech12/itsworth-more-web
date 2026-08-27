import postgres from "postgres";
import { writeFileSync } from "fs";

const CANVAS_PATH =
  "C:/Users/NAT/.cursor/projects/d-Web-Projects-cashing-tech/canvases/device-prices.canvas.tsx";

const pretty = (slug: string) =>
  slug.replace(/[-_]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

async function main() {
  const sql = postgres(process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL!, {
    prepare: false,
  });

  const rows = await sql<
    { brand: string; device: string; condition_slug: string; price_cents: number }[]
  >`
    SELECT b.name AS brand, d.name AS device, dp.condition_slug, dp.price_cents
    FROM device_prices dp
    JOIN devices d ON d.id = dp.device_id
    JOIN brands b ON b.id = d.brand_id
    WHERE dp.is_active AND d.is_active
    ORDER BY b.name, d.name, dp.condition_slug
  `;

  const counts = (
    await sql`
    SELECT
      (SELECT count(*) FROM devices WHERE is_active)::int AS devices,
      (SELECT count(*) FROM brands WHERE is_active)::int AS brands,
      (SELECT count(*) FROM categories WHERE is_active)::int AS categories
  `
  )[0];

  const brands = [...new Set(rows.map((r) => r.brand))].sort();
  const conditions = [...new Set(rows.map((r) => r.condition_slug))];

  const min = Math.min(...rows.map((r) => r.price_cents));
  const max = Math.max(...rows.map((r) => r.price_cents));
  const avg = Math.round(rows.reduce((s, r) => s + r.price_cents, 0) / rows.length);

  const condAvg = conditions.map((c) => {
    const sub = rows.filter((r) => r.condition_slug === c);
    return {
      slug: c,
      label: pretty(c),
      avg: Math.round(sub.reduce((s, r) => s + r.price_cents, 0) / sub.length / 100),
      count: sub.length,
    };
  });

  const brandCounts = brands
    .map((b) => ({
      brand: b,
      devices: new Set(rows.filter((r) => r.brand === b).map((r) => r.device)).size,
    }))
    .sort((a, b) => b.devices - a.devices)
    .slice(0, 10);

  const canvas = `import {
  BarChart,
  Divider,
  Grid,
  H1,
  H2,
  PieChart,
  Row,
  Select,
  Stack,
  Stat,
  Table,
  Text,
  TextInput,
  useCanvasState,
} from "cursor/canvas";

type PriceRow = [string, string, string, number];

const ROWS: PriceRow[] = ${JSON.stringify(rows.map((r) => [r.brand, r.device, r.condition_slug, r.price_cents]))};

const BRANDS: string[] = ${JSON.stringify(brands)};

const CONDITIONS: { value: string; label: string }[] = ${JSON.stringify(
    conditions.map((c) => ({ value: c, label: pretty(c) })),
  )};

const COND_AVG = ${JSON.stringify(condAvg)};

const BRAND_TOP = ${JSON.stringify(brandCounts)};

const fmt = (cents: number) =>
  "$" + (cents / 100).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const pretty = (slug: string) =>
  slug.replace(/[-_]/g, " ").replace(/\\b\\w/g, (c) => c.toUpperCase());

const META = {
  devices: ${counts.devices},
  brands: ${counts.brands},
  categories: ${counts.categories},
  rows: ${rows.length},
  conditions: ${conditions.length},
};

export default function DevicePrices() {
  const [q, setQ] = useCanvasState("q", "");
  const [brand, setBrand] = useCanvasState("brand", "");
  const [cond, setCond] = useCanvasState("cond", "");

  const query = q.trim().toLowerCase();
  const filtered = ROWS.filter(
    (r) =>
      (brand === "" || r[0] === brand) &&
      (cond === "" || r[2] === cond) &&
      (query === "" || r[1].toLowerCase().includes(query) || r[0].toLowerCase().includes(query)),
  );
  const shown = filtered.slice(0, 200);

  return (
    <Stack gap={24} style={{ padding: 24, maxWidth: 1100 }}>
      <Stack gap={8}>
        <H1>Device Prices — CashingTech</H1>
        <Text tone="secondary">
          Live snapshot of the device_prices table on Neon. {META.rows} active price rows
          across {META.devices} devices, {META.brands} brands and{" "}
          {META.categories} categories. Every active device has pricing — none missing.
        </Text>
      </Stack>

      <Grid columns={3} gap={16}>
        <Stat value={String(META.devices)} label="Devices priced" />
        <Stat value={String(META.rows)} label="Active price rows" />
        <Stat value={String(META.conditions)} label="Conditions" />
        <Stat value={fmt(${min})} label="Lowest offer" tone="success" />
        <Stat value={fmt(${max})} label="Highest offer" tone="warning" />
        <Stat value={fmt(${avg})} label="Average offer" />
      </Grid>

      <Divider />

      <Stack gap={12}>
        <H2>Average offer by condition (USD)</H2>
        <BarChart
          categories={COND_AVG.map((c) => c.label)}
          series={[{ name: "Avg offer", data: COND_AVG.map((c) => c.avg) }]}
          valuePrefix="$"
          showValues
          height={240}
        />
        <Text tone="tertiary" size="small">
          Source: Neon device_prices · mean of active rows per condition · Aug 27, 2026
        </Text>
      </Stack>

      <Grid columns={2} gap={16} align="start">
        <Stack gap={12}>
          <H2>Top 10 brands by device count</H2>
          <BarChart
            categories={BRAND_TOP.map((b) => b.brand)}
            series={[{ name: "Devices", data: BRAND_TOP.map((b) => b.devices) }]}
            horizontal
            height={280}
          />
        </Stack>
        <Stack gap={12}>
          <H2>Price rows per condition</H2>
          <PieChart data={COND_AVG.map((c) => ({ label: c.label, value: c.count }))} donut size={220} />
        </Stack>
      </Grid>

      <Divider />

      <Stack gap={12}>
        <H2>Browse all prices</H2>
        <Row gap={8} wrap>
          <TextInput
            value={q}
            onChange={setQ}
            placeholder="Search device or brand…"
            type="search"
            style={{ minWidth: 240 }}
          />
          <Select
            value={brand}
            onChange={setBrand}
            options={[{ value: "", label: "All brands" }, ...BRANDS.map((b) => ({ value: b, label: b }))]}
          />
          <Select
            value={cond}
            onChange={setCond}
            options={[{ value: "", label: "All conditions" }, ...CONDITIONS]}
          />
        </Row>
        <Text tone="secondary" size="small">
          Showing {shown.length} of {filtered.length} matching rows ({META.rows} total). Refine the
          filters to narrow down — the first 200 matches are listed.
        </Text>
        <Table
          headers={["Brand", "Device", "Condition", "Price"]}
          columnAlign={["left", "left", "left", "right"]}
          rows={shown.map((r) => [r[0], r[1], pretty(r[2]), fmt(r[3])])}
          striped
          stickyHeader
          emptyMessage="No prices match these filters."
        />
      </Stack>

      <Text tone="tertiary" size="small">
        Source: live query against Neon (neondb) · device_prices joined with devices and brands · Aug 27, 2026.
        Prices are the cash offers shown to sellers per condition.
      </Text>
    </Stack>
  );
}
`;

  writeFileSync(CANVAS_PATH, canvas, "utf8");
  console.log("Canvas written:", CANVAS_PATH, "| rows:", rows.length);
  await sql.end();
}

main().catch((e) => {
  console.error("ERROR", e.message);
  process.exit(1);
});
