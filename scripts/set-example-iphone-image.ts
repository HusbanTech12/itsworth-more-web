/**
 * Example: set one flagship iPhone to a professional product photo.
 */
import fs from "node:fs";
import path from "node:path";
import postgres from "postgres";

const SLUG = "iphone-17-pro-max";
/** Confirmed professional iPhone product photo (Unsplash License) */
const IMAGE =
  "https://images.unsplash.com/photo-1616348436168-de43ad0db179?w=1200&h=1200&fit=crop&crop=center&auto=format&q=85";

async function main() {
  const sql = postgres(process.env.DATABASE_URL!, { prepare: false });

  const updated = await sql`
    update devices
    set image_url = ${IMAGE}, updated_at = now()
    where slug = ${SLUG}
    returning slug, name, image_url
  `;

  if (!updated.length) {
    console.error("Device not found:", SLUG);
    process.exit(1);
  }

  const dataPath = path.join(process.cwd(), "lib", "data.ts");
  let data = fs.readFileSync(dataPath, "utf8");
  const esc = SLUG.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  data = data.replace(
    new RegExp(`(\\{ slug: "${esc}", name: "[^"]*", imageUrl: ")[^"]*(")`, "g"),
    `$1${IMAGE}$2`,
  );
  fs.writeFileSync(dataPath, data);

  console.log("Example product image set:");
  console.log(updated[0]);
  await sql.end();
}

main();
